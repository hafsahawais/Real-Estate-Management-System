const express = require('express');
var path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
//remove this_frontend module
//const exphbs = require("express-handlebars");

const config = require('./config');
var app = express();

// Handlebars Middleware
//remove below two lines these are used for front-end
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

const startupdebug = require('debug')('app:startup');

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(cors());
// Routing
var users = require('./routes/userRouter');
var booking = require('./routes/bookingRouter');
var property = require('./routes/propertyRouter');
var complainRouter = require("./routes/complainRouter");
var paymentRouter = require("./routes/paymentRouter");
var subscriptionRouter = require("./routes/subscriptionRouter");
// Connect with DB
mongoose.connect('mongodb://localhost/realEstatedb')
  .then((conn) => // we're connected!
  {
    startupdebug('connected to dB');
  })
  .catch(err => console.error('Connection Error', err));


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// use morgan to log requests to the console
app.use(morgan('dev'));
//CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT'); //,DELETE,OPTIONS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use('/auth', users);
app.use('/booking', booking);
app.use('/property', property);
app.use("/complains", complainRouter);
app.use('/pay', paymentRouter);
app.use('/sub', subscriptionRouter);

//console.log(process.env.PORT); //.PORT, ' -port');
// var tokenn = require('./config/config').secretKey;
// console.log('token ', tokenn);

var port =  process.env.PORT || 3000;
var hostname = 'localhost';

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

