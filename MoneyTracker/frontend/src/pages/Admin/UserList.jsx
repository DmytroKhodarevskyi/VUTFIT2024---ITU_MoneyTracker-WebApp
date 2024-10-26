// src/components/UserList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import api from "../../api"; // Ensure you have an axios instance

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) {
      return;
    }
  
    try {
      await api.delete(`/api/custom_admin/users/delete/${id}/`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/custom_admin/users/"); // Ensure the path matches your Django API endpoint
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User List</h1>
      <ul className="admin-userlist">
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/custom-admin/users/${user.id}`} className="admin-useritem">
              <h1 className="admin-user-label">USERNAME:</h1>
              <h2 className="admin-user-value">{user.username}</h2>
              <h1 className="admin-user-label">EMAIL:</h1>
              <h2 className="admin-user-value">{user.email}</h2>
              <h1 className="admin-user-label">FIRSTNAME:</h1>
              <h2 className="admin-user-value">{user.first_name}</h2>
              <h1 className="admin-user-label">LASTNAME:</h1>
              <h2 className="admin-user-value">{user.last_name}</h2>
            </Link>

            <button onClick={() => handleDelete(user.id)}> DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
