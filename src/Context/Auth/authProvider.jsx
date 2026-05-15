/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import AuthContext from './authContext';

const safeParse = (value) => {
    if (!value || value === 'undefined') return null;

    try {
        return JSON.parse(value);
    } catch (error) {
    console.error(error);
        console.error('JSON parse error:', error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const [signupData, setSignupData] = useState(() => {
        const saved = localStorage.getItem('signupData');
        return safeParse(saved);
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        const parsedUser = safeParse(storedUser);

        if (parsedUser && storedToken) {
            setUser(parsedUser);
            setToken(storedToken);
        } else {
            // cleanup bad data if exists
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setToken(null);
        }

        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        if (!userData || !userToken) return;

        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    const updateSignupData = (data) => {
        if (!data) return;

        const newData = { ...(signupData || {}), ...data };
        setSignupData(newData);
        localStorage.setItem('signupData', JSON.stringify(newData));
    };

    const updateUser = (userData) => {
        if (!userData) return;
        const newUser = { ...(user || {}), ...userData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const clearSignupData = () => {
        setSignupData(null);
        localStorage.removeItem('signupData');
    };

    const value = {
        user,
        token,
        signupData,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        updateSignupData,
        clearSignupData,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};