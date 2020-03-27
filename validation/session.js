const isEmpty = require("./is-empty");

module.exports = function validateSession(cookies){
  let errorsSession = {};
  
  if(isEmpty(cookies.email)){
    errorsSession.session = "You haven't log in";
  }

  return {
    errorsSession,
    isValidSession: isEmpty(errorsSession)
  }
}