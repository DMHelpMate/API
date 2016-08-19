
// import dependencies
var router = require('express').Router();
var http = require('http');

const SELECT = '-_id camp_id general encounters'

// mongoose vars
var mongoose,
	Campaign,
	mysqlConn,
	Encounter;


/**
 * getEs() retrieves all encounters in a campaign
 *
 * @param {object} campaign A JSON object representing a campaign
 * @callback {object} fullResult An object containing the campaign and an array of its encounters
 */
function getEs(campaign, callback) {
	var fullResult = {campaign:{}, encounters:[]};
	fullResult.campaign = campaign;
	// null checks
	if (!campaign || !campaign.encounters || !campaign.encounters[0] || campaign.encounters.length === 0) {
		callback(fullResult);
	} else {
		for (var i = 0; i < campaign.encounters.length; i++) {
			(function(i) {
				http.get('http://api.unicornrampage.com/encounters?enc_id=' + campaign.encounters[i], function(res) {
					res.setEncoding('utf8');
					res.on('data', function(chunk) {
						fullResult.encounters.push(JSON.parse(chunk));
						if (i == campaign.encounters.length - 1) {
							callback(fullResult);
						}
					});
				});
			})(i);
		}
	}
}


/**
 * removeEs() removes all encounters from the Encounters collection that belongs to the campaign
 *
 * @param {object} campaign The campaign document
 */
function removeEs(campaign, callback) {
	for (var i = 0; i < campaign.encounters.length; i++) {
		(function(i) {
			Encounter.remove({'enc_id': campaign.encounters[i]}, function(err) {
				if (err) {
					console.log('/campaigns DELETE: error removing encounter:');
					console.log(err);
				}
			});
			if (i === campaign.encounters.length - 1)
				if (callback)
					callback();
		}(i))
	}
}


function getEIDsMySQL(doc, callback) {
	mysqlConn.query('SELECT * FROM ENCOUNTERS WHERE camp_id = ?',[doc.camp_id], function(err, results, fields) {
		var arr = [];
		for (var i = 0; i < results.length; i++) {
			arr.push(results[i].enc_id);
		}
		callback(arr);
	});
}

function getFullEncs(doc, callback) {
	var encs = [];
	for (var i = 0; i < doc.encounters.length; i++) {
		(function(i) {
			var encPath = '/encounters?enc_id=' + doc.encounters[i];
			http.get({
				hostname: 'api.unicornrampage.com',
				path: encPath
			}, function(res) {
				res.setEncoding('utf8');
				var encData = '';
				res.on('data', function(chunk) {
					encData += chunk;
				});
				res.on('end', function() {
					encs.push(JSON.parse(encData));
					if (i === doc.encounters.length - 1)
						callback(encs);
				});
			});
		}(i));
	}
}

function uniformAllCamp(doc, callback) {
	getEIDsMySQL(doc, function(results) {
		callback({
			'camp_id': doc.camp_id,
			'general': {
				'name': doc.name,
				'author': doc.author,
				'theme': doc.author,
				'description': doc.description
			},
			'encounters': results
		});
	});
}

function getFullCampaign(doc, callback) {
	var full = {'campaign':{}, 'encounters': []};
	full.campaign = doc;
	getFullEncs(doc, function(encs) {
		full.encounters = encs;
		callback(full);
	});
}


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Campaign = mongoose.model('Campaign', req.app.get('CampaignsSchema'));
		Encounter = mongoose.model('Encounter', req.app.get('EncountersSchema'));
		mysqlConn = req.app.get('mysqlConn');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			if (req.query.camp_id) {
				Campaign.findOne({'camp_id': req.query.camp_id}, function(err, result) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					} else {
						removeEs(result);
						Campaign.remove({'camp_id': result.camp_id}, function(err) {
							if (err) {
								console.log('/campaigns DELETE: Error:');
								console.log(err);
								return res.sendStatus(500);
							} else {
								console.log('/campaigns DELETE: OK');
							}
						})
					}
				});
			} else {
				console.log('/campaigns DELETE: campaign id is null');
			}
		})
		.get(function(req, res) {
			if (require('../config.json').db === 'mysql') {
				if (req.query.camp_id) {
					mysqlConn.query('SELECT * FROM CAMPAIGNS WHERE camp_id = ?', [req.query.camp_id], function(err, result, fields) {
						if (err || !result || !result[0] || result.length === 0) {
							return res.json(null);
						} else {
							uniformAllCamp(result[0], function(partialCamp) {
								getFullCampaign(partialCamp, function(fullCamp) {
									return res.json(fullCamp);
								});
							});
						}
					});
				} else {
					var campsArr = [];
					mysqlConn.query('SELECT * FROM CAMPAIGNS', function(err, results, fields) {
						for (var i = 0; i < results.length; i++) {
							(function(i) {
								uniformAllCamp(results[i], function(camp) {
									campsArr.push(camp);
									if (i === results.length - 1)
										return res.json(campsArr);
								});
							}(i));
						}
					});
				}
			} else {
				// id in query string: get one by id
				if (req.query.camp_id) {
					Campaign.findOne({'camp_id': req.query.camp_id}, SELECT, function(err, result) {
						if (err) {
							return res.status(500).json(null);
						} else {
							getEs(result, function(fullResult) {
								return res.status(200).json(fullResult);
							});
						}
					});
				} 

				// empty query string: retrieve all
				else {
					Campaign.find({}, SELECT, function(err, result) {
						if (err) {
							res.status(500).json(null);
						} else {
							res.status(200).json(result);
						}
					});
				}
			}
		})
		.post(function(req, res) {
			if (req.body) {
				Campaign.create(req.body, function(err, newEncounter) {
					if (!req.body.camp_id || !req.body.general) {
						return res.sendStatus(400);
					} else {
						var sql = 'INSERT INTO CAMPAIGNS (camp_id, name, author, theme, description) VALUES (?,?,?,?,?)';
						mysqlConn.query( sql, [req.body.camp_id, req.body.general.name, req.body.general.author, req.body.general.theme, req.body.general.description], function(err, result) {
							if (err) {
								console.log('/campaigns POST request: Error: ')
								console.log(err);
								return res.sendStatus(500);
							} else {
								console.log('/campaigns POST request: OK')
								return res.sendStatus(200);
							}
						});
					}
				});
			} else {
				console.log('/campaigns POST request: Error: ');
				console.log('null request body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			if (req.query.camp_id) {
				return res.sendStatus(200);
			} else {
				//console.log('')
				return res.sendStatus(501); 
			}
		});

// make available to node app
module.exports = router;
