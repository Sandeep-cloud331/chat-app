import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar =async(req,res)=>{
  try {
    const loggedIdUserId = req.user._id;
    const filterUsers = await User.find({_id:{$ne:loggedIdUserId}}).select("-password");
    res.status(200).json(filterUsers)
  } catch (error) {
    console.error("error",error);
    res.status(500).json({error:"internal server error"})
  }
}

export const getMeassages = async(req,res)=>{
  try{
    const{id:userTochatId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or:[
        {senderId:myId, recieverId: userTochatId},
        {senderId:userTochatId,recieverId:myId}
      ],
    });
    res.status(200).json(messages);
  }
  catch(error){
    console.log("error",error.message);
    res.status(500).json({error:"Internal server error"})
    
  }
};
export const sendMessage = async(req,res)=>{
  try {
    const{text,image} = req.body;
    const{id:recieverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMeassage = new Message({
      senderId,
      recieverId,
      text,
      image:imageUrl,
    });

    await newMeassage.save();

    //realtime functionality goes here => socket.io
    const recieverSocketId = getRecieverSocketId(recieverId);
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage",newMeassage);
    }


    res.status(200).json(newMeassage)
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({error:"internal server error"})
    
  }
}

