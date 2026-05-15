/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    X,
    Save,
    Image as ImageIcon,
    Layers,
    Info,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Plus,
    Trash2,
    Upload
} from 'lucide-react';
import AuthContext from '../../Context/Auth/authContext';
import toast from 'react-hot-toast';

const CategoryFormModal = ({ isOpen, onClose, category, onSave }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const initialFormState = {
        name: '',
        parent_id: '',
        image: '',
        status: 'active'
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (category) {
                setFormData({
                    name: category.name || '',
                    parent_id: category.parent_id || '',
                    image: category.image || '',
                    status: category.status || 'active'
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, category]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/categories?status=all');
            // Filter out the current category from being its own parent
            const filteredCats = category
                ? res.data.data.categories.filter(c => c.id !== category.id)
                : res.data.data.categories;
            setCategories(filteredCats);
        } catch (error) {
    console.error(error);
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = category
                ? `http://localhost:5000/api/v1/categories/${category.id}`
                : 'http://localhost:5000/api/v1/categories';
            const method = category ? 'patch' : 'post';

            const submissionData = {
                ...formData,
                parent_id: formData.parent_id === "" ? null : formData.parent_id
            };

            const res = await axios[method](url, submissionData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                onSave();
                onClose();
                toast.success(`Category ${method === 'patch' ? 'updated' : 'added'} successfullly`);
            }
        } catch (error) {
    console.error(error);
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] h-fit flex items-center justify-center sm:p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-md shadow-2xl overflow-hidden transform animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {category ? 'Edit Category' : 'New Category'}
                        </h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {category ? 'Update existing category details' : 'Create a new product classification'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-gray-900 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form id="categoryForm" onSubmit={handleSubmit} className="px-6 sm:px-8 py-4 sm:py-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category Name</label>
                        <div className="relative group">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Smartphones, Luxury Watches"
                                className="w-full pl-11 pr-6 py-3 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category Image</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData(prev => ({ ...prev, image: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                                id="category-image-upload"
                            />
                            <label
                                htmlFor="category-image-upload"
                                className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer group-hover:border-indigo-300 group-hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                                    <Upload size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                                        {formData.image ? 'Change Image' : 'Upload Image'}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">JPG, PNG or WEBP (MAX. 2MB)</p>
                                </div>
                            </label>
                        </div>
                        {formData.image && (
                            <div className="relative mt-2 inline-block">
                                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" loading='lazy' />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Parent Category (Optional)</label>
                        <select
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleChange}
                            className="w-full px-6 py-3 bg-gray-50 border border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800 appearance-none cursor-pointer"
                        >
                            <option value="">No Parent (Root Category)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Status</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all cursor-pointer ${formData.status === 'active'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                            >
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Active</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: 'inactive' }))}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all cursor-pointer ${formData.status === 'inactive'
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                            >
                                <XCircle size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Inactive</span>
                            </button>
                        </div>
                    </div>

                    {formData.image && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-24 h-24 rounded-md overflow-hidden border-4 border-gray-50 bg-gray-50 shadow-inner">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://placehold.co/150?text=Invalid+URL'}
                                    loading='lazy'
                                />
                            </div>
                        </div>
                    )}
                </form>

                <div className="px-6 sm:px-8 py-4 sm:py-6 bg-gray-50/50 border-t border-gray-50 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        form="categoryForm"
                        type="submit"
                        disabled={loading}
                        className="flex-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>{category ? 'Save Changes' : 'Create Category'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryFormModal;
