import React, {Component, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom'
import './Manager.css';
import M from 'materialize-css'

// eslint-disable-next-line no-undef
const db = firebase.firestore()
db.settings({})

export const Manager = () => {

    const [users, setUsers] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        apartment: '',
        check_in: '',
        permission: ''
    });

    useEffect(() => {
        const unsubscribe = db.collection("users")
            .onSnapshot(snapshot => {
                const updatedUsers = [];
                snapshot.forEach(user => {
                    updatedUsers.push({ id: user.id, ...user.data() });
                });
                setUsers(updatedUsers);
            });

        return () => unsubscribe();
    }, [])

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const { apartment, name, username, password, check_in, phone, email, permission } = formValues;

        db.collection("users")
            .add({
                apartment,
                name,
                username,
                password,
                check_in,
                phone,
                email,
                permission
            })
            .then(() => {
                console.log("Request successful");
                setFormValues({
                    ...formValues,
                    apartment: '',
                    name: '',
                    username: '',
                    password: '',
                    check_in: '',
                    phone: '',
                    email: '',
                    permission: ''
                });
            })
            .catch(error => {
                console.error("Error adding users!", error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    return (
        <div className="row">
            <section id="add_user">
                <h4 className="center"><b>New User</b></h4>
                <form id="user_form" className="col s12">
                    <div className="row">
                        <div className="input-field col s4 offset-s2">
                            <i className="material-icons prefix">assignment_ind</i>
                            <input value={formValues.name} onChange={handleInputChange} id="new_user_name" name="name" type="text" className="validate" placeholder="Enter name..."/>
                            <label htmlFor="new_user_name">User's Name</label>
                        </div>
                        <div className="input-field col s4">
                            <input name="apartment" value={formValues.apartment} onChange={handleInputChange} id="new_user_apartment" type="text" className="validate" />
                            <label htmlFor="new_user_apartment">Apartment</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4 offset-s2">
                            <i className="material-icons prefix"></i>
                            <input value={formValues.email} onChange={handleInputChange} id="new_user_email" name="email" type="text" className="validate"/>
                            <label htmlFor="new_user_email">Email</label>
                        </div>
                        <div className="input-field col s4">
                            <input value={formValues.phone} onChange={handleInputChange} id="new_user_phone" type="text" className="validate" name="phone" />
                            <label htmlFor="new_user_phone">Phone Number</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4 offset-s2">
                            <i className="material-icons prefix"></i>
                            <input name="username" value={formValues.username} onChange={handleInputChange} id="new_user_username" type="text" className="validate"/>
                            <label htmlFor="new_user_username">Username</label>
                        </div>
                        <div className="input-field col s4">
                            <input name="password" value={formValues.password} onChange={handleInputChange} id="new_user_password" type="text" className="validate" />
                            <label htmlFor="new_user_password">Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4 offset-s2">
                            <i className="material-icons prefix"></i>
                            <input name="permission" value={formValues.permission} onChange={handleInputChange} id="new_user_permission" type="text" className="validate"/>
                            <label htmlFor="new_user_permission">Permissions</label>
                        </div>
                        <div className="input-field col s4">
                            <input name="check_in" value={formValues.check_in} onChange={handleInputChange} id="new_user_date" type="text" className="validate" />
                            <label htmlFor="new_user_date">Check-In Date</label>
                        </div>
                    </div>
                    <div className="center">
                        <a className="wave-effect waves-light btn blue darken-2" type="submit" name="request_form" onClick={handleFormSubmit}>Submit</a>
                    </div>
                    <hr/>
                </form>
            </section>
            <section id="user_list">
                <h3 className="center" id="user_title"><b>All Users</b></h3>
                <ul className="collection">
                    {users.map(user => (
                        <li key={user.id} className="collection-item avatar" data-id={user.id}>
                            <img className="circle" src={user.photo} alt="request" />
                            <span className="title">{user.name} - {user.permission}</span>
                            <p className="grey-text">
                                Apartment {user.apartment}
                            </p>
                            <p className="grey-text">
                                Move-In Date: {user.check_in}
                            </p>
                            <p className="grey-text">
                                Username: {user.username} / Password: {user.password}
                            </p>
                            <p className="grey-text">
                                Email: {user.email} / Phone Number: {user.phone}
                            </p>
                            <i className="material-icons black-text secondary-content">edit</i>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}