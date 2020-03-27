const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateRegisterInput(request){
    let errorsRegister = {};
    
	data = request.body;
    data.username = !isEmpty(data.username) ? data.username:"" ; 
    data.email = !isEmpty(data.email) ? data.email:"" ; 
    data.password = !isEmpty(data.password) ? data.password:"" ; 
	data.birthdate = !isEmpty(data.birthdate) ? data.birthdate:"" ;
	data.profile_picture = !isEmpty(request.files.profile_picture.name) ? request.files.profile_picture.name:"" ;
	data.occupation = !isEmpty(data.occupation) ? data.occupation:"" ;
	data.phone_number = !isEmpty(data.phone_number) ? data.phone_number:"" ;


    if(validator.isEmpty(data.username)){
        errorsRegister.username = "please input username";
    }
    
    if(validator.isEmpty(data.email)){
        errorsRegister.email = "please input email";
    }

    if(!validator.isEmail(data.email)){
        errorsRegister.email = "email not valid";
    }

    if(validator.isEmpty(data.password)){
        errorsRegister.password = "please input password";
    }   

    if(validator.isEmpty(data.birthdate)){
        errorsRegister.birthdate = "please input birthdate";
	}
	
    if(validator.isEmpty(request.files.profile_picture.name)){
        errorsRegister.profile_picture = "please input profile_picture";
	}
	
    if(validator.isEmpty(data.occupation)){
        errorsRegister.occupation = "please input occupation";
	}
	
    if(validator.isEmpty(data.phone_number)){
        errorsRegister.phone_number = "please input phone_number";
    }

    return {
        errorsRegister,
        isValidRegister: isEmpty(errorsRegister)
    }
}