var con = require('./conDB')

const registerPage = (req,res) => {
    res.render("page/register/registerPage",{
        data:{
            msg:'',
            cls : ''
        }
    })
}

// const checkActivity =  (sql,code,callback) => {
//      con.query(sql,[code], (err,respon) => {
//         if (err) 
//         callback(err,null);
//     else
//         callback(null,respon[0].actName);
//     })
// }

const regiser = async (req,res) => {
    const {code} = req.body
    const check = "SELECT * FROM `activity` WHERE actCode = ?"
    await con.query(check,[code], async (err,data) => {

        if(data.length > 0){
            const activityCode = await data[0].actId
            const scoreActivity = await data[0].actScore
            const checkregister =  "SELECT * FROM `register` WHERE actId = ?"
            await con.query(checkregister,[activityCode], async (err,respon) => {
                const user = await req.session.userId
                const date = new Date
                const checkuser = "SELECT * FROM `register_detail` WHERE regId = ? AND userId = ?"
                const sqlRegisterDetail = "INSERT INTO `register_detail` (`regId`, `userId`, `resDe_Date`)  VALUES (?, ?,?)"
                const sqlUser = "SELECT user.userAllScore  FROM `user` WHERE userId = ?"
                const sqlUpDateScore = "UPDATE `user` SET `userAllScore` = ? WHERE `user`.`userId` = ?"
                if(respon.length > 0){
                    const resId = await respon[0].regId
                    await con.query(checkuser,[resId,user],async (err,respon) => {
                            if(respon.length > 0){
                                res.render("page/register/registerPage", {
                                    data:{
                                        msg : 'คุณได้ลงกิจกรรมนี้แล้ว หรือ รหัสหมดอายุ',
                                        cls:'alert alert-warning'
                                    }
                                })
                     
                            }else{
                                con.query(sqlRegisterDetail,[resId,user,date], async(err,respon) => {
                                    await con.query(sqlUser,[user],async (err,responUser) => {
                                        const Score = await responUser[0].userAllScore 
                                        console.log(Score,scoreActivity);
                                            con.query(sqlUpDateScore,[Score+scoreActivity,user],(err,responUpdateScore) => {
                                            res.render("page/register/registerPage", {
                                                data:{
                                                    msg : 'ลงทะเบียนเรียบร้อย',
                                                    cls:'alert alert-success'
                                                }
                                            })
                                        })
    
                                    })
        
                                })

                            }
                    })
                }else{
                    const sqlRegister = "INSERT INTO `register`(`regId`, `actId`)  VALUES (NULL, ?)"
                    con.query(sqlRegister,[activityCode],(err,respon) => {
                        const sqlRegId = "SELECT regId FROM `register` WHERE actId = ?"
                        con.query(sqlRegId,[activityCode],(err,responReg) => {
                            const regIdSe = responReg[0].regId
                        con.query(checkuser,[regIdSe,user],(err,respon) => {

                            if(respon.length > 0){
                                res.render("page/register/registerPage", {
                                    data:{
                                        msg : 'คุณได้ลงกิจกรรมนี้แล้ว หรือ รหัสหมดอายุ',
                                        cls:'alert alert-warning'
                                    }
                                })
                            }else{
                                con.query(sqlRegisterDetail,[regIdSe,user,date],(err,respon) => {
                                     con.query(sqlUser,[user], (err,responUser) => {
                                        const Score =  responUser[0].userAllScore
                                         con.query(sqlUpDateScore,[Score+scoreActivity,user],(err,responUpdateScore) => {
                                            res.render("page/register/registerPage", {
                                                data:{
                                                    msg : 'ลงทะเบียนเรียบร้อย',
                                                    cls:'alert alert-success'
                                                }
                                            })
                                        })
    
                                    })

                                })

                            }
                        })
                    })
                    })
                }
            })
            
        }else{
            res.render("page/register/registerPage", {
                data:{
                    msg : 'โค้ดลงทะเบียนผิดพลาด',
                    cls:'alert alert-danger'
                }
            })
            
        }
    })
    
}

const history = (req,res) => {
    const user =  req.session.userId
    const sql = "SELECT register_detail.regId,activity.actId,activity.actScore,activity.actName,activity.actDate,user.userId,user.userPosition,user.userFname,user.userLname,user.userArea FROM `register` INNER JOIN `register_detail` INNER JOIN activity INNER JOIN user ON register.actId =  activity.actId AND register.regId = register_detail.regId AND register_detail.userId = user.userId WHERE user.userId = ?"
    con.query(sql,[user],(err,respon) => {
        res.render('page/register/historyRegister',{
            listActivityUser:respon,
            data: {
                css:false,
                err:false,
                dashboard: false,
                managerUser: true,
                managerActivity: false,
                managerResource: false
              }
        })
    })

    
}

module.exports.registerPage = registerPage
module.exports.regiser = regiser
module.exports.history = history