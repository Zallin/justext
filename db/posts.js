function PostDAO(db){
  var posts = db.collection('posts');

  this.addPost = function(title, body, author, fn){

    var permalink = title.replace( /\s/g, '_' );
    permalink = permalink.replace( /\W/g, '' );

    var post = {
      "title" : title,
      "body" : body,
      "author" : author,
      "permalink" : permalink,
      "date" : new Date()
    }

    posts.insert(post, function (err, _){
      if(err) return fn(err, null);

      fn(null, permalink);
    })
  }

  this.getPosts = function (n, fn){
    posts.find().sort({date : -1}).limit(n).toArray(function (err, docs){
      if(err) return fn(err, null);

      fn(null, docs);
    });
  }

  this.getUsersPosts = function(name, n, fn){
    posts.find({"author" : name}).sort({date : -1}).limit(n).toArray(function (err, docs){
      if(err) return fn(err, null);
      fn(null, docs);
    });
  }

  this.getPostByPermalink  = function(permalink, fn){
    posts.findOne({permalink : permalink}, function (err, post) {
      if(err) return fn(err, null);

      fn(null, post);
    })
  }

  this.updateAuthor = function (oldName, newName, fn){
    posts.update({"author" : oldName}, {$set : {"author" : newName}}, {multi : true}, function (err, docs){
      if(err) return fn(err, null);
      fn();
    });
  }

  this.removePost = function (permalink, fn){
    posts.remove({permalink : permalink}, function (err){
      if(err) return fn(err, null);
      fn(null);
    });
  }
}

exports.PostDAO = PostDAO;
