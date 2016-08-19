
// import dependencies
var router = require('express').Router();

const SELECT 		= '-_id';
const MON_SELECT 	= '-_id mon_id mname mhitpoints mattack mdefense';
const ENC_SELECT 	= '-_id enc_id general location monsters';

// mongoose vars
var mongoose,
	Mon_Enc,
	Monsters,
	mysqlConn,
	Encounters;


/**
 * getMons() retrieves all the monsters belonging to a campaign
 *
 * @param {string} enc_id The string value of the encounter's id
 *
 * @callback {array} monArr A collections of monster docs
 */
function getMons(enc_id, callback) {
	Mon_Enc.find({'enc_id': enc_id}, function(err, docs) {
		var monArr = [];
		if (err || !docs || !docs[0] || !docs[0].mon_id) {
			callback(monArr);
		} else {
			for (var i = 0; i < docs.length; i++) {
				(function(i) {
					Monsters.findOne({'mon_id': docs[i].mon_id}, MON_SELECT, function(err, monster) {
						if (!err) {
							monArr.push(monster);
						}
						if (i === docs.length - 1) {
							callback(monArr);
						}
					});
				}(i));
			}
		}
	});
} 


/**
 * getEncs() retrieves all the encounters containing a monster 
 *
 * @param {string} mon_id The string value of the monster's id
 *
 * @callback {array} encArr A collection of encounter docs
 */
function getEncs(mon_id, callback) {
	Mon_Enc.find({'mon_id': mon_id}, function(err, docs) {
		var encArr = [];
		if (err || !docs || !docs[0] || !docs[0].enc_id) {
			callback(encArr);
		} else {
			for (var i = 0; i < docs.length; i++) {
				(function(i) {
					Encounters.findOne({'enc_id':docs[i].enc_id}, ENC_SELECT, function(err, encounter) {
						if (!err) {
							encArr.push(encounter);
						}
						if (i === docs.length - 1) {
							callback(encArr);
						}
					});
				}(i));
			}
		}
	});
}


/**
 * getMonEnc() retrieves a pair of one encounter and one monster
 *
 * @param {string} enc_id The string value of the encounter's id
 * @param {string} mon_id The string value of the monster's id
 *
 * @callback {object} monEnc The monster doc and encounter doc nested in an object
 */
function getMonEnc(enc_id, mon_id, callback) {
	var monEnc = {monster:{}, encounter:{}};
	Monsters.findOne({'mon_id': mon_id}, MON_SELECT, function(err, monster) {
		if (!err) {
			monEnc.monster = monster;
		}
		Encounters.findOne({'enc_id': enc_id}, ENC_SELECT, function(err, encounter) {
			if (!err) {
				monEnc.encounter = encounter;
			}
			callback(monEnc);
		});
	});
}


function getMonsQuanID(doc, callback) {
	mysqlConn.query('SELECT mon_id, quantity FROM MONSTERS_ENCOUNTERS WHERE enc_id = ?', [doc.enc_id], function(err, results, fields) {
		callback(results);
	});
}

