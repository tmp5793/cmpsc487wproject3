import React, {Component, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom'
import './Tenant.css';
import M from 'materialize-css'

const form = document.getElementById('request_form')

// eslint-disable-next-line no-undef
const db = firebase.firestore()
db.settings({})

export const Tenant = () => {
    const getDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}/${date}/${year}`;
    };

    const location = useLocation();
    const username = location.state && location.state.username;
    const apartmentNumber = location.state && location.state.aptNum;

    const [requests, setRequests] = useState([]);
    const [formValues, setFormValues] = useState({
        apartment: apartmentNumber,
        request_time: getDate(),
        area: '',
        description: '',
        photo: '',
        status: 'Pending'
    });

    useEffect(() => {
        const unsubscribe = db.collection("requests")
            .where("apartment", "==", apartmentNumber)
            .onSnapshot(snapshot => {
                const updatedRequests = [];
                snapshot.forEach(request => {
                    updatedRequests.push({ id: request.id, ...request.data() });
                });
                setRequests(updatedRequests);
            });

        return () => unsubscribe();
    }, [apartmentNumber]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const apartment = apartmentNumber;
        const { area, description, photo } = formValues;

        db.collection("requests")
            .add({
                apartment,
                area,
                description,
                photo,
                request_time: getDate(),
                status: "Pending"
            })
            .then(() => {
                console.log("Request successful");
                setFormValues({
                    ...formValues,
                    area: '',
                    description: '',
                    photo: ''
                });
            })
            .catch(error => {
                console.error("Error adding request!", error);
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
            <section>
                <h3 className="center" id="title"><b>New Maintenance Request</b></h3>
                <form id="request_form" className="col s12">
                    <div className="row">
                        <div className="input-field col s2 offset-s2">
                            <i className="material-icons prefix">domain</i>
                            <input disabled id="request_aptNum" name="request_aptNum" type="text" className="validate" value={apartmentNumber}/>
                        </div>
                        <div className="input-field col s2">
                            <i className="material-icons prefix"></i>
                            <input disabled value={getDate()} id="request_date" type="text" className="validate" />
                        </div>
                        <div className="input-field col s4">
                            <input placeholder="Enter location..." id="request_location" name="area" value={formValues.area} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4 offset-s2">
                            <i className="material-icons prefix"></i>
                            <input placeholder="Enter problem description..." id="request_description" name="description" type="text" className="validate" value={formValues.description} onChange={handleInputChange} />
                            <label htmlFor="request_problem">Problem Information</label>
                        </div>
                        <div className="input-field col s4">
                            <input placeholder="Enter image (optional)..." id="request_image" value={formValues.photo} name="photo" onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="center">
                        <a className="wave-effect waves-light btn blue darken-2" type="submit" name="request_form" onClick={handleFormSubmit}>Submit</a>
                    </div>
                </form>
            </section>
            <section id="list">
                <hr/>
                <h3 className="center" id="title"><b>Previous/Pending Maintenance Requests</b></h3>
                <ul className="collection">
                    {requests.map(request => (
                        <li key={request.id} className="collection-item avatar" data-id={request.id}>
                            <img className="circle" src={request.photo} alt="request" />
                            <span className="title">{request.description}</span>
                            <p className="grey-text">
                                Location: {request.area}
                            </p>
                            <p className="grey-text">
                                Date: {request.request_time}
                            </p>
                            <p className="grey-text">
                                Status: {request.status}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    )
}