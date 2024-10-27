// src/components/UserEdit.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

import api from "../../api";
import "./Admin.css";

const UserEdit = () => {
  const { pk } = useParams(); // Use pk to extract the ID from the URL
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
  }, [pk]); // Use pk as a dependency to fetch the correct user

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //         await api.put(`/api/users/${pk}/`, formData);
  //         navigate('/admin/users');
  //     } catch (err) {
  //         console.error(err);
  //         setError('Failed to update user');
  //     }
  // };

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
      </div>
    </>
  );
};

export default UserEdit;
