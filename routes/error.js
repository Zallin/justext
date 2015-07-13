function ReqError(code, message){
  this.code = code;

  if(message) this.message = message;
}

ReqError.prototype = new Error();

module.exports = ReqError;
