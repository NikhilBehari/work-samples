// Imports
const express = require('express');
const dotenv = require('dotenv');

var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var cookieParser = require('cookie-parser');
const initDb = require('./mongoUtils').connectToServer;
const conf = require('./.config');

//Configure dotenv
dotenv.config();


// Configure express app 
const app = express();
var jsonParser = bodyParser.json()
app.use(express.static('dist'));
app.use(jsonParser);
app.use(cookieParser());
var corsOptions = {
    origin: conf.allowed_domains,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());
require("./passportUser").initPassport(passport);


const userRoutes = require('./userRouter');
app.use("/user", userRoutes);
const apiRoutes = require('./apiRouter');
app.use("/api", apiRoutes);


initDb(function(err){
    app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
});