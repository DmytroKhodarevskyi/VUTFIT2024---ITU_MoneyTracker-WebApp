import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./GroupCard.css";

function GroupCard({ id, name, subscribers, image }) {
  const [IsCreator, setIsCreator] = useState(false);

  // const groupId = key;
  const nav = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await api.get(`/api/groups/${id}/checkcreator/`);
        setIsCreator(response.data.is_creator);
      } catch (error) {
        console.error("Failed to fetch creator", error);
      }
    };

    fetchCreator();
  }, [id, name]);

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
            <p className="GroupCard-Description">{subscribers} subscribers</p>
          </div>
        </div>

        <div className="GroupCard-buttons-container">
          <button
            onClick={() => {
              nav(`/groups/${id}`);
            }}
          >
            View
          </button>

          {IsCreator ? <button>Edit</button> : <button>Subscribe</button>}
        </div>
      </div>
    </>
  );
}

export default GroupCard;
