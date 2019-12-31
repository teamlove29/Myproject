
const activityPage = (req,res) => {
    res.render('page/ativity/activityPage', {
        data:{
          dashboard:false,
          managerUser : false,
          managerActivity: true,
          managerResource : false
        }
      })
}


module.exports.activityPage = activityPage