var con = require('./conDB')

const resourcePage = (req, res) => {
  const sql = "SELECT * FROM `resource`"
  con.query(sql, (err, respon) => {
    if (err) throw err
    res.render('page/resource/resourcePage', {
      listsResource: respon,
      data: {
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
  con.query(sql, [name, detail, amount], (err, respon) => {
    if (err) throw err
    res.redirect("/ManagerResource")
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
  con.query(sql, [idResource,name, detail.trim(), amount, idResource], (err, respon) => {
    if (err) throw err
    res.redirect('/ManagerResource')
  })
}
const delResource = async (req, res) => {
  const idResource = await req.params.id
  const sql = await "DELETE FROM `resource` WHERE `resId` = ?"
  con.query(sql, [idResource], (err, respon) => {
    if (err) throw err
    console.log('del Success');
    res.redirect('/ManagerResource')
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
        try {
          if (Array.isArray(item_quantity)) {
            const sum = responRes[0].resAmount - item_quantity[i]
            if (sum < -0) {
              const sql = "SELECT * FROM `resource`"
              con.query(sql, (err, respon1) => {
                const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' "
                con.query(sqlact, (err, respon2) => {
                  if (err) throw err
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
                  console.log('ไม่มี');
                  const sqlAddOrder = "INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);"
                  con.query(sqlAddOrder, [name], (err, responAddOrder) => {
                    console.log('สำเร็จ');
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
          } else {
            const sum = responRes[0].resAmount - item_quantity
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
                  const { orderId } = responcheck[0]
                  const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?)"
                  con.query(sqlAddDetail, [orderId,item_name[i],item_quantity,new Date,'เบิก'], (err, responAddDetail) => {
                    const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                    con.query(sqlUpdate,[responRes[0].resAmount-item_quantity,item_name[i]],(err,resUpdate) => {
                      res.redirect("/ManagerResource")
                    })
                  })
                } else {
                  console.log('ไม่มี');
                  const sqlAddOrder = "INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);"
                  con.query(sqlAddOrder, [name], (err, responAddOrder) => {
                    console.log('สำเร็จ');
                    con.query(sqlcheck, [name], (err, responcheck) => {
                      const { orderId } = responcheck[0]
                      const sqlAddDetail = "INSERT INTO `order_detail` (`orderId`, `resId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?);"
                      con.query(sqlAddDetail, [orderId,item_name[i],item_quantity,new Date,'เบิก'], (err, responAddDetail) => {
                        const sqlUpdate = "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?"
                        con.query(sqlUpdate,[responRes[0].resAmount-item_quantity,item_name[i]],(err,resUpdate) => {
                          res.redirect("/ManagerResource")
                        })
                      })
                    })
                  })
                }
              })
            }
          }
        } catch (err) {
          throw err
        }

      })
    }
    setTimeout(() => { res.redirect("/ManagerResource") }, 200);
    
  }
}
// SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = 2 && order_detail.deRes_status = 'เบิก' GROUP BY resource.resName

const ReturnExport = (req,res) => { 
  const {idresId,idAct,Amount} = req.query
  sqlcheck = "SELECT * FROM `order` WHERE actId = ?"
  con.query(sqlcheck,[idAct],(err,respon) => {
    if(respon.length > 0){
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
