import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [authStatus, setAuthStatus] = useState('checking'); // checking, authenticated, unauthenticated
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token) {
            setAuthStatus('unauthenticated');
        } else {
            setAuthStatus('authenticated');
            setUserRole(role);
        }
    }, []);

    if (authStatus === 'checking') {
        return <Spinner />;
    }

    if (authStatus === 'unauthenticated') {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/not-found" replace />;
    }

    return children;
};

export default ProtectedRoute;