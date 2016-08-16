
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
describe('Route POST requests', function() {

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
					'enc_id': '9871',
					'general': {
						'name': 'The Duel of the Lactose Intolerants',
						'setup': 'A gang war between two lactose interolant gangs is beginning. There are pitchers full of milk everywhere.',
						'readaloud': 'You stand in the center, two pitchers full of milk, while the lactose interolant gangs prepare for war'
					},
					'locations': {
						'name': 'Dairy Queen',
						'description': 'In the parking lot of Dairy Queen. There are a few old Toyotas and elderly nearby.'
					},
					'monsters': [
						{
							'quantity': 5,
							'mon_id': '1234'
						}
					]
				})
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res).should.have.status(200);
				})
		});
	})
	describe('Campaign request', function() {
		it('POSTs a campaign JSON to Campaigns collection', function() {
			chai.request(URL)
				.post('/campaigns')
				.send({
					'camp_id': '5555',
					'general': {
						'name': 'The Magical Flavors of Dirt',
						'author': 'Cyrus Sarkosh',
						'theme': 'Eating Simulator',
						'description': 'Discover large variety of flavors as you fill you mouth full of various dirts'
					},
					'encounters': [
						'9871'
					]
				})
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res).should.have.status(200);
				});
		});
	});
	describe('Monsters_Encounters request', function() {
		it('POSTs a Monsters_Encounters JSON to Monsters_Encounters collection', function() {
			chai.request(URL)
				.post('/monsters_encounters')
				.send({
					'mon_id': '1234',
					'enc_id': '9871'
				})
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res).should.have.status(200);
				});
		});
	});
});
