var router = require('express').Router();

router.route('/')
	.get(function(req, res) {
		res.send('Monsters_Encounters works!');
	});

module.exports = router;
