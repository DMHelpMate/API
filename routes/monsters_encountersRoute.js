
// import dependencies
var router = require('express').Router();

// mongoose vars
var mongoose,
	monsters_encountersSchema;

// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
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
			res.send('Accessed POST req');
		})
		.put(function(req, res) {
			res.send('Accessed PUT req');
		});

// make available to node app
module.exports = router;
