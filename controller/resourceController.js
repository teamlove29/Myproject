var con = require("./conDB");
var upload = require('./upload')

const resourcePage = (req, res) => {
  const sql = 
  "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
  con.query(sql, (err, respon) => {
    if (err) throw err;
    res.render("page/resource/resourcePage", {
      listsResource: respon,
      data: {
        css: false,
        err: false,
        msg: "",
        cls: "",
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    });
  });
};

const addResource = (req, res) => {
  res.render("page/resource/addResouce", {
    data: {
      dashboard: false,
      managerUser: false,
      managerActivity: false,
      managerResource: true
    }
  });
};
const PostaddResource = (req, res) => {
  upload(req, res, async (err)  => { 

  var filenames = req.files.map((file) => {
    return file.filename; // or file.originalname
  }); 
const image = req.files != '' ? filenames : 'itemdefault.png'

  const { name, amount, detail ,status} = req.body;
// const resStatus = status == 0 ? 'สิ้นเปลือง' : 'ต้องคืนเท่านั้น'


  const sql =
    "INSERT INTO `resource` (`resId`, `resName`, `resDetail`, `resAmount`, `resImage`, `resStatus`) VALUES (NULL,?,?,?,?,?);";
  const sqlcheck = "SELECT * FROM `resource` WHERE resName = ? ";
  const sqlAll = 
  "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
  con.query(sqlcheck, [name], (err, respomCheck) => {
    if (respomCheck.length > 0) {
      con.query(sqlAll, (err, responAll) => {
        res.render("page/resource/resourcePage", {
          listsResource: responAll,
          data: {
            css: true,
            err: true,
            msg: "ข้อมูลซ้ำกรุณาตรวจสอบ",
            cls: "alert alert-danger",
            dashboard: false,
            managerUser: false,
            managerActivity: false,
            managerResource: true
          }
        });
      });
    } else {
      con.query(sql, [name, detail, amount, image, status], (err, respon) => {
        con.query(sqlAll, (err, responAll) => {
          res.render("page/resource/resourcePage", {
            listsResource: responAll,
            data: {
              css: true,
              err: true,
              msg: "เพิ่มทรัพยากร เรียบร้อยแล้ว",
              cls: "alert alert-success",
              dashboard: false,
              managerUser: false,
              managerActivity: false,
              managerResource: true
            }
          });
        });
      });
    }
  });
})};
const editResource = (req, res) => {
  const idResource = req.params.id;
  const sql = "SELECT * FROM `resource` WHERE resId = ? ";
  con.query(sql, [idResource], (err, respon) => {
    if (err) throw err;
    res.render("page/resource/addResouce", {
      resource: respon,
      data: {
        isEdit: true,
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    });
  });
};
const posteditResource = (req, res) => {
  upload(req, res, async (err)  => { //อัพรูป 
    const idResource = req.params.id;
    const { name, amount, detail ,status} = req.body;
    const sql =
    "UPDATE `resource` SET `resId` = ?, `resName` = ?, `resDetail` =?, `resAmount` = ?,`resImage` = ?, `resStatus` = ? WHERE `resId` = ?"
  const sqlcheck = "SELECT * FROM `resource` WHERE resName = ? AND resId = ?";
  const sqlcheckname = "SELECT * FROM `resource` WHERE resName = ?";
  const sqlAll = 
  "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";

    var filenames = req.files.map((file) => {
      return file.filename; // or file.originalname
    }); 

    const sqlcheckImage = "SELECT * FROM `resource` WHERE `resId` = ?";
    con.query(sqlcheckImage,[idResource],(err,rescheckImage) => {
 
      const image = req.files != '' ? filenames : rescheckImage[0].resImage
      if (image == filenames && rescheckImage[0].resImage != 'itemdefault.png') {
        const fileImageName = 'public/uploads/' + rescheckImage[0].resImage
        fs.unlink(fileImageName, (err) => {
          if (err) throw err;
        });
      } //เช็ครูป
      if (rescheckImage[0].resImage == '') { image = 'itemdefault.png' } 


  con.query(sqlcheck, [name, idResource], (err, respomCheck) => {
    if (respomCheck.length > 0) {
      con.query(sql,[idResource, name, detail.trim(), amount,image, status,idResource],(err, respon) => {

          con.query(sqlAll, (err, responAll) => {
            res.render("page/resource/resourcePage", {
              listsResource: responAll,
              data: {
                css: true,
                err: true,
                msg: "แก้ไขทรัพยากร เรียบร้อยแล้ว",
                cls: "alert alert-success",
                dashboard: false,
                managerUser: false,
                managerActivity: false,
                managerResource: true
              }
            });
          });
        }
      );
    } else {
      con.query(sqlcheckname, [name], (err, responCheckName) => {
        if (responCheckName.length > 0) {
          con.query(sqlAll, (err, responAll) => {
            res.render("page/resource/resourcePage", {
              listsResource: responAll,
              data: {
                css: true,
                err: true,
                msg: "ข้อมูลซ้ำกรุณาตรวจสอบ",
                cls: "alert alert-danger",
                dashboard: false,
                managerUser: false,
                managerActivity: false,
                managerResource: true
              }
            });
          });
        } else {
          con.query(sql,[idResource, name, detail.trim(), amount,image, status,idResource],(err, respon) => {

              con.query(sqlAll, (err, responAll) => {
                res.render("page/resource/resourcePage", {
                  listsResource: responAll,
                  data: {
                    css: true,
                    err: true,
                    msg: "แก้ไขทรัพยากร เรียบร้อยแล้ว",
                    cls: "alert alert-success",
                    dashboard: false,
                    managerUser: false,
                    managerActivity: false,
                    managerResource: true
                  }
                });
              });
            }
          );
        }
      });
    }
  });
})})};
const delResource = async (req, res) => {
  const idResource = await req.params.id;
  const sql = await "DELETE FROM `resource` WHERE `resId` = ?";
  const sqlAll = 
  "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
  con.query(sql, [idResource], (err, respon) => {
    con.query(sqlAll, (err, responAll) => {
      res.render("page/resource/resourcePage", {
        listsResource: responAll,
        data: {
          css: true,
          err: true,
          msg: "ลบทรัพยากร เรียบร้อยแล้ว",
          cls: "alert alert-success",
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      });
    });
  });
};

const exportResouce = (req, res) => {
  const sql = "SELECT * FROM `resource` WHERE resAmount != 0";
  const sqlUser = "SELECT * FROM `user`"
  con.query(sql, (err, respon1) => {
    const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' ORDER BY actId DESC";
    con.query(sqlact, (err, respon2) => {
      con.query(sqlUser,(err,resUser) => {

      
      if (err) throw err;
      res.render("page/resource/exportResource", {
        User : resUser,
        activity: respon2,
        listsResource: respon1,
        data: {
          msg: "",
          cls: "",
          dashboard: false,
          managerUser: false,
          managerActivity: false,
          managerResource: true
        }
      });
    });
  });
  });
};

const AddExport = async (req, res, next) => {
  const { name, item_name, item_quantity } = req.body;
  const User = req.body.User == 'NO' ? 0 : req.body.User

  if (item_quantity < 0) {
    const sql = "SELECT * FROM `resource` WHERE resAmount != 0";
    const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' ORDER BY actId DESC";
    con.query(sql, (err, respon1) => {
      con.query(sqlact, (err, respon2) => {
        const sql = "SELECT * FROM `user`"
                      con.query(sql,(err,responUser) => {  
                        res.render("page/resource/exportResource", {
                          activity: respon2,
                          listsResource: respon1,
                          data: {
                            msg: "เกิดข้อผิดพลาด! ตัวเลขไม่สามารถติดลบได้",
                            cls: "alert alert-danger",
                            dashboard: false,
                            managerUser: false,
                            managerActivity: false,
                            managerResource: true
                          }
                        });
                      })
        
      });
    });
    return false
  }

  let result = "";
  var errorNow = false;
  // หาค่าซ้ำกัน 
  Array.isArray(item_quantity) ? (result = await item_name.filter( a => item_name.filter(b => a == b).length != 1 )) : (result = "");
  if (result.length > 1) {
    const sql = "SELECT * FROM resource WHERE resAmount != 0";
    con.query(sql, (err, respon1) => {
      const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' ORDER BY actId DESC ";
      con.query(sqlact, (err, respon2) => {
        if (err) throw err;
        const sql = "SELECT * FROM `user`"
                      con.query(sql,(err,responUser) => { 
                        res.render("page/resource/exportResource", {
                          User : responUser,
                          activity: respon2,
                          listsResource: respon1,
                          data: {
                            msg: "ทรัพยาซ้ำกัน กรุณาตรวจสอบ",
                            cls: "alert alert-warning",
                            dashboard: false,
                            managerUser: false,
                            managerActivity: false,
                            managerResource: true
                          }
                        });
                      })
  
      });
    });
  } else {
  
            if(Array.isArray(item_quantity) != true){
              console.log("แบบเดี่ยว");
              const sqlOne = "SELECT * FROM `resource` WHERE resId = ? ";
              con.query(sqlOne, [item_name], async (err, responOne) => {
                const sum = responOne[0].resAmount - item_quantity;
                if (sum < 0) {
                  const sql = "SELECT * FROM `resource`";
                  con.query(sql, (err, respon1) => {
                    const sqlact ="SELECT * FROM `activity` WHERE actCode != 'Complete' ORDER BY actId DESC";
                    con.query(sqlact, async (err, respon2) => {
                      const sql = "SELECT * FROM `user`"
                      con.query(sql,(err,responUser) => {
                        res.render("page/resource/exportResource", {
                          User : responUser ,
                          activity: respon2,
                          listsResource: respon1,
                          data: {
                            msg: "เกิดข้อผิดพลาด! โปรดตรวจสอบทรัพยาคงเหลือก่อนทำการเบิก",
                            cls: "alert alert-danger",
                            dashboard: false,
                            managerUser: false,
                            managerActivity: false,
                            managerResource: true
                          }
                        });
                      })
                    });
                  });

                } else {   
                  //แบบ เดี่ยว
                  const sqlcheck = "SELECT * FROM `order` WHERE actId = ? ";
                  con.query(sqlcheck, [name], (err, responcheck) => {
                    if (responcheck.length > 0) {
                      const { orderId } = responcheck[0];
                      const sqlAddDetail =
                        "INSERT INTO `order_detail` (`orderId`, `resId`, `userId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?, ?)";
                      con.query(sqlAddDetail,[orderId, item_name, User, item_quantity, new Date(), "เบิก"],(err, responAddDetail) => {
                          const sqlUpdate ="UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                          con.query(sqlUpdate,[responOne[0].resAmount - item_quantity, item_name],(err, resUpdate) => {
                              // res.redirect("/ManagerResource")
                            }
                          );
                        }
                      );
                    } else { 
                      const sqlAddOrder ="INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);";
                      con.query(sqlAddOrder, [name], (err, responAddOrder) => {
                        con.query(sqlcheck, [name], (err, responcheck) => {
                          const { orderId } = responcheck[0];
                          const sqlAddDetail =
                            "INSERT INTO `order_detail` (`orderId`, `resId`, `userId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?, ?)";
                          con.query(sqlAddDetail,[orderId, item_name, User, item_quantity, new Date(), "เบิก"],(err, responAddDetail) => {
                              const sqlUpdate ="UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                              con.query(
                                sqlUpdate,
                                [responOne[0].resAmount - item_quantity, item_name],
                                (err, resUpdate) => {
                                  // res.redirect("/ManagerResource")
                                }
                              );
                            }
                          );
                        });
                      });
                    }
                  });
                }
              });

              setTimeout(() => {
                const sql = 
                "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
                con.query(sql, (err, respon) => {
                  const sql = "SELECT * FROM `user`"
                    con.query(sql,(err,responUser) => {  
                      res.render("page/resource/resourcePage", {
                        User : responUser,
                        listsResource: respon,
                        data: {
                          css: false,
                          err: true,
                          msg: "เบิกทรัพยากร เรียบร้อยแล้ว",
                          cls: "alert alert-success",
                          dashboard: false,
                          managerUser: false,
                          managerActivity: false,
                          managerResource: true
                        }
                      });
                    })
                 
                });
              }, 200)
              
            }else{ // End แบบเดี่ยว
              console.log('แบบเยอะ');
                // หาค่าติดลบ
              const resultArray = item_quantity.filter(value => {
                return value < 0;
              });
              if (resultArray != "") {
                const sql = "SELECT * FROM `resource` WHERE resAmount != 0";
                const sqlact = "SELECT * FROM `activity` WHERE actCode != 'Complete' ";
                con.query(sql, (err, respon1) => {
                  con.query(sqlact, (err, respon2) => {
                    const sql = "SELECT * FROM `user`"
                    con.query(sql,(err,responUser) => { 
                      res.render("page/resource/exportResource", {
                        User : responUser,
                        activity: respon2,
                        listsResource: respon1,
                        data: {
                          msg: "เกิดข้อผิดพลาด! ตัวเลขไม่สามารถติดลบได้",
                          cls: "alert alert-danger",
                          dashboard: false,
                          managerUser: false,
                          managerActivity: false,
                          managerResource: true
                        }
                      });
                    })
                    
                  });
                });
                // console.log('resultArray จ้า');
                return false
              } 
              //หาค่าเกินของแบบกลุ่ม
              var Wong  
                for (let i = 0; i < item_name.length; i++) {  
                  const sql =  "SELECT * FROM `resource` WHERE resId = ? ";
                   const test55 = await con.query(sql,[item_name[i]], async (err,responRes)  => { 
                    const sumtestArray = responRes[0].resAmount - item_quantity[i];
                    if(sumtestArray < 0){
                      console.log(item_name[i] ,sumtestArray ,' : yes');
                        Wong =  'noo'
                    }    
                  })
                }

         setTimeout(() => {
           //ถ้าไม่มีค่าเกินให้ทำงาน
          if(Wong == 'noo'){
            console.log('noo');
            const sql = "SELECT * FROM `resource` WHERE resAmount != 0";
            con.query(sql, (err, respon1) => {
              const sqlact =
                "SELECT * FROM `activity` WHERE actCode != 'Complete' ";
              con.query(sqlact, (err, respon2) => {
                const sql = "SELECT * FROM `user`"
                    con.query(sql,(err,responUser) => {  
                      res.render("page/resource/exportResource", {
                        User : responUser ,
                        activity: respon2,
                        listsResource: respon1,
                        data: {
                          msg:
                            "เกิดข้อผิดพลาด! โปรดตรวจสอบทรัพยาคงเหลือก่อนทำการเบิก",
                          cls: "alert alert-danger",
                          dashboard: false,
                          managerUser: false,
                          managerActivity: false,
                          managerResource: true
                        }
                      });
                    })
                
              });
              
            });
            return false
          }else{ 
            console.log('for');
            const sqlcheck1 = "SELECT * FROM `order` WHERE actId = ? ";
            con.query(sqlcheck1,[name],(err,respomCheck1) => {
              if (respomCheck1.length > 0) {
                console.log('มีแล้วอันนี้');
                const sql = "SELECT * FROM `resource` WHERE resId = ? ";
                con.query(sql, [item_name[0]], (err, responRes) => {
                  const sqlcheck = "SELECT * FROM `order` WHERE actId = ? ";
                    con.query(sqlcheck, [name], (err, responcheck) => {
                      const { orderId } = responcheck[0];
                      const sqlAddDetail =
                            "INSERT INTO `order_detail` (`orderId`, `resId`, `userId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?, ?)";
                      con.query(sqlAddDetail,[orderId, item_name[0], User[0], item_quantity[0], new Date(), "เบิก"],(err, responAddDetail) => {
                          const sqlUpdate ="UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                          con.query(
                            sqlUpdate,
                            [
                              responRes[0].resAmount - item_quantity[0],
                              item_name[0]
                            ],
                            (err, resUpdate) => {
                              const sqlGo = "SELECT * FROM `resource`";
                              con.query(sqlGo, (err, respon) => {
                                if (err) throw err;
                              });
                            }
                          );
                        }
                      );
                    });
                })
              }else{
                const sql = "SELECT * FROM `resource` WHERE resId = ? ";
                con.query(sql, [item_name[0]], (err, responRes) => {
                  console.log('ยังไม่มี/เพิ่ม');
                  const sqlcheck = "SELECT * FROM `order` WHERE actId = ? ";
                  const sqlAddOrder ="INSERT INTO `order` (`orderId`, `actId`) VALUES (NULL, ?);";
                  con.query(sqlAddOrder, [name], (err, responAddOrder) => {
                    con.query(sqlcheck, [name], (err, responcheck) => {
                      const { orderId } = responcheck[0];
                      const sqlAddDetail =
                      "INSERT INTO `order_detail` (`orderId`, `resId`, `userId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?, ?)";
                      con.query(sqlAddDetail,[orderId,item_name[0], User[0], item_quantity[0],new Date(),"เบิก"],(err, responAddDetail) => {
                          const sqlUpdate ="UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                          con.query(
                            sqlUpdate,
                            [
                              responRes[0].resAmount - item_quantity[0],
                              item_name[0]
                            ],
                            (err, resUpdate) => {
                              const sqlGo = 
                              "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
                              con.query(sqlGo, (err, respon) => {
                                if (err) throw err;
                              });
                            }
                          );
                        }
                      );
                    });
                  });
                })
              }
            })

           
          //  รอเพิ่มแล้วค่อยค่อยต่อ 
setTimeout(() => {
  
  for (let i = 1; i < item_name.length; i++) {
             
    const sql = "SELECT * FROM `resource` WHERE resId = ? ";
    con.query(sql, [item_name[i]], (err, responRes) => {
      if (Array.isArray(item_quantity)) {
        const sum = responRes[0].resAmount - item_quantity[i];
        if (sum < 0) {
          const sql = "SELECT * FROM `resource` WHERE resAmount != 0";
          con.query(sql, (err, respon1) => {
            const sqlact =
              "SELECT * FROM `activity` WHERE actCode != 'Complete' ";
            con.query(sqlact, (err, respon2) => {
              const sql = "SELECT * FROM `user`"
              con.query(sql,(err,responUser) => {  
                res.render("page/resource/exportResource", {
                  User : responUser,
                  activity: respon2,
                  listsResource: respon1,
                  data: {
                    msg:
                      "เกิดข้อผิดพลาด! โปรดตรวจสอบทรัพยาคงเหลือก่อนทำการเบิก",
                    cls: "alert alert-danger",
                    dashboard: false,
                    managerUser: false,
                    managerActivity: false,
                    managerResource: true
                  }
                });
              })
              
            });
            
          });
          return false
        } else {
          console.log("แบบกลุ่ม",i);
          //แบบ กลุ่ม
          const sqlcheck = "SELECT * FROM `order` WHERE actId = ? ";
          con.query(sqlcheck, [name],async (err, responcheck) => {
            if (await responcheck.length > 0) {
              console.log('มีแล้ว');
              const { orderId } = responcheck[0];
              const sqlAddDetail =
              "INSERT INTO `order_detail` (`orderId`, `resId`, `userId`, `deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ?, ?, ?, ?, ?)";
              con.query(
                sqlAddDetail,
                [orderId, item_name[i],User[i], item_quantity[i], new Date(), "เบิก"],
                (err, responAddDetail) => {
                  const sqlUpdate =
                    "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                  con.query(
                    sqlUpdate,
                    [responRes[0].resAmount - item_quantity[i], item_name[i]],
                    (err, resUpdate) => {
                      // res.redirect("/ManagerResource")
                      const sqlGo = 
                      "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
                      con.query(sqlGo, (err, respon) => {
                        if (err) throw err;
                      });
                    }
                  );
                }
              );
            } else {
console.log('ไม่มีโว๊ย');

       
            }
          });
        }
      }
    });
  }
}, 250);
      
setTimeout(() => {
  const sql = 
  "SELECT  resource.resId, resource.resName, resource.resDetail, resource.resAmount,resource.resImage,resource.resStatus ,SUM(case WHEN order_detail.deRes_status = 'เบิก' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount  else 0 end) - SUM(case WHEN order_detail.deRes_status = 'คืน' AND resource.resStatus = 1 AND resource.resId = order_detail.resId THEN order_detail.deRes_amount else 0 end) AS future FROM `order_detail` JOIN resource GROUP BY resource.resName";
  con.query(sql, (err, respon) => {
    const sql = "SELECT * FROM `user`"
                    con.query(sql,(err,responUser) => {   
                      res.render("page/resource/resourcePage", {
                        User : responUser,
                        listsResource: respon,
                        data: {
                          css: false,
                          err: true,
                          msg: "เบิกทรัพยากร เรียบร้อยแล้ว",
                          cls: "alert alert-success",
                          dashboard: false,
                          managerUser: false,
                          managerActivity: false,
                          managerResource: true
                        }
                      });
                    } )
  });
}, 350)
          }         
         }, 350)
  }
  }
};

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

