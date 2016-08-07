
// import dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');

// create db connection and set vars for routes to access db
mongoose.createConnection('mongodb://localhost/unicorn');
var db = mongoose.connect;
app.set('db', db);
app.set('mongoose', mongoose);

// api home screen
app.get('/', function(req, res) {
	res.send('Sweet! You\'re using the UnicornRampage API. **High Five!**');
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
