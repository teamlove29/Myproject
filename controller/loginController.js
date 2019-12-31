var con = require("./conDB");
const jwt = require("jsonwebtoken");

const login =("/login", (req, res) => {
    res.render("page/auth/login", {
      data: {
        pageName: "Login",
        message: "",
        class: "",
        loginStatus: false
      }
    });
  });

const loginPost =  ("/login", async (req, res) => {
    const { username, password } = await req.body;
    if (!username || !password) {
      res.render("page/auth/login", {
        data: {
          pageName: "Login",
          message: "กรุณากรอก Username และ Password",
          class: "alert alert-warning",
          loginStatus: false
        }
      });
    } else {
      const sql = await "SELECT * FROM user_tb WHERE user_position = ? AND user_pass = ? ";
      con.query(sql, [username, password], async (err, respon) => {
        if  (respon.length > 0)  {
          req.session.username = respon[0].user_Fname + ' ' + respon[0].user_Lname
          req.session.status = respon[0].user_Status
          req.session.Islogin = true
          const token = await jwt.sign({ 
            name: respon[0].user_Fname + respon[0].user_Lname
            ,positionID:respon[0].user_position
            ,status: respon[0].user_Status }, "SECRETKEY", {expiresIn: '1h'}
          );
          req.session.token= token
          respon[0].user_Status == 'user'
            ? res.render("home", {
              data: {
                name:req.session.username,
                loginStatus: true
              }})
            : res.render("page/backend/main",{
              data:{
                dashboard:true,
                managerUser : false,
                managerActivity: false,
                managerResource : false
              }})
        } else {
          res.render("page/auth/login", {
            data: {
              pageName: "Login",
              message: "Username หรือ Password ไม่ถูกต้อง",
              class: "alert alert-warning",
              loginStatus: false
            }
          });
        }
      });
    }
  });

const logout =("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err) throw err
});
    res.clearCookie("Token");
    res.render("page/auth/login", {
      data: {
        pageName: "Login",
        message: "",
        class: "",
        loginStatus: false
      }
    });
  });

module.exports.login = login;
module.exports.loginPost = loginPost;
module.exports.logout = logout;
