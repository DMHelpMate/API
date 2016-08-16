
/**
 * setFields.js sets the fields of a passed in document
 *
 * @param {object} body The request query object made to the route
 * @param {object} doc The document update the values to
 * @callback {object} doc The updated document
 */
module.exports = function(body, doc, callback) {
	Object.keys(body).forEach(function(k) {
		doc[k] = body[k];
	});
	callback(doc);
} 
