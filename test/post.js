
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
const URL = 'http://localhost:3000/'
mon_url = 'monsters/'

// test routes
describe('Route requests', function() {
	describe('Monster request', function() {
		it('POSTs a monster JSON to Monsters collection', function() {
			var testMonster = {
				'mon_id' : '1234',
				'mhitpoints' : 5,
				'mattack' : 5,
				'mdefense' : 5
			}
		});
	});
	// describe('Encounter request', function() {
	// 	it('POSTs an encounter JSON to Encounters collection', function() {});
	// })
	// describe('Campaign request', function() {
	// 	it('POSTs a campaign JSON to Campaigns collection', function() {});
	// });
	// describe('Monsters_Encounters request', function() {
	// 	it('POSTs a Monsters_Encounters JSON to Monsters_Encounters collection', function() {});
	// });
});
