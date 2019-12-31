const jwt = require("jsonwebtoken")

module.exports = async (req,res,next) => {    
    try{
        const token = await req.session.token
        tokens = await jwt.verify(token, "SECRETKEY") 
        next();
    }catch(error){
         res.render("page/auth/login", {
             data:{
                pageName: "Login",
                message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
                class: "alert alert-warning",
             }
         })
    }
}


const checkLogin = (req, res, next) => {req.session.Islogin === false ? res.render("page/auth/login", {data:{
       pageName: "Login",
       message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
       class: "alert alert-warning",
    }
}) : next() }
const checkAdmin = (req, res, next) => {req.session.status === 'admin' ? next() : res.render('404')}
const checkUser = (req, res, next) => {req.session.status === 'user' ? next() : res.render('404')}

module.exports.checkLogin = checkLogin
module.exports.checkAdmin = checkAdmin
module.exports.checkUser = checkUser




