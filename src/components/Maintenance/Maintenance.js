import React, {Component, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom'
import './Maintenance.css';
import M from 'materialize-css'

// eslint-disable-next-line no-undef
const db = firebase.firestore()
db.settings({})

export const Maintenance = () => {

    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({
        apartment: '',
        area: '',
        startDate: '',
        endDate: '',
        status: ''
    })

    useEffect(() => {
        const unsubscribe = db.collection("requests")
            .onSnapshot(snapshot => {
                const updatedRequests = [];
                snapshot.forEach(request => {
                    updatedRequests.push({ id: request.id, ...request.data() });
                });
                setRequests(updatedRequests);
            });

        return () => unsubscribe();
    }, [])

    const handleCompleteRequest = (requestId) => {
        // eslint-disable-next-line no-undef
        firebase.firestore().collection('requests').doc(requestId).update({
            status: 'Completed'
        }).then(() => {
            console.log("Request status updated to completed")
        }).catch(error => {
            console.error("Error updating request status:", error)
        })
    }

    const applyFilters = () => {
        let filteredRequests = db.collection("requests");

        if (filters.apartment !== '') {
            filteredRequests = filteredRequests.where("apartment", "==", filters.apartment);
        }

        if (filters.area !== '') {
            filteredRequests = filteredRequests.where("area", "==", filters.area);
        }

        if (filters.startDate !== '') {
            filteredRequests = filteredRequests.where("request_time", ">=", filters.startDate);
        }

        if (filters.endDate !== '') {
            filteredRequests = filteredRequests.where("request_time", "<=", filters.endDate);
        }

        if (filters.status !== '') {
            filteredRequests = filteredRequests.where("status", "==", filters.status);
        }

        filteredRequests.get().then(snapshot => {
            const updatedRequests = [];
            snapshot.forEach(request => {
                updatedRequests.push({ id: request.id, ...request.data() });
            });
            setRequests(updatedRequests);
        }).catch(error => {
            console.error("Error applying filters:", error);
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    return (
        <div className="row">
            <section id="filtering">
                <h4 className="center"><b>Filters</b></h4>
                <div className="row">
                    <div className="col s2 offset-s1">
                        <input id="filter_apartment" type="text" name="apartment" value={filters.apartment} onChange={handleFilterChange} />
                        <label htmlFor="filter_apartment">Apartment</label>
                    </div>
                    <div className="col s2">
                        <input id="filter_area" type="text" name="area" value={filters.area} onChange={handleFilterChange} />
                        <label htmlFor="filter_area">Area</label>
                    </div>
                    <div className="col s2">
                        <input id="filter_startdate" type="text" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                        <label htmlFor="filter_startdate">Start Date</label>
                    </div>
                    <div className="col s2">
                        <input id="filter_enddate" type="text" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                        <label htmlFor="filter_enddate">End Date</label>
                    </div>
                    <div className="col s2">
                        <input id="filter_status" type="text" name="status" value={filters.status} onChange={handleFilterChange} />
                        <label htmlFor="filter_status">Status</label>
                    </div>
                </div>
                <div className="center">
                    <a className="wave-effect waves-light btn blue darken-2" onClick={applyFilters}>Filter</a>
                </div>
            </section>
            <hr/>
            <section id="request_list">
                <h3 className="center" id="request_title"><b>All Maintenance Requests</b></h3>
                <ul className="collection">
                    {requests.map(request => (
                        <li key={request.id} className="collection-item avatar" data-id={request.id}>
                            <img className="circle" src={request.photo} alt="request" />
                            <span className="title">{request.description}</span>
                            <p className="grey-text">
                                Apartment {request.apartment} {request.area}
                            </p>
                            <p className="grey-text">
                                Date: {request.request_time}
                            </p>
                            <p className="grey-text">
                                Status: {request.status}
                            </p>
                            {request.status !== 'Completed' && (
                                <i className="material-icons green-text secondary-content" onClick={() => handleCompleteRequest(request.id)}>done</i>
                            )}
                        </li>
                    ))}
                </ul>

            </section>
        </div>
    )
}