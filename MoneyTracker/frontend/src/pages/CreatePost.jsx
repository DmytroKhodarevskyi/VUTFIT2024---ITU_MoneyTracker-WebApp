import { useState, useEffect } from "react";
import React from "react";
import FormPost from "../components/FormPost";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
import api from "../api";

const CreatePost = () => {

    const [nickname, setNickname] = useState("");

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchNickname = async () => {
        try {
          const response = await api.get("/api/user/profile/");

          setNickname(response.data.first_name);
          setProfilePhoto(response.data.profileImg);
          setIsLoaded(true); 
        } catch (error) {
          window.alert("Failed to fetch profile data", error);
          setIsLoaded(true); 
        }
      };

      fetchNickname();
    }, []);


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


  return (
    <MainContainer>
      <TopPart nickname={nickname} selectedItem={"profile"} profilePhoto={profilePhoto}/>
      <FormPost />
    </MainContainer>
  );
};

export default CreatePost;