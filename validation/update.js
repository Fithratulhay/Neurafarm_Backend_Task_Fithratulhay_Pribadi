const isEmpty = require("./is-empty");

module.exports = function validateUpdateInput(request){
    let errorsUpdate = {};

	if(isEmpty(request.body) && isEmpty(request.files)){
		errorsUpdate.update = "no input";
    }
    
    if(!isEmpty(request.body.password) && isEmpty(request.body.old_password)){
        errorsUpdate.old_password = "please input old_password";
    }
	
    return {
        errorsUpdate,
        isValidUpdate: isEmpty(errorsUpdate)
    }
}