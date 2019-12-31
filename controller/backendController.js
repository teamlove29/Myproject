const main =  (req, res) => {
  res.render("page/backend/main",{
    data:{
      dashboard:true,
      managerUser : false,
      managerActivity: false,
      managerResource : false
    }
  })
}

const notFound = (req, res) => {
  res.render("404")
}

module.exports.main = main
module.exports.notFound = notFound