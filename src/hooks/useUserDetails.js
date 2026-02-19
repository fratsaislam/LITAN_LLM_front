import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useUserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/auth/check');

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('User details fetch failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  return { user, loading };
};