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
    await con.query(check,[code], (err,data) => {
        if(data.length > 0){
            const activityCode = data[0].actId
            const checkregister = "SELECT * FROM `register` WHERE actId = ?"
            con.query(checkregister,[activityCode],(err,respon) => {
                const user = req.session.userId
                const resId = respon[0].regId
                const date = new Date
                const checkuser = "SELECT * FROM `register_detail` WHERE regId = ? AND userId = ?"
                const sqlRegisterDetail = "INSERT INTO `register_detail` (`regId`, `userId`, `resDe_Date`)  VALUES (?, ?,?)"
                if(respon.length > 0){
                    con.query(checkuser,[resId,user],(err,respon) => {
                            if(respon.length > 0){
                                res.render("page/register/registerPage", {
                                    data:{
                                        msg : 'คุณได้ลงกิจกรรมนี้แล้ว หรือ รหัสหมดอายุ',
                                        cls:'alert alert-warning'
                                    }
                                })
                            }else{
                                con.query(sqlRegisterDetail,[resId,user,date],(err,respon) => {
                                    if(err) throw err
                                    res.render("page/register/registerPage", {
                                        data:{
                                            msg : 'ลงทะเบียนเรียบร้อย',
                                            cls:'alert alert-success'
                                        }
                                    })
                                })

                            }
                    })
                }else{
                    const sqlRegister = "INSERT INTO `register`(`regId`, `actId`)  VALUES (NULL, ?)"
                    con.query(sqlRegister,[activityCode],(err,respon) => {
                        con.query(checkuser,[user],(err,respon) => {
                            if(respon.length > 0){
                                res.render("page/register/registerPage", {
                                    data:{
                                        msg : 'คุณได้ลงกิจกรรมนี้แล้ว หรือ รหัสหมดอายุ',
                                        cls:'alert alert-warning'
                                    }
                                })
                            }else{
                                con.query(sqlRegisterDetail,[resId,user,date],(err,respon) => {
                                    res.render("page/register/registerPage", {
                                        data:{
                                            msg : 'ลงทะเบียนเรียบร้อย',
                                            cls:'alert alert-success'
                                        }
                                    })
                                })

                            }
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

module.exports.registerPage = registerPage
module.exports.regiser = regiser