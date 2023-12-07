import {NavLink, useNavigate} from "react-router-dom";
import React, {Component, useState} from "react";
import './Login.css';
import M from 'materialize-css';

const firebaseConfig = {
    apiKey: "AIzaSyCfAGznMGU5MkQwSyB-dK0k1Mhe_gA0vP4",
    authDomain: "cmpsc487project3.firebaseapp.com",
    projectId: "cmpsc487project3",
    storageBucket: "cmpsc487project3.appspot.com",
    messagingSenderId: "168828655878",
    appId: "1:168828655878:web:e63937003a57343e1d2687",
    measurementId: "G-1FHNJM9ET0"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const db = firebase.firestore()
db.settings({})

export const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let aptNum = '';

    let navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("form submitted");

        console.log("Username:", username, "Password:", password);

        try {
            const snapshot = await db.collection('users').where('username', '==', username).get();

            snapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                console.log(userData.permission)
                if (userData.password === password) {
                    console.log("Permission:",userData.permission)
                    aptNum = userData.apartment
                    switch (userData.permission) {
                        case 'tenant':
                            navigate("/tenant", { state: { username, aptNum }})
                            break;
                        case 'maintenance':
                            navigate("/maintenance")
                            break;
                        case 'manager':
                            navigate("/manager")
                            break;
                        default:
                            console.error('Permission Error');
                            break;
                    }
                } else {
                    console.error('Invalid password');
                }
            });
        } catch {
            console.error('Login Error');
        }
    }

    return (
        <div className="row" id="login">
            <h3 className="center"><b>Login</b></h3>
            <p className="center">Please sign in to continue...</p>
            <form id="login_form" className="col s12">
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <i className="material-icons prefix">account_circle</i>
                        <input placeholder="Enter username..." id="user_name" type="text" className="validate" onChange={(e)=>setUsername(e.target.value)}/>
                        <label htmlFor="user_name">Username</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <i className="material-icons prefix">lock</i>
                        <input placeholder="Enter password..." id="password" type="password" className="validate" onChange={(e)=>setPassword(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="center">
                    <a className="wave-effect waves-light btn blue darken-2" type="submit" name="login_form" onClick={handleLogin}>Login</a>
                </div>
            </form>
        </div>
    )
}