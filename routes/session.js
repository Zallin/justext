var UserDAO = require('../db/users.js').UserDAO,
    bcrypt = require('bcrypt'),
    utils = require('../utils.js'),
    ReqErr = require('./error.js');

function SessionHandler(db){
    var users = new UserDAO(db);

    this.signUp = function (req, res, next){
        if (utils.validateSignUp(req.body.email, req.body.password)) {
            users.addUser(req.body.email, req.body.password, function (err){
               if(err) return next(err);

               res.send({redirect : '/login'});
            });
        } else {
            var err = new ReqErr(400);
            next(err);
        }
    }

    this.login = function (req, res, next){
        users.getUser(req.body.email, function (err, user){
            if(err) return next(err);

            if (bcrypt.compareSync(req.body.password, user.password)) {
                req['session'] = {
                    email : req.body.email
                }
                res.send({redirect : '/'});
            } else {
                var err = new ReqErr(400);
                next(err);
            }
        });
    }

    this.requireLogin = function (req, res, next){
      if(req.session.email){
        users.getUser(req.session.email, function(err, user){
          if(err) return next(err);

          //extend req object with user data if required
          if(user){
            next();
          } else {
            req.session.reset();
            res.redirect('/login');
          }

        });
      } else {
          res.redirect('/login');
      }
    }

    this.logout = function (req, res, next){
      req.session.reset();
      res.redirect('/login')
    }
}

module.exports = SessionHandler;
