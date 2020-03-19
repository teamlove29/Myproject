var con = require('./conDB')


const main = (req, res) => {
  
  res.render("firstPage");
}
const home = (req, res) => {

  const sql = "SELECT * FROM `user` WHERE `userStatus` <> 'admin' ORDER BY `userAllScore` DESC LIMIT 10"
  const sqlDate = "SELECT * FROM `activity` WHERE `actDate` BETWEEN ? AND ? ORDER BY `actDate` ASC"
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear() + 543
  nowMonth = nowDate.getMonth() + 1
  const strat = nowYear + '-' + nowMonth + '-' + '01'
  const end = nowYear + '-' + nowMonth + '-' + '31'
con.query(sqlDate,[strat,end],(err,responDate) => {
 // const sqlMyUser = "SELECT * FROM `user` WHERE idUser = ? " 
  con.query(sql, (err, respon) => {
    res.render("home", {
      listDateActivity:responDate,
      listTopTen: respon,
      data: {
        score:req.session.userAllScore,
        image: req.session.image,
        name: req.session.username,
        code: req.session.code
      }
    })
  })
})




}

module.exports.main = main
module.exports.home = home

//หน้าหลักของ User