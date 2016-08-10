
// dependencies
var mongoose = require('mongoose');

// define schema
var EncountersSchema = new mongoose.Schema({
	'enc_id': String,
	'general': {
		'name': String,
		'setup': String,
		'readaloud': String
	},
	'Location': String,
	'monsters': [{
		'quantity': Number,
		'mon_id': String
	}]
});

// export schema
module.exports = EncountersSchema;
