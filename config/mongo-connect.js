var assert = require('assert');
var q = require('q');

var url = "mongodb://localhost:27017/_GLOBAL";

module.exports = {
    connectDB: function () {
        var deffered = q.defer();
        try {
            var mongoClient = require('mongodb').MongoClient;
            mongoClient.connect(global.keys.mongoConnectionString, function (err, db) {
                if (err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(db);
                }
            })
        } catch (err) {
            console.log("Error : " + err);
            deffered.reject(err);
        } finally {
            return deffered.promise;
        }
    },

    dbConnect: function (appId) {
        try {
            return global.mongoClient.db(appId);
        } catch (err) {
            console.log("Error : " + err);
        }
    }
};

