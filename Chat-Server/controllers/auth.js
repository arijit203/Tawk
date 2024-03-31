const jwt = require("jsonwebtoken");

const User = require("../models/user");
const filterObj = require("../utils/filterObject");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const { promisify } = require("util");
const mailService = require("../services/mailer");
const htmlotp = require("../templates/mail/otp");
const resetPassword=require("../templates/mail/resetPassword")

// this function will return you jwt token
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

//Register a New User ( register --> sendOTP ---> VerifyOTP)

//http://api.tawk.com/auth/register
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password"
  );

  // check if a verified user with given email exists

  const existing_user = await User.findOne({ email: email });

  if (existing_user && existing_user.otpVerified) {
    // user with this email already exists, Please login
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  } else if (existing_user) {
    // if not verified than update prev one

    await User.findOneAndUpdate({ email: email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    // generate an otp and send to email
    req.userId = existing_user._id;
    next();
  } else {
    // if user is not created before than create a new one
    const new_user = await User.create(filteredBody);

    // generate an otp and send to email
    req.userId = new_user._id;
    next();
  }
};

exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  console.log(new_otp);

  //now send the email
  mailService
    .sendGmail({
      from: "arijit.saha1373@gmail.com",
      to: user.email,
      subject: "Verification OTP",
      text: `Your OTP is ${new_otp}. This is valid for 10 Mins.`,
      html: htmlotp(user.firstName, new_otp),
      attachments: [],
    })
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "OTP sent successfully!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "Error due to OTP",
        message: err,
      });
    });
};

exports.verifyOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  console.log("Email",email, " otp: ",otp)
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400).json({
      status: "error",
      message: "OTP expired",
    });
    return;
  }

  if (otp != user.otp) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
    return;
  }

  //OTP is correct
  user.otpVerified = true;
  user.otp = undefined;
  user.otp_expiry_time = undefined;
  await user.save({ new: true, validateModifiedOnly: true });
  const token = signToken(user._id); //creating a JWT toke for the user to be logged in

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    token: token,
    user_id:user._id
  });
};

//Login a Existing USer
exports.login = async (req, res, next) => {
  //contains the business logic

  const { email, password } = req.body;

  if (email==null || password==null) {
    res.status(400).json({
      status: "Error",
      message: "Both Email and password is required",
    });
    return;
  }

  const user = await User.findOne({ email: email });
 
  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(400).json({
      status: "Error",
      message: "Email or Password is Incorrect",
    });
    return;
  } else if (!user.otpVerified) {
    res.status(400).json({
      status: "error",
      message: "Email not Verified",
    });
    return;
  }

  const token = signToken(user._id); //creating a JWT toke for the user to be logged in

  res.status(200).json({
    status: "success",
    message: "Logged in Successfully",
    token,
    user_id:user._id
  });
};

//Two types of routes -->Protected (Only logged in users can access) and Unprotected
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token)

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please log in to get access.",
      });
    }
    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    console.log(decoded);
  
    // 3) Check if user still exists
  
    const this_user = await User.findById(decoded.userId);
    if (!this_user) {
      return res.status(401).json({
        message: "The user belonging to this token does no longer exists.",
      });
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = this_user;
    next();
  }
};



exports.forgotPassword = async (req, res, next) => {
  //take user's email as input
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({
      status: "Error",
      message: "No User with given email address",
    });
    return;
  }
  if(!user.otpVerified){
  
    res.status(404).json({
      status: "Error",
      message: "Email is not verified",
    });
    return;
  }

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;

  try {
    await mailService.sendGmail({
      from: "arijit.saha1373@gmail.com",
      to: user.email,
      subject: "Password Reset Link",
      html: resetPassword(user.firstName, resetURL),
      attachments: [],
    });
  
    res.status(200).json({
      status: "success",
      message: "Password Reset Link sent successfully!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
  
    await user.save({ validateBeforeSave: false });
  
    res.status(500).json({
      status: "error",
      message: "There was an error sending the email, Please Try again",
    });
  }
  
};



  exports.resetPassword = async (req, res, next) => {
    // 1) Get user based on the token
    console.log(req.body.password," ",req.body.passwordConfirm)
    if (req.body.password !== req.body.passwordConfirm) {
        return res.status(400).json({
          status: "error",
          message: "Password and Confirm Password do not match",
        });
      }
  
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is Invalid or Expired",
      });
    }
    user.password = req.body.password;
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = signToken(user._id);
  
    res.status(200).json({
      status: "success",
      message: "Password changed Successfully",
      token,
    });
  };