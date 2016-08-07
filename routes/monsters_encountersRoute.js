
// import dependencies
var router = require('express').Router();

// route http reqs
router.route('/')
	.delete(function(req, res) {
		var mongoose = req.app.get('mongoose');
		res.send('Accessed DELETE req');
	})
	.get(function(req, res) {
		var mongoose = req.app.get('mongoose');
		res.send('Accessed GET req');
	})
	.post(function(req, res) {
		var mongoose = req.app.get('mongoose');
		res.send('Accessed POST req');
	})
	.put(function(req, res) {
		var mongoose = req.app.get('mongoose');
		res.send('Accessed PUT req');
	});

// make available to node app
module.exports = router;
