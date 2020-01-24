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
      const sql = await "SELECT * FROM user WHERE userPosition = ? AND userPass = ? ";
      con.query(sql, [username, password], async (err, respon) => {
        if  (respon.length > 0)  {
          const token = await jwt.sign({ 
            name: respon[0].userFname + respon[0].userLname
            ,positionID:respon[0].userPosition
            ,status: respon[0].userStatus }, "SECRETKEY", {expiresIn: '1h'}
          );
          req.session.userId = respon[0].userId
          req.session.username = respon[0].userFname + ' ' + respon[0].userLname
          req.session.status = respon[0].userStatus
          req.session.Islogin = true
          req.session.token = token
          req.session.image = respon[0].userImage
          respon[0].userStatus == 'user' ? res.redirect("/home") : res.redirect('/main')
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
