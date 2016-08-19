
// import dependencies
var router = require('express').Router();
var http = require('http');

// query select
const SELECT = '-_id enc_id general location monsters';
const MON_SELECT = '-_id mon_id mname mhitpoints mattack mdefense';

// mongoose vars
var mongoose,
	Encounter,
	Monster,
	mysqlConn;


/**
 * getMs() retrieves all monsters from the encounter's monsters[]
 *
 * @param {object} enc An encounter that contains a monsters[]
 */
function getMs(enc, callback) {
	var fullResult = {enc: {}, monsters: []};
	fullResult.enc = enc;

	// null checks
	if (!enc || !enc.monsters || !enc.monsters[0] || !enc.monsters[0].mon_id || enc.monsters.length === 0) {
		callback(fullResult);
	} else {
		for (var i = 0; i < enc.monsters.length; i++) {
			(function(i) {
				Monster.findOne({'mon_id': enc.monsters[i].mon_id}, MON_SELECT, function(err, monResult) {
					fullResult.monsters.push(monResult);
					if (i == enc.monsters.length - 1) {
						callback(fullResult);
					}
				});
			}(i));
		}
	}
}


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Encounter = mongoose.model('Encounter', req.app.get('EncountersSchema'));
		Monster = mongoose.model('Monster', req.app.get('MonstersSchema'));
		mysqlConn = req.app.get('mysqlConn');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			if (req.query.enc_id) {
				Encounter.remove({'enc_id':req.query.enc_id}, function(err) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					} else {
						console.log('/encounters DELETE: OK');
						return res.sendStatus(200);
					}
				});
			} else {
				return res.sendStatus(501);
			}
		})
		.get(function(req, res) {
			// id in query string: retrieve one by id
			if (req.query.enc_id) {
				Encounter.findOne({'enc_id': req.query.enc_id}, SELECT, function(err, result) {
					if (err) {
						return res.status(500).json(null);
					} else {
						getMs(result, function(newResult) {
							return res.status(200).json(newResult);
						});
					}
				});
			}
			// empty query string: retrieve all
			else {
				Encounter.find({}, SELECT, function(err, result) {
					if (err) {
						return res.status(500).json(null);
					} else {
						return res.status(200).json(result);
					}
				});
			}
		})
		.post(function(req, res) {
			if (req.body) {
				// Mongo DB Query
				Encounter.create(req.body, function(err, newEncounter) {
					var sql = 'INSERT INTO ENCOUNTERS (enc_id, name, setup, readaloud, loc_name, loc_description, camp_id) VALUES (?,?,?,?,?,?,?)';
					mysqlConn.query(sql, [req.body.enc_id, req.body.general.name, req.body.general.setup, req.body.general.readaloud, req.body.location.name, req.body.location.description, req.body.camp_id], function(err, result) {
						if (err) {
							console.log('/encounters POST request: Error: ')
							console.log(err);
							return res.sendStatus(500);
						} else {
							console.log('/encounters POST request: OK');
							return res.sendStatus(200);
						}
					});
				});
			} else {
				console.log('/encounters POST request: Error: ');
				console.log('null request body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			if (req.query.enc_id) {
				Encounter.findOne({'enc_id':req.query.enc_id}, function(err, result) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					} else {
						require('../services/setFields')(req.body, result, function(updatedEncounter) {
							updatedEncounter.save(function(err) {
								if (err) {
									console.log(err);
									return res.sendStatus(500);
								} else {
									console.log('/encounters PUT: OK');
									return res.sendStatus(200);
								}
							});
						});
					}
				});
			} else {
				return res.sendStatus(501);
			}
		});

// make available to node app
module.exports = router;
