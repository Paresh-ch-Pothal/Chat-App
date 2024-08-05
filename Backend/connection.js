const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    return (
        await mongoose.connect("mongodb://localhost:27017/chat-app-react").then(()=>{
            console.log("MongoDb is connected Successfully");
        }).catch(()=>{
             console.log("Some error is occured");
        })
    )
}

module.exports={connectToMongoDB};