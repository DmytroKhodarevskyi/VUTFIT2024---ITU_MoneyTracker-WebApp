import React from "react";
import api from "../../api";
import { useState, useEffect } from "react";
import "./ThreadRoot.css";
import ThreadIcon from "../../assets/ThreadIcon.svg";
import ArrowIcon from "../../assets/ArrowIcon.svg";

function ThreadRoot({ thread, baseurl, id }) {
  const [commentscount, setCommentscount] = useState(0);

  useEffect(() => {
    if (!thread) {
      return;
    }

    const fetchThread = async () => {
      try {
        // console.log(thread.id);
        const response = await api.get(
          `/api/groups/threads_comments/${thread.id}/commentscount/`
        );
        setCommentscount(response.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch comments count", error);
        setIsLoaded(true);
      }
    };
    fetchThread();
  }, [thread.id]);

  const [isLoaded, setIsLoaded] = useState(false);

//   console.log(thread.media_file);

  return (
    <>
      <div className="ThreadRoot-main-container">
        <div className="ThreadRoot-title-description-container">
          <h1 className="ThreadRoot-title">{thread.title}</h1>
          <p className="ThreadRoot-description">{thread.text_content}</p>
        </div>

        {thread.media_file && (
          <div className="ThreadRoot-image-container">
            <img
              draggable="false"
              className="ThreadRoot-image"
              src={thread.media_file}
              alt="thread"
            />
          </div>
        )}

        <div className="ThreadRoot-bottom-part-container">
          <div className="ThreadRoot-messages-container">
            <h2 className="ThreadRoot-messages-text">Messages</h2>
            <div className="ThreadRoot-messages-count-icon-container">
              <p className="ThreadRoot-messages-count">
                {commentscount.comments_count}
              </p>
              <img
                draggable="false"
                className="ThreadRoot-messages-icon"
                src={ThreadIcon}
                alt="message icon"
              />
            </div>
          </div>

          <div className="ThreadRoot-view-button-container">
            <h2 className="ThreadRoot-messages-text">View</h2>
            <img
              draggable="false"
              className="ThreadRoot-messages-icon-arrow"
              src={ArrowIcon}
              alt="message icon"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ThreadRoot;
