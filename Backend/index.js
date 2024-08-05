const express = require("express");
const { connectToMongoDB } = require("./connection");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express()



app.use(cors());
app.use(express.json());
app.use((bodyParser.json()))



const PORT = 5000
connectToMongoDB();
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})
io.on("connection", (socket) => {
    console.log("Connected to socket io");
    socket.on('setup', (userDataId) => {
        socket.join(userDataId)
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined the room: " + room);
    })

    socket.on("new message", (newMessageReceived) => {
        // console.log("New message received:", newMessageReceived);

        // Ensure the message structure is correct
        if (!newMessageReceived || !newMessageReceived.chat || !newMessageReceived.chat.users) {
            return ;
        }

        let chat = newMessageReceived.chat;
        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
})
