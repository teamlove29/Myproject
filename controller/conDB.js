var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  pass: "",
  database: "rescue_db"
});

con.connect(err => {
  if (err) throw err;
  console.log("Database: Connected!");
});



module.exports = con


