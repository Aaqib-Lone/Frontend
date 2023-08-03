import React, {useState, useEffect} from 'react'
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Logss = () => {


  const [logs, setlogs] = useState([]);
    let count = 0;
    const user = JSON.parse(localStorage.getItem('user'));
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


    const callData = [
      { id: 1, memberName: 'John Doe', customerName: 'John Doe', reqType: 'Call', startTime: '2023-07-18 10:30 AM', endTime: '2023-07-18 11:15 AM' ,description: 'About policy' , status: 'Attended'},
    ];
  return (
    <div className="admin-dashboard">
      <div className="table-container">
        <table>
          <thead>

            <tr>
              <th><input type="text" placeholder="Search..." className="search-input" /></th>
              <th><FontAwesomeIcon className='' icon={faSort} title='Sort' /></th>
            </tr>
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
            </>})}
          </tbody>
        </table>


      </div>
    </div>
  )
}

export default Logss;