/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    Tag,
    ChevronLeft,
    ChevronRight,
    Award,
    Layers,
    Globe,
    MoreVertical
} from 'lucide-react';
import BrandFormModal from '../../Components/Admin/BrandFormModal';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/brands`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setBrands(res.data.data.brands);
            }
        } catch (error) {
    console.error(error);
            toast.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, [token]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this brand?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/brands/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBrands();
                toast.success('Brand deleted successfullly');
            } catch (error) {
    console.error(error);
                toast.error('Failed to delete brand', error);
            }
        }
    };

    const handleEdit = (brand) => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedBrand(null);
        setIsModalOpen(true);
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && brands.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading brand catalog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2 italic">Global Brands</h1>
                    <p className="text-gray-500 text-sm font-medium">Curate and manage the world-class brands in your inventory.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-black hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} />
                        Add Brand
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Partners</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-gray-900">{brands.length}</p>
                        <Award size={24} className="text-indigo-100" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-2">Categories Covered</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-emerald-600">{new Set(brands.map(b => b.category_id)).size}</p>
                        <Layers size={24} className="text-emerald-100" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-2">Featured Brands</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-amber-600">{brands.length > 5 ? 5 : brands.length}</p>
                        <Award size={24} className="text-amber-100" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-2">Global Presence</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-indigo-600">Active</p>
                        <Globe size={24} className="text-indigo-100" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Brand Identity</th>
                                <th className="px-8 py-5 text-left text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Primary Category</th>
                                <th className="px-8 py-5 text-left text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Slug</th>
                                <th className="px-8 py-5 text-left text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Description</th>
                                <th className="px-8 py-5 text-right text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => (
                                    <tr key={brand.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                                    <img
                                                        src={brand.logo || `https://placehold.co/100?text=${brand.name}`}
                                                        alt={brand.name} loading='lazy'
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1 uppercase tracking-tight">{brand.name}</span>
                                                    <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {brand.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{brand.category_name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <code className="text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{brand.slug}</code>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-medium text-gray-500 line-clamp-2 max-w-[200px] italic">
                                                {brand.description || 'No legacy description provided for this brand partner.'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        window.scroll(0, 0);
                                                        handleEdit(brand);
                                                    }}
                                                    className="p-2.5 cursor-pointer text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                                                    title="Edit Brand"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand.id)}
                                                    className="p-2.5 cursor-pointer text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                                    title="Delete Brand"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 max-w-xs mx-auto">
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                                <Award size={40} className="text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-900 text-lg font-bold">No brands discovered</p>
                                                <p className="text-gray-400 text-sm font-medium">Add your first brand partner to begin curating your collection.</p>
                                            </div>
                                            <button
                                                onClick={handleAdd}
                                                className="px-8 py-3 bg-black text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 transition-all cursor-pointer"
                                            >
                                                Register Brand
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Showing {filteredBrands.length} of {brands.length} Global Partners
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2.5 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <BrandFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                brand={selectedBrand}
                onSave={fetchBrands}
            />
        </div>
    );
};

export default AdminBrands;
