
// import dependencies
var router = require('express').Router();
var http = require('http');

// query select
const SELECT = '-_id general location monsters';
const MON_SELECT = '-_id mname mhitpoints mattack mdefense';

// mongoose vars
var mongoose,
	Encounter,
	Monster;


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
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			return res.sendStatus(501);
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
				Encounter.create(req.body, function(err, newEncounter) {
					if (err) {
						console.log('/encounters POST request: Error: ')
						console.log(err);
						return res.sendStatus(500);
					} else {
						console.log('/encounters POST request: OK');
						return res.sendStatus(200);
					}
				});
			} else {
				console.log('/encounters POST request: Error: ');
				console.log('null request body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			return res.sendStatus(501);
		});

// make available to node app
module.exports = router;
