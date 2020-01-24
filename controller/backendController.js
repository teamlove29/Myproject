const con = require('./conDB')


const main = async (req, res) => {
  const sql = await "SELECT * FROM `user`"
  con.query(sql, (err, respon) => {
    res.render("page/backend/main", {
      user: respon,
      data: {
        dashboard: true,
        managerUser: false,
        managerActivity: false,
        managerResource: false
      }
    })
  })


}

const notFound = (req, res) => {
  if (req.session.status === 'admin') {
    res.render("404", {
      data: {
        admin: true,
        user: false
      }
    })
  } else {
    res.render("404", {
      data: {
        admin: false,
        user: true
      }
    })
  }
}


const test = (req, res) => {
  res.render('page/test')
}

module.exports.test = test
module.exports.main = main
module.exports.notFound = notFound