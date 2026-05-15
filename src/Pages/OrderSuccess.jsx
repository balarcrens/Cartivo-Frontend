/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight, ShoppingBag, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../Context/Auth/authContext';
import confetti from "canvas-confetti";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function OrderSuccess() {
    const { orderId } = useParams();
    const { token } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [celebrated, setCelebrated] = useState(false);

    const fireCrackers = () => {
        var duration = 5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);

            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const palettes = [
        ['#16a34a', '#22c55e', '#4ade80', '#ffffff'],
        ['#facc15', '#ffd700', '#fff', '#ffec8b'],
        ['#38bdf8', '#0ea5e9', '#ffffff'],
        ['#c084fc', '#a855f7', '#ffffff']
    ];

    const fireSideCannons = () => {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            const colors = palettes[Math.floor(Math.random() * palettes.length)];

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setOrder(res.data.data.order);
                }
            } catch (error) {
    console.error(error);
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && orderId) {
            fetchOrder();
        }
    }, [token, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center animate-in">
                    <div className="luxury-spinner mb-4"></div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Confirming Order</p>
                </div>
            </div>
        );
    }
    return (
        <main className="min-h-screen bg-white pb-20 font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900">Order Confirmation</span>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center py-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.8
                    }}
                    className="mb-12 relative"
                >
                    <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-100 rounded-full z-0"
                    />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(16,185,129,0.3)] border-white">
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5 }}
                                onAnimationComplete={() => {
                                    if (!celebrated) {
                                        fireCrackers();

                                        setTimeout(() => {
                                            fireSideCannons();
                                        }, 200);

                                        setCelebrated(true);
                                    }
                                }}
                            >
                                <Check className="w-12 h-12 text-white stroke-[3px]" />
                            </motion.div>
                        </div>

                        <div className="flex flex-col items-center gap-3 mb-6">
                            <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full border border-emerald-100">
                                Transaction Secured
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-light text-gray-900 uppercase tracking-tight mb-6 leading-tight">
                            Order Placed.
                        </h1>

                        <p className="text-gray-500 font-medium text-[11px] uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto flex items-center justify-center gap-4">
                            <span className="w-8 h-[1px] bg-gray-100" />
                            Order Reference <span className="text-gray-900 font-bold">#{orderId.split('-')[0].toUpperCase()}</span>
                            <span className="w-8 h-[1px] bg-gray-100" />
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-10 mb-16 text-left">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-10 border border-gray-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                            <Package className="w-32 h-32 text-gray-900" />
                        </div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 mb-8 border-b border-gray-100 pb-2 inline-block">Order Summary</h2>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 border border-emerald-100">Order Confirmed</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{order ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</span>
                            </div>
                            <div className="flex justify-between items-center text-indigo-600">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Method</span>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{order?.payment_method}</span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex justify-between items-baseline">
                                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]">Payment</span>
                                <span className="text-3xl font-bold text-gray-900 tracking-tighter block">₹{Number(order?.final_price).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#fafafa] p-10 border border-gray-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                            <MapPin className="w-32 h-32 text-gray-900" />
                        </div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 mb-8 border-b border-gray-100 pb-2 inline-block">Destination</h2>
                        <div className="space-y-5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{order?.shipping_address?.full_name}</p>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-light uppercase tracking-[0.15em] ml-4">
                                {order?.shipping_address?.address_line1}<br />
                                {order?.shipping_address?.address_line2 && `${order?.shipping_address?.address_line2}, `}
                                {order?.shipping_address?.city}, {order?.shipping_address?.state}<br />
                                {order?.shipping_address?.pincode}
                            </p>
                            <div className="pt-6 border-t border-gray-100 ml-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Contact Details</span>
                                <p className="text-xs font-bold text-gray-900 tracking-widest">{order?.shipping_address?.phone}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full cursor-pointer sm:w-auto px-12 py-5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 group shadow-xl shadow-gray-200/50"
                    >
                        Review Order Status <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                        to="/category/all"
                        className="w-full cursor-pointer sm:w-auto px-12 py-5 border border-gray-100 text-gray-900 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all flex items-center justify-center gap-4"
                    >
                        Explore More <ShoppingBag className="w-4 h-4" />
                    </Link>
                </div>

                <p className="mt-20 text-[11px] text-gray-300 font-bold uppercase tracking-[0.6em] animate-pulse">Cartivo Signature Experience</p>
            </div>
        </main>
    );
}