const ReturnExport = (req, res) => {
  const { idresId, idAct, Amount ,idUser} = req.query;

  sqlcheck = "SELECT * FROM `order` WHERE actId = ?";
  con.query(sqlcheck, [idAct], (err, respon) => {
    if (respon.length > 0) {
      const sqlcheckAmount =
        "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId,order_detail.userId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'เบิก' && resource.resId = ? GROUP BY resource.resName";
      con.query(sqlcheckAmount, [idAct, idresId], (err, responCheckOrder) => {
        const sqlcheckreturn =
          "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId ,order_detail.userId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'คืน' && resource.resId = ? GROUP BY resource.resName";
        con.query(sqlcheckreturn, [idAct, idresId], (err, responCheckRe) => {
            if (Amount == 0) {
              res.redirect("/listJoin/" + idAct);
            } else {
              const toInt = parseInt(Amount);
                const orderId = respon[0].orderId;
                sql =
                  "INSERT INTO `order_detail` (`orderId`,`resId`, `userId`,`deRes_amount`, `deRes_date`, `deRes_status`) VALUES (?, ? , ?, ?, ?, 'คืน')";
                  con.query(
                  sql,
                  [orderId, idresId,idUser, Amount, new Date()],
                  (err, respon) => {
                    const sqlResource =
                      "SELECT * FROM resource WHERE `resId` = ?";
                    con.query(sqlResource, [idresId], (err, responResoirce) => {
                      const quantity = responResoirce[0].resAmount;
                      const sqlupdate =
                        "UPDATE `resource` SET `resAmount` = ? WHERE `resource`.`resId` = ?";
                      con.query(
                        sqlupdate,
                        [quantity + parseInt(Amount), idresId],
                        (err, resUpdate) => {
                          res.redirect("/listJoin/" + idAct);
                        }
                      );
                    });
                  }
                );
          
            }
          
 
        });
      });
    }
  });
};

