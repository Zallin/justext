var csurf = require('csurf'),
    SessionHandler = require('./session.js'),
    ContentHandler = require('./content.js');

var csrfProtection = csurf({cookie : true});

module.exports = function (app, connection){

    var sessionHandler = new SessionHandler(connection);
    var contentHandler = new ContentHandler(connection);

    app.get('/', sessionHandler.requireLogin, contentHandler.displayMain);

    app.get('/login', csrfProtection, function (req, res, next){+
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

    app.get('/profile', csrfProtection, sessionHandler.requireLogin, contentHandler.displayProfile);

    app.post('/profile', csrfProtection, sessionHandler.requireLogin, sessionHandler.updateInfo);

    app.get('/new', csrfProtection, sessionHandler.requireLogin, function (req, res, next){
      res.render('newPost', {
        csrfToken : req.csrfToken()
      });
    });

    app.post('/new', csrfProtection, sessionHandler.requireLogin, contentHandler.addPost);

    app.get('/posts/:permalink', sessionHandler.requireLogin, contentHandler.getPostByPermalink)

    app.get('/:anything', function (req, res, next){
      res.redirect('/');
    });

    app.use(function (err, req, res, next){
       if(res.headersSent) return next(err);
       res.status(err.code).send();
    });
}
