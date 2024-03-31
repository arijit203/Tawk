const express=require("express")

const router=express.Router()

const authRoute=require("./authRoute");

const userRoute=require("./userRoute");

router.use("/auth",authRoute);

router.use("/user",userRoute);

router.get("/under", (req, res) => {
    console.log("/under got called");
    // You can perform any desired operations here
    res.send("Response from /under route");
});

module.exports=router;