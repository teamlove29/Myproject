const con = require('./conDB')


const main =  async (req, res) => {
  const sql = await "SELECT * FROM `user`"
  con.query(sql,(err,respon) => {
    res.render("page/backend/main",{
      user:respon,
      data:{
        dashboard:true,
        managerUser : false,
        managerActivity: false,
        managerResource : false
      }
    })
  })
  
  
}

const notFound = (req, res) => {
  res.render("404")
}

module.exports.main = main
module.exports.notFound = notFound