function buildEncounter(doc, callback) {
	getMonsQuanID(doc, function(results) {
			callback({
			'enc_id': doc.enc_id,
			'general': {
				'name': doc.name,
				'setup': doc.setup,
				'readaloud': doc.readaloud
			},
			'location': {
				'name': doc.loc_name,
				'description': doc.loc_description
			},
			'monsters': results
		});
	});
	
}


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Mon_Enc = mongoose.model('Monsters_Encounters', req.app.get('Monsters_EncountersSchema'));
		Monsters =  mongoose.model('Monsters', req.app.get('MonstersSchema'));
		Encounters = mongoose.model('Encounters', req.app.get('EncountersSchema'));
		mysqlConn = req.app.get('mysqlConn');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			return res.sendStatus(501);
		})
		.get(function(req, res) {
			if (require('../config.json').db === 'mysql') {
				if (req.query.mon_id && req.query.enc_id) {
					var me = {'monster': {},'encounter': {}};
					mysqlConn.query('SELECT * FROM MONSTERS WHERE mon_id = ?', [req.query.mon_id], function(err, result) {
						me.monster = result;
						mysqlConn.query('SELECT * FROM ENCOUNTERS WHERE enc_id = ?', [req.query.enc_id], function(err, resulte) {
							if (resulte[0]) {
								buildEncounter(resulte[0], function(enc) {
									me.encounter = enc;
									return res.json(me);
								});
							} else {
								return res.json(me);
							}
						});
					});
					
				} else if (req.query.mon_id) {
					var encs = [];
					mysqlConn.query('SELECT * FROM ENCOUNTERS E LEFT JOIN MONSTERS_ENCOUNTERS ME ON E.enc_id = ME.enc_id WHERE ME.mon_id = ?', [req.query.mon_id], function(error, results) {
						if (error || !results || results.length === 0)
							return res.json(null);
						for (var i = 0; i < results.length; i++) {
							(function(i) {
								buildEncounter(results[i], function(enc) {
									encs.push(enc);
									if (i === results.length - 1)
										return res.json(encs);
								});
							}(i));
						}
					});
				} else if (req.query.enc_id) {
					mysqlConn.query('SELECT mon_id FROM MONSTERS_ENCOUNTERS WHERE enc_id = ?', [req.query.enc_id], function(error, results) {
						var mons = [];
						if (!results || !results[0] || !results[0].mon_id || results.length === 0) {
							return res.json(null);
						} else {
							for (var i = 0; i < results.length; i++) {
								(function(i) {
									mysqlConn.query('SELECT * FROM MONSTERS WHERE mon_id = ?', [results[i].mon_id], function(error, monsters) {
										mons.push(monsters);
										if (i === results.length - 1)
											return res.json(mons);
									});
								}(i));
							}
						}
					});
				} else {
					mysqlConn.query('SELECT mon_id, enc_id FROM MONSTERS_ENCOUNTERS', function(error, results) {
						return res.json(results);
					});
				}
			} else {
				// mon_id and enc_id in query string: retrieve one where ids match
				if (req.query.mon_id && req.query.enc_id) {
					getMonEnc(req.query.enc_id, req.query.mon_id, function(data) {
						return res.status(200).json(data);
					});
				} 
				// mon_id in query string: retrieve all corresponding encounters
				else if (req.query.mon_id) {
					getEncs(req.query.mon_id, function(data) {
						return res.status(200).json(data);
					});
				} 
				// enc_id in query string: retrieve all corresponding monsters
				else if (req.query.enc_id) {
					getMons(req.query.enc_id, function(data) {
						return res.status(200).json(data);
					});
				} 
				// empty query string: retrieve all 
				else {
					// TODO: retrieve actual JSON of all monsters and encounters
					Mon_Enc.find({}, SELECT, function(err, result) {
						if (err) {
							return res.status(500).json(null);
						} else {
							return res.status(200).json(result);
						}
					});
				}
			}
		})
		.post(function(req, res) {
			if (req.body) {
				Mon_Enc.create(req.body, function(err, newMon_Enc) {
					if (!req.body.mon_id || req.body.enc_id) {
						res.sendStatus(400);
					} else {
						var sql = 'INSERT INTO MONSTERS_ENCOUNTERS (mon_id, enc_id, quantity) VALUES (?,?,?)'
						console.log(sql);
						mysqlConn.query( sql, [req.body.mon_id, req.body.enc_id, req.body.quantity], function(err, result) {
							if (err) {
								console.log('/monsters_encounters POST: Error: ');
								console.log(err);
								return res.sendStatus(500);
							} else {
								console.log('/monsters_encounters POST: OK');
								return res.sendStatus(200);
							}
						});
					}
				});
			} else {
				console.log('/monsters_encounters POST: NULL req.body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			return res.sendStatus(501);
		});

// make available to node app
module.exports = router;
