// import React from 'react';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt, faVideo, faComment } from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Chatbot from './Chatbot/Chatbot'
import { VideoCallContext } from '../contexts/VideoCallContext'
import { ChatBotContext } from '../contexts/ChatBotContext'
import { UserContext } from '../contexts/UserContext'
import Peer from "simple-peer"
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";


const Suppdash = (props) => {
  let { socket } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [req, setReq] = useState([]);
  const [onlineUsers, setonlineUsers] = useState(0);
  const [onlineSupport, setonlineSupport] = useState(0);
  
  const { currUser, setcurrUser } = useContext(UserContext);
  
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  const { room, setRoom, vis, setvis, chat, setchat, disconnectVis, setdisconnectVis, support_log, setLog } = useContext(ChatBotContext)
  //video call states
  const { callAccepted, setCallAccepted, stream, setStream, myVideo, userVideo, connectionRef, setName, setCallerSignal, setReceivingCall, setCaller } = useContext(VideoCallContext);

  const joinRoom = (name, username) => {
      socket.emit("join_room", { room: `${name}@${username}`, username: currUser.username });
      setRoom(`${name}@${username}`);
  }
  const fetchReq = async () => {
      try {
          const res = await axios.get("https://work-u0a5.onrender.com/api/v1/support/getSupport", {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          });
          console.log(res.data)
          setReq(res.data);
  
      } catch (e) {
          console.log(e);
      }
  }
  const fetchOnlineUsers = async () => {
      try {
          const res1 = await axios.get("https://work-u0a5.onrender.com/api/v1/users/onlineUsers", {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          });
          const res2 = await axios.get("https://work-u0a5.onrender.com/api/v1/users/onlineCustomerSupport", {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          });
          setonlineUsers(res1.data);
          setonlineSupport(res2.data);
  
      } catch (e) {
          console.log(e);
      }
  
  }
  
  const handleReq = async (req_id, name, username, email, phone_no, socket_id) => {
      if (disconnectVis) {
          alert("Please Disconnect from previous User")
      } else {
          try {
              const res = axios.post("https://work-u0a5.onrender.com/api/v1/support/delete", { email: email, support_flag: req_id }, {
                  headers: {
                      Authorization: `Bearer ${user.token}`
                  }
              })
  
          } catch (e) {
              console.log(e);
  
          }
          setvis(1);
          setdisconnectVis(1);
          joinRoom(name, username);
          socket.emit("supportReq");
          if (req_id == '0') {
  
  
  
              setchat([...chat, { chat_flag: "0", msg: `You are now chatting with ${name}. Info related to the User is as follows:Username:${username} & Email:${email}`, room: "", date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "" }]);
  
  
              setLog({ ...support_log, support_user: currUser.name, req_user: name, support_req: "Chat", start_time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}` })
  
          } else if (req_id == '1') {
  
  
              socket.emit("getUsers");
              socket.on("users", (users) => {
                  console.log("it workded!!");
                  console.log(users);
                  navigate('/videocall', { state: { id: users[username], designation: '1', name: name } });
              })
              setLog({ ...support_log, support_user: currUser.name, req_user: name, support_req: "Videocall", start_time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}` })
          } else {
  
              joinRoom(name, username);
              setchat([...chat, { chat_flag: "0", msg: `The Contact Details of the User are as follows:\nName:${name}\nUsername:${username}\nemail:${email}\nContact No. ${phone_no}`, room: "", date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "ChatBot" }]);
              setLog({ ...support_log, support_user: currUser.name, req_user: name, support_req: "Call", start_time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}` })
  
  
  
          }
      }
  
  
  }
  
  useEffect(() => {
      socket.on("refreshSupportReq", () => {
          console.log("refreshed!!")
          fetchReq();
      })
  
  
  }, [])
  
  
  useEffect(() => {
      fetchReq();
  }, [room])
  useEffect(() => {
      fetchOnlineUsers();
  }, [])
  
  
  const callData = [
    { id: 1, Phone_no: currUser.phone_no, customerName: user.name, status: 'Pending', requestType: 'call' },
    // Add more call data objects as needed
  ];
   // Function to get the appropriate icon based on the requestType
   const getRequestIcon = (requestType) => {
    switch (requestType) {
      case 'call':
        return <FontAwesomeIcon icon={faPhoneAlt} />;
      case 'video call':
        return <FontAwesomeIcon icon={faVideo} />;
      case 'chat':
        return <FontAwesomeIcon icon={faComment} />;
      default:
        return null;
    }
  };

  const flushReq = async () => {
      try {
          const res = await axios.post("https://work-u0a5.onrender.com/api/v1/support/deleteAll", { email: currUser.email }, {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          });
      } catch (e) {
          console.log(e);
      }

  }


  const setOnlineStatus = async (isonline) => {
    try {
        const res = await axios.put("https://work-u0a5.onrender.com/api/v1/users/setOnlineStatus", { email: currUser.email, isonline: isonline }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
    } catch (e) {
        console.log(e);
    }
    
  }
  
  const iconStyle = {
    transform: 'rotate(90deg)', // Adjust the degree to set the rotation angle
  };

  return (
    <>
    {user && user.designation && <>
    <div className="admin-dashboard">
      <div className="headers">
        <h1>Support Help-Desk</h1>
        <div className="logoss">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/SBI_Life.jpg" alt="Logo 1" />
          <div className="icon_div">
            <FontAwesomeIcon className="icon" icon={faBell} />
            <FontAwesomeIcon className="icon" icon={faSignOutAlt} onClick={() => {
                            localStorage.removeItem('user');
                            if (currUser.designation === '0') {
                                flushReq();
                            }

                            setOnlineStatus('0');
                            window.location = `${window.location.origin}/authentication`;
                        }} />
          </div>
        </div>
      </div>
      <div className="dashboard-stats">
        {/* Your dashboard stats code goes here */}
        
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Request Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
          {req.map((x) => {
            return <>


                        {/* {x.support_flag === '0' && <button class="bg-green-400 text-gray-50 min-w-[5rem] rounded-md p-[10px]" onClick={() => {
                            handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                        }}>Chat</button>}
                        {x.support_flag === '1' && <button class="bg-yellow-400 text-gray-50  rounded-md p-[10px] min-w-[5rem]" onClick={() => {
                            handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                        }}>Video call</button>}
                        {x.support_flag === '2' && <button class="bg-red-400 text-gray-50 min-w-[5rem] rounded-md p-[10px]" onClick={() => {
                            handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                        }}>Call</button>} */}

                {callData.map((call) => (
                  <tr key={call.id}>
                    <td>{x.email}</td>
                    <td>{x.phone_no}</td>
                    <td>{x.name}</td>
                    <td>{call.status}</td>
                    {x.support_flag === '0' &&<td>{<FontAwesomeIcon className='iconicsc' icon={faComment} style={{marginLeft:50, height:25, width:25}} onClick={() => {
                        handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                    }} />}</td>}
                    {x.support_flag === '1' &&<td>{<FontAwesomeIcon className='iconicsv' icon={faVideo} style={{marginLeft:50, height:25, width:25}} onClick={() => {
                        handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                    }} />}</td>}
                    {x.support_flag === '2' &&<td >{<FontAwesomeIcon className='iconicsa' icon={faPhoneAlt} style={{marginLeft:50, height:25, width:25}} onClick={() => {
                        handleReq(x.support_flag, x.name, x.username, x.email, x.phone_no, x.socket_id)
                    }} />}</td>}
                    <td>{x.date_added}</td>
                  </tr>
                ))}

            </>
        })}



          </tbody>
        </table>
      </div>
    </div>
    </>}
    </>
  );
};

export default Suppdash;
