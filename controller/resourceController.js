var con = require('./conDB')

const resourcePage = (req,res) => {
  const sql = "SELECT * FROM `resource_tb`"
  con.query(sql, (err,respon) => {
    if(err) throw err
    res.render('page/resource/resourcePage', {
      listsResource : respon,
      data:{
        dashboard:false,
        managerUser : false,
        managerActivity: false,
        managerResource : true
      }
    })
  })

}


const addResource = (req,res) => {
  res.render('page/resource/addResouce', {
    data:{
      dashboard:false,
      managerUser : false,
      managerActivity: false,
      managerResource : true
    }
  })
}
const PostaddResource = (req,res) => {  
  const {name,amount,detail} = req.body
  const sql = "INSERT INTO `resource_tb` (`res_id`, `res_Name`, `res_Detail`, `res_Amount`) VALUES (NULL,?,?,?);"
  con.query(sql, [name,detail,amount], (err,respon) => {
    if(err) throw err
    res.redirect("/ManagerResource")
  })
}
const editResource = (req,res) => {
  const idResource = req.params.id
  const sql = "SELECT * FROM `resource_tb` WHERE res_id = ? "
  con.query(sql,[idResource], (err,respon) => {
    if(err) throw err
    res.render('page/resource/addResouce',{
      resource:respon,
      data:{
        isEdit:true,
        dashboard:false,
        managerUser : false,
        managerActivity: false,
        managerResource : true
      }
    })
  })
  
}
const posteditResource = (req,res) => {
  const idResource = req.params.id
  const {name,amount,detail} = req.body
  const sql = "UPDATE `resource_tb` SET `res_id` = NULL, `res_Name` = ?, `res_Detail` =?, `res_Amount` = ? WHERE `res_id` = ?;"
  con.query(sql ,[name,detail.trim(),amount,idResource], (err,respon) => {
    if(err) throw err
    res.redirect('/ManagerResource')
  })  
}
const delResource = async (req,res) => {
  const idResource = await req.params.id
  const sql = await "DELETE FROM `resource_tb` WHERE `res_id` = ?"
  con.query(sql,[idResource], (err,respon) => {
    if(err) throw err
    console.log('del Success');
    res.redirect('/ManagerResource')
  })
}

module.exports.resourcePage = resourcePage
module.exports.addResource = addResource
module.exports.PostaddResource = PostaddResource
module.exports.editResource = editResource
module.exports.posteditResource = posteditResource
module.exports.delResource = delResource