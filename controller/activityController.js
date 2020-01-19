var con = require('./conDB')

// const sqltest = "SELECT * FROM `register` INNER JOIN `register_detail` WHERE `register`.`regId` = 1 AND register_detail.regId = 1"
// const test =con.query(sqltest,(err,respon) => {
//   // console.log(respon.length);
// })
// const numSql = "SELECT * FROM `register` INNER JOIN `register_detail` INNER JOIN activity WHERE register.regId = register_detail.regId AND register.actId = ? AND activity.actId = ?"
// for(let i = 0; )
// con.query(numSql,[])


const activityPage = (req,res) => {
  const sql = "SELECT * FROM `activity`"
  con.query(sql , (err, respon2) => {
    const sqlnum =  "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId"
    con.query(sqlnum,async (err,respon) => {
      let result = {}
      await respon.map(value => {
        result[value.actId] ? result[value.actId++] : result[value.actId] = 1
      })
      res.render('page/ativity/activityPage', {
        peopleJoin:result,
        listsActivity:respon2,
        data:{
          dashboard:false,
          managerUser : false,
          managerActivity: true,
          managerResource : false
        }
      })
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
  const sql = "INSERT INTO `activity` (`actId`, `actName`, `actCode`, `actDetail`, `actScore`, `actDate`) VALUES (NULL, ?, ?, ?,?,?)"
  con.query(sql,[name,code,detail,score,date], (err,respon) => {
    if(err) throw err
    res.redirect("/ManagerActivity")
  })

}

const editActivity = async (req, res) => {
  const IdActivity = await req.params.id
  sql = await "SELECT * FROM `activity` WHERE actId = ?"
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
  const sql = await "UPDATE `activity` SET `actName` = ?, `actDetail` =?,`actDate` =?,`actScore` =? WHERE `actId` = ?;"
  con.query(sql, [name,detail,date,score,IdActivity], (err, respon) => {
    if(err) throw err
    res.redirect("/ManagerActivity")
  })
}
const delActivity = async (req, res) => {
  const IdActivity = req.params.id
  const sql = await "DELETE FROM `activity` WHERE `activity`.`actId` = ?"
  con.query(sql ,[IdActivity], (err, respon) => {
    if(err) throw err
    res.redirect('/ManagerActivity')
  })

}

const listJoin = (req,res) => {
  const IdActivity = req.params.id
  const sqlResource = "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'เบิก' GROUP BY resource.resName"
  con.query(sqlResource,[IdActivity],(err,responRe)=>{
    const sql =  "SELECT register_detail.regId,activity.actId,activity.actName,activity.actDate,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"
    con.query(sql,[IdActivity],(err,respon) => {
      const sqlReturn = "SELECT DISTINCT order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId = order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'คืน' GROUP BY resource.resName"
      con.query(sqlReturn,[IdActivity],(err,responReturn) => {
        res.render('page/ativity/listJoinActivity',{
          listResouceRe:responReturn,
          listResouce:responRe,
          listJoin: respon,
          data:{
            dashboard:false,
            managerUser : false,
            managerActivity: true,
            managerResource : false
          }
        })
      })
    })
  })

}

const delJoin = (req,res) => {
  const {idUser,idReg,idAct} = req.query
  const sql = "DELETE FROM `register_detail` WHERE regId = ? AND userId = ?"
  con.query(sql,[idReg,idUser], (err,respon) => {
    if(err) throw err
    res.redirect('/listJoin/'+idAct)
  })
}
const activityStatus = async(req,res) => {
  const {id} = req.params
  const sql = await "UPDATE `activity` SET `actCode` = 'Complete' WHERE `actId` = ?;"
  con.query(sql,[id], (err,respon) => {
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
module.exports.listJoin = listJoin
module.exports.delJoin = delJoin
module.exports.activityStatus = activityStatus