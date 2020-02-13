var con = require('./conDB')

const resourcePage = (req, res) => {
  const sql = "SELECT * FROM `resource`"
  con.query(sql, (err, respon) => {
    if (err) throw err
    res.render('page/resource/resourcePage', {
      listsResource: respon,
      data: {
        css:false,
        err:false,
        msg : '',
        cls : '',
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    })
  })

}


const addResource = (req, res) => {
  res.render('page/resource/addResouce', {
    data: {
      dashboard: false,
      managerUser: false,
      managerActivity: false,
      managerResource: true
    }
  })
}
const PostaddResource = (req, res) => {
  const { name, amount, detail } = req.body
  const sql = "INSERT INTO `resource` (`resId`, `resName`, `resDetail`, `resAmount`) VALUES (NULL,?,?,?);"
  const sqlcheck = "SELECT * FROM `resource` WHERE resName = ? "
  const sqlAll = "SELECT * FROM `resource`"  
  con.query(sqlcheck,[name],(err,respomCheck) => {
    if(respomCheck.length > 0){
  
      con.query(sqlAll,(err,responAll) => {
        res.render('page/resource/resourcePage', {
          listsResource: responAll,
          data: {
            css:true,
            err:true,
            msg : 'ข้อมูลซ้ำกรุณาตรวจสอบ',
            cls : 'alert alert-danger',
            dashboard: false,
            managerUser: false,
            managerActivity: false,
            managerResource: true
          }
        })
      })

    }else{
      con.query(sql, [name, detail, amount], (err, respon) => {
        con.query(sqlAll,(err,responAll) => {
          res.render('page/resource/resourcePage', {
            listsResource: responAll,
            data: {
              css:true,
              err:true,
              msg : 'เพิ่มทรัพยากร เรียบร้อยแล้ว',
              cls : 'alert alert-success',
              dashboard: false,
              managerUser: false,
              managerActivity: false,
              managerResource: true
            }
          })
        })
      })
    }
  })

}
const editResource = (req, res) => {
  const idResource = req.params.id
  const sql = "SELECT * FROM `resource` WHERE resId = ? "
  con.query(sql, [idResource], (err, respon) => {
    if (err) throw err
    res.render('page/resource/addResouce', {
      resource: respon,
      data: {
        isEdit: true,
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    })
  })

}
const posteditResource = (req, res) => {
  const idResource = req.params.id
  const { name, amount, detail } = req.body
  const sql = "UPDATE `resource` SET `resId` = ?, `resName` = ?, `resDetail` =?, `resAmount` = ? WHERE `resId` = ?;"
  const sqlcheck = "SELECT * FROM `resource` WHERE resName = ? AND resId = ?"
  const sqlcheckname = "SELECT * FROM `resource` WHERE resName = ?"
  const sqlAll = "SELECT * FROM `resource`"  
  con.query(sqlcheck,[name,idResource],(err,respomCheck) => {
    if(respomCheck.length > 0){
      con.query(sql, [idResource,name, detail.trim(), amount, idResource], (err, respon) => {
        con.query(sqlAll,(err,responAll) => {
          res.render('page/resource/resourcePage', {
            listsResource: responAll,
            data: {
              css:true,
              err:true,
              msg : 'แก้ไขทรัพยากร เรียบร้อยแล้ว',
                  cls : 'alert alert-success',
              dashboard: false,
              managerUser: false,
              managerActivity: false,
              managerResource: true
            }
          })
        })
      })

    }else{
      con.query(sqlcheckname,[name],(err,responCheckName) => {
        if(responCheckName.length > 0){
          con.query(sqlAll,(err,responAll) => {
            res.render('page/resource/resourcePage', {
              listsResource: responAll,
              data: {
                css:true,
                err:true,
                msg : 'ข้อมูลซ้ำกรุณาตรวจสอบ',
                cls : 'alert alert-danger',
                dashboard: false,
                managerUser: false,
                managerActivity: false,
                managerResource: true
              }
            })
          })
        }else{
          con.query(sql, [idResource,name, detail.trim(), amount, idResource], (err, respon) => {
            con.query(sqlAll,(err,responAll) => {
              res.render('page/resource/resourcePage', {
                listsResource: responAll,
                data: {
                  css:true,
                  err:true,
                  msg : 'แก้ไขทรัพยากร เรียบร้อยแล้ว',
                      cls : 'alert alert-success',
                  dashboard: false,
                  managerUser: false,
                  managerActivity: false,
                  managerResource: true
                }
              })
            })
          })
        }
      })


    }
  })


}
const delResource = async (req, res) => {
  const idResource = await req.params.id
  const sql = await "DELETE FROM `resource` WHERE `resId` = ?"
  const sqlAll = "SELECT * FROM `resource`"  
  con.query(sql, [idResource], (err, respon) => {
    con.query(sqlAll, (err,responAll) => {
      res.render('page/resource/resourcePage', {
        listsResource: responAll,
        data: {
          css:true,
          err:true,
          msg : 'ลบทรัพยากร เรียบร้อยแล้ว',
          cls : 'alert alert-success',
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      })
    })
  })
}

const exportResouce = (req, res) => {
  const sql = "SELECT * FROM `resource`"
  con.query(sql, (err, respon1) => {
    const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' "
    con.query(sqlact, (err, respon2) => {
      if (err) throw err
      res.render('page/resource/exportResource', {
        activity: respon2,
        listsResource: respon1,
        data: {
          msg: '',
          cls: '',
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      })
    })

  })
}

const AddExport = async (req, res, next) => {
  const { name, item_name, item_quantity } = req.body
  let result = ''
  var errorNow = false;
  Array.isArray(item_quantity) ? result = await item_name.filter(a => (item_name.filter(b => (a == b)).length != 1)) : result = ''
  if (result.length > 1) {
    const sql = "SELECT * FROM resource"
    con.query(sql, (err, respon1) => {
      const sqlact = "SELECT * FROM activity WHERE actCode != 'Complete' "
      con.query(sqlact, (err, respon2) => {
        if (err) throw err
        res.render('page/resource/exportResource', {
          activity: respon2,
          listsResource: respon1,
          data: {
            msg: 'ทรัพยาซ้ำกัน กรุณาตรวจสอบ',
            cls: 'alert alert-warning',
            dashboard: false,
            managerUser: false,
            managerActivity: false,
            managerResource: true
          }
        })
      })
    })
  } else {
    for (let i = 0; i < item_name.length; i++) {
      
      const sql = "SELECT * FROM `resource` WHERE resId = ? "
      con.query(sql, [item_name[i]], (err, responRes) => {
          if (Array.isArray(item_quantity)) {
            const sum = responRes[0].resAmount - item_quantity[i]
           
            if (sum < -0) {
              const sql = "SELECT * FROM `resource`"
              con.query(sql, (err, respon1) => {
                const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' "
                con.query(sqlact, (err, respon2) => {
                  res.render('page/resource/exportResource', {
                    activity: respon2,
                    listsResource: respon1,
                    data: {
                      msg: 'เกิดข้อผิดพลาด! โปรดตรวจสอบทรัพยาคงเหลือก่อนทำการเบิก',
                      cls: 'alert alert-danger',
                      dashboard: false,
                      managerUser: false,
                      managerActivity: false,
                      managerResource: true
                    }
                  }) 
                 
                })
              })
            } else { //แบบ กลุ่ม
              const sqlcheck = "SELECT * FROM `order` WHERE actId = ? "
              con.query(sqlcheck, [name], (err, responcheck) => {
                if (responcheck.length > 0) {
                  const { orderId } = responcheck[0]
                  const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?)"
                  con.query(sqlAddDetail, [orderId,item_name[i],item_quantity[i],new Date,'เบิก'], (err, responAddDetail) => {
                    const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                    con.query(sqlUpdate,[responRes[0].resAmount-item_quantity[i],item_name[i]],(err,resUpdate) => {
                      // res.redirect("/ManagerResource")
                      const sqlGo = "SELECT * FROM `resource`"
                      con.query(sqlGo, (err, respon) => {
                        if (err) throw err
                        // res.render('page/resource/resourcePage', {
                        //   listsResource: respon,
                        //   data: {
                        //     dashboard: false,
                        //     managerUser: false,
                        //     managerActivity: false,
                        //     managerResource: true
                        //   }
                        // })
                      })

                    })
                  })
                } else {
                  const sqlAddOrder = "INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);"
                  con.query(sqlAddOrder, [name], (err, responAddOrder) => {
                    con.query(sqlcheck, [name], (err, responcheck) => {
                      const { orderId } = responcheck[0]
                      const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?);"
                      con.query(sqlAddDetail, [orderId,item_name[i],item_quantity[i],new Date,'เบิก'], (err, responAddDetail) => {
                        const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                        con.query(sqlUpdate,[responRes[0].resAmount-item_quantity[i],item_name[i]],(err,resUpdate) => {
                          // res.redirect("/ManagerResource")
                          const sqlGo = "SELECT * FROM `resource`"
                          con.query(sqlGo, (err, respon) => {
                            if (err) throw err
                            // res.render('page/resource/resourcePage', {
                            //   listsResource: respon,
                            //   data: {
                            //     dashboard: false,
                            //     managerUser: false,
                            //     managerActivity: false,
                            //     managerResource: true
                            //   }
                            // })
                          })
                          
                        })
                      })
                    })
                  })
                }
              })
            }
          } }) }
       
   if (Array.isArray(item_name)){}
   else{
    const sqlOne = "SELECT * FROM `resource` WHERE resId = ? "
    con.query(sqlOne,[item_name],(err,responOne) => {
      const sum = responOne[0].resAmount - item_quantity
      if (sum < -0) {
        const sql = "SELECT * FROM `resource`"
        con.query(sql, (err, respon1) => {
          const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' "
          con.query(sqlact, (err, respon2) => {
            res.render('page/resource/exportResource', {
              activity: respon2,
              listsResource: respon1,
              data: {
                msg: 'เกิดข้อผิดพลาด! โปรดตรวจสอบทรัพยาคงเหลือก่อนทำการเบิก',
                cls: 'alert alert-danger',
                dashboard: false,
                managerUser: false,
                managerActivity: false,
                managerResource: true
              }
            })
          })
        })
      } else { //แบบ เดี่ยว
        const sqlcheck = "SELECT * FROM `order` WHERE actId = ? "
        con.query(sqlcheck, [name], (err, responcheck) => {
          if (responcheck.length > 0) {
            console.log('this');
            const { orderId } = responcheck[0]
            const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?)"
            con.query(sqlAddDetail, [orderId,item_name,item_quantity,new Date,'เบิก'], (err, responAddDetail) => {
              const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
              con.query(sqlUpdate,[responOne[0].resAmount-item_quantity,item_name],(err,resUpdate) => {
                // res.redirect("/ManagerResource")
              })
            })
          } else {
            console.log('this2');
            const sqlAddOrder = "INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);"
            con.query(sqlAddOrder, [name], (err, responAddOrder) => {
              con.query(sqlcheck, [name], (err, responcheck) => {
                const { orderId } = responcheck[0]
                const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?);"
                con.query(sqlAddDetail, [orderId,item_name,item_quantity,new Date,'เบิก'], (err, responAddDetail) => {
                  const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                  con.query(sqlUpdate,[responOne[0].resAmount-item_quantity,item_name],(err,resUpdate) => {
                    // res.redirect("/ManagerResource")
                  })
                })
              })
            })
          }
        })
      }
    })
   }

          
     
   

  setTimeout(() => { 
    const sql = "SELECT * FROM `resource`"
    con.query(sql, (err, respon) => {
      res.render('page/resource/resourcePage', {
        listsResource: respon,
        data: {
          css:false,
          err:true,
          msg : 'เบิกทรัพยากร เรียบร้อยแล้ว',
          cls : 'alert alert-success',
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      })
    })
   }, 200);



    
  }
}


// SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = 2 && order_detail.deRes_status = 'เบิก' GROUP BY resource.resName


// ประวัติ 1 วัน
// SELECT DISTINCT 
// resource.resName,activity.actName,order_detail.deRes_amount,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` 
// INNER JOIN `order` ON order.orderId = order_detail.orderId
// INNER JOIN `activity` ON activity.actId = order.actId
// INNER JOIN `resource` ON resource.resId = order_detail.resId
// WHERE order_detail.deRes_date = '2020-01-19'

// ประวัติย้อนหลัง
// SELECT DISTINCT resource.resName,activity.actName,order_detail.deRes_amount,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId ORDER BY order_detail.deRes_date DESC

const ReturnExport = (req,res) => { 
  const {idresId,idAct,Amount} = req.query
  sqlcheck = "SELECT * FROM `order` WHERE actId = ?"
  con.query(sqlcheck,[idAct],(err,respon) => {
    if(respon.length > 0){
      const sqlcheckAmount = "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'เบิก' && resource.resId = ? GROUP BY resource.resName"
      con.query(sqlcheckAmount,[idAct,idresId],(err,responCheckOrder) => {
      const sqlcheckreturn = "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'คืน' && resource.resId = ? GROUP BY resource.resName"
        con.query(sqlcheckreturn,[idAct,idresId],(err,responCheckRe) => {
          if(responCheckRe.length > 0){
            if(Amount == 0){
              res.redirect('/listJoin/'+idAct)
            }else{
              const toInt = parseInt(Amount)
              if(toInt + responCheckRe[0].total <= responCheckOrder[0].total){
                const orderId = respon[0].orderId
                sql = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, 'คืน')"
                con.query(sql,[orderId,idresId,Amount,new Date],(err,respon) => {
                  const sqlResource = "SELECT * FROM resource WHERE `resId` = ?"
                  con.query(sqlResource,[idresId],(err,responResoirce) => {
                    const quantity = responResoirce[0].resAmount
                    const sqlupdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                    con.query(sqlupdate,[quantity+parseInt(Amount),idresId],(err,resUpdate) => {
                      res.redirect('/listJoin/'+idAct)
                    })
                  })
                 
                })
              }else{
                res.redirect('/listJoin/'+idAct)
              }
            }
    

          }else{
            const orderId = respon[0].orderId
            sql = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, 'คืน')"
            con.query(sql,[orderId,idresId,Amount,new Date],(err,respon) => {
              const sqlResource = "SELECT * FROM resource WHERE `resId` = ?"
              con.query(sqlResource,[idresId],(err,responResoirce) => {
                const quantity = responResoirce[0].resAmount
                const sqlupdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                con.query(sqlupdate,[quantity+parseInt(Amount),idresId],(err,resUpdate) => {
                  res.redirect('/listJoin/'+idAct)
                })
              })
             
            })
          }
          
        
        })



      })

    }
  })
}


