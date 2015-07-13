var csurf = require('csurf'),
    SessionHandler = require('./session.js');

var csrfProtection = csurf({cookie : true});

module.exports = function (app, connection){

    var sessionHandler = new SessionHandler(connection);

    app.get('/', sessionHandler.requireLogin, function (req, res, next){
        res.render('main');
    });

    app.get('/login', csrfProtection, function (req, res, next){
       res.render('login', {
            csrfToken : req.csrfToken()
       });
    });

    app.post('/login', csrfProtection, sessionHandler.login);

    app.get('/register', csrfProtection, function (req, res, next){
        res.render('register', {
            csrfToken : req.csrfToken()
        });
    });

    app.post('/register', csrfProtection, sessionHandler.signUp);

    app.get('/logout', sessionHandler.logout);

    app.use(function (err, req, res, next){
       res.status(err.code).send();
    });
}
