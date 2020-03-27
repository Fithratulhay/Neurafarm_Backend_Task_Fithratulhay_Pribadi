const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const home = require("./routes/home/home");
const multipart = require('connect-multiparty');
const cookieParser = require('cookie-parser');
 
//connect to database
mongoose
   .connect(db)
   .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

//parsing request
app.use(multipart());
app.use(cookieParser());

//routes
app.use(express.static('public'))
app.use('/',home);
app.use('/api/users',users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running on port "+port));