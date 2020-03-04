var con = require('./conDB')
var upload = require('./upload')
var fs = require('fs');

const ManagerUser = (req, res) => {
  const sql = "SELECT * FROM `user`"
  con.query(sql, (err, respon) => {
    if (err) throw err
    res.render("page/user/userPage", {
      listsUser: respon,
      data: {
        css: false,
        err: false,
        msg: '',
        cls: '',
        dashboard: false,
        managerUser: true,
        managerActivity: false,
        managerResource: false
      }
    });
  })
};


const adduser = (req, res) => {
  res.render("page/user/addUser", {
    data: {
      isEdit: false,
      dashboard: false,
      managerUser: true,
      managerActivity: false,
      managerResource: false
    }
  });
};

const postUser = (req, res) => {
  upload(req, res, (err) => {
    const { firstName, lastName, area, positionId, sex, date, idCard, address, Email, tel, status } = req.body
    if (upload.MulterError) {

      // ไม่ผ่านเงื่อนไขการอัพโหลดไฟล์
    }
    var filenames = req.files.map((file) => {
      return file.filename; // or file.originalname
    }); //หันเอาคำตั้งแต่ 8-10
    const day = date.slice(8, 10)
    const month = date.slice(5, 7)
    const year = date.slice(2, 4)
    const pass = day + month + year

    const image = req.files != '' ? filenames : 'defaultImage.png'
    const sql = "INSERT INTO `user`(`userId`, `userPosition`, `userFname`, `userLname`, `userSex`, `userBirth`, `userPass`, `userIdCard`, `userAddress`, `userArea`, `userEmail`, `userTel`, `userStatus`, `userImage`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"
    const sqlCheck = "SELECT * FROM `user` WHERE userPosition= ?"
    const sqlUser = "SELECT * FROM `user`"
    con.query(sqlCheck, [positionId], (err, responCheck) => {
      if (responCheck.length > 0) {
        con.query(sqlUser, (err, responUserAll) => {
          res.render("page/user/userPage", {
            listsUser: responUserAll,
            data: {
              err: true,
              msg: 'ข้อมูลซ้ำกรุณาตรวจสอบ',
              cls: 'alert alert-danger',
              dashboard: false,
              managerUser: true,
              managerActivity: false,
              managerResource: false
            }
          });
        })
      } else {
        con.query(sql, [positionId, firstName, lastName, sex, date, pass, idCard, address, area, Email, tel, status, image], (err, respon) => {
          con.query(sqlUser, (err, responUserAll) => {
            res.render("page/user/userPage", {
              listsUser: responUserAll,
              data: {
                css: true,
                err: true,
                msg: 'เพิ่มบุคลากรเรียบร้อยแล้ว',
                cls: 'alert alert-success',
                dashboard: false,
                managerUser: true,
                managerActivity: false,
                managerResource: false
              }
            });
          })
        })
      }
    })

  })

}


const editUser = async (req, res) => {
  const sql = await "SELECT * FROM `user` WHERE `userId` = ?"
  con.query(sql, [req.params.id], (err, respon) => {
    res.render("page/user/addUser", {
      user: respon,
      data: {
        isEdit: true,
        dashboard: false,
        managerUser: true,
        managerActivity: false,
        managerResource: false
      }
    })
  })
}

