const bcrypt = require("bcryptjs");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const User = require("../../models/User");

const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");
const validateSession = require("../../validation/session");
const validateUpdateInput = require("../../validation/update");
const validateForgotPasswordInput = require("../../validation/forgot-password");
const isEmpty = require("../../validation/is-empty");

const hashPassword = function(password){
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password,salt);
	
	return hash;
}

const compareHashPassword = function(password, hashPassword){
	const result = bcrypt.compareSync(password, hashPassword);
	
	return result;
}

const uploadFile = function(oldpath, newpath){
	fs.copyFile(oldpath, newpath, function(err){
        if (err) throw err;
	});
}

const renameFile = function(oldpath, newpath){
	fs.rename(oldpath, newpath, function(err){
        if (err) throw err;
	});
}

router.post("/register",(req,res) =>{
	const {errorsRegister,isValidRegister} = validateRegisterInput(req);
	
    if(!isValidRegister){
        return res.status(400).json({message : errorsRegister});
	}
	
    User.findOne({$or: [
        {email: req.body.email},
        {username: req.body.username}
    ]})
        .then(user => {
            if(user){
                return res.status(400).json({message : 'username or email address already used'});
            }else{
                const newUser = new User({
                    username : req.body.username,
                    email : req.body.email,
					password : req.body.password,
					birthdate : req.body.birthdate,
					profile_picture : req.files.profile_picture.path,
					occupation : req.body.occupation,
					phone_number : req.body.phone_number,
				});

				let oldpath = newUser.profile_picture;
				let newpath = './uploads/' + newUser.username + '-profile_picture.jpg';
				
				uploadFile(oldpath,newpath);
				
				let path = './?image=' + newUser.username + '-profile_picture.jpg';
				
				newUser.profile_picture = path;
				newUser.password = hashPassword(newUser.password);
				newUser.birthdate = Date.parse(newUser.birthdate);
				
				newUser.save()
					.catch(err => console.log(err));
				return res.json(newUser);
            }
        })
});

router.post("/login",(req,res) =>{
	const {errorsSession,isValidSession} = validateSession(req.cookies);
	
    if(isValidSession){
		return res.status(400).json({message : "you already log in"});
	}

	const {errorsLogin,isValidLogin} = validateLoginInput(req);

    if(!isValidLogin){
        return res.status(400).json({message : errorsLogin});
	}
	
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
				let result = compareHashPassword(req.body.password, user.password);
				if(result){
					return res.cookie("email", user.email).json({message: 'Login success'});
				}else{
					return res.status(400).json({message : 'email address or password not valid'});
				}
            }else{
                return res.status(400).json({message : 'no account with this email address'});
            }
        })
});

router.put("/edit-profile",(req,res) =>{
    const {errorsSession,isValidSession} = validateSession(req.cookies);
	
    if(!isValidSession){
		return res.status(400).json({message : errorsSession});
	}
	
	const {errorsUpdate,isValidUpdate} = validateUpdateInput(req);
	
	if(!isValidUpdate){
		return res.status(400).json({message : errorsUpdate});
	}
	
    User.findOne({email: req.cookies.email})
		.then(user => {   
			let isEmailChange = false;         
			
			for (var key in req.body){
                if (!isEmpty(user[key]) && (key != 'old_password')){
                    if(key == 'password'){						
						if (compareHashPassword(req.body.old_password, user.password)){
							user[key] = hashPassword(req.body.password);
						} else {
							return res.status(400).json({message : "old_password not valid, can't change password"});
						}
					} else if (key == 'username') {
						let oldpath = './uploads/' + user.username + '-profile_picture.jpg';
						let newpath = './uploads/' + req.body[key] + '-profile_picture.jpg';
						renameFile(oldpath, newpath);
						
						let imagePath = './?image=' + req.body[key] + '-profile_picture.jpg';
						user.profile_picture = imagePath;

						user[key] = req.body[key];
					} else if (key == 'email') {
						user[key] = req.body[key];
						isEmailChange = true;
                    } else {
                        user[key] = req.body[key];
                    }
                }
            }
            
            user.save()
                .catch(err => console.log(err));
                
			if (!isEmpty(req.files.profile_picture)){
				let oldpath = req.files.profile_picture.path;
				let newpath = './uploads/' + user.username + '-profile_picture.jpg';
				
				uploadFile(oldpath,newpath);
			}
			
			if (isEmailChange) {
				return res.cookie("email", user.email).json({user: user});
			}
            return res.json({user: user});
        })
});

router.put("/forgot-password",(req,res) =>{
	const {errorsForgotPassword,isValidForgotPassword} = validateForgotPasswordInput(req.body);

    if(!isValidForgotPassword){
        return res.status(400).json({message : errorsForgotPassword});
	}
	
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
				user.password = hashPassword(req.body.new_password);
				user.save()
					.catch(err => console.log(err));
				
				return res.json({message : "password changed"});
            }else{
                return res.status(400).json({message : 'no account with this email address'});
            }
        })
});

module.exports = router;