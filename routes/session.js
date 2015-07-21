var UserDAO = require('../db/users.js').UserDAO,
    bcrypt = require('bcrypt'),
    utils = require('../utils.js'),
    ReqErr = require('./error.js'),
    xssFilters = require('xss-filters'),
    config = require('../config.json');

function SessionHandler(db){
    var users = new UserDAO(db);

    this.signUp = function (req, res, next){
        if (utils.validateSignUp(req.body.email, req.body.password)) {

            var email = xssFilters.inHTMLData(req.body.email);
            var password = xssFilters.inHTMLData(req.body.password);

            users.addUser(email, password, function (err){
               if(err) return next(err);

               res.send({redirect : '/login'});
            });
        } else {
            var err = new ReqErr(400);
            next(err);
        }
    }

    this.login = function (req, res, next){
        if(req.body.email && req.body.password){
          users.getUser(req.body.email, function (err, user){
              if(err) return next(err);

              if(user){
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    req['session'] = {
                        email : req.body.email
                    }
                    res.send({redirect : '/'});
                } else {
                    var err = new ReqErr(400);
                    next(err);
                }
              } else {
                var err = new ReqErr(400);
                next(err);
              }
          });
        } else {
          var err = new ReqErr(400);
          next(err);
        }
    }

    this.requireLogin = function (req, res, next){
      if(req.session.email){
        users.getUser(req.session.email, function(err, user){
          if(err) return next(err);

          if(user){
            delete user.password;
            req.user = user;
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

    this.updateInfo = function (req, res, next){
      var data = {}, updatable = config.updatable;

      for(var i = 0; i < updatable.length; i++){
        var k = updatable[i];
        if(req.body[k]){
            data[k] = xssFilters.inHTMLData(req.body[k]);
        }
      }

      users.update(req.session.email, data, function (err){
        if(err) return next(err);

        next();
      });
    }

    this.logout = function (req, res, next){
      req.session.reset();
      res.redirect('/login')
    }
}

module.exports = SessionHandler;
