
// dependencies
var chai = require('chai');
var chaiHTTP = require('chai-http');
var request = require('request');
var app = require('../app');

// more syntactical
var should = chai.should();

// initialize HTTP middleware for chai
chai.use(chaiHTTP);

// routing vars
const URL = 'http://localhost:3000';

describe('route PUT request', function() {
	it('/monsters PUT request', function() {
		chai.request(URL)
			.put('/monsters?mon_id=1234')
			.send({
				'hairiness': 'excessive',
				'mattack': 10000
			})
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res).should.have.status(200);
			});
	});
	
	it('/encounters PUT request', function() {

	});

	it('/campaigns PUT request', function() {

	});

	it('/monsters_encounters PUT request', function() {

	});
});
