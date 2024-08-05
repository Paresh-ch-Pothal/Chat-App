const express=require("express");
const Message=require("../models/message");
const User=require("../models/user");
const Chat=require("../models/chat");
const router=express.Router();
const fetchuser=require("../middleware/fetchuser");

//:: sending the messages
router.post("/:chatId",fetchuser,async(req,res)=>{
    const {content}=req.body;
    if(!content){
        return res.status(400).json({ success: false, error: "Content is required" });

    }
    let newMessages={
        sender: req.user.id,
        content: content,
        chat: req.params.chatId
    }

    try {
        let message=await Message.create(newMessages);
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path: "chat.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.params.chatId,{
            latestMessage: message
        })
        return res.json(message);
    } catch (error) {
        return res.status(400).json({success: false,error: "Some error has been occured"});
    }
})

router.get("/allmessages/:chatId",fetchuser,async(req,res)=>{
    try {
        const message=await Message.find({chat: req.params.chatId}).populate("sender","name pic email").populate("chat");

        return res.json(message);
    } catch (error) {
        return res.status(400).json({success: false,error: "Some error has been occured"});
    }
})

module.exports=router