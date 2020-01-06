var con = require('./conDB')
var upload = require('./upload')


const ManagerUser = (req, res) => {
  const sql = "SELECT * FROM `user_tb`"
  con.query(sql, (err, respon) => {
    if (err) throw err
    res.render("page/user/userPage", {
      listsUser: respon,
      data: {
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
      upload (req, res, (err) => {
      const { firstName, lastName, positionId, sex, date, idCard, address, Email, tel, status } = req.body
      if (err) throw err
      var filenames =  req.files.map((file) => {
        return file.filename; // or file.originalname
      });
      
      const image = req.files != '' ? filenames : 'defaultImage.png'
      const sql = "INSERT INTO `user_tb`(`user_ID`, `user_Fname`, `user_Lname`, `user_Sex`, `user_Birth`, `user_Pass`, `user_IDcard`, `user_Address`, `user_Zipcode`, `user_Email`, `user_Tel`, `user_Status`, `user_AllScore`, `user_position`, `user_Image`) VALUES (NULL, ?, ?, ?, ?, '1234', ?, ?, '52000', ?, ?, ?, null, ?,?)"
      con.query(sql, [firstName, lastName, sex, date, idCard, address, Email, tel, status, positionId, image], (err, respon) => {
        if (err) throw err;
        res.redirect('/ManagerUser')
      })
    })

  }


const editUser = async (req, res) => {
  const sql = await "SELECT * FROM `user_tb` WHERE `user_tb`.`user_ID` = ?"
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

const postEditUser = async (req, res) => {
  const Iduser = req.params.id
  const { firstName, lastName, positionId, sex, date, idCard, address, Email, tel, status } = await req.body
  const sql = await "UPDATE `user_tb` SET `user_Fname` = ? , `user_Lname` = ?, `user_Sex` = ?, `user_Birth` = ?, `user_IDcard` = ?, `user_Address` = ? , `user_Email` = ?, `user_Tel` = ?, `user_Status` = ? , `user_position`= ? WHERE `user_tb`.`user_ID` = ?;"
  con.query(sql, [firstName, lastName, sex, date, idCard, address, Email, tel, status, positionId, Iduser], (err, respon) => {
    if (err) throw err
    res.redirect("/ManagerUser")
  })
}

const delUser = async (req, res) => {
  const sql = await "DELETE FROM `user_tb` WHERE `user_tb`.`user_ID` = ?"
  con.query(sql, [req.params.id], async (err, respon) => {
    if (err) throw err
    console.log('del Success');
    res.redirect('/ManagerUser')
  })
}

module.exports.ManagerUser = ManagerUser
module.exports.adduserPage = adduser
module.exports.postUser = postUser
module.exports.editUser = editUser
module.exports.postEditUser = postEditUser
module.exports.delUser = delUser
