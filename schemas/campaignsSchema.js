
// dependencies
var mongoose = require('mongoose');

// define schema
var CampaignsSchema = new mongoose.Schema({
	'camp_id': String,
	'general': {
		'name': String,
		'author': String,
		'theme': String,
		'description': String
	},
	'encounters': [String]
});

// export schema
module.exports = CampaignsSchema;
