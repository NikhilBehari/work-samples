const routes = require('express').Router();
const getDb = require('./mongoUtils').getDb;
const getPDb = require('./mongoUtils').getPDb;
const passport = require('./passportUser').getPassport();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 4;
const ADMIN = 0;
const DEFAULT_AUTH_LEVEL = 1;
const UNAUTHORIZED = "The user is unauthorized to make these changes";

routes.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

routes.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        getDb().collection('users', function (err, collection) {
            collection.find({ username: req.user }).toArray(function (err, items) {
                if (items.length > 0) {
                    let user = items[0];
                    const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie('accessToken', accessToken, { expires: (new Date(Date.now() + 10000 * 36000)), httpOnly: true, sameSite: false });
                }
                return res.redirect("/");
            });
        });
    });

routes.put('/login', passport.authenticate("local", { session: false }), function (req, res) {
    getDb().collection('users', function (err, collection) {
        collection.find({ username: req.user.username }).toArray(function (err, items) {
            if (items.length > 0) {
                var user = items[0];
                bcrypt.compare(req.user.password, user.password, function(err, response){
                    if(err){
                        res.set('Content-Type', 'text/plain')
                            .status(403).send();
                    }
                    else {
                        const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
                        res.cookie('accessToken', accessToken, { expires: (new Date(Date.now() + 10000 * 36000)), httpOnly: true, sameSite: false });
                        res.status(200).json({ username: user.username });
                    }
                });
            }
            else {
                res.set('Content-Type', 'text/plain')
                    .status(403).send();
            }
        });
    });
});

routes.put('/signup', function (req, res) {
    let user = req.body.user;
    user.classList = [];
    getDb().collection('users', function (err, collection) {
        collection.find({ username: user.username }).toArray(function(err, users){
            if(users.length > 0){
                res.status(409).json({message: "User already exists!"});
            }
            else {
                bcrypt.hash(user.password, saltRounds).then(function(hash){
                    user.password = hash;
                    user.authLevel = DEFAULT_AUTH_LEVEL;
                    collection.insertOne(user);
                    res.status(200).json();
                });
            }
        });
    });
});

routes.get('/logout', passport.authenticate("jwt", { session: false }), function (req, res) {
    res.clearCookie('accessToken');
    res.status(200).json(req.user);
});

routes.get('/isAuthenticated', passport.authenticate("jwt", { session: false }), function (req, res) {
    res.status(200).send();
});

// GET: User profile data
routes.get('/getUserProfile', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Get sample collection
    getDb().collection('users', function (err, collection) {
        collection.find({username: req.user}).toArray(function (err, items) {
            if (err) { throw err }
            else {
                res.send(items[0]);
            };
        });
    });
});

// GET: User data from assigned classes
routes.get('/getData', passport.authenticate('jwt', { session: false }), function (req, res) {
    
    getDb().collection('course_data', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) { throw err }
            else {
                // console.log(req.user);
                // Right now just grabs the first user data document 
                res.send(items[0].data);
            };
        });
    });
});

// GET: User data from assigned classes
routes.post('/getClassData', passport.authenticate('jwt', { session: false }), function (req, res) {

    getDb().collection('course_data', function (err, collection) {
        // var db_classes = collection.find({course: req.body.class_id}).count({}, function(error, count){
        //     console.log(count);
        // });

        collection.find({course: req.body.class_id}).toArray(function (err, items) {
            // console.log(items.length);
            var class_exists = items.length;
            if(class_exists > 0){
                res.send(items[0].data);
            }
            else{
                res.send("Empty");
            }
        });
    });

});



routes.post('/addClass', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Only admin
    getDb().collection('users', function (err, collection) {
        collection.find({ username: req.user }).toArray(function(err, users){
            if (users[0] && users[0].authLevel !== ADMIN){
                return res.status(401).send({ message: UNAUTHORIZED});
            }
            collection.find({ username: req.body.username }).toArray(function(err, mappingUsers){
                if (mappingUsers.length > 0 && mappingUsers[0].classList && mappingUsers[0].classList.includes(req.body.className)) {
                    return res.send({ message: "Mapping already exists" });
                }
                else {
                    collection.updateOne({ username: req.body.username }, { $push: { classList: req.body.className } }, function (error) {
                        if (!error) {
                            return res.send({ message: "Mapping added successfully!" });
                        }
                    })
                }
            });
            
        });
    });
});


routes.put('/removeClass', passport.authenticate('jwt', { session: false }), (req, res) => {
    getDb().collection('users', function (err, collection) {
        collection.find({ username: req.user }).toArray(function(err, users){
            if (users[0] && users[0].authLevel !== ADMIN) {
                return res.status(401).send({ message: UNAUTHORIZED });
            }
            collection.updateOne({ username: req.body.username }, { $pull: { classList: req.body.className } }, function (err, response) {
                if (!err) {
                    return res.send({ message: "Mapping removed successfully!" });
                }
            });
        });
    });
});

// routes.get('/sessions', passport.authenticate('jwt', { session: false }), (req, res) => {
//     getDb().collection('users', function(err, collection){
//         collection.find({username: req.user}).toArray(function(err, user){
//             if(err){ throw err; }
//             else {
//                 user[0].classList.forEach(function(_class){
//                     // var re = new RegExp(_class.split('_')[0], "g");
//                     var re = new RegExp("8888D", "g");
//                     getDb().collection('sessions', function(err, sessionsCollection){
//                         sessionsCollection.find({ keyword: re }).toArray(function(err, sessions){
//                             res.send(sessions);
//                         });
//                     });
//                 });
//             }
//         });
//     });
// });

routes.post('/classAggregate', passport.authenticate('jwt', { session: false }), (req, res) => {
    //add user auth here
    getDb().collection(`class_${req.body.class_code}`, function(err, collection){
        collection.find().toArray(function(err, data){
            res.send(data);
        });
    });
});

module.exports = routes;