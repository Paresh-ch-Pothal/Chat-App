import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

export default function Home() {

  const host = "http://localhost:5000";
  const [users, setusers] = useState([])
  const token = localStorage.getItem("token");
  const currentUserId = jwtDecode(token).user.id;
  const [fetchchats, setFetchchats] = useState([]);
  const [chatuser, setchatuser] = useState({
    name: "", pic: "", latestMessage: "",
  })
  const [chatId, setchatId] = useState();
  const [messages, setmessages] = useState([])
  const [newMessage, setnewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [chat, setchat] = useState([])
  const [latestMessage, setlatestMessage] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', currentUserId);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        return;
      }
      setmessages(prevMessages => [...prevMessages, newMessageReceived]);
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  const allMessages = async () => {
    if (!chat) return;
    try {
      const response = await fetch(`${host}/api/message/allmessages/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
      })
      const json = await response.json();
      setmessages(json);
      console.log(json);
      console.log(currentUserId)
      socket.emit('join chat', chatId);
    } catch (error) {

    }
  }

  useEffect(() => {
    if (chatId) {
      allMessages();
      fetchChatsById();
      selectedChatCompare = chat;
    }
  }, [chatId, chat]);

  // useEffect(() => {
  //   socket.on("message received", (newMessageReceived) => {
  //     if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {

  //     }
  //     setmessages(prevMessages => [...prevMessages, newMessageReceived]);
  //     // setmessages([...messages,newMessageReceived]);
  //   })
  // }, [])

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const response = await fetch(`${host}/api/message/${chatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          },
          body: JSON.stringify({ content: newMessage })
        })

        const json = await response.json();
        setnewMessage("");
        console.log(json);

        // setmessages(prevMessages => [...prevMessages, json]);
        socket.emit("new message", json);
        setmessages([...messages, json]);
        // window.location.reload();
      } catch (error) {
        console.log("Some error has been occured");
      }
    }
  }

  const typingHandler = (e) => {
    setnewMessage(e.target.value);
  }

  const getAllUsers = async () => {
    try {
      const response = await fetch(`${host}/api/user/getallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
      const json = await response.json();
      const sortedUsers = json.sort((a, b) => a.name.localeCompare(b.name));
      setusers(sortedUsers);
      // console.log(json);
    } catch (error) {
      console.log("Some error has been occured");
    }
  }



  const handleGetAccess = async (userId) => {
    const response = await fetch(`${host}/api/chat/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      }
    })
    const json = await response.json();
    window.location.reload();

    // console.log(json);
  }


  const fetchChats = async () => {
    try {
      const response = await fetch(`${host}/api/chat/fetchchats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      })
      const json = await response.json();
      setFetchchats(json.results);
      // console.log(currentUserId)
      // setlatestMessage(json.results.latestMessage);
      console.log(json.results);
    } catch (error) {

    }
  }

  const fetchChatsById = async () => {
    try {
      const response = await fetch(`${host}/api/chat/fetchchatsbyid/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }

      })
      const json = await response.json();
      console.log(json.latestMessage.content);
      setlatestMessage(json)

    } catch (error) {

    }
  }


  const handleMessage = (name, pic, id, chat) => {
    setchatuser({ name: name, pic: pic });
    console.log(id);
    setchatId(id);
    setchat(chat);
  }


  useEffect(() => {
    getAllUsers();
    fetchChats();
  }, [token])

  const handleDelete=async(chatiid)=>{
    try {
      const response = await fetch(`${host}/api/chat/deletechat/${chatiid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }

      })
      const json=response.json();
      console.log(json);
      window.location.reload();
    } catch (error) {
      
    }
  }




  return (
    <>
      <div style={{ display: "flex", overflow: 'hidden' }}>
        <div>
          <div className='container my-2'>



            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
              <div className="offcanvas-header">
                <h3 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Users</h3>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="list-group">
                  {users.map((user) => {
                    return (
                      <li key={user._id} onClick={() => { handleGetAccess(user._id) }} className="users-name list-group-item my-2" style={{ border: "1px solid black", display: "flex", cursor: "pointer" }}><span className='mr-4'><img src={user.pic} alt="" width="30" height="24" className="d-inline-block align-text-top" /></span>{user.name}</li>
                    )
                  })}

                </ul>
              </div>
            </div>
          </div>

          <div style={{ width: "30vw", height: "85vh", overflowY: "scroll", border: "1px solid black", display: "flex", flexDirection: "column", marginLeft: "10px" }}>
            <div className="container mt-3" style={{ display: "flex", justifyContent: 'space-between', height: "5vh" }}>
              <h2 className='text-center'>Your chats</h2>
              <button className="btn btn-success" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Add to your Chats</button>
            </div>
            <div>
              {fetchchats.map((chat) => {
                const chatUser = chat.users.find(user => user._id !== currentUserId)
                const len = chatUser.name.length * 8;

                return (
                  <li key={chat._id} onClick={() => { handleMessage(chatUser.name, chatUser.pic, chat._id, chat) }} className="users-name list-group-item my-2" style={{ display: "flex", cursor: "pointer", height: "60px", padding: "6px 10px" }}><span className='mr-4'><img src={chatUser.pic} alt="" width="30" height="24" className="d-inline-block align-text-top" /></span>
                    <div style={{ display: "flex", flexDirection: "column" }}><div><div style={{display: "flex"}}><div>
                      {chatUser.name}</div></div></div> <div className='users-name' style={{ color: "#1c1a1a", fontStyle: "italic" }}>{latestMessage._id == chat._id ? latestMessage.latestMessage.content : "No new Message"}</div></div></li>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ width: "68vw", height: "85vh", border: "1px solid black", display: "flex", flexDirection: "column", marginLeft: "10px", marginTop: "10px" }}>
          <div style={{ flexGrow: '1' }}>
            <nav className="navbar bg-body-tertiary">
              <div className="container-fluid">
                <a className="navbar-brand"><h2>{chatuser.name ? chatuser.name : "User"}</h2></a>
                <i className="fa-solid fa-trash my-1" onClick={()=>{handleDelete(chatId)}} style={{position: "relative",cursor: "pointer"}}></i>
                <a className="navbar-brand">
                  <img src={chatuser.pic ? chatuser.pic : "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"} alt="" width="30" height="30" />
                </a>
              </div>
            </nav>


            <div className='container' style={{ maxHeight: "70vh", overflowY: "scroll" }}>
              {messages.map((m) => {
                if (!m || !m.sender) {
                  // Handle the case where m or m.sender is undefined, if needed
                  return null; // or some placeholder component
                }

                return m.sender._id === currentUserId ? (
                  <div className='my-2' style={{
                    position: "relative", left: "52vw", border: "1px solid black", maxWidth: "20%", padding: "5px 12px", borderRadius: "20px", backgroundColor: "#8080804a", wordWrap: 'break-word', textAlign: "center"
                  }} key={m._id}>
                    {m.content}
                  </div>
                ) : (
                  <div className='my-2' style={{ border: "1px solid black", maxWidth: "20%", padding: "5px 12px", borderRadius: "20px", backgroundColor: "#bde5d4d1", wordWrap: 'break-word', textAlign: "center" }} key={m._id}>{m.content}</div>
                );
              })}
            </div>



            <div className="input-group mb-3" onKeyDown={sendMessage} style={{ position: "fixed", top: "89.5vh", width: "68vw" }}>
              <input onChange={typingHandler} type="text" className="form-control" placeholder="Message" aria-label="Message" value={newMessage} id='message' name='message' aria-describedby="basic-addon1" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
