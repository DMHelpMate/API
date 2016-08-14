
// import dependencies
var router = require('express').Router();

const SELECT = '-_id';

// mongoose vars
var mongoose,
	Mon_Enc;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Mon_Enc = mongoose.model('Monsters_Encounters', req.app.get('Monsters_EncountersSchema'));
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
				Mon_Enc.findOne({'mon_id': req.query.mon_id, 'enc_id': req.query.enc_id}, SELECT, function(err, result) {
					// TODO: get actual Enc & Mon doc from query
					if (err) {
						return res.status(500).json(null);
					} else {
						return res.status(200).json(result);
					}
				});
			} 
			// mon_id in query string: retrieve all corresponding encounters
			else if (req.query.mon_id) {
				// TODO: retrieve all corresponding encounters
				return res.status(501).json(null);
			} 
			// enc_id in query string: retrieve all corresponding monsters
			else if (req.query.enc_id) {
				// TODO: retrieve all corresponding encounters
				return res.status(501).json(null);
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
