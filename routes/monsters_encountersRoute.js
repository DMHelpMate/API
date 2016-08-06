var router = require('express').Router();
var mongoose = require('mongoose');

router.route('/')
	.get(function(req, res) {
		mongoose.connect('mongodb://localhost/unicorn');
		var db = mongoose.connection;
		db.on('error', function() {
			res.send('oops... something went wrong');
		});
		db.on('open', function() {
			res.send('get worked. mongo connection worked.');
		});
	})
	.post(function(req, res) {
		mongoose.connect('mongodb://localhost/unicorn');
		var db = mongoose.connection;
		db.on('error', function() {
			res.send('oops... something went wrong');
		});
		db.on('open', function() {
			res.send('get worked. mongo connection worked.');
		});
	});

module.exports = router;
