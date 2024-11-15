import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useParams } from "react-router-dom";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import "./GroupEdit.css";

function GroupEdit() {
    const { groupId } = useParams();
    const nav = useNavigate();
    const [group, setGroup] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [showDiscardModal, setShowDiscardModal] = useState(false);
  
    useEffect(() => {
      async function fetchData() {
        setIsLoading(true);
        try {
          const [response, profileDataResponse, photoResponse, membersResponse] = await Promise.all([
            api.get(`/api/groups/${groupId}/viewdata/`),
            api.get("/api/user/profile_detail/"),
            api.get("/api/user/profile/"),
            api.get(`/api/groups/${groupId}/members/`),
          ]);

          console.log(response.data)
  
          setGroup({
            name: response.data.group.name || "", 
            description: response.data.group.description || "",
            currentImage: response.data.base_url +    response.data.group.group_image || "",
            group_image: null, 
          });
  
          setProfileData(profileDataResponse.data);
          setProfilePhoto(photoResponse.data.profileImg);
          setMembers(membersResponse.data);
        } catch (error) {
          console.error("Error fetching group details:", error);
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchData();
    }, [groupId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setGroup((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setGroup((prevState) => ({
          ...prevState,
          group_image: file,
        }));
        setSelectedImage(URL.createObjectURL(file));
      }
    };

    const handleDiscard = () => {
        setShowDiscardModal(true);
    };

    const handleConfirmDiscard = () => {
        nav(`/groups/${groupId}`);
    };

    const handleCancelDiscard = () => {
        setShowDiscardModal(false); 
    };

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!group) return;
  
      setIsLoading(true);

  
      const formData = new FormData();
      formData.append("name", group.name);
      formData.append("description", group.description);
      if (group.group_image) {
        formData.append("group_image", group.group_image);
      }
      
      console.log("Form Data to be submitted:");
      console.log("Group Name:", group.name);
      console.log("Description:", group.description);
      
      if (group.group_image) {
          console.log("New Image Selected:", group.group_image); 
      }
      
      try {
        await api.put(`/api/groups/${groupId}/update/`, formData);
        nav(`/groups/${groupId}`);
      } catch (error) {
        console.error("Error updating group:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
  
    if (!group) {
      return <p>Failed to load group data.</p>; 
    }

  
    return (
        <MainContainer>
            <TopPart
                nickname={profileData?.firstname}
                selectedItem={"groups"}
                profilePhoto={profilePhoto}
            />

            <div className="group-edit-main-container">
                <div className="group-edit-left-container">
                    
                    <h2 className="group-edit-left-title">Edit Group</h2>
                    <div className="group-edit-name">
                        <label htmlFor="name">Group Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={group.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="group-edit-description">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={group.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="group-edit-image">
                        <label htmlFor="group_image">Group Image</label>
                        <input
                            type="file"
                            id="group_image"
                            name="group_image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {selectedImage ? (
                            <div className="group-edit-image-preview">
                                <p>New Image Preview:</p>
                                <div className="group-edit-image-container">
                                    <img src={selectedImage} alt="New Group" />
                                </div>
                            </div>
                        ) : group.currentImage ? (
                            <div className="group-edit-image-preview">
                                <p>Current Image:</p>
                                <div className="group-edit-image-container">
                                    <img src={group.currentImage} alt="Current Group" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="group-edit-right-container">
                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={isLoading} 
                        className="group-edit-save-button"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleDiscard} 
                        disabled={isLoading} 
                        className="group-edit-discard-button"
                    >
                        Discard
                    </button>

                    <h3 className="group-edit-right-title">Group Members</h3>
                    <ul className="group-edit-members-list">
                        {members.map((member) => (
                            <li key={member.id} className={`member-role-${member.role}`}>
                                <p>
                                    <strong>{member.username}</strong> ({member.role})
                                </p>
                            </li>
                        ))}
                    </ul>
                 
                </div>
            </div>
            {showDiscardModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to discard your changes?</p>

                        <div className="modal-buttons">
                            <button onClick={handleConfirmDiscard} className="button-confirm">Yes, Discard</button>
                            <button onClick={handleCancelDiscard}  className="button-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </MainContainer>
    );
}
  
  export default GroupEdit;
  