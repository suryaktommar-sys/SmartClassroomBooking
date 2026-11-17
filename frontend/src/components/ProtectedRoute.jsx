
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                const response = await fetch(`${API_URL}/api/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            }
        };

        verifyUser();
    }, []);

    if (isAuthenticated === null) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Checking authentication...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
