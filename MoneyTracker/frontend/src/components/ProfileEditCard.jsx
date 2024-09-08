import React from 'react';
import "../styles/ProfileEdit.css";
import defaultImageUrl from '../../../backend/media/profile_images/default.png';


function ProfileEditCard({
    profileImg, 
    firstname,
    lastname,
    fullname, 
    jobTitle, 
    email, 
    phone, 
    country,
    city,
    gender,
    handleInputChange
}) {
    return (
        <div className="profile-wrapper">
            <div className="profile-details-card">
                <div className="profile-header-section">
                    <div className="profile-picture-section">
                        <img 
                            draggable="false"
                            src={defaultImageUrl} 
                            alt={`${fullname}'s profile`} 
                            className="profile-picture" 
                        />
                    </div>
                <div className="header-info-section">
                    <div className="photo-buttons">
                        <button className="upload-photo-button">Upload a new photo</button>
                        <button className="delete-photo-button">Delete Photo</button>
                    </div>
                    <div className="details-section">
                        <div className='info-item'>
                        <label className="label-first-name">Name</label>
                        <input 
                            type="text" 
                            className="input-name" 
                            value={firstname} 
                            onChange={e => handleInputChange('firstname', e.target.value)} 
                            placeholder="Name"
                        />
                        </div>
                        <div className="info-item">
                            <label className="label-last-name">Surname</label>
                            <input 
                                type="text" 
                                className="input-name" 
                                value={lastname} 
                                onChange={e => handleInputChange('secondname', e.target.value)} 
                                placeholder="Surname"
                            />
                        </div>
                        <div className='info-item'>
                        <label className="label-contact">Phone</label>
                        <input 
                            type="tel" 
                            className="input-box" 
                            value={phone} 
                            onChange={e => handleInputChange('phone', e.target.value)} 
                            placeholder="Phone"
                        />
                        </div>
                    </div>
                </div>
            </div>
                    
                <div className="personal-info-section">
                    <div className="info-item">
                        <label className="label-contact">Email</label>
                            <input 
                                type="email" 
                                className="input-box" 
                                value={email} 
                                onChange={e => handleInputChange('email', e.target.value)} 
                                placeholder="Email"
                            />
                    </div>
                    <div className="info-item">
                        <label className='label-job-title'> Job </label>
                            <input 
                                type="text" 
                                className="input-job-title" 
                                value={jobTitle} 
                                onChange={e => handleInputChange('jobTitle', e.target.value)} 
                                placeholder="Job Title"
                            />
                    </div>
                    <div className="info-item">
                        <label className="label-info">Gender</label>
                        <select 
                            className="input-box" 
                            value={gender} 
                            onChange={e => handleInputChange('gender', e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className='adress-info'>
                        <div className="info-item">
                            <label className="label-info">Country</label>
                            <input 
                                type="text" 
                                className="input-box" 
                                value={country} 
                                onChange={e => handleInputChange('country', e.target.value)} 
                                placeholder="Country"
                            />
                        </div>
                        <div className="info-item">
                            <label className="label-info">City</label>
                            <input 
                                type="text" 
                                className="input-box" 
                                value={city} 
                                onChange={e => handleInputChange('city', e.target.value)} 
                                placeholder="City"
                            />
                         </div>
                    </div>    
                </div>
            </div>

            <div className="sidebar-actions">
                <div className="action-buttons">
                    <button className="button-save-profile">Save</button>
                    <button className="button-discard-profile">Discard</button>
                </div>
            </div>
        </div>
    );
}
    
export default ProfileEditCard;