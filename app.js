
// import dependencies
var express 	= require('express');
var app 		= express();
var mongoose 	= require('mongoose');
var bodyParser 	= require('body-parser');

// it's a cool header for the / route
const COOL_HEADER = 
' _    _       _                      _____                                                     _____ _____ \n| |  | |     (_)                    |  __ \\                                              /\\   |  __ \\_   _|\n| |  | |_ __  _  ___ ___  _ __ _ __ | |__) |__ _ _ __ ___  _ __   __ _  __ _  ___       /  \\  | |__) || |  \n| |  | | \'_ \\| |/ __/ _ \\| \'__| \'_ \\|  _  // _` | \'_ ` _ \\| \'_ \\ / _` |/ _` |/ _ \\     / /\\ \\ |  ___/ | |  \n| |__| | | | | | (_| (_) | |  | | | | | \\ \\ (_| | | | | | | |_) | (_| | (_| |  __/    / ____ \\| |    _| |_ \n \\____/|_| |_|_|\\___\\___/|_|  |_| |_|_|  \\_\\__,_|_| |_| |_| .__/ \\__,_|\\__, |\\___|   /_/    \\_\\_|   |_____|\n                                                          | |           __/ |                              \n                                                          |_|          |___/                               \n';

// create db connection and set vars for routes to access db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/unicorn');
var db = mongoose.connect;
app.set('db', db);
app.set('mongoose', mongoose);

// globalize schemas
app.set('MonstersSchema', require('./schemas/monstersSchema'));
app.set('EncountersSchema', require('./schemas/encountersSchema'));
app.set('CampaignsSchema', require('./schemas/campaignsSchema'));
app.set('Monsters_EncountersSchema', require('./schemas/monsters_encountersSchema'));

// sanitize json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// api home screen
app.get('/', function(req, res) {
	res.send("<pre>" + COOL_HEADER + "</pre>");
});

// import route modules
var monstersRoute = require('./routes/monstersRoute');
var encountersRoute = require('./routes/encountersRoute');
var campaignsRoute = require('./routes/campaignsRoute');
var monsters_encountersRoute = require('./routes/monsters_encountersRoute');

// set route modules to routes
app.use('/monsters', monstersRoute);
app.use('/encounters', encountersRoute);
app.use('/campaigns', campaignsRoute);
app.use('/monsters_encounters', monsters_encountersRoute);


app.listen(3000, function() {
	console.log('app.js using port 3000');
});
