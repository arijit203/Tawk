const express=require("express")

const router=express.Router()

const authController=require("../controllers/auth");

const userController=require("../controllers/user");


router.post("/update-me",authController.protect,userController.updateMe);

router.get("/get-users",authController.protect,userController.getUsers); // trying to find users that are not alreadry friend
router.get("/get-friends",authController.protect,userController.getFriends); 
router.get("/get-friend-requests",authController.protect,userController.getRequests); 



module.exports=router;