const postEditUser = (req, res) => {
  upload(req, res, (err) => {
    const Iduser = req.params.id
    const { firstName, lastName, area, positionId, sex, date, idCard, address, Email, tel, status } = req.body
    var filenames = req.files.map((file) => {
      return file.filename; // or file.originalname
    });




    const sql = "UPDATE `user` SET  `userPosition` = ? , `userFname` = ? , `userLname` = ?, `userSex` = ?, `userBirth` = ?, `userIdCard` = ?, `userAddress` = ? ,`userArea` = ? , `userEmail` = ?, `userTel` = ?, `userStatus` = ? , `userImage`= ? WHERE `user`.`userId` = ?;"
    const sqlCheck = "SELECT * FROM `user` WHERE  userId = ? && userPosition = ? "
    const sqlUser = "SELECT * FROM `user`"
    const newPosition = "SELECT * FROM `user` WHERE userPosition = ? "
    const newPositionUser = "SELECT * FROM `user` WHERE  userId = ? "
    con.query(sqlCheck, [Iduser,positionId], (err, responCheck) => {
      if (responCheck.length > 0) {
        const image = req.files != '' ? filenames : responCheck[0].userImage

        if (image == filenames && responCheck[0].userImage != 'defaultImage.png') {
          const fileImageName = 'public/uploads/' + responCheck[0].userImage
          fs.unlink(fileImageName, (err) => {
            if (err) throw err;
          });
        }
        if (responCheck[0].userImage == '') {
          image = 'defaultImage.png'
        }
        con.query(sql, [positionId, firstName, lastName, sex, date, idCard, address, area, Email, tel, status, image, Iduser], (err, respon) => {
          con.query(sqlUser, (err, responUserAll) => {
            res.render("page/user/userPage", {
              listsUser: responUserAll,
              data: {
                css: true,
                err: true,
                msg: 'แก้ไขบุคลากรเรียบร้อยแล้ว',
                cls: 'alert alert-success',
                dashboard: false,
                managerUser: true,
                managerActivity: false,
                managerResource: false
              }
            });
          })
        })
      } else {
        con.query(newPosition,[positionId],(err,resNewPosition) => {
          if(resNewPosition.length > 0){
            con.query(sqlUser, (err, responUserAll) => {
              res.render("page/user/userPage", {
                listsUser: responUserAll,
                data: {
                  css: true,
                  err: true,
                  msg: 'รหัสนี้มีบุคลากรใช้แล้ว',
                  cls: 'alert alert-danger',
                  dashboard: false,
                  managerUser: true,
                  managerActivity: false,
                  managerResource: false
                }
              });
            })
          }else{  

            con.query(newPositionUser,[Iduser], (err,resNewPositionUser) => {
              const image = req.files != '' ? filenames : resNewPositionUser[0].userImage
              if (image == filenames && resNewPositionUser[0].userImage != 'defaultImage.png') {
                const fileImageName = 'public/uploads/' + resNewPositionUser[0].userImage
                fs.unlink(fileImageName, (err) => {
                  if (err) throw err;
                });
              }
              if (resNewPositionUser[0].userImage == '') {
                image = 'defaultImage.png'
              }
              con.query(sql, [positionId, firstName, lastName, sex, date, idCard, address, area, Email, tel, status, image, Iduser], (err, respon) => {
                con.query(sqlUser, (err, responUserAll) => {
                  res.render("page/user/userPage", {
                    listsUser: responUserAll,
                    data: {
                      css: true,
                      err: true,
                      msg: 'แก้ไขบุคลากรเรียบร้อยแล้ว',
                      cls: 'alert alert-success',
                      dashboard: false,
                      managerUser: true,
                      managerActivity: false,
                      managerResource: false
                    }
                  });
                })
              })
            })

          }
        })
      }
    })

  })

}

const delUser = async (req, res) => {
  const imageUser = "SELECT * FROM `user` WHERE `userId` = ?"
  const sql = await "DELETE FROM `user` WHERE `userId` = ?"
  const sqlUser = "SELECT * FROM `user`"
  
  con.query(imageUser,[req.params.id],(err,responImage) => {
    if (responImage[0].userImage != 'defaultImage.png') {
      const fileImageName = 'public/uploads/' + responImage[0].userImage
      fs.unlink(fileImageName, (err) => {
        if (err) throw err;
      });
    }
  })
  con.query(sql, [req.params.id], async (err, respon) => {

    con.query(sqlUser, (err, responUserAll) => {
      res.render("page/user/userPage", {
        listsUser: responUserAll,
        data: {
          css: true,
          err: true,
          msg: 'ลบบุคลากรสำเร็จแล้ว',
          cls: 'alert alert-success',
          dashboard: false,
          managerUser: true,
          managerActivity: false,
          managerResource: false
        }
      });
    })
  })
}

const getArea = (req, res) => {
  const sql = "SELECT `userArea` FROM `user`"
  con.query(sql, (err, respon) => {
    res.json(respon)
  })
}


const CheckUser = (req, res) => {
  res.render('page/user/checkUser', {
    data: {
      err: false,
      msg: '',
      cls: '',
    }
  })
}

