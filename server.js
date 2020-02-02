var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var route = require("./controller/router/app")
var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var con = require('./controller/conDB')


app.use(session({secret: 'SECRETKEY',saveUninitialized: true,resave: false}));
app.use(express.static("./public"));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use("/", route)

// app.set('views', 'all-views');
app.set("view engine", "ejs");

// app.listen(3000, () => {
//   console.log("PORT : 3000 START!");
// });

io.on('connection', (socket) =>{
  console.log('a user connected');
  const sql = "SELECT `resAmount` FROM `resource` WHERE resId = ? "
  
  socket.on('updateAmount', (data) => { //รับค่า
    var num = data.split('/')[1]
  con.query(sql,[data],(err,respon) => {
    io.emit('updateAmount'+num,respon) // ส่งออกแบบ realTime 
  })
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000');
})







