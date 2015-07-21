var PostDAO = require('../db/posts.js').PostDAO,
    ReqErr = require('./error.js'),
    xssFilters = require('xss-filters');

function ContentHandler(db){
    var posts = new PostDAO(db);

    this.displayMain = function (req, res, next){
      posts.getPosts(10, function (err, docs){
        if(err) return next(err);

        res.render('index', {
          posts : docs
        });
      });
    }

    this.addPost = function (req, res, next){
      var title = req.body.title, body = req.body.body;

      if(!title || !body){
        var err = new ReqErr(400);
        return next(err);
      }

      title = xssFilters.inHTMLData(title);
      body = xssFilters.inHTMLData(body);

      posts.addPost(title, body, req.user.name, function (err){
        if(err) return next(err);

        res.status(200).send();
      });
    }

    this.getPostByPermalink = function (req, res, next){
      posts.getPostByPermalink(req.params.permalink, function (err, post) {
        if(err) return next(err);

        if(post){
          res.render('post', {
            post : post
          });
        } else {
          res.render('post', {
            err : 'Unfortunately, nothing has been found'
          });
        }

      });
    }

    this.displayProfile = function (req, res, next){
      posts.getUsersPosts(req.user.name, 5, function (err, posts){
        res.render('profile', {
          csrfToken : req.csrfToken(),
          user : req.user,
          posts : posts
        });
      });
    }

    this.updateAuthor = function (req, res, next){
      if(!req.body.name) return next();

      posts.updateAuthor(req.user.name, req.body.name, function (err){
        if(err) return next(err);
        res.status(200).send();
      });
    }

    this.deletePost = function (req, res, next){
      posts.getPostByPermalink(req.params.permalink, function (err, post){
        if(err) return next(err);

        if(post){
          if(post.author == req.user.name){
            posts.removePost(req.params.permalink, function (err){
              if(err) return next(err);
              res.status(200).send();
            });
          } else {
            next(new ReqErr(403));
          }
        } else {
          next(new ReqErr(404));
        }
      });
    }
}

module.exports = ContentHandler;