const PostCheckUser = (req, res) => {
  const { code } = req.body
  const sql = "SELECT `userPosition`,`userFname`,`userLname`,`userArea`,`userImage` FROM `user` WHERE `userPosition` = ?"
  con.query(sql, [code], (err, respon) => {
    if (respon.length > 0) {
      const name = respon[0].userFname + ' ' + respon[0].userLname
      const Area = respon[0].userArea
      const image = respon[0].userImage
      res.render('page/user/checkUser', {
        data: {
          err: true,
          image: image,
          name: name,
          code: code,
          Area: Area,
          cls: 'alert alert-success',
        }
      })
    } else {
      res.render('page/user/checkUser', {
        data: {
          err: true,
          image: 'ไม่พบบุคลากร',
          name: 'ไม่พบบุคลากร',
          code: 'ไม่พบบุคลากร',
          Area: 'ไม่พบบุคลากร',
          cls: 'alert alert-warning',
        }
      })
    }
  })

}

const profile = (req, res) => {
  const idUser = req.params.id
  const sql = "SELECT * FROM `user` WHERE userId = ?"
  con.query(sql,[idUser],(err,respon) => {
    res.render('page/user/profile',{
      user:respon,
      data: {
        css: true,
        err: false,
        msg: '',
        cls: '',
        dashboard: false,
        managerUser: true,
        managerActivity: false,
        managerResource: false
      }
    })
  })


}

const changePassword = (req, res) => {
  res.render('page/user/changePassword', {
    data: {
      err: false,
      css: false,
      cls: '',
      msg: '',
    }
  })

}
const changePasswordPost = (req, res) => {
  const { pass, newPass, newPass2 } = req.body
  const idUser = req.session.userId
  const sqlCheckPass = "SELECT * FROM `user` WHERE userId = ?"
  con.query(sqlCheckPass, [idUser], (err, responcheckPass) => {
    if (responcheckPass[0].userPass != pass) {
      res.render('page/user/changePassword', {
        data: {
          err: true,
          css: false,
          cls: 'alert alert-warning',
          msg: 'รหัสผ่านไม่ถูกต้อง กรุณาตวจสอบ',
        }
      })
    } else {
      if (newPass != newPass2) { //พาสใหม่ไม่เหมือนยืนยัน
        res.render('page/user/changePassword', {
          data: {
            err: true,
            css: false,
            cls: 'alert alert-warning',
            msg: 'รหัสผ่านใหม่ไม่ตรงกับรหัสผ่านยืนยัน กรุณาตวจสอบ',
          }
        })
      } else {
        if (newPass.length < 6) {
          res.render('page/user/changePassword', {
            data: {
              err: true,
              css: false,
              cls: 'alert alert-warning',
              msg: 'รหัสผ่านต้องมีความยาวมากกว่าหรือเท่ากับ 6 ตัว กรุณาตรวจสอบ',
            }
          })
        } else {
          const sqlChang = "UPDATE `user` SET  `userPass` = ? WHERE `user`.`userId` = ?;"
          con.query(sqlChang, [newPass, idUser], (err, responChang) => {
            req.session.destroy((err) => {
              if(err) throw err
          })
          res.clearCookie("Token");
            res.render("page/auth/login", {
              data: {
                pageName: "Login",
                message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
                class: "alert alert-success",
                loginStatus: false
              }
            });
          })
        }
      }

    }


  })
}

const testUser = (req,res) => {
  const sql = "SELECT * FROM `user`"
  con.query(sql,(err,respon) => {
    if (err)
    {
        res.send("Please enter valid ISA");
    }
    // respon = JSON.stringify(respon);
      res.send(respon);
  })
}


module.exports.ManagerUser = ManagerUser
module.exports.adduserPage = adduser
module.exports.postUser = postUser
module.exports.editUser = editUser
module.exports.postEditUser = postEditUser
module.exports.delUser = delUser
module.exports.getArea = getArea
module.exports.CheckUser = CheckUser
module.exports.PostCheckUser = PostCheckUser
module.exports.profile = profile
module.exports.changePassword = changePassword
module.exports.changePasswordPost = changePasswordPost
module.exports.testUser = testUser
