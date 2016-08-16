
// import dependencies
var router = require('express').Router();

// query select
const SELECT = '-_id mon_id mname mhitpoints mattack mdefense';

// mongoose vars
var mongoose,
	Monster;


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Monster = mongoose.model('Monsters', req.app.get('MonstersSchema'));
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma');
		res.header('Cache-Control', 'public, max-age=31557600');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			if (req.query.mon_id) {
				Monster.remove({'mon_id': req.query.mon_id}, function(err) {
					if (err) {
						console.log(err)
						return res.sendStatus(500);
					} else {
						console.log('/monsters DELETE: OK');
						return res.sendStatus(200);
					}
				});
			} else {
				console.log('/monsters DELETE: route is not available');
				return res.sendStatus(501);
			}
		})
		.get(function(req, res) {
			console.log(req.query);
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
			if (req.query.mon_id) {
				Monster.findOne({'mon_id': req.query.mon_id}, function(err, obj) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					} else {
						require('../services/setFields')(req.body, obj, function(updateMonster) {
							updateMonster.save(function(err) {
								if (err) {
									console.log(err);
									return res.sendStatus(500);
								} else {
									console.log('/monsters PUT: OK');
									res.sendStatus(200);
								}
							});
						});
					}
				});
			} else {
				console.log('/monsters PUT: req.query.mon_id is empty');
				return res.sendStatus(501);
			}
		});

// make available to node app
module.exports = router;
