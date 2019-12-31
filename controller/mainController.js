const main = (req, res) => {
    res.render("firstPage");
  }
const home =  (req, res) => {
  res.render("home", {
    data:{
      name:req.session.username,
  }})
}
  
module.exports.main = main
module.exports.home = home