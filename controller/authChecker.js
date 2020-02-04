const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    if (req.session.status === 'admin') {
        try {
            const token = await req.session.token
            tokens = await jwt.verify(token, "SECRETKEY")
            next();
        } catch (err) {
            res.render("page/auth/login", {
                data: {
                    pageName: "Login",
                    message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
                    class: "alert alert-warning",
                }
            })
        }
    } else {
        try {
            const token = await req.session.token
            tokens = await jwt.verify(token, "SECRETKEY")
            next();
        } catch (err) {
            res.render("page/auth/login", {
                data: {
                    pageName: "Login",
                    message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
                    class: "alert alert-warning",
                }
            })
        }
    }
}



// redirect
const checkAdmin = (req, res, next) => {
    req.session.status === 'admin' ? next() : res.render('404',{ data:{admin:false,user:true}})}
const checkUser = (req, res, next) => { 
    req.session.status === 'user' ? next() : res.render('404',{ data:{admin:true,user:false}})}

const stayLogin = (req,res,next) => {
    if(req.session.status != ''){
        req.session.status === 'admin' ? res.redirect('main') : res.redirect('home')
    }else{
        res.render("page/auth/login", {
            data: {
                pageName: "Login",
                message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
                class: "alert alert-warning",
            }
        })
    }
}

module.exports.checkAdmin = checkAdmin
module.exports.checkUser = checkUser
module.exports.stayLogin = stayLogin

