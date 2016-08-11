
// import dependencies
var router = require('express').Router();

// mongoose vars
var mongoose,
	Encounter;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Encounter = mongoose.model('Encounter', req.app.get('EncountersSchema'));
		next();
	})
	.route('/')
		.delete(function(req, res) {
			res.sendStatus(403);
		})
		.get(function(req, res) {
			res.send('Accessed GET req');
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
