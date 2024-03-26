import bcrypt from "bcryptjs"
import user from "../Model/user.model.js"
import mail from "../Service/nodemailer.js"
import jwt from "jsonwebtoken"
import {nanoid} from "nanoid"
export const createUser= async(req,res)=>{
    try {
        const{ FirstName,LastName,UserName,password}=req.body
        const hashPassword=await bcrypt.hash(password,10)
        const userRegister= new user({FirstName,LastName,UserName,password:hashPassword})
        await userRegister.save()
        console.log(userRegister);
        res.status(200).json({message:"user created successfully",user:user})
        
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
}
export const loginUser = async (req, res) => {
  try {
    const { UserName, password } = req.body;
    const userLogin = await user.findOne({ UserName });
    if (!userLogin) {
      return res.status(401).json({ message: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(password, userLogin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "invalid password" });
    }
    const token = jwt.sign({ _id: userLogin._id }, process.env.JWT_SECRET);
    userLogin.token = token;
    await userLogin.save();
    res.status(200).json({ message: "login successful" ,token:token});
  } catch (error) {
    res.status(500).json({ errormessage: "internal server error" });
  }
};
export const forgotPassword = async (req, res) => {
  const { UserName } = req.body;
  const userlogin = await user.findOne({ UserName});
  if (!userlogin) {
    return res.status(404).json({ message: "User not found" });
  }
  const token=jwt.sign({_id:userlogin._id},process.env.JWT_SECRET)
   userlogin.token=token
   await userlogin.save()
  mail(UserName,token);
};
// Endpoint to handle password reset
export const resetpassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Find user by reset token
  const userReset = await user.findOne({ token:token });
  if (!userReset) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // Update user's password and clear reset token
  userReset.password = newPassword;
  userReset.token = null;

  await userReset.save();

  res.status(200).json({ message: "Password reset successfully" });
};
export const shortenUrl=async(req,res)=>{
  const { originalURL } = req.body;
  const alias = nanoid(7)
  shortenUrl[alias]= originalURL;
  res.json({ shortenedURL: `http://localhost:3000/${alias}` });
}

