
var router = require('express').Router();

router.route('/')
	.get(function(req, res) {
		res.send('Monsters works!');
	});

module.exports = router;
