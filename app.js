const http = require('http');
var express = require("express");
var app = express();
const port = 80;


app.get('/', function(req, res) {
  res.send('<h1>My Node App </h1>');
});


app.listen(port, () => {
  console.log(`Server running at :${port}/`);
});
