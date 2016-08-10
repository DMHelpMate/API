
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
mon_url = URL + 'monsters';

// test routes
describe('Route requests', function() {

	// test monster routes
	describe('Monster request', function() {
		it('POSTs a monster JSON to Monsters collection', function() {
			// uncomment when ready to test /monsters POST request
			chai.request(URL)
				.post('/monsters')
				.send({
					'mon_id' : '1234',
					'mname' : 'Heraldy the Baldy',
					'mhitpoints' : 5,
					'mattack' : 5,
					'mdefense' : 5
				})
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res).should.have.status(200);
				});
		});
	});
	describe('Encounter request', function() {
		it('POSTs an encounter JSON to Encounters collection', function() {
			chai.request(URL)
				.post('/encounters')
				.send({

				})
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res).should.have.status(200);
				})
		});
	})
	// describe('Campaign request', function() {
	// 	it('POSTs a campaign JSON to Campaigns collection', function() {});
	// });
	// describe('Monsters_Encounters request', function() {
	// 	it('POSTs a Monsters_Encounters JSON to Monsters_Encounters collection', function() {});
	// });
});
