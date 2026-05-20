/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../Context/Auth/authContext';
import { Package, ChevronRight, ArrowRight, Clock, CheckCircle2, Truck, XCircle, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setOrders(res.data.data.orders);
                }
            } catch (error) {
                console.error(error);
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, isAuthenticated]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'delivered': return 'text-emerald-600 group-hover:text-white group-hover:bg-emerald-500 border-emerald-100';
            case 'shipped': return 'text-blue-600 group-hover:text-white group-hover:bg-blue-500 border-blue-100';
            case 'processing': return 'text-amber-600 group-hover:text-white group-hover:bg-amber-500 border-amber-100';
            case 'returned': return 'text-green-600 group-hover:text-white group-hover:bg-green-500 border-green-100';
            case 'cancelled': return 'text-rose-600 group-hover:text-white group-hover:bg-rose-500  border-rose-100';
            default: return 'text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'shipped': return <Truck className="w-3.5 h-3.5" />;
            case 'processing': return <Clock className="w-3.5 h-3.5" />;
            case 'returned': return <RotateCw className="w-3.5 h-3.5" />;
            case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gray-400">Loading your history</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900">Orders</span>
                    </nav>
                    <h1 className="text-4xl font-light text-gray-900 uppercase tracking-tight">
                        My <span className="italic font-serif">Orders</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order.id}
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="bg-white border border-gray-100 rounded-sm overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-wrap group items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Date</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Number</span>
                                                <span className="text-sm font-medium text-gray-900">#{order.id.split('-')[0].toUpperCase()}</span>
                                            </div>
                                            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Price</span>
                                                <span className="text-sm font-bold text-gray-900">₹{parseFloat(order.final_price).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className={`px-4 py-1.5 rounded-lg border flex transition-all duration-300 items-center gap-2 text-xs font-bold uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex space-x-1 overflow-hidden py-2">
                                            {order.item_details?.map((item, idx) => (
                                                <div key={idx} className="relative w-16 h-20 bg-gray-50 border-2 border-white rounded-sm overflow-hidden">
                                                    <img
                                                        src={item.image || 'https://placehold.co/100x120?text=Product'}
                                                        alt={item.name} loading='lazy'
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {order.item_details?.length > 2 && (
                                                <div className="w-16 h-20 bg-gray-900 border-2 border-white rounded-sm flex items-center justify-center text-white text-[10px] font-bold">
                                                    +{order.item_details.length - 2}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                                                {order.item_details?.[0]?.name}
                                                {order.item_details?.length > 1 && ` & ${order.item_details.length - 1} other items`}
                                            </h3>
                                            {order.shipping_address?.city &&
                                                <p className="text-gray-400 text-xs font-light">
                                                    Delivering to {order?.shipping_address?.city}
                                                </p>
                                            }
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 group-hover:translate-x-2 transition-transform">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-sm py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                            <Package className="w-8 h-8 text-gray-300 stroke-[1px]" />
                        </div>
                        <h2 className="text-2xl font-light uppercase tracking-widest text-gray-900 mb-3">No orders yet</h2>
                        <p className="text-gray-400 text-sm font-light mb-10 max-w-xs">
                            Your purchase history is currently empty. Start exploring our collections to find your next favorite piece.
                        </p>
                        <Link
                            to="/"
                            className="bg-gray-900 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 group active:scale-95 shadow-xl shadow-gray-200"
                        >
                            Shop Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
