/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import WishlistContext from './WishlistContext';
import AuthContext from '../Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, token } = useContext(AuthContext);

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setWishlistItems([]);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/v1/cart/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setWishlistItems(res.data.data.wishlist);
            }
        } catch (error) {
    console.error(error);
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) {
            toast.error('Please Login First.');
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/cart/wishlist`, {
                product_id: productId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                fetchWishlist();
            }
        } catch (error) {
    console.error(error);
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return;

        try {
            const res = await axios.delete(`${BASE_URL}/api/v1/cart/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 204 || res.data.status === 'success') {
                setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
            }
        } catch (error) {
    console.error(error);
            console.error('Error removing FROM public.wishlist:', error);
        }
    };

    const toggleWishlist = async (productId) => {
        const isInWishlist = wishlistItems.some(item => item.product_id === productId);
        if (isInWishlist) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product_id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            wishlistCount: wishlistItems.length,
            loading,
            fetchWishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
