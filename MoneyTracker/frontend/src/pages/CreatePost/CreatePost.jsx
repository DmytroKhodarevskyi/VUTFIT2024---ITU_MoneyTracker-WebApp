import { useState, useEffect, useRef } from "react";
import React from "react";
import FormPost from "../../components/CreatePostForm/FormPost";
import MainContainer from "../../components/MainContainer/MainContainer";
import TopPart from "../../components/TopPart/TopPart";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api";
import DiscardForm from "../../components/DiscardForm/DiscardForm"; 
import { useNavigate, useParams  } from 'react-router-dom';

const CreatePost = () => {


    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    
    const emojiArray = [
      "😊", "😂", "😍", "🥺", "😢", "😎", "🤔", "🙄", "😡", "🥳", "😴", "🤯",
      "🤩", "😜", "🤗", "💪", "🎉", "🔥", "❤️", "👍", "🤝", "👏", "💥", "😇",
      
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


    useEffect(() => {
      const fetchPostData = async () => {
        if (id) {
          setIsEdit(true);
          try {
            const response = await api.get(`/api/publications/${id}/`);
            const { title, content_text, tags, media_files } = response.data;
            setTitle(title);
            setText(content_text);
            setTags(tags);
           
            const mediaArray = media_files.map(file => ({
              id: file.id,
              file: {
                type: file.media_type, 
                name: file.file.split('/').pop(), 
              },
              url: file.file,
            }));

          setMedia(mediaArray);
        } catch (error) {
          console.error("Failed to fetch post data:", error);
          }
      }
    };
    fetchPostData();
    }, [id]);


  const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const newMedia = files.map(file => ({
          id: null,
          file,
          url: URL.createObjectURL(file),
      }));

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

    if (!title.trim()) {
      alert("Title cannot be empty.");
      return; 
    }

    const newPost = new FormData();
    newPost.append("title", title);
    newPost.append("content_text", text);
    
    const tagArray = tags.split(/\s+/).map(tag => tag.trim()).filter(tag => tag);
    const uniqueTags = Array.from(new Set(tagArray));

    const validInput = /^[A-Za-z0-9\-.]*$/;
    const invalidTags = tagArray.filter(tag => !validInput.test(tag));
    if (invalidTags.length > 0) {
      alert("Tags can only contain letters, numbers, hyphens (-), and periods (.)");
      return;
  }
    newPost.append("tags", uniqueTags.join(' '));
    media.forEach(mediaItem => {
        if (mediaItem.file instanceof File) {
          newPost.append("media", mediaItem.file);
      }
      });
    
    const existingMediaIds = media
      .filter(mediaItem => mediaItem.id !== undefined)
      .map(mediaItem => mediaItem.id);
    
    existingMediaIds.forEach(id => {
          if (Number.isInteger(id)) { 
            newPost.append("existing_media", id);
        } else {
            console.error(`Invalid media ID: ${id}`);       
          }
      });

    try {
      let res;
      if(isEdit) {
          res = await api.patch(`/api/publications/${id}/update/`, newPost, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
          });
      } else {
          res = await api.post("/api/publications/", newPost, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`, 
          },
        });
    }

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
      setIsLoaded(false); 
    }
  };

  const handleRemoveFile = (index) => {
    if (media[index].id) {
      URL.revokeObjectURL(media[index].url); 
      setMedia(prevMedia => {
        return prevMedia.filter((_, i) => i !== index);
    });
  } else {
    URL.revokeObjectURL(media[index].url);
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
  }
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
  const handleTagChange = (e) => {
    const inputValue = setTags(e.target.value); 
    const validInput = inputValue.match(/^[A-Za-z0-9\-.]*$/);

    const tagArray = inputValue.split(/\s+/).map(tag => tag.trim()).filter(tag => tag);
    const validTags = tagArray.filter(tag => validInput.test(tag));
    const hasInvalidTags = tagArray.length > validTags.length;


    if (hasInvalidTags) {
      alert("Tags can only contain letters, numbers, hyphens (-), and periods (.)");
    }


    setTags(validTags.join(' ') + (validTags.length > 0 ? ' ' : ''));
};

  const handleKeyDown = (e) => {
      if (e.key === " ") { 
          e.preventDefault();
          const tagArray = tags.split(/\s+/).map(tag => tag.trim()).filter(tag => tag); 
          const uniqueTags = Array.from(new Set(tagArray)); 
          setTags(uniqueTags.join(' ') + ' '); 
      }
  };

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
      handleTagChange={handleTagChange}       
      handleKeyDown={handleKeyDown}   
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