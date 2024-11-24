

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

import api from "../../api";
import "./Admin.css";

const UserEdit = () => {
  const { pk } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = await api.get(
            `/api/custom_admin/users/${pk}/username/`
          );

        setUsername(username.data.username);
      } catch (err) {
        console.error(err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pk]); 

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Data</h1>
        <Link
          to={`/custom-admin/users/${pk}/transactions`}
          className="admin-useritem"
        >
          <button className="admin-user-button">
            <a> Transactions</a>
          </button>
        </Link>
        <Link
          to={`/custom-admin/users/${pk}/categories`}
          className="admin-useritem"
        >
          <button className="admin-user-button">
            <a> Categories</a>
          </button>
        </Link>
        <Link
          to={`/custom-admin/users/${pk}/publications`}
          className="admin-useritem"
        >
          <button className="admin-user-button">
            <a> Publications</a>
          </button>
        </Link>
        <Link
          to={`/custom-admin/users/${pk}/groups`}
          className="admin-useritem"
        >
          <button className="admin-user-button">
            <a> Groups</a>
          </button>
        </Link>
        <Link
          to={`/custom-admin/users/${pk}/reminders`}
          className="admin-useritem"
        >
          <button className="admin-user-button">
            <a> Reminders</a>
          </button>
        </Link>
      </div>
    </>
  );
};

export default UserEdit;
