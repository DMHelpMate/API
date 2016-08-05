var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('Hello homies!');
});

app.get('/test', function(req, res) {
	res.send('Update to master worked');
});

app.listen(3000);