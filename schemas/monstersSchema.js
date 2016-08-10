
// dependencies
var mongoose = require('mongoose');

// define schema
var MonstersSchema = new mongoose.Schema({
	'mon_id': String,
	'mname': String,
	'mhitpoints': Number,
	'mattack': Number,
	'mdefense': Number
});

// export schema
module.exports = MonstersSchema;
