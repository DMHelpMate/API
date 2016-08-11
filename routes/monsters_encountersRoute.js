
// import dependencies
var router = require('express').Router();

// mongoose vars
var mongoose,
	Mon_Enc;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Mon_Enc = mongoose.model('Monsters_Encounters', req.app.get('Monsters_EncountersSchema'));
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
				Mon_Enc.create(req.body, function(err, newMon_Enc) {
					if (err) {
						console.log('/monsters_encounters POST: Error: ');
						console.log(err);
					} else {
						console.log('/monsters_encounters POST: OK');
					}
				});
			} else {
				console.log('/monsters_encounters POST: NULL req.body');
			}
		})
		.put(function(req, res) {
			res.send('Accessed PUT req');
		});

// make available to node app
module.exports = router;
