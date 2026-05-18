/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    ChevronLeft,
    Edit3,
    Trash2,
    Package,
    Tag,
    Info,
    ShoppingCart,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Share2,
    Layers,
    BadgePercent,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    Circle
} from 'lucide-react';
import ProductFormModal from '../../Components/Admin/ProductFormModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const NestedAttribute = ({ label, value, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArray = Array.isArray(value);

    if (isObject || isArray) {
        return (
            <div className={`space-y-2 ${level > 0 ? 'ml-4 mt-2  pl-4' : ''}`}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-left group w-full"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-indigo-600 transition-colors">{label}</span>
                    {isExpanded ? <ChevronDown size={12} className="text-gray-300" /> : <ChevronRight size={12} className="text-gray-300" />}
                </button>
                {isExpanded && (
                    <div className="space-y-3">
                        {isObject ? (
                            Object.entries(value).map(([k, v]) => (
                                <NestedAttribute key={k} label={k} value={v} level={level + 1} />
                            ))
                        ) : (
                            value.map((v, i) => (
                                <div key={i} className="flex items-start gap-3 py-1">
                                    <div className="mt-1.5 shrink-0">
                                        <Circle size={6} className="fill-indigo-400 text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        {typeof v === 'object' && v !== null ? (
                                            <div className="flex gap-4">
                                                {v.name && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{v.name}:</span>}
                                                <span className="text-sm font-bold text-gray-800">{v.value || JSON.stringify(v)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-700 leading-relaxed">{String(v)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between py-3 ${level > 0 ? 'ml-4' : ''}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
            <span className="text-sm font-black text-gray-800">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
        </div>
    );
};

const AdminProductDetail = () => {
    const { productId } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchProductDetail = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setProduct(res.data.data.product);
                setVariants(res.data.data.variants);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching product detail:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [productId, token]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this product?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/admin/products');
                toast.success('Product deleted successfullly');
            } catch (error) {
                console.error(error);
                toast.error('Error deleting product:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Masterpiece...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
                <div className="p-6 bg-rose-50 text-rose-500 rounded-[2rem]">
                    <XCircle size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Product Not Found</h2>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="px-8 py-4 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-2xl"
                >
                    Back to Inventory
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-black hover:shadow-xl hover:shadow-gray-100 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 line-clamp-1">{product.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Product SKU: {product.id.split('-')[0].toUpperCase()}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${product.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {product.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="inline-flex cursor-pointer items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex cursor-pointer items-center gap-2 px-4 py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 shadow-xl shadow-indigo-100"
                    >
                        <Edit3 size={16} />
                        Edit Details
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                    <div className="aspect-[4/5] bg-white rounded-md border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 group">
                        <img
                            src={product.images && product.images[activeImage] ? product.images[activeImage] : 'https://placehold.co/150'}
                            alt={product.name} loading='lazy'
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-xl overflow-hidden border-1 transition-all ${activeImage === idx ? 'border-indigo-600 scale-95' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt="thumbnail" loading='lazy' className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white p-8 rounded-md border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Market Price</p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-4xl font-black text-gray-900">₹{parseFloat(product.price).toLocaleString()}</h2>
                                    {parseFloat(product.discount) > 0 && (
                                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                            ₹{parseFloat(product.discount).toLocaleString()} Off
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                                <div className="flex flex-col items-end">
                                    <span className={`text-xl font-black ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-600'}`}>
                                        {product.stock} Units
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">In Warehouse</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Info size={18} />
                            </div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Description</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Layers size={18} />
                            </div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Detailed Specifications</h3>
                        </div>
                        <div className="bg-white rounded-md p-6 space-y-4">
                            {product.attributes && Object.keys(product.attributes).length > 0 ? (
                                Object.entries(product.attributes).map(([key, value]) => (
                                    <NestedAttribute key={key} label={key} value={value} />
                                ))
                            ) : (
                                <p className="text-gray-400 text-xs italic text-center py-4">No technical specifications available.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <Tag size={18} />
                            </div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Organization</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                                Category: {product.category_name}
                            </span>
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                Brand: {product.brand_name}
                            </span>
                            {product.vendor_name && (
                                <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm flex items-center gap-2">
                                    <User size={10} />
                                    Vendor: {product.vendor_name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {variants.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <BadgePercent size={18} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Available Selection</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {variants.map(variant => (
                            <div key={variant.id} className="bg-white p-6 rounded-md hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">SKU: {variant.sku || variant.id.split('-')[0]}</span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">{variant.name}</h4>
                                <p className="text-xs font-medium text-gray-400 mb-4 line-clamp-2">{variant.description || 'Verified product variant with premium specifications.'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-xl font-black text-gray-900">₹{parseFloat(variant.price || product.price).toLocaleString()}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${variant.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {variant.stock > 0 ? `${variant.stock} In Stock` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ProductFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                product={product}
                onSave={fetchProductDetail}
            />
        </div>
    );
};

export default AdminProductDetail;
