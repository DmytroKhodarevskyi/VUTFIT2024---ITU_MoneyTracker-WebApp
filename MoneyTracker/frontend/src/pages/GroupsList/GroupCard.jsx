import React from "react";
import { useEffect, useState } from "react";
import api from "../../api";
import "./GroupCard.css";

function GroupCard({ name, subscribers, image }) {
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
          <button>View</button>
          <button>Subscribe</button>
        </div>
      </div>
    </>
  );
}

export default GroupCard;
