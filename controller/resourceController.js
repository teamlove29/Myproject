const resourcePage = (req,res) => {
    res.render('page/resource/resourcePage', {
        data:{
          dashboard:false,
          managerUser : false,
          managerActivity: false,
          managerResource : true
        }
      })
}

module.exports.resourcePage = resourcePage