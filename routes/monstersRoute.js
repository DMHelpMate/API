
// import dependencies
var router = require('express').Router();

// query select
const SELECT = '-_id mname mhitpoints mattack mdefense';

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
			res.sendStatus(403);
		})
		.get(function(req, res) {
			// id in query string: retrieve one by id
			if (req.query.mon_id) {
				Monster.findOne({'mon_id': req.query.mon_id}, SELECT,function(err, monster) {
					if (err) { 
						return res.json(null); 
					} else {
						return res.json(monster);
					}
				});

			// empty query string: return all monsters
			} else {
				Monster.find({}, SELECT, function(err, monster) {
					if (err) {
						return res.json(null);
					} else {
						return res.json(monster);
					}
				});
			}
		})
		.post(function(req, res) {
			if (req.body) {
				Monster.create(req.body, function(err, newMonster) {
					if (err) {
						console.log('/monsters POST: Error: ');
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
