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
    Layers,
    ChevronLeft,
    ChevronRight,
    Package,
    FolderTree,
    CheckCircle2,
    XCircle,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import CategoryFormModal from '../../Components/Admin/CategoryFormModal';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/categories?status=all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setCategories(res.data.data.categories);
            }
        } catch (error) {
    console.error(error);
            toast.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this category?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/categories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCategories();
                toast.success('Category deleted successfullly');
            } catch (error) {
    console.error(error);
                toast.error('Failed to delete category', error);
            }
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getParentName = (parentId) => {
        const parent = categories.find(c => c.id === parentId);
        return parent ? parent.name : '—';
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Organizing categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Categories</h1>
                    <p className="text-gray-500 text-sm font-medium">Define and manage your product hierarchy.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
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
                        className="inline-flex items-center sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-3 bg-indigo-600 text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Categories</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-gray-900">{categories.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Root Categories</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-emerald-600">{categories.filter(c => !c.parent_id).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Sub Categories</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-amber-600">{categories.filter(c => c.parent_id).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-indigo-600">{categories.filter(c => c.status === 'active').length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Category Info</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Slug</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Parent</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="group hover:bg-indigo-50/10 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    <img
                                                        src={cat.image || `https://placehold.co/150?text=${cat.name}`}
                                                        alt={cat.name} loading='lazy'
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{cat.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {cat.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <code className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{cat.slug}</code>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {cat.parent_id ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                        <span className="text-xs font-bold text-gray-600">{getParentName(cat.parent_id)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${cat.status === 'active'
                                                ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                                : 'text-rose-600 bg-rose-50 border-rose-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${cat.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        window.scroll(0, 0);
                                                        handleEdit(cat);
                                                    }}
                                                    className="p-2.5 cursor-pointer text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                                                    title="Edit Category"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2.5 cursor-pointer text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                                    title="Delete Category"
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
                                            <div className="w-24 h-24 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                                                <Layers size={40} className="text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-900 text-lg font-bold">No categories found</p>
                                                <p className="text-gray-400 text-sm">Create your first category to start organizing your product catalog.</p>
                                            </div>
                                            <button
                                                onClick={handleAdd}
                                                className="px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all cursor-pointer"
                                            >
                                                Create Category
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Showing {filteredCategories.length} of {categories.length} Categories
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

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
                onSave={fetchCategories}
            />
        </div>
    );
};

export default AdminCategories;

