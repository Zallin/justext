exports.validateSignUp = function (email, password){
        var email_reg = /^[\S]+@[\S]+\.[\S]+$/;
        var password_reg = /^.{3,20}$/;
        
        if (!email_reg.test(email)) {
            return false;
        }
        else if (!password_reg.test(password)) {
            return false;
        }

        return true;
}