import React from "react";
import { useState, useEffect, useRef } from "react";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function GroupCreate() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const imageInputRef = useRef(null);
  const [media, setMedia] = useState(null);

  const [image, setImage] = useState("");

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);

  //   const handleimageUpload = () => {
  //     imageInputRef.current.click();
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName) {
      alert("Please enter a group name");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", groupDescription);
    formData.append("image", image);

    try {
      const res = await api.post("/api/groups/create/", formData);

      // DOES NOT FIX IMAGES -- |
      //                        V
      //   const res = await api.post("/api/groups/create/", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      console.log(res.data + "group created");
      nav("/groups");
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  //   const handleFileChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const newMedia = files.map((file) => ({
  //       id: null,
  //       file,
  //       url: URL.createObjectURL(file),
  //     }));

  //     const uniqueMedia = newMedia.filter(
  //       (newItem) =>
  //         !media.some(
  //           (existingItem) => existingItem.file.name === newItem.file.name
  //         )
  //     );

  //     setMedia((prevMedia) => [...prevMedia, ...uniqueMedia]);

  //     e.target.value = null;
  //   };

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await api.get("/api/user/profile/");
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
        <TopPart
          nickname={nickname}
          profilePhoto={profilePhoto}
          selectedItem={"groups"}
          titletext={"Conversation starting point"}
          subtitletext={"Let’s see if there is something to discuss"}
        />

        <div className="GroupCreate-main-block-container">
          {/* <button onClick={handleimageUpload}>select image</button>
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          /> */}

          <input type="file" onChange={handleImageChange} />

          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Group description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />

          <button onClick={handleSubmit}>Create Group</button>
        </div>
      </MainContainer>
    </>
  );
}

export default GroupCreate;
