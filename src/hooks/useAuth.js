import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/check');

        const data = response.data;
        console.log('Auth check response:', data);

        if (data.success) {
          setIsAuthenticated(true);
          setUser(data.user);
          // Sync localStorage just in case, though ideally we rely on the state/hook
          localStorage.setItem('role', data.user.role);
          localStorage.setItem('authToken', 'true'); // Placeholder if using cookies, or actual token if returned
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('role');
          navigate('/login');
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthenticated, user, loading };
};