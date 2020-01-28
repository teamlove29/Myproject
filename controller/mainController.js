var con = require('./conDB')


const main = (req, res) => {
    res.render("firstPage");
  }
const home =  (req, res) => {
  const sql = "SELECT * FROM `user` WHERE `userStatus` <> 'admin' ORDER BY `userAllScore` DESC LIMIT 10"
  con.query(sql,(err,respon) => {
    res.render("home", {
      listTopTen:respon,
      data:{
        image:req.session.image,
        name:req.session.username,
        code:req.session.code
    }})
  })

}
  
module.exports.main = main
module.exports.home = home