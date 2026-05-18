/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import CartContext from './CartContext';
import AuthContext from '../Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { isAuthenticated, token } = useContext(AuthContext);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setCartItems([]);
            setCartCount(0);
            setCartSubtotal(0);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/v1/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setCartItems(res.data.data.cart);
                setCartSubtotal(res.data.data.subtotal);
                setCartCount(res.data.data.totalItems);
            }
        } catch (error) {
    console.error(error);
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, variantId, quantity = 1) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/cart`, {
                product_id: productId,
                variant_id: variantId,
                quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                fetchCart();
                setIsCartOpen(true);
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to add item to cart');
            console.error(error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/v1/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 204 || res.data.status === 'success') {
                fetchCart();
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to remove item from cart');
            console.error(error);
        }
    };

    const clearCart = async () => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/v1/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 204 || res.data.status === 'success') {
                setCartItems([]);
                setCartCount(0);
                setCartSubtotal(0);
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to clear cart');
            console.error(error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        try {
            const res = await axios.patch(`${BASE_URL}/api/v1/cart/update-quantity`, {
                id: itemId,
                quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                fetchCart();
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to update quantity');
            console.error(error);
        }
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, cartSubtotal, loading, addToCart, removeFromCart, clearCart, updateQuantity, isCartOpen, setIsCartOpen, toggleCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}
