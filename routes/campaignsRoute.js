
// import dependencies
var router = require('express').Router();

const SELECT = '-_id general encounters'

// mongoose vars
var mongoose,
	Campaign;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Campaign = mongoose.model('Campaign', req.app.get('CampaignsSchema'));
		res.header('Access-Control-Allow-Origin', '*');
		res.header('POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			res.send('Accessed DELETE req');
		})
		.get(function(req, res) {
			// id in query string: get one by id
			if (req.query.camp_id) {
				Campaign.findOne({'camp_id': req.query.camp_id}, SELECT, function(err, result) {
					if (err) {
						return res.json(null);
					} else {
						return res.json(result);
					}
				});
			} 

			// empty query string: retrieve all
			else {
				Campaign.find({}, SELECT, function(err, result) {
					if (err) {
						res.json(null);
					} else {
						res.json(result);
					}
				});
			}
		})
		.post(function(req, res) {
			if (req.body) {
				Campaign.create(req.body, function(err, newEncounter) {
					if (err) {
						console.log('/campaigns POST request: Error: ')
						console.log(err);
					} else {
						console.log('/campaigns POST request: OK')
					}
				});
			} else {
				console.log('/campaigns POST request: Error: ');
				console.log('null request body');
			}
		})
		.put(function(req, res) {
			res.send('Accessed PUT req');
		});

// make available to node app
module.exports = router;
