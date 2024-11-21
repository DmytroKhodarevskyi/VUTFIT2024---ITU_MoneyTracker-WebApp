import React from "react";
import api from "../../api";
import { useState, useEffect, useRef } from "react";
import "./ThreadRoot.css";
import ThreadIcon from "../../assets/ThreadIcon.svg";
import ArrowIcon from "../../assets/ArrowIcon.svg";
import MoreIcon from "../../assets/MoreIcon.svg";
import { useNavigate } from "react-router-dom";

function ThreadRoot({ thread, admin, baseurl, id, setRefreshThreads }) {
  const [commentscount, setCommentscount] = useState(0);
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  // const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const [modalState, setModalState] = useState(1);

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

  const openModal = (event) => {
    // setModalPosition({ x: event.clientX, y: event.clientY });
    setModalVisible(true);
  };

  const modalStateRender = () => {
    if (modalState === 1) {
      return modalstate1();
    } else {
      return modalstate2();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalState(1);
    setRefreshThreads();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/groups/threads/${id}/delete/`);
      closeModal();
    } catch (error) {
      console.error("Failed to delete thread", error);
    }
  };

  const modalstate1 = () => {
    return (
      <div
        ref={modalRef}
        className="ThreadRoot-modal"
        // style={{
        //   position: "relative",
        //   top: modalPosition.y,
        //   left: modalPosition.x,
        // }}
      >
        <button
          className="ThreadRoot-modal-button-delete"
          onClick={() => {
            setModalState(2);
          }}
        >
          Delete Post
        </button>

        <button onClick={closeModal}>Close</button>
      </div>
    );
  };

  const modalstate2 = () => {
    return (
      <div
        ref={modalRef}
        className="ThreadRoot-modal-2"
        // style={{
        //   position: "absolute",
        //   top: modalPosition.y,
        //   left: modalPosition.x,
        // }}
      >
        <h1>Are you sure?</h1>

        <button onClick={handleDelete}>Yes</button>
        <button onClick={closeModal}>No</button>
      </div>
    );
  };

  useEffect(() => {
    if (modalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible]);

  const handleViewClick = () => {
    navigate(`/thread/${id}`, { state: { thread } });
  };

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

          <div className="ThreadRoot-view-button-more-container">
            {admin && (
              <div onClick={openModal} className="ThreadRoot-more-button">
                <img src={MoreIcon} draggable="false" alt="arrow" />
              </div>
            )}

            <div
              className="ThreadRoot-view-button-container"
              onClick={handleViewClick}
            >
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

        {modalVisible && modalStateRender()}
      </div>

      {/* {modalVisible && (
        modalStateRender()
      )} */}
    </>
  );
}

export default ThreadRoot;
