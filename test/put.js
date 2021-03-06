
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
				'mon_id' : 'Brand Fucking New',
				'mname' : 'Heraldy the ',
				'mhitpoints' : 5,
				'mattack' : 5,
				'mdefense' : 5
			})
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res).should.have.status(200);
			});
	});
	
	it('/encounters PUT request', function() {
		chai.request(URL)
			.put('/encounters?enc_id=9871')
			.send({
				'asdf': 'asdfa',
				'big pants': '50% off',
				'general': {
					'setup': 'PUT: setup changed',
					'name': 'The name changed'
				}
			})
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res).should.have.status(200);
			})
	});

	it('/campaigns PUT request', function() {

	});

	it('/monsters_encounters PUT request', function() {

	});
});
