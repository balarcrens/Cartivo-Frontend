/* eslint-disable react-hooks/immutability */
import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../Context/Auth/authContext';
import { User, Phone, Mail, Camera, Save, ShoppingBag, MapPin, Shield, LogOut, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'addresses'

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        profile_image: user?.profile_image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [addresses, setAddresses] = useState([]);
    const [isAddrLoading, setIsAddrLoading] = useState(false);
    const [showAddrForm, setShowAddrForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addrFormData, setAddrFormData] = useState({
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
        if (activeTab === 'addresses') {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchAddresses = async () => {
        setIsAddrLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/v1/addresses'`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setAddresses(data.data.addresses);
            }
        } catch (error) {
    console.error(error);
            console.error('Error fetching addresses:', error);
        } finally {
            setIsAddrLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/v1/users/updateMe`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.status === 'success') {
                updateUser(data.data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
    console.error(error);
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Address Handlers
    const handleAddrChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddrFormData({
            ...addrFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleEditClick = (addr) => {
        setEditingAddress(addr);
        setAddrFormData({
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
        setShowAddrForm(true);
    };

    const handleAddrSubmit = async (e) => {
        e.preventDefault();
        setIsAddrLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = editingAddress
                ? `${BASE_URL}/api/v1/addresses/${editingAddress.id}`
                : `${BASE_URL}/api/v1/addresses`;
            const method = editingAddress ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addrFormData)
            });

            const data = await response.json();
            if (data.status === 'success') {
                fetchAddresses();
                setShowAddrForm(false);
                setEditingAddress(null);
                setAddrFormData({
                    full_name: '', phone: '', address_line1: '', address_line2: '',
                    city: '', state: '', country: 'India', pincode: '', is_default: false
                });
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to save address');
            console.error(error);
        } finally {
            setIsAddrLoading(false);
        }
    };

    const handleDeleteAddr = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete the address?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${BASE_URL}/api/v1/addresses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (error) {
    console.error(error);
            toast.error('Failed to delete the address');
            console.error(error);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${BASE_URL}/api/v1/addresses/${id}/set-default`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (error) {
    console.error(error);
            toast.error('Failed set default address:');
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth/signin');
    };

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 animate-in">
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">My Account</h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-[0.2em]">
                        {activeTab === 'profile' ? 'Manage your profile and preferences' : 'Manage your saved delivery locations'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6 animate-in" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-white border border-gray-100 p-4 sm:p-8 flex flex-col items-center text-center sticky top-24">
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, profile_image: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                    id="profile-image-upload"
                                />
                                <label htmlFor="profile-image-upload" className="block relative cursor-pointer group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-50 mb-4 group-hover:opacity-80 transition-all duration-300">
                                        <img src={formData.profile_image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} alt="User" loading='lazy' className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-4 right-0 bg-gray-900 text-white p-2 rounded-full border-2 border-white shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Camera size={14} />
                                    </div>
                                </label>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-400 text-[12px] uppercase tracking-widest mt-1">{user?.role || 'Customer'}</p>

                            <div className="w-full h-px bg-gray-50 my-6" />

                            <div className="w-full space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full cursor-pointer flex items-center justify-between p-3 rounded-md transition-colors group text-left ${activeTab === 'profile' ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User size={18} className={activeTab === 'profile' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} />
                                        <span className="text-sm font-medium">Personal Information</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full cursor-pointer flex items-center justify-between p-3 rounded-md transition-colors group text-left ${activeTab === 'addresses' ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className={activeTab === 'addresses' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} />
                                        <span className="text-sm font-medium">Saved Addresses</span>
                                    </div>
                                </button>
                                <button onClick={() => navigate('/orders')} className="w-full cursor-pointer flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors group text-left">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag size={18} className="text-gray-400 group-hover:text-gray-900" />
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Order History</span>
                                    </div>
                                </button>
                                <button onClick={handleLogout} className="w-full cursor-pointer flex items-center justify-between p-3 rounded-md hover:bg-red-50 transition-colors group text-left mt-4">
                                    <div className="flex items-center gap-3">
                                        <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
                                        <span className="text-sm font-medium text-red-500 group-hover:text-red-700">Logout</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 animate-in" style={{ animationDelay: '0.2s' }}>
                        {activeTab === 'profile' ? (
                            <div className="bg-white border border-gray-100 p-4 sm:p-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-50 pb-4 uppercase tracking-widest text-[12px]">Profile Information</h3>

                                {message.text && (
                                    <div className={`mb-6 p-4 text-sm font-medium rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleProfileUpdate} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <User size={16} className="text-gray-300 group-focus-within:text-gray-900 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleProfileChange}
                                                    className="w-full bg-gray-50 border border-transparent px-10 py-3.5 text-sm font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Phone size={16} className="text-gray-300 group-focus-within:text-gray-900 transition-colors" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleProfileChange}
                                                    className="w-full bg-gray-50 border border-transparent px-10 py-3.5 text-sm font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address (Primary)</label>
                                            <div className="relative group opacity-60">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail size={16} className="text-gray-300" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-gray-100 border border-transparent px-10 py-3.5 text-sm font-medium cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-[12px] text-gray-400 italic mt-1 ml-1">Email cannot be changed for security reasons.</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="bg-gray-900 cursor-pointer text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isUpdating ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Save size={14} />
                                            )}
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-widest text-[12px]">Saved Addresses</h3>
                                        {!showAddrForm && (
                                            <button
                                                onClick={() => { setShowAddrForm(true); setEditingAddress(null); }}
                                                className="flex cursor-pointer items-center gap-2 text-indigo-600 font-bold text-[12px] uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                            >
                                                <Plus size={16} /> Add New
                                            </button>
                                        )}
                                    </div>

                                    {showAddrForm ? (
                                        <form onSubmit={handleAddrSubmit} className="space-y-6 animate-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={addrFormData.full_name}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={addrFormData.phone}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        name="address_line1"
                                                        value={addrFormData.address_line1}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Address Line 2 (Optional)</label>
                                                    <input
                                                        type="text"
                                                        name="address_line2"
                                                        value={addrFormData.address_line2}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={addrFormData.city}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={addrFormData.state}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={addrFormData.pincode}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 ml-1">Country</label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={addrFormData.country}
                                                        onChange={handleAddrChange}
                                                        className="w-full bg-gray-50 border border-transparent px-4 py-3 text-md font-medium focus:outline-none focus:bg-white focus:border-gray-900 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2">
                                                <input
                                                    type="checkbox"
                                                    id="is_default"
                                                    name="is_default"
                                                    checked={addrFormData.is_default}
                                                    onChange={handleAddrChange}
                                                    className="w-4 h-4 text-indigo-600 cursor-pointer border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor="is_default" className="text-sm cursor-pointer font-medium text-gray-600">Set as default address</label>
                                            </div>

                                            <div className="pt-4 flex gap-4">
                                                <button
                                                    type="submit"
                                                    disabled={isAddrLoading}
                                                    className="bg-gray-900 cursor-pointer text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowAddrForm(false); setEditingAddress(null); }}
                                                    className="bg-white cursor-pointer border border-gray-100 text-gray-600 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {isAddrLoading ? (
                                                <div className="col-span-2 flex justify-center py-10">
                                                    <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                                                </div>
                                            ) : addresses.length > 0 ? (
                                                addresses.map((addr) => (
                                                    <div key={addr.id} className={`p-6 border ${addr.is_default ? 'border-indigo-100 bg-indigo-50/20' : 'border-gray-100'} hover:shadow-sm transition-all relative group`}>
                                                        {addr.is_default && (
                                                            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                                                <CheckCircle2 size={12} />
                                                                <span className="text-[12px] font-bold uppercase tracking-widest">Default</span>
                                                            </div>
                                                        )}

                                                        <h4 className="font-bold text-gray-900 mb-2">{addr.full_name}</h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                                                            <br />
                                                            {addr.city}, {addr.state} - {addr.pincode}
                                                            <br />
                                                            {addr.country}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2 font-medium">Phone: {addr.phone}</p>

                                                        <div className="mt-6 flex items-center gap-6 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditClick(addr)} className="text-gray-500 hover:text-indigo-600 cursor-pointer text-[12px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <Edit3 size={14} /> Edit
                                                            </button>
                                                            <button onClick={() => handleDeleteAddr(addr.id)} className="text-gray-500 hover:text-red-600 cursor-pointer text-[12px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                            {!addr.is_default && (
                                                                <button onClick={() => handleSetDefault(addr.id)} className="text-gray-500 hover:text-indigo-600 cursor-pointer text-[12px] font-bold uppercase tracking-widest">
                                                                    Set Default
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-2 text-center py-10 space-y-4">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                                        <MapPin size={24} className="text-gray-300" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-medium">No saved addresses yet.</p>
                                                        <p className="text-gray-400 text-xs mt-1">Add your first delivery address to get started.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-100 p-6 flex items-start gap-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => navigate('/orders')}>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <ShoppingBag size={20} className="text-gray-900" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Recent Orders</h4>
                                        <p className="text-[12px] text-gray-400 mt-0.5">Track and manage your orders</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 flex items-start gap-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setActiveTab('addresses')}>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <MapPin size={20} className="text-gray-900" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Delivery Addresses</h4>
                                        <p className="text-[12px] text-gray-400 mt-0.5">Manage your shipping locations</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;