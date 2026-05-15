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
    Ticket,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Calendar,
    Users,
    TrendingUp,
    Clock,
    AlertCircle
} from 'lucide-react';
import CouponFormModal from '../../Components/Admin/CouponFormModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/coupons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setCoupons(res.data.data.coupons);
            }
        } catch (error) {
    console.error(error);
            toast.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [token]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this coupon?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/coupons/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCoupons();
                toast.success('Coupon deleted successfullly');
            } catch (error) {
    console.error(error);
                toast.error('Failed to delete Coupon', error);
            }
        }
    };

    const handleEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCoupon(null);
        setIsModalOpen(true);
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (date) => {
        return new Date(date) < new Date();
    };

    const getRemainingUsage = (coupon) => {
        if (coupon.usage_limit === null) return '∞';
        return Math.max(0, coupon.usage_limit - coupon.usage_count);
    };

    if (loading && coupons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing promotions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-3">Vouchers</h1>
                    <p className="text-gray-500 text-base font-medium">Create and optimize your customer incentives.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group flex-grow lg:flex-grow-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all w-full lg:w-96 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            window.scroll(0, 0);
                            handleAdd();
                        }}
                        className="inline-flex items-center sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black hover:shadow-2xl hover:shadow-gray-200 transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} />
                        New Voucher
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Active Vouchers</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-gray-900">{coupons.filter(c => c.status === 'active' && !isExpired(c.expiry_date)).length}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Total Claims</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-indigo-600">{coupons.reduce((acc, curr) => acc + (curr.usage_count || 0), 0)}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Expiring Soon</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-amber-500">
                            {coupons.filter(c => {
                                const days = (new Date(c.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
                                return days > 0 && days < 7;
                            }).length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Deactivated</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-rose-500">{coupons.filter(c => c.status === 'inactive' || isExpired(c.expiry_date)).length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Voucher Code</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Benefit</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Limits</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Expires</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                                <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCoupons.length > 0 ? (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                    <Ticket size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-gray-900 tracking-tight">{coupon.code}</span>
                                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {coupon.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-gray-800">
                                                    {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${parseFloat(coupon.value).toLocaleString()} OFF`}
                                                </span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Min Order: ₹{parseFloat(coupon.min_order_value).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-gray-700">Used: {coupon.usage_count}</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Remaining: {getRemainingUsage(coupon)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold ${isExpired(coupon.expiry_date) ? 'text-rose-500' : 'text-gray-700'}`}>
                                                        {new Date(coupon.expiry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    {isExpired(coupon.expiry_date) && (
                                                        <span className="text-[9px] font-black uppercase text-rose-400 tracking-widest">Expired</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all ${coupon.status === 'active' && !isExpired(coupon.expiry_date)
                                                ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                                : 'text-rose-600 bg-rose-50 border-rose-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2.5 ${coupon.status === 'active' && !isExpired(coupon.expiry_date) ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                                                {isExpired(coupon.expiry_date) ? 'Deactivated' : coupon.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => {
                                                        window.scroll(0, 0);
                                                        handleEdit(coupon);
                                                    }}
                                                    className="p-3 cursor-pointer text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                                                    title="Edit Parameters"
                                                >
                                                    <Edit3 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-3 cursor-pointer text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-10 py-40 text-center">
                                        <div className="flex flex-col items-center gap-8 max-w-sm mx-auto">
                                            <div className="w-32 h-32 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100 shadow-inner">
                                                <Ticket size={56} className="text-gray-100" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-gray-900 text-2xl font-black tracking-tight">No active promotions</p>
                                                <p className="text-gray-400 text-sm font-medium leading-relaxed">It looks like you haven't created any promotional vouchers yet. Start incentivizing your customers today!</p>
                                            </div>
                                            <button
                                                onClick={handleAdd}
                                                className="px-10 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-black hover:shadow-2xl hover:shadow-gray-200 transition-all cursor-pointer"
                                            >
                                                Launch Campaign
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Sync Complete — {filteredCoupons.length} Vouchers Optimized
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="p-3 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-3 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <CouponFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coupon={selectedCoupon}
                onSave={fetchCoupons}
            />
        </div>
    );
};

export default AdminCoupons;
