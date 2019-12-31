const express = require("express")
const router = express.Router()
var loginController = require("../loginController")
var mainController = require("../mainController")
var authChecker = require("../authChecker")
var userController = require("../userController")
var backendController = require("../backendController")
var resourceControlloer = require('../resourceController')
var ActivityControlloer = require('../activityController')

router.get("/", mainController.main)
router.get("/home", mainController.home)
//Login - Logout
router.get("/login", loginController.login)
router.post("/login",loginController.loginPost)
router.get("/logout",loginController.logout)
//Admin
router.get("/main", backendController.main)
router.get("/ManagerUser", userController.ManagerUser)
//User
router.get("/ManagerUser/adduser",userController.adduserPage)
router.post("/ManagerUser/adduser/user", userController.postUser)
router.get("/ManagerUser/edituser/:id", userController.editUser)
router.post("/ManagerUser/editUser/:id", userController.postEditUser)
router.get("/ManagerUser/deluser/:id", userController.delUser)
//Activity
router.get("/ManagerActivity", ActivityControlloer.activityPage)
//Resource
router.get("/ManagerResource", resourceControlloer.resourcePage)


router.get("*",backendController.notFound)
module.exports = router;