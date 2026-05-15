/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, User, Menu, X,
    ChevronDown, Gift, PlayCircle, Heart, Bell, ShoppingBag,
    Cpu, Shirt, Sparkles, Baby, Flower2, Pill, Apple, Gem, ArrowRight,
    Zap, ShieldCheck, Truck, LogOut, Settings, Package,
    LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../Context/Auth/authContext';
import CartContext from '../../Context/Cart/CartContext';
import WishlistContext from '../../Context/Wishlist/WishlistContext';
import { useContext, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Header() {
    const navigate = useNavigate();
    const [isTopBarShow, setIsTopBarShow] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [isSearchBar, setIsSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const { cartCount, toggleCart } = useContext(CartContext);
    const { wishlistCount } = useContext(WishlistContext);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchBar(false);
            setSearchQuery('');
        }
    };

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/categories/tree`);
            if (res.data.status === 'success') {
                setCategories(res.data.data.categories);
            }
        } catch (error) {
    console.error(error);
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const getCategoryIcon = (name) => {
        const iconMap = {
            'Electronics': Cpu,
            'Fashion': Shirt,
            'Beauty': Sparkles,
            'Health': Pill,
            'Grocery': Apple,
            'Luxury': Gem,
            'Home': Flower2,
            'Kids': Baby
        };
        return iconMap[name] || LayoutDashboard;
    };

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <div className={`bg-indigo-900 hidden sm:relative transition-all duration-300 ease-in-out text-white ${isTopBarShow ? 'block' : 'hidden'} py-1.5 px-4 text-center text-[10px] sm:text-xs font-medium tracking-wide`}>
                FLASH SALE: 50% OFF ON ALL LUXURY ITEMS. <span className="underline cursor-pointer ml-1 text-indigo-200">SHOP NOW</span>

                <X size={18} className="absolute top-1/6 right-2 sm:right-4 cursor-pointer" onClick={() => setIsTopBarShow(false)} />
            </div>

            <div className="mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-0">
                        <button
                            className="lg:hidden cursor-pointer p-1 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <div className='w-25 h-fit'>
                                <img src="/logo_v2.png" alt="Cartivo Logo" className="h-full w-full" loading='lazy' />
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-grow max-w-xl relative mx-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="block w-full pl-11 pr-4 py-2 rounded-md bg-gray-50 focus:ring-2 focus:border border-indigo-300  focus:ring-indigo-200 text-sm transition-all outline-none text-gray-700 font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3 lg:gap-4">
                        {!isSearchBar ? <button onClick={() => setIsSearchBar(true)} className="p-2 lg:hidden cursor-pointer text-gray-500 hover:text-indigo-500 rounded-xl transition-all relative">
                            <Search className="w-5.5 h-5.5" />
                        </button> : <button onClick={() => setIsSearchBar(false)} className="p-2 lg:hidden cursor-pointer text-gray-500 hover:text-red-500 rounded-xl transition-all relative">
                            <X className="w-5.5 h-5.5" />
                        </button>}

                        {isAuthenticated && (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => navigate('/wishlist')}
                                    className="hidden sm:flex items-center group gap-2.5 px-2 py-2 rounded-xl transition-all active:scale-95 group duration-100 ease-in-out cursor-pointer"
                                >
                                    <div className="relative">
                                        <Heart className="w-5.5 h-5.5 text-gray-700 group-hover:text-rose-500 transition-colors" />
                                        {wishlistCount > 0 && (
                                            <span className="absolute font-normal -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                <button
                                    onClick={toggleCart}
                                    className="flex items-center group gap-2.5 px-2 py-2 rounded-xl transition-all active:scale-95 group duration-100 ease-in-out cursor-pointer"
                                >
                                    <div className="relative">
                                        <ShoppingBag className="w-5.5 h-5.5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                                        {cartCount > 0 && (
                                            <span className="absolute font-normal -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="relative group profile"
                                    onMouseEnter={() => setIsProfileOpen(true)}
                                    onMouseLeave={() => setIsProfileOpen(false)}
                                >
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-all border-2 border-transparent hover:border-indigo-200 shadow-sm overflow-hidden"
                                    >
                                        {user?.profile_image ? (
                                            <img
                                                src={user.profile_image}
                                                alt="user"
                                                className="w-full h-full object-cover"
                                                loading='lazy'
                                            />
                                        ) : user?.name ? (
                                            <span className="font-bold text-sm">
                                                {user.name
                                                    .split(' ')
                                                    .map(word => word[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        ) : (
                                            <User className="w-5.5 h-5.5" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 z-[100] overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
                                                    <p className="font-black text-gray-900 truncate">{user?.name || 'User'}</p>
                                                </div>

                                                {user?.role === 'admin' &&
                                                    <div className='px-2'>
                                                        <button
                                                            onClick={() => { navigate('/admin/dashboard'); setIsProfileOpen(false); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                                                        >
                                                            <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                                            Dashboard
                                                        </button>
                                                    </div>
                                                }

                                                <div className="p-2">
                                                    {[
                                                        { icon: User, text: "My Profile", path: "/profile" },
                                                        { icon: Package, text: "My Orders", path: "/orders" },
                                                        { icon: Heart, text: "Wishlist", path: "/wishlist" },
                                                    ].map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => { navigate(item.path); setIsProfileOpen(false); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                                                        >
                                                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                                            {item.text}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="p-2 border-t border-gray-50 bg-gray-50/30">
                                                    <button
                                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                                        className="w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all group"
                                                    >
                                                        <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={() => navigate('/auth/signin')}
                                        className="px-1 sm:px-4 py-1.5 text-sm cursor-pointer group font-bold text-gray-700 hover:text-indigo-600 transition-all"
                                    >
                                        Sign <span className="group-hover:text-black">In</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/auth/signup')}
                                        className="px-3 sm:px-4 py-2 cursor-pointer bg-indigo-500 group text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-200 active:scale-95"
                                    >
                                        Sign <span className="group-hover:text-black">Up</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <nav className="hidden lg:block border-t border-gray-100 bg-white">
                <div className="mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center h-full">
                        <div
                            className="relative h-full"
                            onMouseEnter={() => setIsCategoryMenuOpen(true)}
                            onMouseLeave={() => setIsCategoryMenuOpen(false)}
                        >
                            <button className="flex items-center gap-2 h-full px-5 text-sm font-bold text-gray-900 border-r border-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                                <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                All Categories
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                            </button>

                            <AnimatePresence>
                                {isCategoryMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute left-0 top-full mt-0 w-[1100px] xl:w-[1300px] bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden flex rounded-b-2xl"
                                    >
                                        <div className="w-80 bg-gray-50/50 border-r border-gray-100 overflow-y-auto max-h-[600px] scrollbar-hidden">
                                            <div className="p-4 space-y-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4">All Categories</p>
                                                {categories.map((cat, idx) => (
                                                    <div
                                                        key={cat.id}
                                                        onMouseEnter={() => setExpandedCategory(idx)}
                                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all ${expandedCategory === idx ? 'bg-white text-indigo-600' : 'text-gray-600 hover:bg-white/60'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2 rounded-lg ${expandedCategory === idx ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                                                                {React.createElement(getCategoryIcon(cat.name), { className: "w-4 h-4" })}
                                                            </div>
                                                            <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                                                        </div>
                                                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-grow p-6 bg-white min-h-[600px]">
                                            {expandedCategory !== null && categories[expandedCategory] ? (
                                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                                    <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                                                            {React.createElement(getCategoryIcon(categories[expandedCategory].name), { className: "w-8 h-8 text-indigo-600" })}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                                                                {categories[expandedCategory].name}
                                                            </h3>
                                                            <Link to={`/category/${categories[expandedCategory].slug}`} onClick={() => setIsCategoryMenuOpen(false)} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1.5 uppercase tracking-widest mt-1">
                                                                View All Collection <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 lg:gap-6">
                                                        {categories[expandedCategory].children?.map((sub, sIdx) => (
                                                            <div key={sub.id} className="space-y-5">
                                                                <Link to={`/category/${sub.slug}`} className="font-black text-gray-900 text-xs uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3">
                                                                    {sub.name}
                                                                </Link>
                                                                <ul className="space-y-3 mt-2">
                                                                    {sub.children?.length > 0 && (
                                                                        sub.children.map((item) => (
                                                                            <li key={item.id}>
                                                                                <Link
                                                                                    to={`/category/${item.slug}`}
                                                                                    onClick={() => setIsCategoryMenuOpen(false)}
                                                                                    className="text-sm font-medium text-gray-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-all"
                                                                                >
                                                                                    {item.name}
                                                                                </Link>
                                                                            </li>
                                                                        ))
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                        {(!categories[expandedCategory].children || categories[expandedCategory].children.length === 0) && (
                                                            <div className="col-span-3 py-10 text-center">
                                                                <p className="text-gray-400 text-sm font-medium">No subcategories found.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-300">
                                                    <LayoutDashboard className="w-16 h-16 stroke-1 opacity-20" />
                                                    <p className="text-sm font-bold uppercase tracking-widest">Select a category to explore</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-72 bg-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                            <div className="relative z-10 space-y-6">
                                                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                                    Seasonal Picks
                                                </div>
                                                <h3 className="font-black text-3xl leading-tight">
                                                    Elevate Your <br />
                                                    <span className="text-indigo-300 italic serif font-normal">Lifestyle.</span>
                                                </h3>
                                                <p className="text-sm text-indigo-100/70 font-medium leading-relaxed">
                                                    Discover our curated selection of global premium brands and exclusive collections.
                                                </p>
                                                <div className="space-y-4 pt-4 border-t border-white/10">
                                                    {[
                                                        { icon: Zap, text: "Instant Shipping", color: "text-amber-400" },
                                                        { icon: ShieldCheck, text: "Verified Quality", color: "text-emerald-400" }
                                                    ].map((feat, fIdx) => (
                                                        <div key={fIdx} className="flex items-center gap-3 text-xs font-bold text-indigo-100">
                                                            <feat.icon className={`w-4 h-4 ${feat.color}`} />
                                                            {feat.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { navigate('/category/all'); setIsCategoryMenuOpen(false); }}
                                                className="relative z-10 cursor-pointer w-full bg-white text-indigo-900 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group shadow-xl"
                                            >
                                                Explore Everything
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center overflow-x-auto scrollbar-hidden xl:w-fit w-xl gap-2 px-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.slug}`}
                                    className="cursor-pointer px-4 py-1.5 text-[12.5px] text-nowrap font-bold text-gray-500 hover:text-indigo-600 rounded-full transition-all flex items-center gap-2 group"
                                >
                                    {React.createElement(getCategoryIcon(cat.name), { className: "w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors" })}
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                            <Gift className="w-4 h-4 text-indigo-600" />
                            Best Deals
                        </a>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                            <PlayCircle className="w-4 h-4 text-rose-500" />
                            Cartivo Live
                        </a>
                    </div>
                </div>
            </nav>

            {isSearchBar && <div className="lg:hidden px-4 pb-4 bg-white">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Cartivo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-gray-50 border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:border border-indigo-300  focus:ring-indigo-200 transition-all outline-none text-sm font-medium"
                    />
                </div>
            </div>}

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] lg:hidden flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="py-4 px-5 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex items-center w-35">
                                    <img src="/logo_v2.png" alt="" loading='lazy' />
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-full group cursor-pointer transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto bg-gray-50/30 scrollbar-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="bg-white p-3 rounded-2xl flex flex-col gap-4">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 pt-0.5 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-100 border-2 border-transparent hover:border-indigo-200 font-bold text-xl shadow-inner overflow-hidden transition-all">
                                                        {user?.profile_image ? (
                                                            <img src={user.profile_image} alt="user" className="w-full h-full object-cover" loading='lazy' />
                                                        ) : (
                                                            user.name
                                                                .split(' ')
                                                                .map(word => word[0])
                                                                .join('')
                                                                .slice(0, 2)
                                                                .toUpperCase() || 'U'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Account</p>
                                                        <p className="font-bold text-gray-900 leading-none">{user?.name || 'User'}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                                                    <button
                                                        onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                                                        className="flex cursor-pointer items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-bold uppercase tracking-wider"
                                                    >
                                                        <User size={14} /> Profile
                                                    </button>
                                                    <button
                                                        onClick={() => { navigate('/orders'); setIsMenuOpen(false); }}
                                                        className="flex cursor-pointer items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider"
                                                    >
                                                        <Package size={14} /> Orders
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full space-y-3">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Join Cartivo Today</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => { navigate('/auth/signin'); setIsMenuOpen(false); }}
                                                        className="w-full cursor-pointer py-3 px-4 group text-sm font-bold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-center"
                                                    >
                                                        Sign <span className="group-hover:text-indigo-500">In</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { navigate('/auth/signup'); setIsMenuOpen(false); }}
                                                        className="w-full cursor-pointer py-3 px-4 group text-sm font-bold text-white bg-indigo-500 rounded-xl transition-all text-center shadow-lg shadow-indigo-100"
                                                    >
                                                        Sign <span className="group-hover:text-black">Up</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-4 pl-2">Shop Categories</h3>
                                        <div className="grid grid-cols-1 gap-1">
                                            {categories.map((cat, idx) => (
                                                <div key={cat.id} className="space-y-1">
                                                    <button
                                                        onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                                                        className={`flex items-center justify-between w-full group py-2.5 px-5 rounded-2xl transition-all ${expandedCategory === idx ? '' : 'bg-white hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2.5 rounded-xl bg-gray-50 text-indigo-600 group-hover:scale-110 transition-transform`}>
                                                                {React.createElement(getCategoryIcon(cat.name), { className: "w-5 h-5" })}
                                                            </div>
                                                            <span className={`text-sm font-bold ${expandedCategory === idx ? 'text-indigo-600' : 'text-gray-800'}`}>{cat.name}</span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${expandedCategory === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedCategory === idx && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden bg-white/50 rounded-2xl mt-1 mx-2"
                                                            >
                                                                <div className="p-4 grid grid-cols-3 gap-2">
                                                                    {cat.children?.map((sub) => (
                                                                        <div key={sub.id} className="space-y-2">
                                                                            <div className="flex flex-wrap gap-2">
                                                                                <button
                                                                                    key={sub.id} onClick={() => { navigate(`/category/${sub.slug}`); setIsMenuOpen(false); }}
                                                                                    className="px-3 cursor-pointer py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-100 rounded-lg hover:border-indigo-200 hover:text-indigo-600 transition-all"
                                                                                >
                                                                                    {sub.name}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full bg-rose-50 cursor-pointer text-rose-600 py-4 rounded-2xl font-black text-sm hover:bg-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Need help? <span className="text-indigo-600 underline cursor-pointer">Contact Support</span></p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
