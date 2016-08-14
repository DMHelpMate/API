
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
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			return res.sendStatus(501);
		})
		.get(function(req, res) {
			// id in query string: retrieve one by id
			if (req.query.mon_id) {
				Monster.findOne({'mon_id': req.query.mon_id}, SELECT,function(err, result) {
					if (err) { 
						return res.status(500).json(null); 
					} else {
						return res.status(200).json(result);
					}
				});

			// empty query string: retrieve all
			} else {
				Monster.find({}, SELECT, function(err, result) {
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
				Monster.create(req.body, function(err, newMonster) {
					if (err) {
						console.log('/monsters POST: Error: ');
						console.log(err);
						return res.sendStatus(500);
					} else {
						console.log('/monsters POST: OK');
						return res.sendStatus(200);
					}
				});
			} else {
				console.log('/monsters POST: NULL req.body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			return res.sendStatus(501);
		});

// make available to node app
module.exports = router;
