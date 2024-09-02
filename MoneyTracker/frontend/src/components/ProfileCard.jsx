import React from 'react';
import "../styles/ProfileCard.css";
import defaultImageUrl from '../../../backend/media/profile_images/default.png';


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
                    <img src={defaultImageUrl} alt={`${fullname}'s profile`} className="profile-image" />
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
                    <div className="profile-sidebar-buttons">
                        <button className="change-profile-button"> Change Profile</button>
                        <button className="setup-reminder-button"> Setup Reminders</button>
                    </div>

                    <div className='profile-sidebar-bottom'>
                        <div className='profile-currency'>
                        <label for="currency" className='label-currency'>Currency</label>
                        <select id="currency" name="currency" className='currency-select'>
                            <option value="usd">USD - United States Dollar</option>
                            <option value="uah">UAH - Ukrainian Hryvnia</option>
                            <option value="czk">CZK - Czech Koruna</option>
                        </select>
                        </div>

                        <div className='profile-reminder'>
                            <div className='reminder-info'>
                                <p className="label-reminder">Reminder</p>
                                    <p className='text-reminder'>Reminder Text</p>

                                    <div className="reminder-row">
                                    <div className="reminder-item">
                                        <p className="label-deadline">Deadline:</p>
                                        <p className='deadline-reminder'> Date Text</p>
                                    </div>

                                    <div className="reminder-item">
                                            <p className="label-amount">Amount:</p>
                                            <p className='amount-reminder'> Amount Text</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default ProfileCard;