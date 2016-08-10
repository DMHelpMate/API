
// import dependencies
var router = require('express').Router();

// mongoose vars
var mongoose,
	Monster;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Monster = mongoose.model('Monsters', req.app.get('MonstersSchema'));
		next();
	})
	.route('/')
		.delete(function(req, res) {
		})
		.get(function(req, res) {
			res.send('Accessed GET req');
		})
		.post(function(req, res) {
			if (req.body) {
				// var monsterToAdd = new Monster(req.body);
				// monsterToAdd.save(function(err) {
				// 	if (err) {
				// 		console.log(err);
				// 	} else {
				// 		console.log('/monsters POST: OK');
				// 	}
				// });
				Monster.create(req.body, function(err, newMonster) {
					if (err) {
						console.log(err);
					} else {
						console.log('/monsters POST: OK');
					}
				});
			} else {
				console.log('/monsters POST: NULL req.body');
			}
		})
		.put(function(req, res, next) {
		})
		.all(function(req, res) {
			console.log('reached last');
		});

// make available to node app
module.exports = router;