const lossExport = (req,res) => {
  res.send('OK')
}

const historyOneDay = (req, res) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // const newDate = '2020-1-19'
  const newDate = year + "-" + month + "-" + day+ ' 00:00:00';
  const newDate2 = year + "-" + month + "-" + day+ ' 23:59:59';
  const monthArray = [
    "",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ];
  const mm = monthArray[month];
  const plusYear = year + 543;
  const DateShow = day + " " + mm + " " + plusYear;
  const sql =
  "SELECT DISTINCT resource.resName,activity.actName, SUM(case WHEN order_detail.orderId = order.orderId THEN order_detail.deRes_amount else 0 END) AS total ,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId WHERE order_detail.deRes_date  BETWEEN ?  AND ? GROUP By  resource.resId,activity.actId,order_detail.deRes_status,order_detail.deRes_date ORDER BY order_detail.deRes_date , activity.actName  , order_detail.deRes_status  DESC"
  // "SELECT resource.resName,activity.actName,order_detail.deRes_date,order_detail.deRes_status ,order_detail.deRes_amount as total FROM order_detail INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN activity ON activity.actId = order.actId INNER JOIN resource ON resource.resId = order_detail.resId WHERE order_detail.deRes_date  BETWEEN ?  AND ? ORDER BY order_detail.deRes_date DESC";
  con.query(sql, [newDate,newDate2], (err, respon) => {
    if (err) throw err;
    res.render("page/resource/historyOneDay", {
      listHitory: respon,
      data: {
        DateShow: DateShow,
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    });
  });
};

