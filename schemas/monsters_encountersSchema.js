
// dependencies
var mongoose = require('mongoose');

// define schema
var Monsters_EncountersSchema = new mongoose.Schema({
	'mon_id': String,
	'enc_id': String
});

// export schema
module.exports = Monsters_EncountersSchema;
