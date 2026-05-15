/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    X,
    Save,
    Image as ImageIcon,
    Tag,
    Info,
    Upload
} from 'lucide-react';
import AuthContext from '../../Context/Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const BrandFormModal = ({ isOpen, onClose, brand, onSave }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const initialFormState = {
        name: '',
        category_id: '',
        logo: '',
        description: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (brand) {
                setFormData({
                    name: brand.name || '',
                    category_id: brand.category_id || '',
                    logo: brand.logo || '',
                    description: brand.description || ''
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, brand]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/categories?status=active`);
            if (res.data.status === 'success') {
                setCategories(res.data.data.categories);
            }
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
            const url = brand
                ? `${BASE_URL}/api/v1/brands/${brand.id}`
                : `${BASE_URL}/api/v1/brands`;
            const method = brand ? 'patch' : 'post';

            const res = await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                onSave();
                onClose();
                toast.success(`Brand ${method === 'patch' ? 'updated' : 'added'} successfullly`);
            }
        } catch (error) {
            console.error(error);
            console.error('Error saving brand:', error);
            toast.error('Failed to save brand');
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
                            {brand ? 'Edit Brand' : 'New Brand'}
                        </h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {brand ? 'Update existing brand identity' : 'Establish a new brand presence'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-gray-900 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form id="brandForm" onSubmit={handleSubmit} className="px-6 sm:px-8 py-4 sm:py-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Brand Name</label>
                        <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Apple, Nike, Rolex"
                                className="w-full pl-11 pr-6 py-3 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Primary Category</label>
                        <div className="relative group">
                            <select
                                required
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-6 py-3 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800 appearance-none cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Brand Logo</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData(prev => ({ ...prev, logo: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                                id="brand-logo-upload"
                            />
                            <label
                                htmlFor="brand-logo-upload"
                                className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer group-hover:border-indigo-300 group-hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                                    <Upload size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                                        {formData.logo ? 'Change Logo' : 'Upload Logo'}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">JPG, PNG or WEBP (MAX. 2MB)</p>
                                </div>
                            </label>
                        </div>
                        {formData.logo && (
                            <div className="relative mt-2 inline-block">
                                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                    <img src={formData.logo} alt="Preview" className="w-full h-full object-contain" loading='lazy' />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Description</label>
                        <div className="relative group">
                            <Info className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe the brand's history, mission or philosophy..."
                                className="w-full pl-11 pr-6 py-3 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium text-gray-800 resize-none"
                            ></textarea>
                        </div>
                    </div>
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
                        form="brandForm"
                        type="submit"
                        disabled={loading}
                        className="flex-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>{brand ? 'Update Brand' : 'Publish Brand'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandFormModal;
