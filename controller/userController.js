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
      const { firstName, lastName, area, positionId, sex, date, idCard, address, Email, tel, status } = req.body
      if (err) throw err
      var filenames =  req.files.map((file) => {
        return file.filename; // or file.originalname
      });
      const day = date.slice(8,10)
      const month = date.slice(5,7)
      const year = date.slice(2,4)
      const pass = day+month+year

      const image = req.files != '' ? filenames : 'defaultImage.png'
      const sql = "INSERT INTO `user`(`userId`, `userPosition`, `userFname`, `userLname`, `userSex`, `userBirth`, `userPass`, `userIdCard`, `userAddress`, `userArea`, `userEmail`, `userTel`, `userStatus`, `userImage`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"
      con.query(sql, [positionId, firstName, lastName, sex, date, pass, idCard, address, area, Email, tel, status, image], (err, respon) => {
        if (err) throw err;
        res.redirect('/ManagerUser')
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

const postEditUser =  (req, res) => {
  upload (req, res, (err) => {
    const Iduser = req.params.id
    const { firstName, lastName, area, positionId, sex, date, idCard, address, Email, tel, status } =  req.body
    if (err) throw err
    var filenames =  req.files.map((file) => {
      return file.filename; // or file.originalname
    });
    const image = req.files != '' ? filenames : 'defaultImage.png'
    const sql =  "UPDATE `user` SET  `userPosition` = ? , `userFname` = ? , `userLname` = ?, `userSex` = ?, `userBirth` = ?, `userIdCard` = ?, `userAddress` = ? ,`userArea` = ? , `userEmail` = ?, `userTel` = ?, `userStatus` = ? , `userImage`= ? WHERE `user`.`userId` = ?;"
    con.query(sql, [positionId, firstName, lastName, sex, date, idCard, address, area, Email, tel, status, image, Iduser], (err, respon) => {
      if (err) throw err
      res.redirect("/ManagerUser")
    })
  })

}

const delUser = async (req, res) => {
  const sql = await "DELETE FROM `user` WHERE `userId` = ?"
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
