var express = require('express'),
    session = require('client-sessions'),
    MongoClient = require('mongodb').MongoClient,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config.json');

var app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

app.set('view engine', 'jade');

app.use(session({
   cookieName : 'session',
   secret : 'fejfeij3939r-3f3f',
   duration : 1000 * 60 * 60,
   activeDuration : 5000
}));

MongoClient.connect(config.database, function (err, db){
   if (err) {
      throw err;
   }

   require('./routes')(app, db);

   app.listen(3000, function (){
      console.log('listening');
   });
});
