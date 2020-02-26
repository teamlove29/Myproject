var multer  = require('multer')

var Storage = multer.diskStorage({
    destination: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) { // ตรวจสอบชนิดไฟล์
        return callback(new Error('เฉพาะไฟล์รูปภาพเท่านั้น!'), false)
    }
    callback(null, "public/uploads");
    },
    filename: (req, file, callback) => {
      let extArr = file.originalname.split('.')[1]
        callback(null, file.fieldname + "_" + Date.now() +'.'+ extArr);
    },

});


var upload = multer({
    storage: Storage
}).any() //Field name and max count

module.exports = upload