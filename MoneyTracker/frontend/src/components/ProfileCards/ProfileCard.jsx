import React from 'react';
import "./ProfileCard.css";
import Arrow from '../../assets/ArrowRight.svg'
import { useNavigate } from 'react-router-dom'


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
    const baseUrl = import.meta.env.VITE_API_URL;
    const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

    
    const navigate = useNavigate();


    const handleChangeProfile = () => {
        navigate('/edit-profile'); 
    };

    const handleMyPublicationsButton = () => {
        navigate('/my-feed');
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className='profile-image'>
                        <img src={fullImageUrl} alt={`${fullname}'s profile`} className="profile-image" draggable="false"/>
                    </div>
                    <div className="profile-header-info">
                        <div className="profile-details">
                            <h2 className="profile-name">{fullname}</h2>
                            <p className="profile-job-title">{jobTitle}</p>
                        </div>
                        {/* <div className="profile-contact-info"> */}
                            <div className="profile-form">
                                <p className="label-contacts">Email</p>
                                <div className="profile-box">
                                    <p>{email}</p>
                                </div>
                            </div>

                            <div className="profile-form">
                                <p className="label-contacts">Phone</p>
                                <div className="profile-box">
                                    <p>{phone}</p>
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                </div>

                <div className="personal-container">
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
                        <button className="change-profile-button" onClick={handleChangeProfile}> Change Profile</button>
                        <button className="setup-reminder-button" onClick={handleMyPublicationsButton}> My Publications</button>
                        <button className="setup-reminder-button"> Setup Reminders</button>
                    </div>

                    <div className='profile-sidebar-bottom'>
                        <div className='profile-currency'>
                        <label htmlFor="currency" className='label-currency'>Currency</label>
                        <select id="currency" name="currency" className='currency-select'>
                            <option value="usd">USD - United States Dollar</option>
                            <option value="uah">UAH - Ukrainian Hryvnia</option>
                            <option value="czk">CZK - Czech Koruna</option>
                        </select>
                        </div>

                        <div className='profile-reminder'>
                            <div className='reminder-info'>
                                <p className="label-reminder">Reminder</p>

                                    <div className="reminder-text-deadline-amount">
                                        <p className="text-reminder">
                                            There will be <span className="text-teal">*Some Taxes*</span> soon, don`t forget to pay for it!
                                        </p>

                                        <div className="reminder-row">
                                            <div className="reminder-item">
                                                <p className="label-deadline">Deadline:</p>
                                                <p className='deadline-reminder'> *Some Deadline*</p>
                                            </div>

                                            <div className="reminder-item">
                                                    <p className="label-amount">Amount:</p>
                                                    <p className='amount-reminder'> *Some Amount*</p>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                            <img src={Arrow} className='arrow-btn' draggable="false"/>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default ProfileCard;