/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Edit3,
    Trash2,
    Package,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    MoreVertical,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    ShoppingBag
} from 'lucide-react';
import ProductFormModal from '../../Components/Admin/ProductFormModal';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/products?status=all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setProducts(res.data.data.products);
            }
        } catch (error) {
            console.error(error);
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const handleDelete = async (id) => {
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
                await axios.delete(`${BASE_URL}/api/v1/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
                toast.success('Product deleted successfullly');
            } catch (error) {
                console.error(error);
                toast.error('Error deleting product:', error);
            }
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active': return 'text-emerald-600 border-emerald-100';
            case 'inactive': return 'text-rose-600 border-rose-100';
            case 'draft': return 'text-amber-600 border-amber-100';
            default: return 'text-gray-600 border-gray-100';
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Curating products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Inventory</h1>
                    <p className="text-gray-500 text-sm font-medium">Manage and refine your luxury product catalog.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            window.scroll(0, 0);
                            handleAdd();
                        }}
                        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 bg-indigo-600 text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Items</p>
                    <p className="text-3xl font-black text-gray-900">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Active</p>
                    <p className="text-3xl font-black text-emerald-600">{products.filter(p => p.status === 'active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Low Stock</p>
                    <p className="text-3xl font-black text-amber-600">{products.filter(p => p.stock < 10).length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Inactive</p>
                    <p className="text-3xl font-black text-rose-600">{products.filter(p => p.status === 'inactive').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Product Details</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Category & Brand</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Inventory</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Pricing</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-indigo-50/10 transition-all duration-300">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/150'}
                                                        alt={product.name} loading='lazy'
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.target.src = 'https://placehold.co/150?text=No+Image'}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-700">{product.category_name || 'Uncategorized'}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand_name || 'No Brand'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-sm font-bold ${product.stock < 10 ? 'text-rose-500' : 'text-gray-900'}`}>{product.stock} Units</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(product.status)}`}>
                                                <span className={`w-1 h-1 rounded-full mr-2 ${product.status === 'active' ? 'bg-emerald-500' : 'bg-current'}`}></span>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/products/${product.id}`)}
                                                    className="p-2 cursor-pointer text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        window.scroll(0, 0);
                                                        handleEdit(product);
                                                    }}
                                                    className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Edit Product"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-2 sm:px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 max-w-xs sm:mx-auto">
                                            <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                                                <Package size={40} className="text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-900 text-lg font-bold">No products found</p>
                                                <p className="text-gray-400 text-sm">We couldn't find any items matching your current search or filters.</p>
                                            </div>
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                                            >
                                                Clear all search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                        Showing {filteredProducts.length} of {products.length} Products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSave={fetchProducts}
            />
        </div>
    );
};

export default AdminProducts;
