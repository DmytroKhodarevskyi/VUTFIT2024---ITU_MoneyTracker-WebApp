/**
 * File: GroupCreate.jsx
 * Description: Page for creating new group.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - Accessible only if user has enough stars (for testing purposes it is 1).
 */


import React from "react";
import { useState, useEffect, useRef } from "react";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./GroupCreate.css";
import Notification from "../../components/Notifications/Notifications";

function GroupCreate() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  

  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null); 
  const [notification, setNotification] = useState(null);  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const closeNotification = () => {
    setNotification(null); 
  };
  const handleDeletePhoto = () => {
    setImage("");
    setFileName("");
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [userStars, setUserStars] = useState(0);

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userStars < 1) {
      
      setNotification({
        message: "U don't have enough stars to create group (required 1)",
        type: "error",
      });
      return;
    }

    if (!groupName) {
      
      setNotification({
        message: "Please enter a group name",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", groupDescription);

    if (image) {
      formData.append("group_image", image);
    }
    try {
      const res = await api.post("/api/groups/create/", formData);
      console.log(res.data + "group created");
      nav("/groups");
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await api.get("/api/user/profile/");
        setUserStars(response.data.stars);
        setNickname(response.data.username);
        setProfilePhoto(response.data.profileImg);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch nickname", error);
        setIsLoaded(true);
      }
    };

    fetchNickname();
  }, []);

  if (!isLoaded) {
    return (
      <>
        <MainContainer>LOADING...</MainContainer>
      </>
    );
  }

  return (
    <>
      <MainContainer>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
        <TopPart
          nickname={nickname}
          profilePhoto={profilePhoto}
          selectedItem={"groups"}
          titletext={"Conversation starting point"}
          subtitletext={"Let’s see if there is something to discuss"}
        />

        <div className="GroupCreate-main-block-container-first">
          <div className="GroupCreate-main-block-container">
            <div className="GroupCreate-title-block">
              <h1 className="GroupCreate-title">Create a group</h1>
              <h2 className="GroupCreate-subtitle">Carve your public space</h2>
            </div>
            <div className="GroupCreate-label-container">
              <label
                className="GroupCreate-label-customfile"
                htmlFor="file-upload"
              >
                Choose a group image
              </label>

              <input
                id="file-upload"
                className="GroupCreate-input"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
              />
            </div>

            <div className="GroupCreate-bottom-container">
              <div className="GroupCreate-labels-container">
                <div className="GroupCreate-label-container">
                  <label className="GroupCreate-label" htmlFor="file">
                    Group Name
                  </label>
                  <input
                    className="GroupCreate-input"
                    type="text"
                    placeholder="Group name*"
                    value={groupName}
                    maxLength="99"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                <div className="GroupCreate-label-container">
                  <label className="GroupCreate-label" htmlFor="file">
                    Group Description
                  </label>
                  <textarea
                    className="GroupCreate-input-textarea"
                    type="text"
                    placeholder="Group description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </div>
              </div>
              {fileName && imagePreview && (
                 <div className="GroupCreate-images-container">
                 {fileName && (
                   <>
                     <div className="Group-Create-rightpart-withoutphoto">
                       <button
                       className="GroupCreate-delete-button"
                       onClick={handleDeletePhoto}
                       >Delete Photo</button>
                       <div className="GroupCreate-selected-file-container">
                         <p className="GroupCreate-label">Selected file:</p>
                         <p>{fileName}</p>
                       </div>
                     </div>
                   </>
                 )}
 
                 {imagePreview && (
                   <img
                     src={imagePreview}
                     alt="Preview"
                     className="GroupCreate-preview-image"
                   />
                 )}
               </div>

              )}
              
            </div>

            <button
            className="GroupCreate-button"
            onClick={handleSubmit}>Create Group</button>
          </div>
        </div>
      </MainContainer>
    </>
  );
}

export default GroupCreate;
