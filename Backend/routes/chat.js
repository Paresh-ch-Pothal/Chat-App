const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const router = express.Router();

router.post("/:id", fetchuser, async (req, res) => {
    const  userId  = req.params.id;
    if (!userId) {
        console.log("The other user is not selected");
        return res.json({ success: false, message: "No user is selected" });
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender", select: "name pic email",
    });

    if (isChat.length > 0) {
        return res.json(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            return res.status(200).json(FullChat);
        } catch (error) {
            return res.status(400);
        }
    }

})


router.get("/fetchchats",fetchuser,async(req,res)=>{
    try {
        Chat.find({
            users: {$elemMatch: {$eq: req.user.id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt: -1})
            .then(async(results)=>{
                results=await User.populate(results,{
                    path: "latestMessage.sender",
                    select: "name pic email",
                })
                return res.status(200).json({success: true,results});
            
        })
        // const userId=req.user.id;
        // let chat=await Chat.find({users: {$elemMatch: {$eq: userId}}})
        // .populate("users","-password").populate('latestMessage')

        // chat = await User.populate(chat, {
        //     path: "latestMessage.sender",
        //     select: "name pic email",
        // });
        // return res.json(chat);
    } catch (error) {
        return res.status(400).json({error: "some error has been occured"});
    }
})

router.get("/fetchchatsbyid/:chatId",async(req,res)=>{
    try {
        const chat=await Chat.findById(req.params.chatId).populate("latestMessage");
        return res.json(chat);
    } catch (error) {
        return res.status(400).json({error: "some error has been occured"});
    }
})

router.delete("/deletechat/:chatId",async(req,res)=>{
    try {
        const DeletedChat=await Chat.findByIdAndDelete(req.params.chatId)
        await Message.deleteMany({chat: req.params.chatId});
        return res.json(DeletedChat);
    } catch (error) {
        return res.status(400).json({error: "some error has been occured"});
    }
})

module.exports = router;