
var router = require('express').Router();
var mongoose = require('mongoose');

// initialize connection
mongoose.connect('mongodb://localhost/unicorn');
var db = mongoose.connection;

// handle connection error
db.on('error', function() {
	console.log('oops... something went wrong in campaigns');
	mongoose.disconnect();
	return;
});

// handle connection open
db.once('open', function() {
	router.route('/')
		.get(function(req, res) {
			res.send('connection established. get worked');
			mongoose.disconnect();
			return;
		})
		.post(function(req, res) {
			res.send('connection established. get worked');
			mongoose.disconnect();
			return;
		});
});

module.exports = router;
