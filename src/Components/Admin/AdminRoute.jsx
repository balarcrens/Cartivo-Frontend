import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../Context/Auth/authContext';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gray-400">Verifying Admin Access</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
