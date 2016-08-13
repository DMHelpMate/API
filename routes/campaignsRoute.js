
// import dependencies
var router = require('express').Router();

const SELECT = '-_id general encounters'

// mongoose vars
var mongoose,
	Campaign;


/**
 * getEs() retrieves all encounters in a campaign
 */
function getEs(campaign, callback) {
	var fullResult = {campaign:{}, encounters:[]};
	for (var i = 0; i < campaign.encounters.length; i++) {
		(function(i) {
			
		})(i);
	}
}


// route http reqs
router.use(function(req, res, next) {
		mongoose = req.app.get('mongoose');
		Campaign = mongoose.model('Campaign', req.app.get('CampaignsSchema'));
		res.header('Access-Control-Allow-Origin', '*');
		res.header('POST, GET');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		next();
	})
	.route('/')
		.delete(function(req, res) {
			return res.sendStatus(501);
		})
		.get(function(req, res) {
			// id in query string: get one by id
			if (req.query.camp_id) {
				Campaign.findOne({'camp_id': req.query.camp_id}, SELECT, function(err, result) {
					if (err) {
						return res.status(500).json(null);
					} else {
						return res.status(200).json(result);
					}
				});
			} 

			// empty query string: retrieve all
			else {
				Campaign.find({}, SELECT, function(err, result) {
					if (err) {
						res.status(500).json(null);
					} else {
						res.status(200).json(result);
					}
				});
			}
		})
		.post(function(req, res) {
			if (req.body) {
				Campaign.create(req.body, function(err, newEncounter) {
					if (err) {
						console.log('/campaigns POST request: Error: ')
						console.log(err);
						return res.sendStatus(500);
					} else {
						console.log('/campaigns POST request: OK')
						return res.sendStatus(200);
					}
				});
			} else {
				console.log('/campaigns POST request: Error: ');
				console.log('null request body');
				return res.sendStatus(204);
			}
		})
		.put(function(req, res) {
			return res.sendStatus(501);
		});

// make available to node app
module.exports = router;
