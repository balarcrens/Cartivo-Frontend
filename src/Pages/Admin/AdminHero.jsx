/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    Plus,
    Edit3,
    Trash2,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Eye,
    Layout
} from 'lucide-react';
import HeroFormModal from '../../Components/Admin/HeroFormModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const AdminHero = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/hero`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setBanners(res.data.data.banners);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [token]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this hero banner?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/hero/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBanners();
                toast.success('Banner deleted successfullly');
            } catch (error) {
                console.error(error);
                toast.error('Error deleting banner:', error);
            }
        }
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedBanner(null);
        setIsModalOpen(true);
    };

    if (loading && banners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading banners...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-800 pb-12 font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2 uppercase">Hero Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Design the first impression of your store.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-gray-800 shadow-xl shadow-black/10 transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={18} />
                    New Slide
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="group bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col">
                        <div className="relative aspect-video overflow-hidden bg-gray-50">
                            <img
                                src={banner.image_url}
                                alt={banner.title} loading='lazy'
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${banner.is_active
                                    ? 'bg-emerald-500/90 text-white'
                                    : 'bg-white/90 text-gray-400'
                                    }`}>
                                    {banner.is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                    {banner.is_active ? 'Active' : 'Draft'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 flex-grow">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{banner.subtitle || 'NO SUBTITLE'}</p>
                                    <h3 className="text-lg font-black text-gray-900 line-clamp-1 uppercase tracking-tight">{banner.title}</h3>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-black text-gray-400">#{banner.display_order}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 font-medium leading-relaxed">
                                {banner.description || 'No description provided for this hero slide.'}
                            </p>

                            <div className="pt-4 flex items-center justify-end border-t border-gray-50">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="bg-white cursor-pointer text-black p-3 rounded-md font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="p-3 cursor-pointer rounded-md hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div onClick={() => {
                    handleAdd();
                    window.scroll(0, 0);
                }}
                    className="group aspect-square md:aspect-auto rounded-md border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-indigo-50/10 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-12 text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-transform duration-500 mb-6">
                        <Plus className="w-8 h-8 text-gray-300 group-hover:text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Add New Slide</h3>
                    <p className="text-gray-400 text-sm font-medium">Create a stunning entry point for your customers.</p>
                </div>
            </div>

            <HeroFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                banner={selectedBanner}
                onSave={fetchBanners}
            />
        </div>
    );
};

export default AdminHero;
