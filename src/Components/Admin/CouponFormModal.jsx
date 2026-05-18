/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    X,
    Save,
    Ticket,
    Calendar,
    DollarSign,
    Percent,
    ShoppingCart,
    Users,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import AuthContext from '../../Context/Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const CouponFormModal = ({ isOpen, onClose, coupon, onSave }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        code: '',
        discount_type: 'percentage',
        value: '',
        min_order_value: '',
        max_discount: '',
        expiry_date: '',
        usage_limit: '',
        status: 'active'
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (coupon) {
                // Format date for input type="date"
                const formattedDate = coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '';
                setFormData({
                    code: coupon.code || '',
                    discount_type: coupon.discount_type || 'percentage',
                    value: coupon.value || '',
                    min_order_value: coupon.min_order_value || '',
                    max_discount: coupon.max_discount || '',
                    expiry_date: formattedDate,
                    usage_limit: coupon.usage_limit || '',
                    status: coupon.status || 'active'
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, coupon]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = coupon
                ? `${BASE_URL}/api/v1/coupons/${coupon.id}`
                : `${BASE_URL}/api/v1/coupons`;
            const method = coupon ? 'patch' : 'post';

            const submissionData = {
                ...formData,
                value: Number(formData.value),
                min_order_value: formData.min_order_value ? Number(formData.min_order_value) : 0,
                max_discount: formData.max_discount ? Number(formData.max_discount) : null,
                usage_limit: formData.usage_limit ? Number(formData.usage_limit) : 1,
                expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null
            };

            const res = await axios[method](url, submissionData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                onSave();
                onClose();
                toast.success(`Coupon ${method === 'patch' ? 'updated' : 'added'} successfullly`);
            }
        } catch (error) {
            console.error(error);
            console.error('Error saving coupon:', error);
            toast.error('Failed to save coupon');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] h-fit flex justify-center sm:p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white rounded-md shadow-2xl overflow-hidden transform animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="px-4 sm:px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {coupon ? 'Modify Coupon' : 'New Coupon'}
                        </h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {coupon ? 'Update existing discount parameters' : 'Create a new promotional campaign'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-gray-900 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form id="couponForm" onSubmit={handleSubmit} className="px-3 sm:px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-8">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Voucher Code</label>
                            <div className="relative group">
                                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. SUMMER2024"
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Discount Type</label>
                            <select
                                name="discount_type"
                                value={formData.discount_type}
                                onChange={handleChange}
                                className="w-full px-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800 appearance-none cursor-pointer"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Value</label>
                            <div className="relative group">
                                {formData.discount_type === 'percentage' ? (
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                ) : (
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400 group-focus-within:text-emerald-600 transition-colors">₹</span>
                                )}
                                <input
                                    required
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Min. Order (₹)</label>
                            <div className="relative group">
                                <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                                <input
                                    type="number"
                                    name="min_order_value"
                                    value={formData.min_order_value}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-amber-100 focus:ring-4 focus:ring-amber-500/5 transition-all text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className={`space-y-2 transition-all ${formData.discount_type === 'percentage' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Max Discount (₹)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                                <input
                                    type="number"
                                    name="max_discount"
                                    disabled={formData.discount_type !== 'percentage'}
                                    value={formData.max_discount}
                                    onChange={handleChange}
                                    placeholder="No limit"
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-rose-100 focus:ring-4 focus:ring-rose-500/5 transition-all text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Expiry Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    required
                                    type="date"
                                    name="expiry_date"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Usage Limit</label>
                            <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="number"
                                    name="usage_limit"
                                    value={formData.usage_limit}
                                    onChange={handleChange}
                                    placeholder="1"
                                    className="w-full pl-11 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-lg outline-0 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Status</label>
                            <div className="grid grid-cols-2 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                                    className={`flex items-center justify-center gap-3 py-3.5 rounded-lg border-2 transition-all cursor-pointer ${formData.status === 'active'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    <CheckCircle2 size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Active</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'inactive' }))}
                                    className={`flex items-center justify-center gap-3 py-3.5 rounded-lg border-2 transition-all cursor-pointer ${formData.status === 'inactive'
                                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    <XCircle size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Inactive</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="px-2 sm:px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex gap-2 sm:gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-2 sm:px-8 py-4 bg-white border border-gray-200 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        form="couponForm"
                        type="submit"
                        disabled={loading}
                        className="flex-[2] px-2 sm:px-8 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-black hover:shadow-2xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>{coupon ? 'Confirm Changes' : 'Create Voucher'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CouponFormModal;
