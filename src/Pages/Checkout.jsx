/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    CreditCard,
    ChevronRight,
    Plus,
    Check,
    Loader2,
    ArrowRight,
    Tag,
    Truck,
    ShieldCheck,
    X,
    Edit2,
    CheckCircle2,
    RotateCcw,
    Trash2,
    Smartphone,
    Banknote,
} from 'lucide-react';
import AuthContext from '../Context/Auth/authContext';
import CartContext from '../Context/Cart/CartContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import SEO from '../Components/Common/SEO';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function Checkout() {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const { cartItems, fetchCart } = useContext(CartContext);
    const [checkoutItems, setCheckoutItems] = useState([]);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const [showSuggestion, setShowSuggestion] = useState(false);

    const [addressForm, setAddressForm] = useState({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        is_default: false
    });

    useEffect(() => {
        if (!token) {
            navigate('/auth/signin');
            return;
        }

        const session = localStorage.getItem('checkout_session');
        if (session) {
            setCheckoutItems(JSON.parse(session));
        } else if (cartItems.length > 0) {
            setCheckoutItems(cartItems);
        }

        fetchAddresses();
        fetchActiveCoupons();
    }, [token]);

    useEffect(() => {
        if (!localStorage.getItem('checkout_session') && cartItems.length > 0) {
            setCheckoutItems(cartItems);
        }
    }, [cartItems]);

    const fetchActiveCoupons = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/coupons/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveCoupons(res.data.data.coupons);
        } catch (error) {
            console.error(error);
            console.error("Error fetching coupons", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setAddresses(res.data.data.addresses);
                const defaultAddr = res.data.data.addresses.find(a => a.is_default);
                if (defaultAddr) setSelectedAddress(defaultAddr);
                else if (res.data.data.addresses.length > 0) setSelectedAddress(res.data.data.addresses[0]);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status !== 404) {
                console.error('Error fetching addresses:', error);
            } else {
                setAddresses([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEditingAddress) {
                const res = await axios.patch(`${BASE_URL}/api/v1/addresses/${isEditingAddress.id}`, addressForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    await fetchAddresses();
                    setIsAddingAddress(false);
                    setIsEditingAddress(null);
                    toast.success('Address updated successfully');
                }
            } else {
                const res = await axios.post(`${BASE_URL}/api/v1/addresses`, addressForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    await fetchAddresses();
                    setIsAddingAddress(false);
                    toast.success('Address saved successfully');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (addressId) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete address?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/addresses/${addressId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                fetchAddresses();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete address');
            }
        }
    }

    const handleApplyCoupon = async (code = null) => {
        const targetCode = typeof code === 'string' ? code : couponCode;
        if (!targetCode) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/coupons/check/${targetCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                const coupon = res.data.data.coupon;

                if (checkoutSubtotal < Number(coupon.min_order_value)) {
                    setCouponError(`Minimum order value for this coupon is ₹${coupon.min_order_value}`);
                } else {
                    setAppliedCoupon(coupon);
                    setCouponCode('');
                }
            }
        } catch (error) {
            console.error(error);
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discount_type === 'percentage') {
            let discount = (checkoutSubtotal * Number(appliedCoupon.value)) / 100;
            if (appliedCoupon.max_discount && discount > Number(appliedCoupon.max_discount)) {
                discount = Number(appliedCoupon.max_discount);
            }
            return discount;
        } else {
            return Number(appliedCoupon.value);
        }
    };

    const calculateSubtotal = () => {
        return checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const checkoutSubtotal = calculateSubtotal();
    const shippingCharge = 0;
    const discountAmount = calculateDiscount();
    const finalPrice = checkoutSubtotal - discountAmount + shippingCharge;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            // Already loaded
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (orderLoading) return;

        if (addresses.length === 0) {
            setShowSuggestion(true);
            window.scroll(0, 0);
            toast.error("Please add shipping address first");

            setTimeout(() => {
                setShowSuggestion(false);
            }, 4000);

            return;
        }

        setOrderLoading(true);

        try {
            if (paymentMethod === 'Online Payment') {

                const loaded = await loadRazorpay();

                if (!loaded) {
                    toast.error("Razorpay SDK failed to load");
                    setOrderLoading(false);
                    return;
                }
            }

            const payload = {
                shipping_address: selectedAddress,
                items: checkoutItems.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity
                })),
                coupon_id: appliedCoupon?.id,
                payment_method: paymentMethod
            };

            const res = await axios.post(`${BASE_URL}/api/v1/orders`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                const { order, razorpay_order, razorpay_key_id, temp_order_data } = res.data.data;

                if (paymentMethod === 'Cash on Delivery') {
                    localStorage.removeItem('checkout_session');
                    fetchCart();
                    navigate(`/order-success/${order.id}`);
                } else if (razorpay_order) {
                    if (!window.Razorpay) {
                        toast.error("Razorpay SDK not loaded. Please refresh the page.");
                        setOrderLoading(false);
                        return;
                    }

                    const options = {
                        key: razorpay_key_id,
                        amount: razorpay_order.amount,
                        currency: "INR",
                        name: "Cartivo Luxury",
                        description: `Payment for order`,
                        order_id: razorpay_order.id,

                        handler: async function (response) {
                            try {
                                const verifyRes = await axios.post(
                                    `${BASE_URL}/api/v1/orders/verify-payment`,
                                    {
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_signature: response.razorpay_signature,
                                        temp_order_data: temp_order_data // Send data for order creation
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }
                                );

                                if (verifyRes.data.status === 'success') {
                                    localStorage.removeItem('checkout_session');
                                    fetchCart();
                                    navigate(`/order-success/${verifyRes.data.order_id}`);
                                }

                            } catch (error) {
                                console.error(error);
                                console.error("Verification error:", error);
                                toast.error(error.response?.data?.message || "Payment verification failed");
                            } finally {
                                setOrderLoading(false);
                            }
                        },

                        modal: {
                            ondismiss: function () {
                                setOrderLoading(false);
                            },
                            backdropclose: false,
                            escape: false,
                            animation: true
                        },

                        prefill: {
                            name: user?.name || '',
                            email: user?.email || '',
                            contact: selectedAddress?.phone || ''
                        },

                        retry: {
                            enabled: true
                        },

                        theme: {
                            color: "#1E3A8A"
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        toast.error("Payment failed: " + response.error.description);
                        setOrderLoading(false);
                    });
                    rzp.open();
                }
            }
        } catch (error) {
            console.error(error);
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || 'Failed to place order');
            setOrderLoading(false);
        }
    };

    const removeFromCheckout = (id) => {
        const updated = checkoutItems.filter(item => item.id !== id);
        setCheckoutItems(updated);
        removeCoupon();
        localStorage.setItem('checkout_session', JSON.stringify(updated));
    };

    const openEditAddress = (addr) => {
        setAddressForm({
            full_name: addr.full_name,
            phone: addr.phone,
            address_line1: addr.address_line1,
            address_line2: addr.address_line2 || '',
            city: addr.city,
            state: addr.state,
            country: addr.country,
            pincode: addr.pincode,
            is_default: addr.is_default
        });
        setIsEditingAddress(addr);
        setIsAddingAddress(true);
    };

    const openAddAddress = () => {
        setAddressForm({
            full_name: user?.name || '',
            phone: user?.phone || '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            is_default: false
        });
        setIsEditingAddress(null);
        setIsAddingAddress(true);
    };

    if (loading && !isAddingAddress) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center animate-in">
                    <div className="luxury-spinner mb-4"></div>
                    <p className="text-[12px] uppercase tracking-[0.4em] text-gray-400 font-bold">Secure Gateway</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-20 font-outfit">
            <SEO 
                title="Secure Checkout | Cartivo"
                description="Securely finalize your order at Cartivo. Complimentary shipping and insured express checkout."
                keywords="checkout, secure checkout, purchase, cart, order payment, cartivo"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                    <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="hover:text-gray-900 transition-colors">Shopping Bag</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900">Checkout</span>
                    </nav>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Shipping</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300 hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[11px] font-bold">2</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    <div className="lg:w-3/5 space-y-6">
                        <div>
                            <h1 className="text-4xl font-semibold text-gray-900 uppercase tracking-tight mb-8">Shipping Information</h1>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900">Select Address</h2>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={openAddAddress}
                                            className={`text-xs font-bold cursor-pointer uppercase tracking-widest transition-all flex items-center gap-2 ${showSuggestion
                                                ? 'text-rose-600 animate-pulse'
                                                : 'text-amber-600 hover:text-amber-700'
                                                }`}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add New Boutique Address
                                        </button>

                                        <AnimatePresence>
                                            {showSuggestion && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full mt-3 right-0 z-50"
                                                >
                                                    <div className="bg-gray-900 text-white text-[11px] uppercase tracking-wider px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700">
                                                        Please add shipping address first
                                                    </div>

                                                    <div className="absolute -top-1 right-6 w-3 h-3 bg-gray-900 rotate-45 border-l border-t border-gray-700" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`relative p-6 border transition-all cursor-pointer ${selectedAddress?.id === addr.id
                                                ? 'border-gray-900 bg-[#fafafa]'
                                                : 'border-gray-100 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">{addr.full_name}</h3>
                                                    {addr.is_default && (
                                                        <span className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-900 text-white">Default</span>
                                                    )}
                                                </div>
                                                {selectedAddress?.id === addr.id ? (
                                                    <div className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => { deleteAddress(addr.id); }}
                                                        className="text-gray-400 cursor-pointer hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 leading-relaxed font-light mb-4 uppercase tracking-wider">
                                                {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                                                {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{addr.phone}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditAddress(addr); }}
                                                        className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {addresses.length === 0 && (
                                        <div className="col-span-full py-16 border border-dashed border-gray-100 flex flex-col items-center justify-center bg-[#fafafa]/50">
                                            <MapPin className="w-8 h-8 text-gray-200 mb-4 stroke-1" />
                                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">No boutique addresses found</p>
                                            <button
                                                onClick={openAddAddress}
                                                className="mt-4 text-[12px] cursor-pointer font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-gray-900 pb-1"
                                            >
                                                Add First Address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 mb-4 border-b border-gray-900 pb-2 inline-block">Order Summary</h2>
                            <div className="space-y-10">
                                {checkoutItems.map((item) => (
                                    <div key={item.id} className="flex sm:gap-8 flex-wrap group animate-in">
                                        <div className="w-24 h-32 bg-[#f9f9f9] overflow-hidden flex-shrink-0 relative border border-gray-100">
                                            <img
                                                src={item.product_images?.[0] || 'https://placehold.co/150'}
                                                alt={item.product_name} loading='lazy'
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-[2000ms]"
                                            />
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-900">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-grow pt-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest line-clamp-1 mb-2">{item.product_name}</h3>
                                                    {item.variant_name && (
                                                        <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">{item.variant_name}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 tracking-tight">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price:</span>
                                                    <span className="text-xs font-bold text-gray-600">₹{Number(item.price).toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity:</span>
                                                    <span className="text-xs font-bold text-gray-600">{item.quantity}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCheckout(item.id)}
                                                    className="ml-auto text-[10px] cursor-pointer font-bold text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-1 group/btn"
                                                >
                                                    <Trash2 className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {checkoutItems.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your selection is empty</p>
                                        <Link to="/" className="mt-4 inline-block text-[12px] font-bold text-gray-900 border-b border-gray-900 pb-1 uppercase tracking-widest">Return to Boutique</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/5">
                        <div className="sticky top-32 space-y-5 bg-[#fafafa] sm:p-6 border border-gray-100">
                            <div>
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 mb-8 border-b border-gray-900 pb-2 inline-block">Pricing Details</h2>

                                <div className="pb-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-900">Payment Selection</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { id: 'Cash on Delivery', image: 'https://cdn-icons-png.flaticon.com/512/10351/10351751.png', label: 'Cash on Delivery' },
                                            { id: 'Online Payment', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1280px-Google_Pay_Logo.svg.png', label: 'Online Payment (UPI / Card / Wallets)' },
                                        ].map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 border cursor-pointer rounded-lg flex items-center justify-between transition-all ${paymentMethod === method.id ? 'border-green-600 bg-white shadow-lg shadow-gray-100' : 'border-gray-100 bg-[#fdfdfd] hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 flex justify-center items-center`}>
                                                        <img src={method.image} loading='lazy' alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className={`text-[11px] font-bold uppercase tracking-widest ${paymentMethod === method.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {method.label}
                                                    </span>
                                                </div>
                                                {paymentMethod === method.id && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="flex flex-wrap sm:gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="ENTER PROMO CODE"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-grow bg-white border border-gray-100 px-6 py-4 text-[11px] font-bold tracking-[0.3em] focus:outline-none focus:border-gray-900 transition-all placeholder:text-gray-400 uppercase"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponCode}
                                            className="flex-grow px-8 py-4 bg-gray-900 text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                                        >
                                            {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-[12px] text-rose-500 font-bold uppercase tracking-widest mb-4 animate-in">{couponError}</p>}

                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between p-4 bg-white border border-emerald-100 animate-in mb-6">
                                            <div className="flex items-center gap-3">
                                                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{appliedCoupon.code} Applied</span>
                                            </div>
                                            <button onClick={removeCoupon} className="text-gray-400 cursor-pointer hover:text-rose-500 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {activeCoupons.length > 0 && (
                                        <div className="mt-8 animate-in">
                                            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-900">Boutique Privileges</span>
                                            </div>
                                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                                {activeCoupons.map((coupon) => (
                                                    <div
                                                        key={coupon.id}
                                                        onClick={() => handleApplyCoupon(coupon.code)}
                                                        className={`flex-shrink-0 w-48 p-4 border transition-all cursor-pointer group relative overflow-hidden ${couponCode === coupon.code ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100 bg-white hover:border-emerald-200'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-sm font-bold text-gray-900 tracking-widest">{coupon.code}</span>
                                                            <Tag className="w-3 h-3 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <p className="text-xs text-emerald-600 font-bold uppercase">
                                                            {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 uppercase tracking-tighter mt-1 font-medium">
                                                            Min. Order ₹{coupon.min_order_value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pb-8 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                                        <span className="text-sm font-bold text-gray-900 tracking-tight">₹{Number(checkoutSubtotal).toLocaleString('en-IN')}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-emerald-600">
                                            <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Coupon Discount</span>
                                            <span className="text-sm font-bold tracking-tight">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}

                                    {(checkoutItems.length !== 0) && <div className="flex justify-between items-center text-blue-600">
                                        <div className="flex items-center gap-2">
                                            <Truck className="w-3.5 h-3.5" />
                                            <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Express Shipping</span>
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">
                                            {shippingCharge === 0 ? (
                                                <span className="uppercase text-[11px] tracking-[0.2em] bg-blue-50 px-2 py-0.5 border border-blue-100 font-bold">Complimentary</span>
                                            ) : (
                                                `₹${shippingCharge}`
                                            )}
                                        </span>
                                    </div>}
                                </div>

                                <div className="py-10 flex flex-wrap gap-2 justify-between items-baseline">
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-[0.3em]">Estimated Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-gray-900 tracking-tighter block">₹{finalPrice.toLocaleString('en-IN')}</span>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">VAT & Duties Inclusive</p>
                                    </div>
                                </div>

                                <button
                                    disabled={orderLoading}
                                    onClick={handlePlaceOrder}
                                    className="w-full cursor-pointer bg-gray-900 text-white py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-gray-200/50 group"
                                >
                                    {orderLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {orderLoading ? 'Processing...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                    <Link to="/privacy-policy" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">Secure Checkout</span>
                                    </Link>
                                    <Link to="/return-policy" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                                        <RotateCcw className="w-4 h-4 text-blue-600" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">Easy Returns</span>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-amber-600" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Insured Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAddingAddress && (
                    <div className="fixed inset-0 z-[1000] flex justify-center p-4 sm:p-6 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingAddress(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl h-fit bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] border border-gray-100"
                        >
                            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-gray-900">
                                        {isEditingAddress ? 'Refine Boutique Address' : 'New Delivery Destination'}
                                    </h2>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ensuring precision in every delivery</p>
                                </div>
                                <button
                                    onClick={() => setIsAddingAddress(false)}
                                    className="p-2 -mr-2 text-gray-400 cursor-pointer hover:text-gray-900 transition-all rounded-full hover:bg-gray-50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto custom-scrollbar flex-grow p-6 sm:p-8">
                                <form onSubmit={handleAddressSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                required
                                                value={addressForm.full_name}
                                                onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all uppercase tracking-wider placeholder:text-gray-200"
                                                placeholder="Recipient Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                            <input
                                                required
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all placeholder:text-gray-200"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address Line 1</label>
                                            <input
                                                required
                                                value={addressForm.address_line1}
                                                onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all uppercase tracking-wider placeholder:text-gray-200"
                                                placeholder="Street Address, P.O. Box, etc."
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Area / Locality</label>
                                            <input
                                                value={addressForm.address_line2}
                                                onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all uppercase tracking-wider placeholder:text-gray-200"
                                                placeholder="Apartment, suite, unit, building, floor, etc."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                                            <input
                                                required
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all uppercase tracking-wider placeholder:text-gray-200"
                                                placeholder="Enter City"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                                            <input
                                                required
                                                value={addressForm.pincode}
                                                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                className="w-full px-5 py-4 bg-[#fcfcfc] border border-gray-100 focus:outline-none focus:border-gray-900 font-medium text-sm transition-all placeholder:text-gray-200"
                                                placeholder="6-digit PIN code"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 group cursor-pointer" onClick={() => setAddressForm({ ...addressForm, is_default: !addressForm.is_default })}>
                                        <div className={`w-5 h-5 border flex items-center justify-center transition-all ${addressForm.is_default ? 'bg-gray-900 border-gray-900' : 'border-gray-200 group-hover:border-gray-400'}`}>
                                            {addressForm.is_default && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest select-none">Set as primary shipping destination</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-10 sticky bottom-0 bg-white border-t border-gray-50 -mx-8 px-8 pb-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="flex-1 px-8 py-4 border cursor-pointer border-gray-100 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-8 py-4 cursor-pointer bg-gray-900 text-white text-[12px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-gray-200"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                <>
                                                    Save Boutique Address
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main >
    );
}
