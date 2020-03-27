const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(request){
	data = request.body;
    let errorsLogin = {};
    
    data.email = !isEmpty(data.email) ? data.email:"" ; 
    data.password = !isEmpty(data.password) ? data.password:"" ; 
    
    if(validator.isEmpty(data.email)){
        errorsLogin.email = "please input email";
    }

    if(!validator.isEmail(data.email)){
        errorsLogin.email = "email not valid";
    }

    if(validator.isEmpty(data.password)){
        errorsLogin.password = "please input password";
    }

    return {
        errorsLogin,
        isValidLogin: isEmpty(errorsLogin)
    }
}