var bcrypt = require('bcrypt');

function UserDAO (db){
    var users = db.collection('users');
    
    this.addUser = function (email, password, fn){
        var user = {
            _id : email,
            password : bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        }
        
        users.insert(user, function (err, _){
            if(err) return fn(err);
            
            fn(null)
        });
    }
    
    this.getUser = function (email, fn){
        users.findOne({_id : email}, function (err, doc){
            if (err) return fn(err, null);
            
            fn(null, doc)
        });
    }
}

exports.UserDAO = UserDAO;