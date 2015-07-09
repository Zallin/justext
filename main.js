var express = require('express'),
    sessions = require('client-sessions');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'jade');

app.use(session({
   cookieName : 'session',
   secret : 'fejfeij3939r-3f3f',
   duration : 5000,
   activeDuration : 5000
}));      

app.get('/', function (req, res, next){
   res.render('index');
});

app.get('/login', function (req, res, next){
   res.render('login');    
});

app.get('/register', function (req, res, next){
   res.render('register');
});

app.listen(3000, function (){
   console.log('listening'); 
});