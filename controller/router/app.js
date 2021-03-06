const express = require("express")
const router = express.Router()
var loginController = require("../loginController")
var mainController = require("../mainController")
var authChecker = require("../authChecker")
var userController = require("../userController")
var backendController = require("../backendController")
var resourceControlloer = require('../resourceController')
var ActivityControlloer = require('../activityController')
var registerController = require('../registerController')
var report = require('../reportController')


//User
router.get("/", mainController.main)
router.get("/home",authChecker,authChecker.checkUser, mainController.home)
router.get("/CheckUser",authChecker, userController.CheckUser)
router.post("/PostCheckUser",authChecker, userController.PostCheckUser)
router.get("/changePassword",authChecker, userController.changePassword)
router.post("/changePassword",authChecker, userController.changePasswordPost)
router.get("/resetPass" ,userController.resetPass)
// router.post("/testUser", userController.testUser)
//Login - Logout
router.get("/login", authChecker,authChecker.stayLogin,loginController.login)
router.post("/login",loginController.loginPost)
router.get("/logout",loginController.logout)
//Admin
router.get("/main",authChecker,authChecker.checkAdmin, backendController.main)
router.get("/ManagerUser",authChecker,authChecker.checkAdmin, userController.ManagerUser)
router.get("/ManagerUser/adduser",authChecker,authChecker.checkAdmin,userController.adduserPage)
router.get("/profile/:id",authChecker,authChecker.checkAdmin,userController.profile)
router.post("/adduser", userController.postUser)
router.get("/ManagerUser/edituser/:id",authChecker,authChecker.checkAdmin, userController.editUser)
router.post("/editUser/:id", userController.postEditUser)
router.get("/ManagerUser/deluser/:id",authChecker,authChecker.checkAdmin, userController.delUser)
//Activity
router.get("/ManagerActivity",authChecker,authChecker.checkAdmin, ActivityControlloer.activityPage)
router.get("/ManagerActivity/addactivity",authChecker,authChecker.checkAdmin,authChecker,authChecker.checkAdmin, ActivityControlloer.addActivity)
router.post("/ManagerActivity/addactivity/activity", ActivityControlloer.PostaddActivity)
router.get("/ManagerActivity/editactivity/:id",authChecker,authChecker.checkAdmin, ActivityControlloer.editActivity)
router.post("/ManagerActivity/editactivity/:id", ActivityControlloer.posteditActivity)
router.get("/delactivity/:id",authChecker,authChecker.checkAdmin, ActivityControlloer.delActivity)
router.get("/listJoin/:id",authChecker,authChecker.checkAdmin, ActivityControlloer.listJoin)
router.get("/deljoin",authChecker,authChecker.checkAdmin, ActivityControlloer.delJoin)
router.get("/activityStatus/:id",authChecker,authChecker.checkAdmin, ActivityControlloer.activityStatus)
//Resource
router.get("/ManagerResource",authChecker,authChecker.checkAdmin, resourceControlloer.resourcePage)
router.get("/ManagerResource/addresource",authChecker,authChecker.checkAdmin, resourceControlloer.addResource)
router.post("/addresource", resourceControlloer.PostaddResource)
router.get("/ManagerResource/editresource/:id",authChecker,authChecker.checkAdmin, resourceControlloer.editResource)
router.post("/ManagerResource/editresource/:id", resourceControlloer.posteditResource)
router.get("/delresource/:id",authChecker,authChecker.checkAdmin, resourceControlloer.delResource)
router.get("/exportResource",authChecker,authChecker.checkAdmin, resourceControlloer.exportResouce)
router.post("/addExport", resourceControlloer.AddExport)
router.get("/returnExport",authChecker,authChecker.checkAdmin, resourceControlloer.ReturnExport)
router.get("/historyOneDay",authChecker,authChecker.checkAdmin, resourceControlloer.historyOneDay)
router.get("/historyAll",authChecker,authChecker.checkAdmin, resourceControlloer.historyAll)
router.post("/AddAmount",authChecker,authChecker.checkAdmin, resourceControlloer.AddAmount)

//register
router.get("/register",authChecker,authChecker.checkUser, registerController.registerPage)
router.post("/register", registerController.regiser)
router.get("/history",authChecker,authChecker.checkUser, registerController.history)

//report
router.get("/report",authChecker,authChecker.checkAdmin, report.report)
router.post("/reportUser",authChecker,authChecker.checkAdmin, report.reportUserpost)
router.post("/reportActivity",authChecker,authChecker.checkAdmin, report.reportActivity)
router.post("/reportHistory",authChecker,authChecker.checkAdmin, report.reportHistory)
router.post("/reportHistoryOne",authChecker,authChecker.checkAdmin, report.reportHistoryOne)

router.get("/Area", userController.getArea)
router.get("/test", backendController.test)
router.get("*",authChecker,backendController.notFound)


  


module.exports = router;