/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Star, ChevronRight, Minus, Plus, Check, ShoppingBag, Heart, Truck, ShieldCheck, RotateCcw, Ticket, Tag, Camera, X, Loader2
} from 'lucide-react';
import CartContext from '../Context/Cart/CartContext';
import axios from 'axios';
import ProductCard from '../Components/Product/ProductCard';
import AuthContext from '../Context/Auth/authContext';
import WishlistContext from '../Context/Wishlist/WishlistContext';
import toast from 'react-hot-toast';
import SEO from '../Components/Common/SEO';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const ProductDetail = () => {
    const location = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeVariant, setActiveVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [zoomStyle, setZoomStyle] = useState(null);
    const zoomRef = useRef(null);
    const positionRef = useRef({ x: 50, y: 50 });
    const targetRef = useRef({ x: 50, y: 50 });
    const { isAuthenticated } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const isWishlisted = product ? isInWishlist(product.id) : false;

    // Review States
    const [reviews, setReviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [reviewImagesPreview, setReviewImagesPreview] = useState([]);

    const [activeCoupons, setActiveCoupons] = useState([]);

    useEffect(() => {
        if (location.hash === '#reviews') {
            setActiveTab('reviews');
        }
    }, [location]);

    useEffect(() => {
        let animationFrame;

        const animate = () => {
            const current = positionRef.current;
            const target = targetRef.current;

            // Smooth interpolation
            current.x += (target.x - current.x) * 0.1;
            current.y += (target.y - current.y) * 0.1;

            if (zoomRef.current) {
                zoomRef.current.style.backgroundPosition = `${current.x}% ${current.y}%`;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        targetRef.current = { x, y };
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProductData();
        fetchActiveCoupons();
    }, [slug]);

    const fetchActiveCoupons = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/coupons/active`);
            setActiveCoupons(res.data.data.coupons);
        } catch (error) {
            console.error("Error fetching coupons", error);
        }
    };

    useEffect(() => {
        if (product?.id) {
            fetchReviews();
        }
    }, [product]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/reviews/product/${product.id}`);
            setReviews(res.data.data.reviews);
        } catch (error) {
            console.error("Error fetching reviews", error);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...reviewImages];
        const newPreviews = [...reviewImagesPreview];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                newImages.push(reader.result); // Store base64 for submission
                setReviewImages([...newImages]);
                setReviewImagesPreview([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = reviewImages.filter((_, i) => i !== index);
        const newPreviews = reviewImagesPreview.filter((_, i) => i !== index);
        setReviewImages(newImages);
        setReviewImagesPreview(newPreviews);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to leave a review');
        if (rating === 0) return toast.error('Please select a rating');

        setIsSubmitting(true);
        try {
            await axios.post(`${BASE_URL}/api/v1/reviews`, {
                product_id: product.id,
                rating,
                comment,
                images: reviewImages
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setRating(5);
            setComment('');
            setReviewImages([]);
            setReviewImagesPreview([]);
            setShowReviewForm(false);

            fetchReviews();
        } catch (error) {
            toast.error("Failed to submit review");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr?.rating, 0) / reviews.length).toFixed(1)
        : product?.rating || '0.0';


    const fetchProductData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/products/slug/${slug}`);
            const productData = res.data.data.product;
            const variantData = res.data.data.variants || [];

            setProduct(productData);
            setVariants(variantData);

            if (variantData.length > 0) {
                const firstV = variantData[0].variant_attributes;
                const initialSelection = {};

                const variantMenu = productData.attributes?.variants || {};
                Object.keys(variantMenu).forEach(menuKey => {
                    const singularKey = menuKey.toLowerCase().endsWith('s') ? menuKey.toLowerCase().slice(0, -1) : menuKey.toLowerCase();
                    const val = firstV[singularKey] || firstV[menuKey.toLowerCase()];
                    if (val) initialSelection[menuKey.toLowerCase()] = val;
                });

                setSelectedAttributes(initialSelection);
                setActiveVariant(variantData[0]);
            }

            const relatedRes = await axios.get(`${BASE_URL}/api/v1/products?category=${productData.category_slug || ''}&limit=4`);
            setRelatedProducts(relatedRes.data.data.products.filter(p => p.slug !== slug));
        } catch (error) {
            console.error("Error fetching product details", error);
        } finally {
            setLoading(false);
        }
    };

    const variantMenu = useMemo(() => {
        const menu = { ...(product?.attributes?.variants || {}) };
        if (Object.keys(menu).length === 0) {
            variants.forEach(v => {
                Object.entries(v.variant_attributes || {}).forEach(([key, val]) => {
                    const mk = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
                    if (!menu[mk]) menu[mk] = new Set();
                    (Array.isArray(val) ? val : [val]).forEach(i => menu[mk].add(typeof i === 'object' ? JSON.stringify(i) : i));
                });
            });
            Object.keys(menu).forEach(k => menu[k] = Array.from(menu[k]).map(x => typeof x === 'string' && x.startsWith('{') ? JSON.parse(x) : x));
        }
        return menu;
    }, [product, variants]);

    useEffect(() => {
        if (variants.length > 0 && Object.keys(selectedAttributes).length > 0) {
            const found = variants.find(v => {
                const vAttrs = v.variant_attributes || {};
                return Object.entries(selectedAttributes).every(([key, value]) => {
                    if (!value) return true;

                    const normalizedKey = key.toLowerCase();
                    const actualKey = Object.keys(vAttrs).find(k => {
                        const kn = k.toLowerCase();
                        return kn === normalizedKey || (kn.endsWith('s') && kn.slice(0, -1) === normalizedKey) || (normalizedKey.endsWith('s') && normalizedKey.slice(0, -1) === kn);
                    });

                    if (!actualKey) return false;

                    const attrVal = vAttrs[actualKey];
                    if (Array.isArray(attrVal)) {
                        return attrVal.some(item => {
                            const itemVal = typeof item === 'object' ? (item.name || item.value || Object.values(item)[0]) : item;
                            return String(itemVal).toLowerCase() === String(value).toLowerCase();
                        });
                    }
                    return String(attrVal).toLowerCase() === String(value).toLowerCase();
                });
            });
            setActiveVariant(found || null);
        }
    }, [selectedAttributes, variants]);

    const renderAttributeValue = (val, isNested = false) => {
        if (val === null || val === undefined) return '-';

        if (Array.isArray(val)) {
            return (
                <div className={`flex flex-wrap gap-2 ${isNested ? 'mt-1' : 'mt-2'}`}>
                    {val.map((item, i) => (
                        <div key={i} className="group relative">
                            {typeof item === 'object' && item !== null ? (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 py-1.5 px-3 bg-gray-50 rounded border border-gray-100 hover:border-gray-200 transition-all">
                                    {item.name !== undefined && item.value !== undefined ? (
                                        <div className="flex gap-2 items-baseline">
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{String(item.name).replace(/_/g, ' ')}</span>:
                                            <span className="text-sm font-bold text-gray-900">{String(item.value)}</span>
                                        </div>
                                    ) : (
                                        Object.entries(item).map(([k, v]) => (
                                            <div key={k} className="flex gap-2 items-baseline">
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{String(k).replace(/_/g, ' ')}</span>
                                                <span className="text-[12px] font-bold text-gray-900">{String(v)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded-sm hover:border-gray-900 hover:text-gray-900 transition-all cursor-default shadow-sm">
                                    {String(item)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof val === 'object' && val !== null) {
            return (
                <div className={`${isNested ? 'mt-2' : 'mt-4'} space-y-2`}>
                    {Object.entries(val).map(([subKey, subVal]) => (
                        <div key={subKey} className="group flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 p-2.5 bg-gray-50/50 rounded-sm border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                                {subKey.replace(/_/g, ' ')}
                            </span>
                            <div className="text-[13px] font-bold text-gray-900 text-right">
                                {typeof subVal === 'object' && subVal !== null ? renderAttributeValue(subVal, true) : String(subVal)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof val === 'boolean') return (
            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest ${val ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                {val ? 'Yes' : 'No'}
            </span>
        );

        return <span className={`font-bold ${isNested ? 'text-[12px]' : 'text-[14px]'} text-gray-900`}>{String(val)}</span>;
    };

    const getRatingLabel = (rating) => {
        switch (rating) {
            case 1:
                return "Very Poor";
            case 2:
                return "Poor";
            case 3:
                return "Average";
            case 4:
                return "Good";
            case 5:
                return "Excellent";
            default:
                return "";
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) return navigate('/auth/signin');

        const newItem = {
            id: activeVariant ? `v${activeVariant.id}` : `p${product.id}`,
            product_id: product.id,
            variant_id: activeVariant?.id,
            quantity: quantity,
            price: activeVariant ? activeVariant.price : product.price,
            product_name: product.name,
            product_images: product.images || [product.image],
            variant_name: activeVariant?.name
        };

        const existingSession = JSON.parse(localStorage.getItem('checkout_session') || '[]');
        const existingItemIndex = existingSession.findIndex(item =>
            item.product_id === newItem.product_id && item.variant_id === newItem.variant_id
        );

        if (existingItemIndex > -1) {
            existingSession[existingItemIndex].quantity += newItem.quantity;
        } else {
            existingSession.push(newItem);
        }

        localStorage.setItem('checkout_session', JSON.stringify(existingSession));
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center animate-in">
                    <div className="luxury-spinner mb-4"></div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Refining Details</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
                <h2 className="text-2xl font-light uppercase tracking-widest text-gray-900 mb-4">Product Not Found</h2>
                <Link to="/" className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-900 pb-1">Return to Home</Link>
            </div>
        );
    }

    const productImages = [
        ...(activeVariant?.images || []),
        ...(product.images || [product.image]),
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title={`${product.name} | Cartivo`}
                description={product.description || `Buy ${product.name} at Cartivo with secure checkout and fast delivery.`}
                keywords={`${product.name}, ${product.brand_name || ''}, ${product.category_name || ''}, cartivo, online shopping`}
                image={productImages[0] || "/logo.png"}
                type="product"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to={`/category/${product.category_slug}`} className="hover:text-gray-900 transition-colors">{product.category_name}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
                    <div className="lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:justify-center md:items-center lg:justify-start lg:overflow-y-auto no-scrollbar md:w-70 lg:w-30">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative cursor-pointer flex flex-shrink-0 items-center justify-center w-27 h-28 px-2 sm:w-28 sm:h-32 lg:w-full lg:h-32 border transition-all duration-300 ${selectedImage === idx ? 'border-gray-200' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${idx}`} loading='lazy' className="h-full object-contain" />
                                </button>
                            ))}
                        </div>

                        <div className="flex-grow cursor-zoom-in relative h-[50vh] sm:h-[70vh] lg:h-auto lg:aspect-[4/5] max-h-[80vh] overflow-hidden bg-[#f9f9f9]" onMouseMove={handleMouseMove}
                            onMouseEnter={() => setZoomStyle(true)}
                            onMouseLeave={() => setZoomStyle(false)}>
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name} loading='lazy'
                                className="w-full h-full object-contain transition-transform duration-700"
                            />

                            {zoomStyle && (
                                <div
                                    ref={zoomRef}
                                    className="absolute hover:cursor inset-0 pointer-events-none transition-opacity duration-300"
                                    style={{
                                        backgroundImage: `url(${productImages[selectedImage]})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "200%",
                                        opacity: zoomStyle ? 1 : 0,
                                    }}
                                />
                            )}

                            {product.discount > 0 && (
                                <div className="absolute top-6 left-6 bg-gray-900 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
                                    Limited Edition
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-2/5 flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                                    {product.brand_name || 'Cartivo'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-gray-900 text-[12px] font-bold">{averageRating}</span>
                                    <span className="text-gray-400 text-[12px]">({reviews.length} Reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 uppercase tracking-wider leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                    ₹{Number(activeVariant ? activeVariant.price : product.price).toLocaleString('en-IN')}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-lg text-gray-400 line-through font-light">
                                        ₹{Number(Number((activeVariant ? activeVariant.price : product.price).toString().replace(/,/g, '')) + Number(product.discount)).toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                {(activeVariant ? activeVariant.stock : product.stock) > 0 ? (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-sm">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                                            In Stock ({activeVariant ? activeVariant.stock : product.stock} units)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 rounded-sm">
                                        <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-rose-600">Out of Stock</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-sm">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                        SKU: {activeVariant ? activeVariant.sku : product.slug?.toUpperCase().slice(0, 8)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed font-light">
                                {product.description || "No specific description provided for this collection."}
                            </p>
                        </div>

                        <div className="space-y-5 mb-5">
                            {Object.entries(variantMenu).map(([attrKey, attrValue]) => {
                                if (!Array.isArray(attrValue)) return null;
                                const currentKey = attrKey.toLowerCase();
                                const selectedValue = selectedAttributes[currentKey];

                                return (
                                    <div key={attrKey}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                                                {attrKey.replace(/_/g, ' ')}: {selectedValue || 'Select'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {attrValue.map((option, idx) => {
                                                const value = typeof option === 'object' ? (option.name || option.color || Object.values(option)[0]) : option;
                                                const hexValue = typeof option === 'object' ? option.hex : null;
                                                const isColor = currentKey.includes('color');

                                                return (
                                                    <button
                                                        key={`${value}-${idx}`}
                                                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [currentKey]: value }))}
                                                        className={`transition-all cursor-pointer flex items-center justify-center ${isColor
                                                            ? `w-8 h-8 rounded-full border ${selectedValue === value ? 'border-gray-900 scale-110' : 'border-transparent hover:border-gray-200'}`
                                                            : `px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest border ${selectedValue === value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-100 hover:border-gray-300'}`
                                                            }`}
                                                        style={isColor ? { backgroundColor: hexValue || (typeof value === 'string' ? value.toLowerCase() : 'transparent') } : {}}
                                                        title={value}
                                                    >
                                                        {isColor && selectedValue === value && (
                                                            <Check className={`w-3 h-3 ${typeof value === 'string' && ['White', 'Yellow', 'Ivory', 'Gray'].some(c => value.includes(c)) ? 'text-black' : 'text-white'}`} />
                                                        )}
                                                        {!isColor && value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {activeCoupons.length > 0 && (
                            <div className="mb-2 animate-in">
                                <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                                    <Tag className="w-3.5 h-3.5 text-gray-900" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Available Offers</span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                    {activeCoupons.map((coupon) => (
                                        <div key={coupon.id}
                                            className="flex-shrink-0 w-52 p-4 border border-gray-100 bg-white hover:border-gray-500 rounded-lg transition-all cursor-default group relative overflow-hidden"
                                        >
                                            <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Ticket className="w-16 h-16 text-black group-hover:text-blue-600 rotate-12" />
                                            </div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-bold text-gray-900 tracking-widest">{coupon.code}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-600 font-bold">
                                                {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                            </p>
                                            <p className="text-xs text-gray-600 uppercase tracking-tighter mt-1 font-medium">
                                                {coupon.min_order_value > 0 ? `Min. Spend: ₹${coupon.min_order_value}` : 'No Min. Spend'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className='mb-5'>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-900 block mb-4">Quantity</span>
                            <div className="flex items-center w-32 border border-gray-100">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 text-gray-600 cursor-pointer hover:text-black transition-colors"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="flex-grow text-center text-[12px] font-bold">{quantity}</span>
                                <button
                                    disabled={quantity >= (activeVariant ? activeVariant.stock : product.stock)}
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 text-gray-600 cursor-pointer hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-10">
                            <div className="flex gap-4">
                                <button
                                    disabled={(activeVariant ? activeVariant.stock : product.stock) <= 0}
                                    onClick={() => addToCart(product.id, activeVariant?.id, quantity)}
                                    className="flex-grow cursor-pointer bg-gray-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {(activeVariant ? activeVariant.stock : product.stock) <= 0 ? 'Out of Stock' : 'Add to Shopping Bag'}
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`p-4 border cursor-pointer transition-all active:scale-[0.98] ${isWishlisted
                                        ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                                        : 'border-gray-100 text-gray-900 hover:border-rose-300 hover:text-rose-500'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <button
                                onClick={handleBuyNow}
                                disabled={(activeVariant ? activeVariant.stock : product.stock) <= 0}
                                className="w-full btn-gradient cursor-pointer text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                            >
                                {(activeVariant ? activeVariant.stock : product.stock) <= 0 ? 'Currently Unavailable' : 'Buy Now'}
                            </button>

                            {/* Policy Trust Links */}
                            <div className="mt-4 flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Link to="/return-policy" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">7-Day Easy Return Policy</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="h-px bg-gray-200/50" />
                                <Link to="/warranty-policy" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">Comprehensive Warranty Coverage</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="h-px bg-gray-200/50" />
                                <Link to="/shipping-policy" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">Premium Insured Shipping</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 flex gap-4 animate-in shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                            <button
                                disabled={(activeVariant ? activeVariant.stock : product.stock) <= 0}
                                onClick={() => addToCart(product.id, activeVariant?.id, quantity)}
                                className="flex-grow cursor-pointer bg-gray-900 text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-400"
                            >
                                <ShoppingBag className="w-3.5 h-3.5" /> {(activeVariant ? activeVariant.stock : product.stock) <= 0 ? 'Out' : 'Add'}
                            </button>
                            <button
                                disabled={(activeVariant ? activeVariant.stock : product.stock) <= 0}
                                onClick={handleBuyNow}
                                className="flex-grow btn-gradient cursor-pointer text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50"
                            >
                                {(activeVariant ? activeVariant.stock : product.stock) <= 0 ? 'Out of Stock' : 'Buy Now'}
                            </button>
                        </div>


                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
                            <div className="flex flex-col items-center text-center">
                                <Truck className="w-5 h-5 text-gray-900 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Complementary Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheck className="w-5 h-5 text-gray-900 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Authenticated Luxury</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RotateCcw className="w-5 h-5 text-gray-900 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">7-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 sm:mt-12 border-t border-gray-100 pt-8 sm:pt-16">
                    <div className="flex sm:justify-center overflow-x-auto gap-8 sm:gap-12 mb-12">
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-[11px] font-bold uppercase cursor-pointer tracking-[0.3em] py-2 outline-0 focus:text-black border-b-2 transition-all ${activeTab === tab ? 'border-gray-900 text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <div className="animate-in space-y-8">
                                <h3 className="text-lg font-light uppercase tracking-widest text-center mb-8">Artistry & Details</h3>
                                <p className="text-gray-500 font-light leading-relaxed text-center max-w-2xl mx-auto">
                                    {product.description || "Detailed craftsmanship and uncompromising quality define this exquisite piece."}
                                </p>

                                {(product.attributes?.features || product.attributes?.highlights) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                                        {(product.attributes.features || product.attributes.highlights).map((feature, i) => (
                                            <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50/50 rounded-sm">
                                                <div className="w-1 h-1 rounded-full bg-gray-900 mb-3"></div>
                                                <span className="text-[12px] font-bold uppercase tracking-widest text-gray-900">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {product.category_name === "Mobiles" || product.category_name === "Electronics" || product.category_name === "Accessories" && <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                                    <div className="bg-[#f9f9f9] p-2 sm:p-4 md:p-6 rounded-sm">
                                        <h4 className="text-md font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Material & Care</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">Composition</span>
                                                <div className="text-gray-900 text-sm font-medium">
                                                    {product.attributes?.materiale || product.attributes?.fabric || "Premium grade materials selected for durability and aesthetic appeal."}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">Care Instructions</span>
                                                <div className="text-gray-900 text-xs">
                                                    {product.attributes?.care ? renderAttributeValue(product.attributes.care) : "Handle with care to maintain the pristine condition of the item."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#f9f9f9] p-2 sm:p-4 md:p-6">
                                        <h4 className="text-md font-bold uppercase tracking-widest mb-4">Authenticity</h4>
                                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                                            Each piece is verified for quality and authenticity by our team of experts before it reaches you.
                                        </p>
                                    </div>
                                </div>}
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="animate-in max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 gap-12">
                                    {product.attributes && Object.entries(product.attributes).map(([key, value]) => {
                                        if (key === 'sizes' || key === 'colors' || key === 'features' || key === 'highlights' || key === 'care' || key === 'material') return null;

                                        const isSection = typeof value === 'object' && value !== null && !Array.isArray(value);

                                        if (isSection) {
                                            return (
                                                <div key={key} className="space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 whitespace-nowrap">
                                                            {key.replace(/_/g, ' ')}
                                                        </h4>
                                                        <div className="h-px w-full bg-gray-100"></div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                                        {Object.entries(value).map(([subK, subV]) => (
                                                            <div key={subK} className="flex justify-between items-center py-4 border-b border-gray-50 group hover:border-gray-100 transition-all">
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors">
                                                                    {subK.replace(/_/g, ' ')}
                                                                </span>
                                                                <div className="text-right">
                                                                    {renderAttributeValue(subV, true)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={key} className="flex gap-2 justify-between items-center py-5 border-b border-gray-100 group hover:border-gray-200 transition-all">
                                                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-900">
                                                    {key.replace(/_/g, ' ')}
                                                </span>
                                                <div className="text-right">
                                                    {renderAttributeValue(value)}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {(!product.attributes ||
                                        Object.keys(product.attributes).filter(
                                            (k) => !['sizes', 'colors', 'features', 'highlights', 'care', 'material'].includes(k)
                                        ).length === 0) && (
                                            <div className="text-center py-20 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-100">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                    Technical Specifications Pending
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-in space-y-6" id='reviews'>
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between border-b border-gray-50 pb-12">
                                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="text-5xl font-light mb-2 text-gray-900">{averageRating}</div>
                                        <div className="flex gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Based on {reviews.length} authenticated reviews</p>
                                    </div>

                                    <div className="flex-grow max-w-md w-full space-y-3">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviews.filter(r => r.rating === star).length;
                                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-4">
                                                    <span className="text-[10px] font-bold w-4">{star}</span>
                                                    <div className="flex-grow h-1 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gray-900 transition-all duration-1000"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 w-8">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-col items-center justify-center">
                                        <button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="px-8 cursor-pointer py-4 bg-gray-900 text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95"
                                        >
                                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                                        </button>
                                    </div>
                                </div>

                                {showReviewForm && (
                                    <div className="animate-in bg-gray-50/50 p-6 md:p-10 rounded-sm border border-gray-100">
                                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-center">Your Perspective</h4>
                                        <form onSubmit={handleReviewSubmit} className="space-y-8 max-w-2xl mx-auto">
                                            <div className="flex flex-col items-center gap-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Rating</span>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => setRating(s)}
                                                            onMouseEnter={() => setRating(s)}
                                                            className="transition-transform hover:scale-110 active:scale-90"
                                                        >
                                                            <Star
                                                                className={`w-8 h-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} transition-colors`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {getRatingLabel(rating)}
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Detailed Experience</label>
                                                <textarea
                                                    required
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your thoughts on the craftsmanship, fit, and overall quality..."
                                                    className="w-full bg-white border border-gray-100 p-5 text-sm font-light min-h-[150px] focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-300 resize-none"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visual Evidence (Optional)</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {reviewImagesPreview.map((img, idx) => (
                                                        <div key={idx} className="relative w-24 h-24 border border-gray-100 p-1 bg-white">
                                                            <img src={img} alt="Preview" loading='lazy' className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                className="absolute cursor-pointer -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full shadow-lg hover:bg-rose-500 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {reviewImagesPreview.length < 5 && (
                                                        <label className="w-24 h-24 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-900 transition-colors group bg-white">
                                                            <Camera className="w-6 h-6 text-gray-300 group-hover:text-gray-900 transition-colors mb-2" />
                                                            <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400 group-hover:text-gray-900">Add Photo</span>
                                                            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full cursor-pointer bg-gray-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                                                        </>
                                                    ) : (
                                                        'Publish Review'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {reviews.length > 0 ? (
                                        reviews.map((r) => (
                                            <div key={r.id} className="border-t border-gray-50 pt-6 animate-in">
                                                <div className="flex flex-col md:flex-row md:items-start gap-3">
                                                    <div className="md:w-1/4">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            {r.profile_image ? (
                                                                <img src={r.profile_image} alt={r.user_name} loading='lazy' className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                                                                    {r.user_name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{r.user_name}</h5>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center px-1.5 py-0.5 bg-emerald-50 rounded-[2px]">
                                                                        <Check className="w-2.5 h-2.5 text-emerald-600 mr-1" />
                                                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <div className="md:w-3/4">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-100'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 text-[15px] font-light leading-relaxed mb-6">
                                                            {r.comment}
                                                        </p>
                                                        {r.images && r.images.length > 0 && (
                                                            <div className="flex flex-wrap gap-3">
                                                                {r.images.map((img, idx) => (
                                                                    <div key={idx} className="w-24 h-32 overflow-hidden border border-gray-100 hover:border-gray-400 transition-colors cursor-zoom-in">
                                                                        <img src={img} alt={`Review by ${r.user_name}`} className="w-full h-full object-cover" loading='lazy' />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50/30 rounded-sm border border-dashed border-gray-100">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">No narratives yet</p>
                                            <p className="text-gray-500 font-light text-sm max-w-xs mx-auto">Be the first to share your experience with this exceptional piece.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-16 md:mt-32">
                    <div className="bg-gray-900 text-white p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-md text-center md:text-left">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-4">Excellence Defined</span>
                                <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-6 leading-tight">Shared Experiences</h2>
                                <p className="text-gray-400 font-light leading-relaxed text-sm">
                                    Our patrons appreciate the finer nuances of luxury. Explore their journeys and insights into the craftsmanship of this piece.
                                </p>
                            </div>

                            <div className="flex items-center gap-8 bg-white/5 backdrop-blur-md p-10 border border-white/10 rounded-sm">
                                <div className="text-center">
                                    <div className="text-6xl font-light mb-2">{averageRating}</div>
                                    <div className="flex gap-1 justify-center mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">Boutique Rating</span>
                                </div>
                                <div className="w-[1px] h-20 bg-white/10"></div>
                                <div className="text-center">
                                    <div className="text-6xl font-light mb-2">{reviews.length}</div>
                                    <div className="flex gap-1 justify-center mb-2 text-amber-400">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">Patron Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-16 md:mt-32">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] block mb-2">Curated for You</span>
                                <h2 className="text-2xl font-light uppercase tracking-widest text-gray-900">You Might Also Like</h2>
                            </div>
                            <Link to={`/category/${product.category_slug}`} className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-900 pb-1">View Collection</Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;