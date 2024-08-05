const mongoose=require("mongoose");
const ChatSchema=new mongoose.Schema({
    chatName: {
        type: String,
        required: true
    },
    isGroupChat: {
        type: Boolean,
        default: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},{
    timestamps: true
})

const Chat=mongoose.model('chat',ChatSchema);
module.exports=Chat;