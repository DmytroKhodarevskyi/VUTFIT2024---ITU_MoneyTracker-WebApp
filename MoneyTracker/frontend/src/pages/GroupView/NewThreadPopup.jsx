import React from "react";
import "./NewThreadPopUp.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gif_icon from "../../assets/gif_icon.svg";
import api from "../../api";
import img_icon from "../../assets/img_icon.svg";
import video_icon from "../../assets/video_icon.svg";
import { ACCESS_TOKEN } from "../../constants";
import Notification from "../../components/Notifications/Notifications";

function NewThreadPopup({
  setNewThreadPopup,
  groupId,
  setRefreshThreads,
}) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); 
  const closeNotification = () => {
    setNotification(null); 
  };
  const handleDiscard = () => {
    setNewThreadPopup(false);
  };
  const emojiArray = [
    "😊",
    "😂",
    "😍",
    "🥺",
    "😢",
    "😎",
    "🤔",
    "🙄",
    "😡",
    "🥳",
    "😴",
    "🤯",
    "🤩",
    "😜",
    "🤗",
    "💪",
    "🎉",
    "🔥",
    "❤️",
    "👍",
    "🤝",
    "👏",
    "💥",
    "😇",
  ];

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);

  const imageInputRef = useRef(null);
  const gifInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleUploadPhoto = () => {
    imageInputRef.current.click();
  };

  const handleUploadGif = () => {
    gifInputRef.current.click();
  };

  const handleUploadVideo = () => {
    videoInputRef.current.click();
  };

  const addEmoji = (emoji) => {
    setText((prevText) => prevText + emoji);
  };

  const handleFileChange = (e) => {
    if (media.length >= 1) {
      
      setNotification({
        message: "Only one file can be added to this thread.",
        type: "error",
      });
      return;
    }

    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      id: null,
      file,
      url: URL.createObjectURL(file),
    }));

    setMedia(newMedia);

    e.target.value = null;
  };

  const handleRemoveFile = () => {
    if (media.length > 0) {
      URL.revokeObjectURL(media[0].url);
      setMedia([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
     
      setNotification({
        message: "Title cannot be empty.",
        type: "error",
      });
      return;
    }

    if(!text.trim()) {
      
      setNotification({
        message: "Thread description cannot be empty.",
        type: "error",
      });
      return;
    }

    const newThread = new FormData();
    newThread.append("title", title);
    newThread.append("text_content", text);

    if (media.length > 0 && media[0].file instanceof File) {
      newThread.append("media", media[0].file);
    }

    if (!groupId) {
      
      setNotification({
        message: "Group ID is required to create a thread.",
        type: "error",
      });
      return;
    }
    newThread.append("group", groupId);

    for (let [key, value] of newThread.entries()) {
      console.log(key, value);
    }
    try {
      const res = await api.post("/api/groups/threads/create/", newThread, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });

      console.log(res.status);
      if (res.status === 201) {
        setNewThreadPopup(false);
        setRefreshThreads();
      } else {
        throw new Error("Failed to create thread.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
      } else {
        console.error("Error message:", error.message);
      }
    } finally {
    }
  };

  return (
    <>
      {}
      <div className="GroupView-new-thread-popup">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
        <div className="GroupView-new-thread-popup-body">
          <div className="GroupView-new-thread-popup-content">
            <h1 className="GroupView-new-thread-popup-title">
              Create new thread
            </h1>
            <input
              className="GroupView-new-thread-popup-input"
              type="text"
              placeholder="Thread title*"
              value={title}
              maxLength="254"
              onChange={(e) => setTitle(e.target.value)}
             
            />
            <textarea
              className="GroupView-new-thread-popup-textarea"
              placeholder="Thread description*"
              value={text}
              onChange={(e) => setText(e.target.value)}
              
            />

            <div className="form-post-selected-media">
              {media.map((mediaItem, index) => {
                return (
                  <div
                    key={index}
                    className="GroupView-new-thread-popup-post-form-media-file"
                    onClick={() => handleRemoveFile(index)}
                  >
                    {mediaItem.file.type.startsWith("image") && (
                      <img
                        src={mediaItem.url}
                        alt={mediaItem.file.name}
                        className="GroupView-new-thread-popup-post-form-media-preview"
                      />
                    )}
                    {mediaItem.file.type.startsWith("video") && (
                      <video
                        src={mediaItem.url}
                        controls
                        className="GroupView-new-thread-popup-post-form-media-preview"
                      />
                    )}
                    {mediaItem.file.type === "gif" && (
                      <img
                        src={mediaItem.url}
                        alt={mediaItem.file.name}
                        className="GroupView-new-thread-popup-post-form-media-preview"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="GroupView-new-thread-popup-sidebar">
            <div className="GroupView-new-thread-button-containter">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <input
                type="file"
                accept=".gif"
                ref={gifInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                className="GroupView-new-thread-popup-button-create"
                onClick={handleSubmit}
              >
                Create
              </button>
              <button
                onClick={handleDiscard}
                className="GroupView-new-thread-popup-button-discard"
              >
                Discard
              </button>
            </div>

            <div className="GroupView-new-thread-popup-container">
              <button
                className="GroupView-new-thread-popup-action-buttons"
                onClick={handleUploadGif}
              >
                <img src={gif_icon} alt="GIF Icon" />
              </button>
              <button
                className="GroupView-new-thread-popup-action-buttons"
                onClick={handleUploadPhoto}
              >
                <img src={img_icon} alt="IMG Icon" />
              </button>
              <button
                className="GroupView-new-thread-popup-action-buttons"
                onClick={handleUploadVideo}
              >
                <img src={video_icon} alt="VIDEO Icon" />
              </button>
            </div>
            <div className="GroupView-new-thread-popup-emoji-grid-container">
              {emojiArray.map((emoji, index) => (
                <div
                  key={index}
                  className="GroupView-new-thread-popup-emoji-box"
                  onClick={() => addEmoji(emoji)}
                >
                  <span className="GroupView-new-thread-popup-emoji">
                    {emoji}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewThreadPopup;
