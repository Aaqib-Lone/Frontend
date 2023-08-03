import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Register = (props) => {
    const { settoggle } = props;
    const naviagte = useNavigate();
    const [data, setdata] = useState({ name: "", username: "", email: "", password: "", phone_no: "", profile_image: "" });
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    const handleRegister = async (data) => {
        try {
            if(data.password==='' || data.email===''){
                alert('Enter info')
            }else{
                const res = await axios.post("https://work-u0a5.onrender.com/api/v1/users/addUser", { ...data, designation: '1' });
                if (res.status == 200) {
                    alert("Registration Successful!");
                    settoggle(1);
                } else {
                    alert("Registration Failed Please try again!")
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const [passwordShown, setPasswordShown] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

    return (
        <>

            <div className="bg-gray-50 h-screen flex items-center justify-center  bg-gradient-to-r from-orange-500 to-red-400 to-rose-600 to-pink-600 ">
                {/* <!-- login container --> */}
                <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-[3rem] items-center">
                    {/* <!-- form --> */}
                    <div className="md:w-1/2 px-8 md:px-16">
                        <h2 className="font-bold text-3xl text-[black]">Register</h2>

                        <div className="flex flex-col gap-4">
                            <input className="p-2 mt-8 rounded-xl border" type="text" name="name" placeholder="Name" onChange={(e) => {
                                setdata({ ...data, name: e.target.value })
                            }} />
                            <input className="p-2  rounded-xl border" type="text" name="username" placeholder="Username" onChange={(e) => {
                                setdata({ ...data, username: e.target.value })
                            }} />
                            <input className="p-2  rounded-xl border" type="email" name="email" placeholder="Email" onChange={(e) => {
                                setdata({ ...data, email: e.target.value })
                            }} />
                            <input className="p-2  rounded-xl border" type="tel" name="phone_no" placeholder="Phone No." maxLength={10} onChange={(e) => {
                                setdata({ ...data, phone_no: e.target.value })
                            }} />
                            <div className="relative">
                                <input className="p-2 rounded-xl border w-full" type={passwordShown ? "text" : "password"} name="password" placeholder="Password" onChange={(e) => {
                                    setdata({ ...data, password: e.target.value })
                                }} />
                                <svg onClick={togglePassword} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                </svg>
                            </div>

                            <button className=" ml-0 mt-2 bg-gradient-to-r from-orange-500 to-red-400 to-rose-600 to-pink-600 rounded-xl text-white py-2 hover:scale-105 duration-300" onClick={() => {
                                handleRegister(data);
                            }}>Register</button>
                        </div>
                        {/* <div className="mt-3 text-ls flex justify-between items-center text-[#ab3a5a]">
                            <p>Already Have an Account?</p>
                            <button className="ml-5 mt-2 py-2 px-5 bg-white border rounded-xl hover:scale-105 duration-300" onClick={() => {
                                naviagte('admin')
                            }} >Login</button>
                        </div> */}
                    </div>

                    {/* <!-- image --> */}
                    <div className="md:block hidden w-1/2">
                        <img className="rounded-2xl" src='https://www.infomazeelite.com/wp-content/uploads/2022/02/Outsource-IT-Help-Desk-Services.png' />
                    </div>
                </div>
            </div>



        </>
    )
}

export default Register