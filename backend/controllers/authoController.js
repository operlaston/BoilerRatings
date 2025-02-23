const crypto = require("crypto");
const User = require("../models/user")
const sendEmail = require("../utils/email");

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  
    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    const user = new User({
      email,
      password, 
      verificationCode,
      codeExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
  
    await user.save();
  
    await sendEmail(email, verificationCode);
  
    res.json({ message: "Verification code sent to your email" });
  };

  exports.verifyCode = async (req, res) => {
    const {email, code} =  req.body;
    const user = await User.findOne({
        email,
        verificationCode: code,
        codeExpires: {$gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({message: "Wrong or expried code"});
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully"});
  }