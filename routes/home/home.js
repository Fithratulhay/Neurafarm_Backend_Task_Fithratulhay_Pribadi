const express = require("express");
const router = express.Router();
const isEmpty = require("../../validation/is-empty");

router.get("",(req,res) =>{
	if(isEmpty(req.query.image)){
		return res.json({"message": "connect success"});
	}
	
	let image = req.query.image;
	return res.sendFile("/"+image, {'root': __dirname+'/../../uploads'});
});

module.exports = router;