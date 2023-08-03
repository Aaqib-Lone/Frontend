import React, { useEffect } from 'react'
import Chatbot from './Chatbot/Chatbot'
import './Chatbot/Chat.css'

import { useLocation, useNavigate } from "react-router-dom";

const User = (props) => {
    let { socket } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    useEffect(() => {



    }, [])
    return (
        <>
            {user && user.designation && <>

                <div>
                <h4 contenteditable data-heading="Folded" className="text">Hey Welcome to SBI Life Support Desk</h4>
        <p contenteditable data-heading="Folded" className="text2">We are here to solve your queries, you can chat, call or video call our support member in order to get query solved. We are open 24x7</p>
                </div>
            </>}
        </>

    )
}

export default User