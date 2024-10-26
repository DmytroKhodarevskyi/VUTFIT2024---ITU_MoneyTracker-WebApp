// src/components/UserEdit.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const UserEdit = () => {
    const { pk } = useParams();  // Use pk to extract the ID from the URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/users/${pk}/`);  // Make sure to use pk here
                setUser(response.data);
                setFormData(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [pk]); // Use pk as a dependency to fetch the correct user

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/users/${pk}/`, formData);
            navigate('/admin/users');
        } catch (err) {
            console.error(err);
            setError('Failed to update user');
        }
    };

    if (loading) return <p>Loading user...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default UserEdit;
