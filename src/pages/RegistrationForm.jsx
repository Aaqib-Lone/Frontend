import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './RegistrationForm.css';
import axios from 'axios';
const RegistrationForm = () => {

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
            const res = await axios.post("https://work-u0a5.onrender.com/api/v1/users/addUser", { ...data, designation: '1' });
            if (res.status == 200) {
                alert("Registration Successful!");

            } else {
                alert("Registration Failed Please try again!")
            }
        } catch (e) {
            console.log(e);
        }
    }



    return (
        <div className='body'>
        <div className="container">
            <div className="title">Registration</div>
            <div className="content">
                <form>
                    <div className="user-details">
                        <div className="input-box">
                            <span className="details">Full Name</span>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your name"
                                required
                                onChange={(e) => {
                                    setdata({ ...data, name: e.target.value })
                                }} />
                        </div>
                        <div className="input-box">
                            <span className="details">Employee ID</span>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                maxLength={5}
                                required
                                onChange={(e) => {
                                    setdata({ ...data, username: e.target.value })
                                }} />
                        </div>
                        <div className="input-box">
                            <span className="details">Email</span>
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                                required
                                onChange={(e) => {
                                    setdata({ ...data, username: e.target.value })
                                }} />
                        </div>
                        <div className="input-box">
                            <span className="details">Phone Number</span>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter your number"
                                maxLength={10}
                                required
                                onChange={(e) => {
                                    setdata({ ...data, password: e.target.value })
                                }} />
                        </div>
                        <div className="input-box">
                            <span className="details">Password</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]){8,}'
                                required
                                onChange={(e) => {
                                    setdata({ ...data, password: e.target.value })
                                }} />
                        </div>
                        <div className="input-box">
                            <span className="details">Confirm Password</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                required
                                onChange={(e) => {
                                    setdata({ ...data, confirmPassword: e.target.value })
                                }} />
                        </div>
                    </div>
                    {/* <div className="gender-details">
                        <input
                            type="radio"
                            name="gender"
                            id="dot-1"
                            value="Male"
                            onChange={handleChange}
                        /> */}
                        {/* <input
                            type="radio"
                            name="gender"
                            id="dot-2"
                            value="Female"
                            onChange={handleChange}
                        /> */}
                        {/* <input
                            type="radio"
                            name="gender"
                            id="dot-3"
                            value="Prefer not to say"
                            onChange={handleChange}
                        /> */}
                        {/* <span className="gender-title">Gender</span>
                        <div className="category">
                            <label htmlFor="dot-1">
                                <span className="dot one"></span>
                                <span className="gender">Male</span>
                            </label>
                            <label htmlFor="dot-2">
                                <span className="dot two"></span>
                                <span className="gender">Female</span>
                            </label>
                            <label htmlFor="dot-3">
                                <span className="dot three"></span>
                                <span className="gender">Prefer not to say</span>
                            </label>
                        </div> */}
                    {/* </div> */}
                    <div className="button">
                        <input type="submit" value="Register" />
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default RegistrationForm;