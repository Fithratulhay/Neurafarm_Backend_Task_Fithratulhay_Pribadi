const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateForgotPasswordInput(data){
    let errorsForgotPassword = {};
    
    data.email = !isEmpty(data.email) ? data.email:"" ; 
    data.new_password = !isEmpty(data.new_password) ? data.new_password:"" ; 
    
    if(validator.isEmpty(data.email)){
        errorsForgotPassword.email = "please input email";
    }

    if(!validator.isEmail(data.email)){
        errorsForgotPassword.email = "email not valid";
    }

    if(validator.isEmpty(data.new_password)){
        errorsForgotPassword.new_password = "please input new_password";
    }

    return {
        errorsForgotPassword,
        isValidForgotPassword: isEmpty(errorsForgotPassword)
    }
}