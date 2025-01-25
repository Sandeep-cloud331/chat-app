import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import becypt from "bcryptjs";
export const signup = async(req, res) => {
  const{fullName, email,password} = req.body;
  try {
    if(!fullName || !email ||!password){
      return res.status(400).json({message: "All fields are required"});

    }
    //hash password
    if(password.length <6){
      return res.status(400).json({message: "password must be atleast 6 character"});
    }
    const user = await User.findOne({email});

    if(user){ return res.status(400).json({message:"user already exist"});}

    const salt = await becypt.genSalt(10);
    const hashedPassword = await becypt.hash(password,salt);

    const newUser = new User({
      fullName,
      email,
      password:hashedPassword,
      profilePic :'https://res.cloudinary.com/drmrp5jb1/image/upload/v1737835062/OIP_qspvhe.jpg'
    })
    if(newUser){
      //jwt token
      generateToken(newUser._id,res)
      await newUser.save();
      console.log("user has been created");
      
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
    });

    }else{
      return res.status(400).json({message: "invalid user"});
      
    }

    
  } catch (error) {
    console.log("error " + error);
    
    res.status(500).json({message:"Internal Server Error"});  
  } 
};

export const login = async(req, res) => {
  const{email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json(({message:"Invalid credentials"}))
    }
    const isPasswordCorrect = await becypt.compare(password ,user.password);
    if(!isPasswordCorrect){
      return res.status(400).json(({message:"Invalid credentials"}))
    }
    generateToken(user._id,res);
    res.status(200).json({message:"done",
      _id:user._id,
      fullName : user.fullName,
      email: user.email,
      profilePic:user.profilePic,
    })

  } catch (error) {
    console.log("error in logIn controller "+ error);
    return res.status(500).json({message:"Internal Server Error"});
    
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0} );
    return res.status(200).json({message:"Logged out successfully"});

  } catch (error) {
    console.log("error "+ error);
    return res.status(500).json({message:"Internal Server Error"});
    
  }
};

export const updateProfile = async (req, res) =>{
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload with transformations to limit size or dimensions
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics", // Optional: Organize images in folders
      transformation: [
        { width: 1024, height: 1024, crop: "limit" }, // Resize if needed
      ],
    });

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkAuth = (req,res)=>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error",error);
    res.status(500).json({message:"internal server error"});
    
  }
}