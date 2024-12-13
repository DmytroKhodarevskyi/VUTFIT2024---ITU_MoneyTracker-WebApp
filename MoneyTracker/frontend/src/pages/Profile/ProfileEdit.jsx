import { useState, useRef, useEffect } from "react"
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import ProfileEditCard from "../../components/ProfileCards/ProfileEditCard"
import DiscardForm from "../../components/DiscardForm/DiscardForm"
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import Notification from "../../components/Notifications/Notifications";
import ConfirmModal from "../../components/ConfirmModel/ConfirmModal";

function ProfileEdit() {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState(null);

    const [genderChoices, setGenderChoices] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [deletePhoto, setDeletePhoto] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [photoPreview, setPhotoPreview] = useState(null);

    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    

    const fileInputRef = useRef(null);

    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const [profileResponse, genderResponse, photoResponse] = await Promise.all([
                    api.get("/api/user/profile_detail/"),
                    api.get("/api/user/gender-choices/"),
                    api.get("/api/user/profile/")
                ]);

                setProfileData(profileResponse.data);
                setGenderChoices(genderResponse.data);
                setProfilePhoto(photoResponse.data.profileImg);
                setIsLoaded(true);
            } catch (error) {
                setError(error);
                setIsLoaded(false);
            }
        }

        fetchProfileData();
    }, []);

    useEffect(() => {
        if (profileData && genderChoices.length > 0) {
            const genderLabel = profileData.gender;
            const matchingChoice = genderChoices.find(choice => choice.label === genderLabel);

            if (matchingChoice) {
                setProfileData(prevData => ({
                    ...prevData,
                    gender: matchingChoice.value 
                }));
            }
        }
    }, [profileData, genderChoices]);

    const handleDiscard = () => {
        setShowDiscardModal(true);
    };
    
    const confirmDiscard = () => {
        navigate('/profile');
    };
    
    const cancelDiscard = () => {
        setShowDiscardModal(false);
    };

    
    const handleInputChange = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setDeletePhoto(false);
            };
            reader.readAsDataURL(file);

            event.target.value = null;
        }
    }
    
    const handleUploadPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleDeletePhoto = async () => {
        setPhotoPreview(null);
        setDeletePhoto(true);
    }
    const closeNotification = () => {
        setNotification(null);
      };

    const handleSave = async () => {
        try {

            const jobTitleRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;    
            const nameRegex = /^[A-Za-z]+$/; 
            const countryCityRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[+]?[1-9][0-9]{7,14}$/; 

            let { firstname, lastname, jobTitle, country, city, email, phone } = profileData;

            profileData.firstname = firstname.trim();
            profileData.lastname = lastname.trim();
            profileData.jobTitle = jobTitle.trim();
            profileData.country = country.trim();
            profileData.city = city.trim();
            profileData.email = email.trim();
            profileData.phone = phone.trim();


            if(jobTitle.length == 0) {
                profileData.jobTitle = "Unemployed";
                jobTitle = "Unemployed";
            }

            if (!nameRegex.test(firstname.trim())) {
               
                
                setNotification({
                    message: "First name can only contain letters and cannot be empty.",
                    type: "error",
                  });
                return;
            }

            if (!nameRegex.test(lastname.trim())) {
                
                
                setNotification({
                    message: "Last name can only contain letters and cannot be empty.",
                    type: "error",
                  });
                return;
            }

            if (!jobTitleRegex.test(jobTitle.trim())) {
                
                
                setNotification({
                    message: "Job can only contain letters and spaces. And numbers (But not as a first char)",
                    type: "error",
                  });
                return;
            }

            if (!countryCityRegex.test(country.trim()) && country.length != 0) {
                
                
                setNotification({
                    message: "Country can only contain letters and spaces.",
                    type: "error",
                  });
                return;
            }

            if (!countryCityRegex.test(city.trim()) && city.length != 0) {
                
                
                setNotification({
                    message: "City can only contain letters and spaces.",
                    type: "error",
                  });
                return;
            }
            
            if (!emailRegex.test(email.trim())) {
                
                
                setNotification({
                    message: "Email can only contain letters and spaces.",
                    type: "error",
                  });
                return;
            }

            if (!phoneRegex.test(phone.trim())) {
               
                
                setNotification({
                    message: "Phone can only contain letters and spaces and start with either + or any number except 0",
                    type: "error",
                  });
                return;
            }
            
            
            if (deletePhoto) {
                await api.delete("/api/user/profile-photo/");
                setDeletePhoto(false); 
            }

            if (selectedFile) {
                const formData = new FormData();
                formData.append('profile_image', selectedFile);
                await api.post('/api/user/profile-photo/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSelectedFile(null);
            }  

            const response = await api.patch("/api/user/profile_detail/", profileData);
            navigate('/profile');
            
        } catch (error) {
            
            
            setNotification({
                message: error,
                type: "error",
              });
        }
    };

    const getNewAccessToken = async (refreshToken) => {
        try {
            const response = await api.post("/api/auth/refresh/", { refresh_token: refreshToken });
            return response.data.access_token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

    const handleDeleteAccount = async (accessToken, refreshToken) => {
        handleOpenDeleteModal(async () => {
            if (!accessToken) {
                setNotification({
                    message: "You need to log in first.",
                    type: "error",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                return;
            }

            try {
                await api.delete("/api/user/delete/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);

                setNotification({
                    message: "Your account has been successfully deleted.",
                    type: "success",
                });

                setTimeout(() => {
                    navigate("/login");
                    window.location.reload();
                }, 2000);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const newAccessToken = await getNewAccessToken(refreshToken);
                    if (newAccessToken) {
                        await api.delete("/api/user/delete/", {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        });

                        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                        localStorage.removeItem(REFRESH_TOKEN);

                        navigate("/login");
                    } else {
                        navigate("/login");
                    }
                } else {
                    setNotification({
                        message: "There was an error deleting your account. Please try again later.",
                        type: "error",
                    });
                }
            }
        });
    };
    

    if (error) {
        return (
            <div className="error-container">
                <h1 className="error-text">Failed to load profile data</h1>
                <p>Details: {error.message}</p>
                <p>Please check the console for more information.</p>
            </div>
        );
    }


    if (!isLoaded) {
        return (
            <div className="loading-container">
                <h1 className="loading-text">Hold up, loading data...</h1>
            </div>
        )
      }
      const handleOpenDeleteModal = (action) => {
        setConfirmAction(() => action); 
        setShowModal(true); 
    };

    const confirmDelete = async () => {
        if (confirmAction) {
            await confirmAction(); 
        }
        setShowModal(false); 
    };

    const cancelDelete = () => {
        setShowModal(false); 
        setConfirmAction(null); 
    };
    return (
        
        <MainContainer>
            {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
        
      )}
      {showModal && (
                <ConfirmModal
                    message="Are you sure you want to delete your account? This action cannot be undone."
                    onConfirm={confirmDelete} 
                    onCancel={cancelDelete} 
                />
            )}
        <TopPart nickname={profileData.username} selectedItem={"profile"} profilePhoto={profilePhoto}/>
        <div className="profile-container">
            <ProfileEditCard 
                profileImg={profileData.profileImg}
                firstname={profileData.firstname}
                lastname={profileData.lastname}
                fullname={profileData.fullname}
                jobTitle={profileData.jobTitle} 
                email={profileData.email}
                phone={profileData.phone}
                country={profileData.country}
                city={profileData.city}
                gender={profileData.gender}
                genderChoices={genderChoices}  
                fileInputRef={fileInputRef}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleFileChange={handleFileChange}
                handleFileSelect={handleFileSelect}
                handleUploadPhoto={handleUploadPhoto}
                handleDeletePhoto={handleDeletePhoto}
                handleDiscard={handleDiscard}
                photoPreview={photoPreview}
                deletePhoto={deletePhoto}
                handleDeleteAccount={handleDeleteAccount}
            />
        </div>

        {showDiscardModal && (
                <DiscardForm
                    onConfirm={confirmDiscard}
                    onCancel={cancelDiscard}
                />
            )}
    </MainContainer>
    )
}

export default ProfileEdit