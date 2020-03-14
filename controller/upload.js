var multer  = require('multer')

var Storage = multer.diskStorage({
    destination: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) { // ตรวจสอบชนิดไฟล์
        return callback(new Error('เฉพาะไฟล์รูปภาพเท่านั้น!'), false)
    }
    //ถ้าเปน false ส่งค่าว่างออกไป ถ้าไม่ใช่ให้เก็บไฟล์ไว้ที่ public
    callback(null, "public/uploads");
    },
    filename: (req, file, callback) => {
      let extArr = file.originalname.split('.')[1]
        callback(null, file.fieldname + "_" + Date.now() +'.'+ extArr);
    }, //ส่งค่าว่าง ถ้าไม่ว่างให้ส่งชื่อไฟล์ออกไป (ที่แปลงแล้ว โดนแปลงจากวันที่ ณ ที่อัพเปนชื่อไฟล์ ตามด้วยนามสกุล)

});


var upload = multer({
    storage: Storage
}).any() //Field name and max count

module.exports = upload