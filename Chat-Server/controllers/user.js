const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const filterObj = require("../utils/filterObject");

exports.updateMe = async (req, res, next) => {
  const { user } = req;
  console.log(req.body);
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "Success",
    data: updated_user,
    message: "Profile Updated Successfully",
  });
};

exports.getUsers = async (req, res, next) => { //Fetching users from database that are not friends
  const all_users = await User.find({
    otpVerified: true,
  }).select("firstName lastName _id");

  const this_user = req.user;
  console.log(this_user)
  //filter all those users that are not alreadry our friends along with the user itself
  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );
    console.log("Get explored Users called:")
  res.status(200).json({
    status:"success",
    data:remaining_users,
    message:"Users found successfully!"
  })
};

exports.getRequests=async(req,res,next)=>{

    const requests=await FriendRequest.find({recipient:req.user._id}).populate("sender","_id firstName lastName");

    res.status(200).json({
        status:"success",
        data:requests,
        message:"Friends Requests found successfully!"
    })
}
exports.getFriends=async(req,res,next)=>{
    const this_user=await User.findById(req.user._id).populate("friends","_id firstName lastName");

    
    res.status(200).json({
        status:"success",
        data:this_user.friends,
        message:"Friends found successfully!"
    })


}