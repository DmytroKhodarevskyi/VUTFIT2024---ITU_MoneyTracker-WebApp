import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./GroupCard.css";

function GroupCard({ id, name, subscribers, image }) {
  const [IsCreator, setIsCreator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const nav = useNavigate();

  const [IsSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(subscribers);

  const handleSubscribe = async () => {
    try {
      await api.post(`/api/groups/${id}/subscribe/`);
      console.log("Subscribed successfully");
      setSubscribersCount(subscribersCount + 1);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Failed to subscribe", error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await api.delete(`/api/groups/${id}/unsubscribe/`);
      console.log("Unsubscribed successfully");
      setSubscribersCount(subscribersCount - 1);
      setIsSubscribed(false);
    } catch (error) {
      console.error("Failed to unsubscribe", error);
    }
  }

  const handleEdit = () => {
    nav(`/groups/${id}/edit`);
  };

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await api.get(`/api/groups/${id}/checkcreator/`);
        const subscribed = await api.get(
          `/api/groups/${id}/checksubscription/`
        );
        setIsSubscribed(subscribed.data.is_subscribed);
        setIsCreator(response.data.is_creator);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch creator", error);
      }
    };

    fetchCreator();
  }, [id, name]);

  const SubscribeButton = () => {
    if (IsSubscribed) {
      return <button className="GroupCard-subscribe-button" onClick={handleUnsubscribe}>Unsubscribe</button>;
    } else {
      return <button className="GroupCard-subscribe-button" onClick={handleSubscribe}>Subscribe</button>;
    }
  };

  if (!isLoaded) {
    return (
      <>
        <div className="GroupCard-mainbox">
          <div className="GroupCard-image-text-container">
            <div
              className="GroupCard-image-container"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="GroupCard-NameDescription-container">
              <h2 className="GroupCard-Name">{name}</h2>
              
              <p className="GroupCard-Description">{subscribersCount} subscribers</p>
            </div>
          </div>

          <div className="GroupCard-buttons-container"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="GroupCard-mainbox">
        <div className="GroupCard-image-text-container">
          <div
            className="GroupCard-image-container"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="GroupCard-NameDescription-container">
            <h2 className="GroupCard-Name">{name}</h2>
            <p className="GroupCard-Description">{subscribersCount} subscribers</p>
          </div>
        </div>

        <div className="GroupCard-buttons-container">
          <button
            className="GroupCard-view-button"
            onClick={() => {
              nav(`/groups/${id}`);
            }}
          >
            View
          </button>

          {IsCreator ? (
              <button
                className="GroupCard-edit-button"
                onClick={handleEdit}
              >
                Edit
              </button>
            ) : (
              <SubscribeButton />
            )}
          
        </div>
      </div>
    </>
  );
}

export default GroupCard;
