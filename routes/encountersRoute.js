
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
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			res.sendStatus(403);
		})
		.get(function(req, res) {
			// id in query string: retrieve one by id
			if (req.query.enc_id) {
				Encounter.findOne({'enc_id': req.query.enc_id}, SELECT, function(err, result) {
					if (err) {
						return res.json(null);
					} else {
						return res.json(result);
					}
				});
			}
			// empty query string: retrieve all
			else {
				Encounter.find({}, SELECT, function(err, result) {
					if (err) {
						return res.json(null);
					} else {
						return res.json(result);
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
					} else {
						console.log('/encounters POST request: OK')
					}
				});
			} else {
				console.log('/encounters POST request: Error: ');
				console.log('null request body');
			}
		})
		.put(function(req, res) {
			res.send('Accessed PUT req');
		});

// make available to node app
module.exports = router;
