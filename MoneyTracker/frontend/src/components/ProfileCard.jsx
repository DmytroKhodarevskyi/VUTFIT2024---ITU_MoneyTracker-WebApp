import React from 'react';
import "../styles/ProfileCard.css";

function ProfileCard({
    profileImg, 
    fullname, 
    jobTitle, 
    email, 
    phone, 
    country,
    city,
    gender,
    totalSpends,
    totalIncome
}) {
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <img src={profileImg} alt={`${fullname}'s profile`} className="profile-image" />
                    <div className="profile-header-info">
                        <div className="profile-details">
                            <h2 className="profile-name">{fullname}</h2>
                            <p className="profile-job-title">{jobTitle}</p>
                        </div>
                        <div className="profile-contact-info">
                            <p className="label-contacts">Email</p>
                            <div className="profile-box">
                                <p>{email}</p>
                            </div>
                            <p className="label-contacts">Phone</p>
                            <div className="profile-box">
                                <p>{phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="personal-info-header">Personal Info</h3>
                <div className="profile-personal-info">
                    <div className="profile-item">
                        <p className="label-personal-info">Country</p>
                        <div className="profile-box">
                            <p>{country}</p>
                        </div>
                    </div>
                    <div className="profile-item">
                        <p className="label-personal-info">City</p>
                        <div className="profile-box">
                            <p>{city}</p>
                        </div>
                    </div>
                    <div className="profile-item">
                        <p className="label-personal-info">Gender</p>
                        <div className="profile-box">
                            <p>{gender}</p>
                        </div>
                    </div>
                </div>
                <div className="profile-financial-info">
                    <div className="profile-item-financial">
                        <p className="label-financial">Total Spends</p>
                        <div className="profile-box">
                            <p>{totalSpends}</p>
                        </div>
                    </div>
                    <div className="profile-item-financial">
                        <p className="label-financial">Total Income</p>
                        <div className="profile-box">
                            <p>{totalIncome}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-sidebar">
                <p> <b>TODO FUTURE </b></p>
                <p> <b>TODO FUTURE </b></p>
                <p> <b>TODO FUTURE </b></p>
            </div>
        </div>
    );
}

export default ProfileCard;