var con = require('./conDB')

const activityPage = (req, res) => {
  const sql = "SELECT * FROM `activity` order BY actId DESC"
  con.query(sql, (err, respon2) => {
    const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
    con.query(sqlnum, async (err, respon) => {
      let result = {}
      await respon.map(value => {
        result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
      })
      res.render('page/ativity/activityPage', {
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
}


const addActivity = (req, res) => {
  res.render("page/ativity/addActivity", {
    data: {
      isEdit: false,
      dashboard: false,
      managerUser: false,
      managerActivity: true,
      managerResource: false
    }
  })
}
const PostaddActivity = (req, res) => {
  const { name, date, score, detail } = req.body
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
  con.query(sql, [name, code, detail, score, date], (err, respon) => {
    const sqlac = "SELECT * FROM `activity` order BY actId DESC"
    con.query(sqlac, (err, respon2) => {
      const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
      con.query(sqlnum, async (err, respon) => {
        let result = {}
        //หาจำนวนคนเข้าร่วมกิจกรรม
        await respon.map(value => {
          result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
        })
        res.render('page/ativity/activityPage', {
          peopleJoin: result,
          listsActivity: respon2,
          data: {
            css:true,
            err:true,
            msg : 'เพิ่มกิจกรรม เรียบร้อยแล้ว',
            cls : 'alert alert-success',
            dashboard: false,
            managerUser: false,
            managerActivity: true,
            managerResource: false
          }
        })
      })
    })
  })

}

const editActivity = async (req, res) => {
  const IdActivity = await req.params.id
  sql = await "SELECT * FROM `activity` WHERE actId = ?"
  con.query(sql, [IdActivity], (err, respon) => {
    if (err) throw err
    res.render("page/ativity/addActivity", {
      activity: respon,
      data: {
        isEdit: true,
        dashboard: false,
        managerUser: false,
        managerActivity: true,
        managerResource: false
      }
    })
  })
}
const posteditActivity = async (req, res) => {
  const IdActivity = await req.params.id
  const { name, date, score, detail } = await req.body
  const sql = await "UPDATE `activity` SET `actName` = ?, `actDetail` =?,`actDate` =?,`actScore` =? WHERE `actId` = ?;"
  const sqlscoreAct = "SELECT `actScore` FROM `activity` WHERE actId = ?"
  const sqlscoreUser = "SELECT user.userAllscore,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"
  const sqlUpDateScore = "UPDATE `user` SET `userAllScore` = ? WHERE `user`.`userId` = ?"

    // ดึงค่าคะแนนของกิจกรรมก่อนแก้ไข
    con.query(sqlscoreAct,[IdActivity],(err,responScoreAct) => {
      const ScoreAct =  responScoreAct[0].actScore
      //เอาค่าคะแนนชอง User จากกิจกรรมที่ต้องการแก้
      con.query(sqlscoreUser,[IdActivity],async (err,responUser) => {
        //ถ้า user มากกว่า 0
        if(responUser.length > 0){
          for(var i=0; i < responUser.length;i++){
            let userId = responUser[i].userId
            let scoreUser = responUser[i].userAllscore
            let scoreReal 
            //ถ้าคะแนนเดิม เท่ากับ คะแนนที่แก้
            if(ScoreAct == score){
              scoreReal = scoreUser
            }
            //ถ้าคะแนนกิจกรรมเดิม น้อยกว่า คะแนนที่แก้
            if(ScoreAct < score){
              const total = score-ScoreAct
              scoreReal = scoreUser + total
            }
            //ถ้าคะแนนกิจกรรม มากกว่า คะแนนที่แก้
            if(ScoreAct > score){
              const total = ScoreAct-score
              scoreReal = scoreUser - total
            }
            //ถ้าคะแนนที่คำนวนมาแล้ว น้อยกว่า 0 ให้มันเป็น 0
            if(scoreReal < 0){
              scoreReal = 0
            }
            
            // console.log('คะแนนปัจจุบัน : ',ScoreAct);
            // console.log('คะแนนที่ใส่ : ',score);
            // console.log('คะแนนUser : ',scoreUser);
            // console.log('รวม : ',scoreReal);

            //อัพเดทคะแนนทั้งหมด
            con.query(sqlUpDateScore,[scoreReal,userId],(err,responReal) => {

            })
        }
        //แก้ไขกิจกรรม
        con.query(sql, [name, detail, date, score, IdActivity], (err, respon) => { 
          const sql2 = "SELECT * FROM `activity` order BY actId DESC"
          //ค่ากิจกรรม
          con.query(sql2, (err, respon2) => {
            const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
            //นับจำนวนคนเข้าร่วมกิจกรรม
            con.query(sqlnum, async (err, respon) => {
              let result = {}
              await respon.map(value => {
                result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
              })
              res.render('page/ativity/activityPage', {
                peopleJoin: result,
                listsActivity: respon2,
                data: {
                  css:true,
                  err:true,
                  msg : 'แก้ไขกิจกรรม เรียบร้อยแล้ว',
                  cls : 'alert alert-success',
                  dashboard: false,
                  managerUser: false,
                  managerActivity: true,
                  managerResource: false
                }
              })
            })
          })
        })

        //หมด For

      }else{
        con.query(sql, [name, detail, date, score, IdActivity], (err, respon) => { 
          const sql2 = "SELECT * FROM `activity` order BY actId DESC"
          con.query(sql2, (err, respon2) => {
            const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
            con.query(sqlnum, async (err, respon) => {
              let result = {}
              await respon.map(value => {
                result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
              })
              res.render('page/ativity/activityPage', {
                peopleJoin: result,
                listsActivity: respon2,
                data: {
                  css:true,
                  err:true,
                  msg : 'เพิ่มกิจกรรม เรียบร้อยแล้ว',
                  cls : 'alert alert-success',
                  dashboard: false,
                  managerUser: false,
                  managerActivity: true,
                  managerResource: false
                }
              })
            })
          })
        })
        

      }
    })
    })

}
const delActivity = async (req, res) => {

  const IdActivity = req.params.id
  //ดึงคะแนนจากกิจกรรม
   const sqlSeeScorce = "SELECT `actScore` FROM `activity` WHERE actId = ?"
    con.query (sqlSeeScorce,[IdActivity],  (err,responSeeScore) => {
      //ถ้าคะแนนไม่เท่ากับว่าง ดึงคะแนนใส่ตัวแปล
      if(responSeeScore != ''){
        var ScoreActivityDel =  responSeeScore[0].actScore
      }
      const sql = "SELECT * FROM `activity` order BY actId DESC"
      con.query(sql, (err, respon2) => {
        const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
        con.query(sqlnum, async (err, respon) => {
          //นับจำนวนคนเข้าร่วมกิจกรรม แต่ละกิจกรรม
          let result = {}
          await respon.map(value => {
            result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
          })
          //เอาคะแนนของกิจกรรม ไปลบกับคะแนนของคนที่เคยลงกิจกรรม
          const sqlScore = "SELECT user.userAllscore,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"
          con.query(sqlScore,[IdActivity], async(err,responScore) => {
            if(responScore.length>0){
              for(var i=0; i < responScore.length;i++){
                const userId = await responScore[i].userId
                const scoreUser =await responScore[i].userAllscore
                const scoreReal = await (scoreUser-ScoreActivityDel)
                if(scoreReal < 0){ 
                  scoreReal = 0
                }
                //อัพเดทคะแนนของ user
                const sqlUpDateScore = "UPDATE `user` SET `userAllScore` = ? WHERE `user`.`userId` = ?"
                con.query(sqlUpDateScore,[scoreReal,userId],(err,responReal) => {
                })
              }
              // หมดFor
              const sql =  "DELETE FROM `activity` WHERE `activity`.`actId` = ?"
              const sqlActivityAll = "SELECT * FROM `activity` order BY actId DESC" 
              const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
              con.query(sql, [IdActivity], (err, respon) => {
                con.query(sqlActivityAll,(err,responActivityAll) => {
                  con.query(sqlnum,async (err,responJoin) => {
                    let result = {}
                    await responJoin.map(value => {
                      result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
                    })
            
                      res.render('page/ativity/activityPage', {
                        peopleJoin: result,
                        listsActivity: responActivityAll,
                        data: {
                              css:true,
                              err:true,
                              msg : 'ลบกิจกรรม เรียบร้อยแล้ว',
                              cls : 'alert alert-success',
                          dashboard: false,
                          managerUser: false,
                          managerActivity: true,
                          managerResource: false
                        }
                      })
                  })
            
                              })    
                          })
            }else{
  const sql =  "DELETE FROM `activity` WHERE `activity`.`actId` = ?"
  const sqlActivityAll = "SELECT * FROM `activity` order BY actId DESC" 
  const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
  con.query(sql, [IdActivity], (err, respon) => {
    con.query(sqlActivityAll,(err,responActivityAll) => {
      con.query(sqlnum,async (err,responJoin) => {
        let result = {}
        await responJoin.map(value => {
          result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
        })

          res.render('page/ativity/activityPage', {
            peopleJoin: result,
            listsActivity: responActivityAll,
            data: {
                  css:true,
                  err:true,
                  msg : 'ลบกิจกรรม เรียบร้อยแล้ว',
                  cls : 'alert alert-success',
              dashboard: false,
              managerUser: false,
              managerActivity: true,
              managerResource: false
            }
          })
      })

                  })    
              })
            }
          })

        })
      })
  })


}

const listJoin = (req, res) => {
  const IdActivity = req.params.id
  const sqlResource = "SELECT DISTINCT  order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId =  order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'เบิก' GROUP BY resource.resName"
  con.query(sqlResource, [IdActivity], (err, responRe) => {
    const sql = "SELECT register_detail.regId,activity.actId,activity.actName,activity.actDate,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"
    con.query(sql, [IdActivity], (err, respon) => {
      const sqlReturn = "SELECT DISTINCT order.orderId, order.actId, order_detail.resId, resource.resName,order_detail.deRes_status, SUM(order_detail.deRes_amount) AS total FROM `order` INNER JOIN `order_detail` ON order.orderId = order_detail.orderId INNER JOIN resource ON order_detail.resId = resource.resId WHERE order.actId = ? && order_detail.deRes_status = 'คืน' GROUP BY resource.resName"
      con.query(sqlReturn, [IdActivity], (err, responReturn) => {
        const sqlActivity = "SELECT * FROM `activity` WHERE `actId` = ?"
        con.query(sqlActivity, [IdActivity], (err, responActivity) => {
          // console.table(responRe);
          // console.table(responReturn);
          res.render('page/ativity/listJoinActivity', {
            nameActivity: responActivity,
            listResouceRe: responReturn,
            listResouce: responRe,
            listJoin: respon,
            data: {
              dashboard: false,
              managerUser: false,
              managerActivity: true,
              managerResource: false
            }
          })
        })
      })
    })
  })

}

const delJoin = (req, res) => {
  const { userId, regId, actId } = req.query
  const sql = "DELETE FROM `register_detail` WHERE regId = ? AND userId = ?"
  const sqlUser = "SELECT user.userAllScore  FROM `user` WHERE userId = ?"
  const sqlActivityScroce = "SELECT activity.`actScore` FROM `activity` WHERE actId = ?"
  const sqlUpDateScore = "UPDATE `user` SET `userAllScore` = ? WHERE `user`.`userId` = ?"
  con.query(sql, [regId, userId], (err, respon) => {
    con.query(sqlUser, [userId], (err, responUser) => {
      const Score = responUser[0].userAllScore
      con.query(sqlActivityScroce, [actId], (err, responAcSroce) => {
        const ScoreActivity = responAcSroce[0].actScore
        const scoreReal = Score - ScoreActivity < 0 ? 0 : Score - ScoreActivity
        con.query(sqlUpDateScore, [scoreReal, userId], (err, respon) => {
          res.redirect('/listJoin/' + actId)
        })
      })
    })
  })
}
const activityStatus = async (req, res) => {
  const { id } = req.params
  const sql = await "UPDATE `activity` SET `actCode` = 'Complete' WHERE `actId` = ?;"
  con.query(sql, [id], (err, respon) => {
    if (err) throw err
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



// const sql = "SELECT * FROM `activity` order BY actId DESC"
// con.query(sql, (err, respon2) => {
//   const sqlnum = "SELECT activity.actId FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId = activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId "
//   con.query(sqlnum, async (err, respon) => {
//     let result = {}
//     await respon.map(value => {
//       result[value.actId] ? result[value.actId]++ : result[value.actId] = 1
//     })
//     res.render('page/ativity/activityPage', {
//       peopleJoin: result,
//       listsActivity: respon2,
//       data: {
//         css:true,
//         err:true,
//         msg : 'เพิ่มกิจกรรม เรียบร้อยแล้ว',
//         cls : 'alert alert-success',
//         dashboard: false,
//         managerUser: false,
//         managerActivity: true,
//         managerResource: false
//       }
//     })
//   })
// })


// const sqlScore = "SELECT register_detail.regId,activity.actId,activity.actName,activity.actDate,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE activity.actId = ?"