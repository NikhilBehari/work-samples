const routes = require('express').Router();
const getDb = require('./mongoUtils').getDb;
const getPDb = require('./mongoUtils').getPDb;
const passport = require('./passportUser').getPassport();
const { ListItemSecondaryAction } = require('@material-ui/core');
const jwt = require('jsonwebtoken');

// SAMPLE USER
// Grabs a sample user index in user_data collection
const user_ind = 0


// GET: Sample frame collection
routes.get('/getFrameData', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getDb().collection('session-5f11e488dab4eb718a819779-classinsight-graphql-video', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                res.send(items[1]);
            };
        });
    });
});


// GET: PD Learning Modules (MD Format)
routes.get('/getPDModules', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getDb().collection('pd_courses', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                res.send(items);
                // console.log(items);
            };
        });
    });
});


// GET: PD List
routes.get('/getPDList', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getDb().collection('pd_courses', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                res.send(items[0].List);
            };
        });
    });
});

// GET: PD Descriptions
routes.get('/getPDDesc', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getDb().collection('pd_courses', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                res.send(items[0].Desc);
            };
        });
    });
});

// GET: User data for PD Modules
routes.get('/getDashboardData', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getPDb().collection('user_data', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                // Right not just grabs the first user data document 
                res.send(items[user_ind].dashboardData);
            };
        });
    });
});

// GET: Mapping requests
routes.get('/getRequests', passport.authenticate('jwt', { session: false }), function (req, res) {
    // Get sample collection
    getDb().collection('requests', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                // Right not just grabs the first user data document 
                res.send(items);
            };
        });
    });
});

// POST: Store PD goal data in db
routes.post('/setGoal', function (req, res) {

    // Insert in user data goals field 
    // getPDb().collection("user_data").insertOne({ nextWeek: req.body.nextWeek }, function(err, res){
    //     if(err) throw err;
    //     console.log("Doc  insterted");
    // });      
});

// POST: Store PD Module in db
routes.post('/uploadPD', passport.authenticate('jwt', { session: false }), function (req, res) {

    var setObj = { $set: {} };
    setObj.$set[req.body.nvb] = req.body.pdContent;

    getDb().collection("pd_courses").updateOne(
        { "content": "LearningModules" },
        setObj)
        .catch((err) => {
            console.log("Error: " + err);
        });

});

// POST: Save class mapping request
routes.post('/requestClass', passport.authenticate('jwt', { session: false }), function (req, res) {

    var setObj = { };
    setObj = req.body;
    var today = new Date();
    setObj["date"] = today;


    getDb().collection("requests").insertOne(setObj)
        .catch((err) => {
            console.log("Error: " + err);
        });

});

// only admin
routes.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {
    getDb().collection('users', function (err, collection) {
        collection.find().toArray(function (err, users) {
            res.send(users);
        })
    })
});


module.exports = routes;