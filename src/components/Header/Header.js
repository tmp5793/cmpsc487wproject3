import {NavLink} from "react-router-dom";
import React, {Component} from "react";
import './Header.css';
import M from 'materialize-css';

export default class Header extends Component {
    render() {
        return (
            <div className="navbar-fixed">
                <nav className="nav-wrapper blue darken-2">
                    <div className="container">
                        <div className="left "><b>Apartment Management System</b></div>
                        <ul className="right">
                            <li><NavLink to="/" className=""><b>Login Page</b></NavLink></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}