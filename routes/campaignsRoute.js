var router = require('express').Router();

router.route('/')
	.get(function(req, res) {
		res.send('Campaigns works!');
	});

module.exports = router;