const historyOneDay = (req,res) => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth()+1
  const year = date.getFullYear();
  // const newDate = '2020-1-19'
  const newDate = year+'-'+month+'-'+day
  const monthArray = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 
  const mm = monthArray[month]
  const plusYear = year+543
  const DateShow = day+' '+mm+' '+ plusYear
  const sql = "SELECT resource.resName,activity.actName,Sum(order_detail.deRes_amount)AS total,order_detail.deRes_date,order_detail.deRes_status FROM order_detail INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN activity ON activity.actId = order.actId INNER JOIN resource ON resource.resId = order_detail.resId WHERE order_detail.deRes_date = ? GROUP BY resource.resName,order_detail.deRes_status,activity.actName ORDER BY activity.actName ASC"
  con.query(sql,[newDate],(err,respon)=> {
    if(err) throw err
    res.render('page/resource/historyOneDay',{
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


const historyAll = (req,res) => {
const sql = "SELECT resource.resName,activity.actName,Sum(order_detail.deRes_amount)AS total,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId GROUP BY resource.resName,order_detail.deRes_status,activity.actName ORDER BY order_detail.deRes_date DESC"
con.query(sql,(err,respon)=> {
  res.render('page/resource/historyAll',{
    listHitoryAll:respon,
    data: {
      dashboard: false,
      managerUser: false,
      managerActivity: false,
      managerResource: true
    }
})
})
}



const AddAmount = (req,res) => {
  const numbers = /^[0-9]+$/;
  const {resId,Amount} = req.query
  const sql = "SELECT resAmount FROM `resource` WHERE resId = ?"
  if(Amount.match(numbers) && Amount > 0){
    con.query(sql,[resId],(err,respon)=>{
      const AmountSum = respon[0].resAmount + parseInt(Amount)
      const sqlAmount = "UPDATE `resource` SET `resAmount` = ? WHERE `resId` = ?;"
      con.query(sqlAmount,[AmountSum,resId],(err,responAmount) => {
        const sqlAll = "SELECT * FROM `resource`"
        con.query(sqlAll, (err, respon) => {
          res.render('page/resource/resourcePage', {
            listsResource: respon,
            data: {
              css:false,
              err:true,
              msg : 'เพิ่มจำนวน เรียบร้อยแล้ว',
              cls : 'alert alert-success',
              dashboard: false,
              managerUser: false,
              managerActivity: false,
              managerResource: true
            }
          })
        })
      })
    })
  }else{
    const sqlAll = "SELECT * FROM `resource`"
    con.query(sqlAll, (err, respon) => {
      res.render('page/resource/resourcePage', {
        listsResource: respon,
        data: {
          css:false,
          err:true,
          msg : 'กรุณาใส่จำนวน หรือ จำนวนเกินกว่าที่เบิก',
          cls : 'alert alert-warning',
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      })
    })
  }



  
}

module.exports.resourcePage = resourcePage
module.exports.addResource = addResource
module.exports.PostaddResource = PostaddResource
module.exports.editResource = editResource
module.exports.posteditResource = posteditResource
module.exports.delResource = delResource
module.exports.exportResouce = exportResouce
module.exports.AddExport = AddExport
module.exports.ReturnExport = ReturnExport
module.exports.historyOneDay = historyOneDay
module.exports.historyAll = historyAll
module.exports.AddAmount = AddAmount