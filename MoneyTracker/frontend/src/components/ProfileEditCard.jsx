import React from 'react';
import "../styles/ProfileEdit.css";

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
    genderChoices,
    fileInputRef,
    handleInputChange,
    handleSave,
    handleFileChange,
    handleFileSelect,
    handleUploadPhoto,
    handleDeletePhoto,
    handleDiscard,
    photoPreview,
    deletePhoto
}) {

    const baseUrl = import.meta.env.VITE_API_URL;
    let displayImageUrl;

    if (deletePhoto) {
        displayImageUrl = `${baseUrl}/media/profile_images/default.png`
    } else if (photoPreview) {
        displayImageUrl = photoPreview;
    } else {
        displayImageUrl = `${baseUrl}${profileImg}`;
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-details-card">
                <div className="profile-header-section">
                    <div className="profile-picture-section">
                        <img 
                            draggable="false"
                            src={displayImageUrl} 
                            alt={`${fullname}'s profile`} 
                            className="profile-picture" 
                        />
                    </div>
                <div className="header-info-section">
                    <div className="photo-buttons">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                            onInput={handleFileSelect} 
                        />
                        <button className="upload-photo-button" onClick={handleUploadPhoto}>Upload a new photo</button>
                        <button className="delete-photo-button" onClick={handleDeletePhoto}>Delete Photo</button>
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
                            maxLength="15"
                        />
                        </div>
                        <div className="info-item">
                            <label className="label-last-name">Surname</label>
                            <input 
                                type="text" 
                                className="input-name" 
                                value={lastname} 
                                onChange={e => handleInputChange('lastname', e.target.value)} 
                                placeholder="Surname"
                                maxLength="15"
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
                            maxLength="15"
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
                                maxLength="29"
                                // TODO maybe email should be any, but needed to change profile card then 
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
                                maxLength="25" 
                            />
                    </div>
                    <div className="info-item">
                        <label className="label-info">Gender</label>
                        <select 
                            className="input-box" 
                            value={gender} 
                            onChange={e => handleInputChange('gender', e.target.value)}>
                            {genderChoices.map(choice => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
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
                                maxLength="20" 
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
                                maxLength="25" 
                            />
                         </div>
                    </div>    
                </div>
            </div>

            <div className="sidebar-actions">
                <div className="action-buttons">
                    <button className="button-save-profile" onClick={handleSave}>Save</button>
                    <button className="button-discard-profile" onClick={handleDiscard}>Discard</button>
                </div>
            </div>
        </div>
    );
}
    
export default ProfileEditCard;