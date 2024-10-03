import { useState, useEffect, useRef } from "react";
import React from "react";
import FormPost from "../components/FormPost";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import DiscardForm from "../components/DiscardForm"; 
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

    const emojiArray = [
      "😊", "😂", "😍", "🥺", "😢", "😎", "🤔", "🙄", "😡", "🥳", "😴", "🤯",
      "🤩", "😜", "🤗", "💪", "🎉", "🔥", "❤️", "👍", "🤝", "👏", "💥", "😇"
    ];


    const navigate = useNavigate()
    const [nickname, setNickname] = useState("");
    const [fullname, setFullname] = useState("")
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [media, setMedia] = useState([]); 
    const [tags, setTags] = useState("");


    const imageInputRef = useRef(null);
    const gifInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const [showDiscardModal, setShowDiscardModal] = useState(false);
    

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchNickname = async () => {
        try {
          const response = await api.get("/api/user/profile/");

          setNickname(response.data.first_name);
          setFullname(response.data.first_name + " " + response.data.last_name)
          setProfilePhoto(response.data.profileImg);
          setIsLoaded(true); 
        } catch (error) {
          window.alert("Failed to fetch profile data", error);
          setIsLoaded(true); 
        }
      };

      fetchNickname();
    }, []);

  const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const newMedia = files.map(file => {
          const url = URL.createObjectURL(file); 
          return { file, url }; 
      });

      const uniqueMedia = newMedia.filter(newItem => 
        !media.some(existingItem => existingItem.file.name === newItem.file.name)
      );
  
      setMedia(prevMedia => [...prevMedia, ...uniqueMedia]);
  
      e.target.value = null;
  };

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    navigate('/my-feed');
  };

  const cancelDiscard = () => {
    setShowDiscardModal(false);
  };

  const handleUploadPhoto = () => {
    imageInputRef.current.click(); 
  };

  const handleUploadGif = () => {
    gifInputRef.current.click(); 
  };

  const handleUploadVideo = () => {
    videoInputRef.current.click();  
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoaded(true);

    const newPost = new FormData();
    newPost.append("title", title);
    newPost.append("content_text", text);
    newPost.append("tags", tags);
    
    media.forEach(mediaItem => {
        newPost.append("media", mediaItem.file);
    });
   

    try {
      const res = await api.post("/api/publications/", newPost, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`, 
        },
      });
      console.log("Post created:", res.data);

      navigate("/my-feed");


  } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        const errorMessage = error.response.data.detail || "Something went wrong.";
        setError(errorMessage); 
      } else {
        console.error("Error message:", error.message);
        setError("Network error. Please try again."); 
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(media[index].url); 
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji) => {
    setText((prevText) => prevText + emoji); 
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

  return (
    <MainContainer>
      <TopPart nickname={nickname} selectedItem={"profile"} profilePhoto={profilePhoto}/>
      <FormPost 
      fullname={fullname}
      profileImg={profilePhoto}
      title={title}
      text={text}
      media={media}
      tags={tags}
      imageInputRef={imageInputRef}
      gifInputRef={gifInputRef}
      videoInputRef={videoInputRef}
      handleDiscard={handleDiscard}
      handleFileChange={handleFileChange}
      handleUploadPhoto={handleUploadPhoto}
      handleUploadGif={handleUploadGif}
      handleUploadVideo={handleUploadVideo}
      handleSubmit={handleSubmit}
      handleRemoveFile={handleRemoveFile}
      setTitle={setTitle}        
      setText={setText}         
      setTags={setTags}          
      addEmoji={addEmoji}
      emojiArray={emojiArray}
      />
      {showDiscardModal && (
                <DiscardForm
                    onConfirm={confirmDiscard}
                    onCancel={cancelDiscard}
                />
            )}
    </MainContainer>
  );
};

export default CreatePost;