const historyAll = (req, res) => {
  const sql =
  "SELECT DISTINCT resource.resName,activity.actName, SUM(case WHEN order_detail.orderId = order.orderId THEN order_detail.deRes_amount else 0 END) AS total ,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId GROUP By  resource.resId,activity.actId,order_detail.deRes_status,order_detail.deRes_date ORDER BY order_detail.deRes_date , activity.actName  , order_detail.deRes_status  DESC"
        // "SELECT resource.resName,activity.actName,order_detail.deRes_date,order_detail.deRes_status ,order_detail.deRes_amount as total FROM order_detail INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN activity ON activity.actId = order.actId INNER JOIN resource ON resource.resId = order_detail.resId ORDER BY order_detail.deRes_date DESC";
        
  con.query(sql, (err, respon) => {
    res.render("page/resource/historyAll", {
      listHitoryAll: respon,
      data: {
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    });
  });
};

const AddAmount = (req, res) => {
  const {resId, Amount} = req.body
  const numbers = /^[0-9]+$/;
  const sql = "SELECT resAmount FROM `resource` WHERE resId = ?";
  if (Amount.match(numbers) && Amount > 0) {
    con.query(sql, [resId], (err, respon) => {
      const AmountSum = respon[0].resAmount + parseInt(Amount);
      const sqlAmount =
        "UPDATE `resource` SET `resAmount` = ? WHERE `resId` = ?;";
      con.query(sqlAmount, [AmountSum, resId], (err, responAmount) => {
        const sqlAll = "SELECT * FROM `resource`";
        con.query(sqlAll, (err, respon) => {
          // res.render("page/resource/resourcePage", {
          //   listsResource: respon,
          //   data: {
          //     css: false,
          //     err: true,
          //     msg: "เพิ่มจำนวน เรียบร้อยแล้ว",
          //     cls: "alert alert-success",
          //     dashboard: false,
          //     managerUser: false,
          //     managerActivity: false,
          //     managerResource: true
          //   }
          // });
        });
      });
    });
  } else {
    const sqlAll = "SELECT * FROM `resource`";
    con.query(sqlAll, (err, respon) => {
      // res.render("page/resource/resourcePage", {
      //   listsResource: respon,
      //   data: {
      //     css: false,
      //     err: true,
      //     msg: "กรุณาใส่จำนวน หรือ จำนวนเกินกว่าที่เบิก",
      //     cls: "alert alert-warning",
      //     dashboard: false,
      //     managerUser: false,
      //     managerActivity: false,
      //     managerResource: true
      //   }
      // });
    });
  }
};

const checkReturn = (req,res) => {
  const sql = 
  "SELECT DISTINCT activity.actId,user.userPosition,user.userArea, user.userImage,resource.resName,activity.actName,user.userFname,user.userLname, SUM(case WHEN resource.resStatus = '1' AND  order_detail.deRes_status = 'เบิก' AND order_detail.orderId = order.orderId THEN order_detail.deRes_amount else 0 END) - SUM(case WHEN resource.resStatus = '1' AND  order_detail.deRes_status = 'คืน' AND order_detail.orderId = order.orderId THEN order_detail.deRes_amount else 0 END) AS total ,order_detail.deRes_date,order_detail.deRes_status FROM `order_detail` INNER JOIN `order` ON order.orderId = order_detail.orderId INNER JOIN `activity` ON activity.actId = order.actId INNER JOIN `resource` ON resource.resId = order_detail.resId INNER JOIN `user` ON user.userId = order_detail.userId WHERE resource.resStatus = '1' GROUP By  resource.resId,activity.actId,order_detail.deRes_date ORDER BY order_detail.deRes_date DESC"
  con.query(sql,(err ,respon) => {

    res.render("page/resource/returnResource", {
      listreturn : respon ,
      data: {
        dashboard: false,
        managerUser: false,
        managerActivity: false,
        managerResource: true
      }
    });

  })

}


module.exports.resourcePage = resourcePage;
module.exports.addResource = addResource;
module.exports.PostaddResource = PostaddResource;
module.exports.editResource = editResource;
module.exports.posteditResource = posteditResource;
module.exports.delResource = delResource;
module.exports.exportResouce = exportResouce;
module.exports.AddExport = AddExport;
module.exports.ReturnExport = ReturnExport;
module.exports.lossExport = lossExport;
module.exports.historyOneDay = historyOneDay;
module.exports.historyAll = historyAll;
module.exports.AddAmount = AddAmount;
module.exports.checkReturn = checkReturn;
