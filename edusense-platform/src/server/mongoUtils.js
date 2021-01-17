const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const url = "mongodb://localhost:27017";
var tunnel = require('tunnel-ssh');
// ENTER CREDENTIALS IN ./config.js
const conf = require('./.config');
var _db, _pdb;


// SSH Tunnel Config 
var config = {
    // Change
    username: conf.username,
    // Usually in the form of /Users/*username*/.shh/id_rsa 
    privateKey: require('fs').readFileSync(conf.key_path),
    password: conf.password,

    // Keep the same 
    agent: process.env.SSH_AUTH_SOCK,
    host: conf.db_host,
    port: 22,
    dstPort: 27017
};

module.exports = {

    connectToServer: function (callback) {
        var server = tunnel(config, function (error, server) {
            if (error) {
                console.log("SSH connection error: " + error);
            } else {
                console.log("SSH Connection Successful");
            }

            MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
                if(err){
                    console.log("Error connecting to database");
                }
                _db = client.db('edusense-graphql-testdb');
                _pdb = client.db('frontend-test');
                return callback(err);
            });
        });
    },

    getDb: function () {
        return _db;
    },

    getPDb: function () {
        return _pdb;
    }
};