var path =require('path');
var express=require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser=require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(cors());

require('dotenv').config();

//connect to MongoDB Atlas
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

//routes
var User=require('./routes/user');
//middleware
app.use('/',User);

//Start the server
var port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log('Server started on port ' + port)
});