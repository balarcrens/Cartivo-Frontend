/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { X, Upload, Save, Type, Link, Layers, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import AuthContext from '../../Context/Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const HeroFormModal = ({ isOpen, onClose, banner, onSave }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        button_text: 'Shop Now',
        link_url: '',
        is_active: true,
        display_order: 0
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title || '',
                subtitle: banner.subtitle || '',
                description: banner.description || '',
                image_url: banner.image_url || '',
                button_text: banner.button_text || 'Shop Now',
                link_url: banner.link_url || '',
                is_active: banner.is_active,
                display_order: banner.display_order || 0
            });
            setPreviewImage(banner.image_url);
        } else {
            resetForm();
        }
    }, [banner, isOpen]);

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image_url: '',
            button_text: 'Shop Now',
            link_url: '',
            is_active: true,
            display_order: 0
        });
        setPreviewImage(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({ ...prev, image_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = `${BASE_URL}/api/v1/hero${banner ? `/${banner.id}` : ''}`;
            const method = banner ? 'patch' : 'post';

            const res = await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                onSave();
                onClose();
                toast.success(`Banner ${method === 'patch' ? 'updated' : 'added'} successfullly`);
            }
        } catch (error) {
    console.error(error);
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed h-fit inset-0 z-[60] flex justify-center animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                            {banner ? 'Edit Hero Banner' : 'Create Hero Banner'}
                        </h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Management Console</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 scrollbar-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <Type size={14} /> Banner Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter main heading"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <Layers size={14} /> Subtitle
                                </label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter catchphrase"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <Type size={14} /> Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Brief description of the promotion"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <Type size={14} /> Button Text
                                    </label>
                                    <input
                                        type="text"
                                        name="button_text"
                                        value={formData.button_text}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <Link size={14} /> Link URL
                                    </label>
                                    <input
                                        type="text"
                                        name="link_url"
                                        value={formData.link_url}
                                        onChange={handleInputChange}
                                        placeholder="/product/my-product"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <Upload size={14} /> Hero Image
                                </label>
                                <div className="relative group aspect-video rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-indigo-400">
                                    {previewImage ? (
                                        <>
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" loading='lazy' />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <label className="bg-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition-transform">
                                                    Change Image
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center gap-4 cursor-pointer">
                                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-900">Upload Hero Image</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">1600x900 recommended</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!banner} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-900">Visibility</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Show on homepage</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`p-1 rounded-full transition-colors cursor-pointer ${formData.is_active ? 'text-indigo-600' : 'text-gray-300'}`}
                                    >
                                        {formData.is_active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                    </button>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Display Priority</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            name="display_order"
                                            min="0"
                                            max="100"
                                            value={formData.display_order}
                                            onChange={handleInputChange}
                                            className="flex-grow accent-indigo-600"
                                        />
                                        <span className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sm font-black text-gray-900">
                                            {formData.display_order}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-10 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-widest rounded-md hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save size={16} />
                            )}
                            {banner ? 'Apply Changes' : 'Publish Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeroFormModal;
