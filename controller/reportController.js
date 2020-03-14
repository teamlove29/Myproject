const con = require('./conDB')


const report = (req,res) => {
    const sqlUser = "SELECT * FROM `user` WHERE userStatus <> 'admin'"
    const sqlActivity = "SELECT * FROM `activity`"
    con.query(sqlUser,(err,responUser) => {
        con.query(sqlActivity,(err,responActivity) => {
            res.render('page/report/report',
            {
                listActivity : responActivity,
                listUser : responUser,
                data: {
                    css: false,
                    err: false,
                    msg: '',
                    cls: '',
                    dashboard: false,
                    managerUser: false,
                    managerActivity: false,
                    managerResource: false,
                    report:true
                }
              })
        })

    })
   
}


const reportUserpost =  (req,res) => {
    const { reportUser } = req.body
    if(reportUser == 'All'){
        const sql = "SELECT * FROM `user`"
        con.query(sql,(err,respon) => {
            res.render('page/report/reporrUserAll',{
                userAll : respon,
                data:{
                    
                }
            })
        })
        
        
    }else{
        const sql = "SELECT * FROM `user` WHERE userId = ?"
        con.query(sql,[reportUser],(err,respon) => {
            res.render('page/report/reportUser',{
                user : respon
            })
        })
    }
    


}
const reportActivity =  (req,res) => {
    const { reportActivity } = req.body
    if(reportActivity == 'All'){

        const sql = "SELECT * FROM `activity` order BY actId DESC"
        con.query(sql, (err, respon2) => {
          const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
          con.query(sqlnum, async (err, respon) => {
            let result = {}
            await respon.map(value => {
              result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
            })
            res.render('page/report/reportActivityAll', {
              peopleJoin: result,
              listsActivity: respon2,
              data: {
                dashboard: false,
                managerUser: false,
                managerActivity: true,
                managerResource: false
              }
            })
          })
        })

        
    }else{
        const sqlResource = "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'เบิก' GROUP BY resource.resName"
        con.query(sqlResource, [reportActivity], (err, responRe) => {
          const sql = "SELECT register_detail.regId,activity.actId,activity.actName,activity.actDate,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"
          con.query(sql, [reportActivity], (err, respon) => {
            const sqlReturn = "SELECT DISTINCT order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId = order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'คืน' GROUP BY resource.resName"
            con.query(sqlReturn, [reportActivity], (err, responReturn) => {
              const sqlActivity = "SELECT * FROM `activity` WHERE `actId` = ?"
              con.query(sqlActivity, [reportActivity], (err, responActivity) => {
                res.render('page/report/reportActivity', {
                  nameActivity: responActivity,
                  listResouceRe: responReturn,
                  listResouce: responRe,
                  listJoin: respon,
                  data: {
                  }
                })
              })
            })
          })
        })
    }
}





const reportHistory =  async (req,res) => {
    const { start,end } = req.body  
    if(start == '' || end == '' || start > end){

        const sqlUser = "SELECT * FROM `user` WHERE userStatus <> 'admin'"
        const sqlActivity = "SELECT * FROM `activity`"
        con.query(sqlUser,(err,responUser) => {
            con.query(sqlActivity,(err,responActivity) => {
                res.render('page/report/report',
                {
                    listActivity : responActivity,
                    listUser : responUser,
                    data: {
                        css: false,
                        err: false,
                        msg: 'กรุณาตรวจสอบวันที่',
                        cls: 'alert alert-warning',
                        dashboard: false,
                        managerUser: false,
                        managerActivity: false,
                        managerResource: false,
                        report:true
                    }
                  })
            })
    
        })

            
    }else{

      const datestart = new Date(start)
      const daystart = datestart.getDate()
      const monthstart = datestart.getMonth()+1
      const yearstart = datestart.getFullYear();
      const yystrat = yearstart-543
      const startDay = yystrat + '-' + monthstart + '-' + daystart

      const dateend = new Date(end)
      const dayend = dateend.getDate()
      const monthend = dateend.getMonth()+1
      const yearend = dateend.getFullYear();
      const yyend = yearstart-543
      const endDay = yyend + '-' + monthend + '-' + dayend

        // const arr1 = start.split('-');
        // const yyyy = parseInt(arr1[0])-543
        // const mm = arr1[1]
        // const dd = arr1[2]
        // const startDay = yyyy + '-' + mm + '-' + dd
    
        // const arr2 = end.split('-');
        // const yyyy2 = parseInt(arr2[0])-543
        // const mm2 = arr2[1]
        // const dd2 = arr2[2]
        // const endDay = yyyy2 + '-' + mm2 + '-' + dd2
    
        const monthArray = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 
        const mmstart = monthArray[monthstart]
        const mmend = monthArray[monthend]
        const toListStart =  daystart + ' ' + mmstart + ' ' + yearstart
        const toListEnd =  dayend + ' ' + mmend + ' ' + yearend
        const sql = "SELECT resource.resName,activity.actName,Sum(order_detail.deRes_amount)AS total,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId WHERE order_detail.deRes_date BETWEEN ? AND ? GROUP BY resource.resName,order_detail.deRes_status,activity.actName ORDER BY order_detail.deRes_date DESC"
        con.query(sql,[startDay,endDay],(err,respon)=> {
          res.render('page/report/reportHistoryAll',{
            listHitoryAll:respon,
            data: {
                startDay:toListStart,
                endDay:toListEnd,
            }
        })
        })
    }


}
const reportHistoryOne =  (req,res) => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear();
    // const newDate = '2020-1-19'
    const monthArray = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 
    const mm = monthArray[month]
    const plusYear = year+543
    const DateShow = day+' '+mm+' '+ plusYear
    const newDate = year+'-'+month+'-'+day
    const sql = "SELECT resource.resName,activity.actName,Sum(order_detail.deRes_amount)AS total,order_detail.deRes_date,order_detail.deRes_status FROM order_detail INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN activity ON activity.actId = order.actId INNER JOIN resource ON resource.resId = order_detail.resId WHERE order_detail.deRes_date = ? GROUP BY resource.resName,order_detail.deRes_status,activity.actName ORDER BY activity.actName ASC"
    con.query(sql,[newDate],(err,respon)=> {
      if(err) throw err
      res.render('page/report/reportHistoryOne',{
        listHitory:respon,
        data: {
            DateShow:DateShow,
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
    })
    })


}


module.exports.report = report
module.exports.reportUserpost = reportUserpost
module.exports.reportActivity = reportActivity
module.exports.reportHistory = reportHistory
module.exports.reportHistoryOne = reportHistoryOne

