import React, { useEffect, useState } from 'react'
import axios from "axios";
import './Chat.css'
const Chatstart = (props) => {
    const { setchat, chat, username } = props;
    const [questions, setQuestions] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchQuestionData = async () => {
        try {
            const res = await axios.get("https://work-u0a5.onrender.com/api/v1/questions/getQuestions", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            setQuestions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {

        fetchQuestionData();
    }, []);
    return (
        <>
            {questions.length != 0 && <div class="flex w-full mt-5 space-x-3 max-w-xs flex-col">
                <text className='ml-[12px]'>{username}</text>
                <div className=''>
                    <div class="box">
                        <p class="text-sm">Hello, How Can I help you?</p>
                    </div>
                    <div className=''>
                        {
                            questions.map((x) => {
                                return <>

                                    <button class="box" onClick={() => {
                                        setchat([...chat, { chat_flag: '0', msg: x.answer, room: "", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "", name: "Chatbot" }])

                                    }}>
                                        {x.question}
                                    </button >

                                </>
                            })
                        }
                        <button class="box" onClick={() => {
                            setchat([...chat, { chat_flag: '0', msg: null, room: "", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "" }])

                        }}>
                            Contact Support Team?
                        </button >
                    </div>



                </div>
            </div >}
        </>
    )
}

export default Chatstart