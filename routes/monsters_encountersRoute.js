
// import dependencies
var router = require('express').Router();

const SELECT 		= '-_id';
const MON_SELECT 	= '-_id mon_id mname mhitpoints mattack mdefense';
const ENC_SELECT 	= '-_id enc_id general location monsters';

// mongoose vars
var mongoose,
	Mon_Enc,
	Monsters,
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


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Mon_Enc = mongoose.model('Monsters_Encounters', req.app.get('Monsters_EncountersSchema'));
		Monsters =  mongoose.model('Monsters', req.app.get('MonstersSchema'));
		Encounters = mongoose.model('Encounters', req.app.get('EncountersSchema'));
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
		})
		.post(function(req, res) {
			if (req.body) {
				Mon_Enc.create(req.body, function(err, newMon_Enc) {
					if (err) {
						console.log('/monsters_encounters POST: Error: ');
						console.log(err);
						return res.sendStatus(500);
					} else {
						console.log('/monsters_encounters POST: OK');
						return res.sendStatus(200);
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
