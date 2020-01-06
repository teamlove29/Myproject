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
//User
router.get("/ManagerUser", userController.ManagerUser)
router.get("/ManagerUser/adduser",userController.adduserPage)
router.post("/ManagerUser/adduser/user", userController.postUser)
router.get("/ManagerUser/edituser/:id", userController.editUser)
router.post("/ManagerUser/editUser/:id", userController.postEditUser)
router.get("/ManagerUser/deluser/:id", userController.delUser)
//Activity
router.get("/ManagerActivity", ActivityControlloer.activityPage)
router.get("/ManagerActivity/addactivity", ActivityControlloer.addActivity)
router.post("/ManagerActivity/addactivity/activity", ActivityControlloer.PostaddActivity)
router.get("/ManagerActivity/editactivity/:id", ActivityControlloer.editActivity)
router.post("/ManagerActivity/editactivity/:id", ActivityControlloer.posteditActivity)
router.get("/ManagerActivity/delactivity/:id", ActivityControlloer.delActivity)
//Resource
router.get("/ManagerResource", resourceControlloer.resourcePage)
router.get("/ManagerResource/addresource", resourceControlloer.addResource)
router.post("/ManagerResource/addresource/resource", resourceControlloer.PostaddResource)
router.get("/ManagerResource/editresource/:id", resourceControlloer.editResource)
router.post("/ManagerResource/editresource/:id", resourceControlloer.posteditResource)
router.get("/ManagerResource/delresource/:id", resourceControlloer.delResource)

router.get("*",backendController.notFound)
module.exports = router;