import React from 'react';
import {useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import api from "../../api"
import { Link } from 'react-router-dom';
import "./TopPart.css"
import Logo from "../../assets/AppLogo.svg"

function TopPart({nickname, selectedItem, profilePhoto, titletext, subtitletext}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        
        navigate('/logout');
    };


    



    return (
        <>
            <div className="top-container">
                <img draggable="false" className='app-logo' src={Logo} alt="Logo" />

                <div className="img_butt">
                <img draggable="false" className='mini_foto' src={profilePhoto} alt="Face" />

                    <button className="logout" onClick={handleLogout}>Logout</button>
                </div>

                <div className="home-title-container">
                    

                    { titletext == null ?
                    <h1 className="home-title">Hello again, {nickname}!</h1> 
                    : <h1 className="home-title">{titletext}</h1>  }

                    { subtitletext == null ?
                     <h2 className="home-subtitle">Here is your brief finances overview, keep track!</h2> 
                    : <h2 className="home-subtitle">{subtitletext}</h2> }
                </div>

                <div className="navigation-container">
                    <ul className="navigation-list">
                        
                        <li className={`navigation-item ${selectedItem === 'feed' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/feed">Feed</Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'groups' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/groups">Groups</Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'overview' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/">Overview</Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'update' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/update"><p>Update</p></Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'profile' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/profile">Profile</Link>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TopPart