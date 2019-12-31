var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var route = require("./controller/router/app")
const session = require('express-session');

app.use(session({secret: 'SECRETKEY',saveUninitialized: true,resave: false}));
app.use(express.static("./public"));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use("/", route)

// app.set('views', 'all-views');
app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("PORT : 3000 START!");
});

