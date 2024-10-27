import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api'; // Ensure you have an axios instance

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuperuserStatus = async () => {
      try {
        const response = await api.get('/api/custom_admin/check_superuser/');
        if (response.data.is_superuser) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Failed to check superuser status', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkSuperuserStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />; // Redirect to login or an error page if not a superuser
  }

  return children;
};

export default AdminRoute;