const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
	},
	birthdate:{	
		type:Date,
		required:true
	},
	profile_picture:{	
		type:String,
		required:true
	},
	occupation:{	
		type:String,
		required:true
	},
	phone_number:{	
		type:String,
		required:true
	},
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = User = mongoose.model("user",UserSchema);