var bcrypt = require('bcrypt');

function UserDAO (db){
    var users = db.collection('users');

    this.addUser = function (email, password, fn){
        var user = {
            email : email,
            password : bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        }

        users.insert(user, function (err, _){
            if(err) return fn(err);

            fn(null)
        });
    }

    this.getUser = function (email, fn){
        users.findOne({email : email}, {_id : 0}, function (err, doc){
            if (err) return fn(err, null);

            fn(null, doc)
        });
    }

    this.update = function (email, props, fn){
      users.update({email : email}, {$set : props}, function (err, _){
        if(err) return fn(err);

        fn(null);
      });
    }
}

exports.UserDAO = UserDAO;
