var con = require('./conDB')


const activityPage = (req,res) => {
  const sql = "SELECT * FROM `activities_tb`"
  con.query(sql , (err, respon) => {
    res.render('page/ativity/activityPage', {
      listsActivity:respon,
      data:{
        dashboard:false,
        managerUser : false,
        managerActivity: true,
        managerResource : false
      }
    })
  })
}


const addActivity = (req, res) => {
  res.render("page/ativity/addActivity", {
    data:{
      isEdit: false,
      dashboard:false,
      managerUser : false,
      managerActivity: true,
      managerResource : false
    }
  })
}
const PostaddActivity = (req, res) => {
  const {name,date,score,detail} = req.body
  const generateRandomCode = (() => {
    const USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    return length => {
      return new Array(length).fill(null).map(() => {
        return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
      }).join("");
    }
  })();
  const code = generateRandomCode(10)
  const sql = "INSERT INTO `activities_tb` (`ac_ID`, `ac_Name`, `ac_Code`, `ac_Detail`) VALUES (NULL, ?, ?, ?)"
  con.query(sql,[name,code,detail], (err,respon) => {
    if(err) throw err
    res.redirect("/ManagerActivity")
  })

}

const editActivity = async (req, res) => {
  const IdActivity = await req.params.id
  sql = await "SELECT * FROM `activities_tb` WHERE ac_ID = ?"
  con.query(sql ,[IdActivity], (err,respon) => {
    if(err) throw err
    res.render("page/ativity/addActivity", {
      activity: respon,
      data:{
        isEdit: true,
        dashboard:false,
        managerUser : false,
        managerActivity: true,
        managerResource : false
      }
    })
  })
}
const posteditActivity = async (req, res) => {
  const IdActivity = await req.params.id
  const {name,date,score,detail} = await req.body 
  const sql = await "UPDATE `activities_tb` SET `ac_Name` = ?, `ac_Detail` =? WHERE `ac_ID` = ?;"
  con.query(sql, [name,detail,IdActivity], (err, respon) => {
    if(err) throw err
    res.redirect("/ManagerActivity")
  })
}
const delActivity = async (req, res) => {
  const IdActivity = req.params.id
  const sql = await "DELETE FROM `activities_tb` WHERE `activities_tb`.`ac_ID` = ?"
  con.query(sql ,[IdActivity], (err, respon) => {
    if(err) throw err
    res.redirect('/ManagerActivity')
  })

}

module.exports.activityPage = activityPage
module.exports.addActivity = addActivity
module.exports.PostaddActivity = PostaddActivity
module.exports.editActivity = editActivity
module.exports.posteditActivity = posteditActivity
module.exports.delActivity = delActivity