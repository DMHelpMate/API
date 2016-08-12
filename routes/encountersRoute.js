
// import dependencies
var router = require('express').Router();

// query select
const SELECT = '-_id general location monsters'

// mongoose vars
var mongoose,
	Encounter;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Encounter = mongoose.model('Encounter', req.app.get('EncountersSchema'));
		res.header('Access-Control-Allow-Origin', '*');
		res.header('POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
						return res.status(200).json(result);
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
