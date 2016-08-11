
// import dependencies
var router = require('express').Router();

// mongoose vars
var mongoose,
	Campaign;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Campaign = mongoose.model('Campaign', req.app.get('CampaignsSchema'));
		next();
	})
	.route('/')
		.delete(function(req, res) {
			res.send('Accessed DELETE req');
		})
		.get(function(req, res) {
			res.send('Accessed GET req');
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
