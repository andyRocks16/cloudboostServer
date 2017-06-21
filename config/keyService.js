var q = require('q');
var uuid = require('node-uuid');
var keys = require('./keys.js');

module.exports = function() {
	return {
		initSecureKey: function() {
			try {
                console.log("in")
				if (global.keys.secureKey) {
					console.log("Secure Key : " + global.keys.secureKey);
					deferred.resolve(global.keys.secureKey);
				} else {

					var deferred = q.defer();

					var collection = global.mongoClient.db(keys.globalDb).collection(global.keys.globalSettings);

					collection.find({}).toArray(function(err, docs) {
						if (err) {
							console.log("Error retrieveing Global Settings");
							console.log(err);
							deferred.reject(err);
						} else {

							var key = uuid.v4(); //generate a new key.

							if (docs.length >= 1) {
								if (docs[0].secureKey) {
									keys.secureKey = docs[0].secureKey;
									console.log("Secure Key : " + global.keys.secureKey);
									deferred.resolve(global.keys.secureKey);
								} else {

									//save in mongodb.
									if (!docs[0])
										docs[0] = {};

									docs[0]["secureKey"] = key;



									collection.save(docs[0], function(err, doc) {
										if (err) {
											console.log("Error while saving Global Settings");
											console.log(err);
											deferred.reject(err);
										} else {
											//resolve if not an error
											global.keys.secureKey = key;
											console.log("Secure Key : " + global.keys.secureKey);

											deferred.resolve(key);
										}
									});
								}
							} else {
								//create a new document.
								var doc = {};
								doc.secureKey = key;
								global.keys.secureKey = key;
								collection.save(doc, function(err, doc) {
									if (err) {
										console.log("Error while saving Global Settings");
										console.log(err);
										deferred.reject(err);
									} else {
										//resolve if not an error
										console.log("Secure Key : " + global.keys.secureKey);
										deferred.resolve(key);
									}
								});
							}
						}
					});

				}

				return deferred.promise;
			} catch (e) {
				console.log("Error Init Encrypt Key");
				console.log(e);
				global.winston.log('error', {
					"error": String(e),
					"stack": new Error().stack
				});
			}
		}
    }
}