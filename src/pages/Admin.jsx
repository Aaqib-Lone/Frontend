import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RegistrationForm from './RegistrationForm'
import RegisterSupport from './RegisterSupport';
import Logss from './Logss';
import { FiLogOut } from 'react-icons/fi';
import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Chatbot from './Chatbot/Chatbot'
import { VideoCallContext } from '../contexts/VideoCallContext'
import Peer from "simple-peer"
import { UserContext } from '../contexts/UserContext'
import { BrowserRouter,Routes,Link, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { faBell, faPlus, faSignOutAlt,faUserCircle} from '@fortawesome/free-solid-svg-icons';
const Admin= (props) => {


    let { socket } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [onlineUsers, setonlineUsers] = useState(0);
    const [onlineSupport, setonlineSupport] = useState(0);

    const { currUser, setcurrUser } = useContext(UserContext);
    const [newQuestion, setnewQuestion] = useState({ question: "", answer: "" });
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
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


        const fetchUser = async () => {
        try {
            const res = await axios.get("https://work-u0a5.onrender.com/api/v1/users/getCurrUser", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log(res.data);

            setcurrUser(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const fetchQuestionData = async () => {
        try {
            const res = await axios.get("https://work-u0a5.onrender.com/api/v1/questions/getQuestions", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log("question fetched !");

            setQuestions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const addQuestion = async (newQuestion) => {
        try {
            const res = await axios.post("https://work-u0a5.onrender.com/api/v1/questions/addQuestion", newQuestion, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            fetchQuestionData();
        } catch (e) {

            console.log(e);
        }
    }


    useEffect(() => {

        fetchQuestionData();
    }, []);

    useEffect(() => {

        fetchUser();
        fetchOnlineUsers();
    }, [])

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

const [logs, setlogs] = useState([]);
    let count = 0;
    const fetchLogs = async () => {
        try {
            const res = await axios.get("https://work-u0a5.onrender.com/api/v1/history/getHistory", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setlogs(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {

        fetchLogs();
    }, [])


    let resolvedCount = 0
    let notResolvedCount = 0
      logs.forEach((jsonData) => {
    if (jsonData.status === "Resolved") {
      resolvedCount++
    }
    if (jsonData.status === "Not Resolved") {
      notResolvedCount++
    }
    });



  const callData = [
    { id: 1, memberName: 'John Doe', customerName: currUser.name, reqType: 'Call', startTime: '2023-07-18 10:30 AM', endTime: '2023-07-18 11:15 AM' ,description: 'About policy' , status: 'Attended'},
  ];
 

  // Function to count the number of calls with a specific status
  const countCallsByStatus = (status) => {
    return callData.filter((call) => call.status === status).length;
  };
  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="logos">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/SBI_Life.jpg" alt="Logo 1" />
       <div className='icon_div'>
        <FontAwesomeIcon className='icon' icon={faBell} title='Notifications' />

      <FontAwesomeIcon className='icon' icon={faPlus} title='Add Support member' onClick={() => {
                                navigate('/registersupport')
                            }}/>
        <FontAwesomeIcon className='icon' icon={faSignOutAlt} title='Logout' onClick={() => {
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

      <div className='user'>
      <FontAwesomeIcon className='user_icon' icon={faUserCircle} title='' />
        <h5 className='user_name'>Admin</h5>
      </div>
      
      <div className="dashboard-stats">
      <div className="stat">
          <h2>Current Traffic</h2>
          <p>{countCallsByStatus('Attended')}</p>
        </div>
        <div className="stat">
          <h2>Attended</h2>
          <p>{resolvedCount}</p>
        </div>
        <div className="stat">
          <h2>Pending</h2>
          <p>{notResolvedCount}</p>
        </div>
        <div className="stat">
          <h2>In-progress</h2>
          <p>{notResolvedCount}</p>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Call ID</th>
              <th>Support member name</th>
              <th>Customer name</th>
              <th>Request Type</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((x)=>{
              count++
              return <>
            {callData.map((call) => (
              <tr key={call.id}>
              <td>{count}</td>
              <td>{x.req_user}</td>
              <td>{x.support_user}</td>
              <td>{x.support_req}</td>
              <td>{x.start_time}</td>
              <td>{x.end_time}</td>
              <td>{call.description}</td>
              <td>{x.status}</td>
            </tr>
            ))}
            </>
            })}
          </tbody>
        </table>


      </div>
      <div>
      <button className='BtnLogs' onClick={() => {
        navigate('/logss')
    }} >See more..</button>
      </div>
    </div>
  );
};

export default Admin;
