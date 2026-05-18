/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import { Link } from 'react-router-dom';
import {
    Search,
    RotateCcw,
    Eye,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Image as ImageIcon,
    X,
    User,
    Mail,
    CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [updating, setUpdating] = useState(false);
    const { token } = useContext(AuthContext);

    // Form states for update
    const [status, setStatus] = useState('');
    const [adminComment, setAdminComment] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        fetchReturns();
    }, [token]);

    const fetchReturns = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/orders/returns/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setReturns(res.data.data.returns);
            }
        } catch (error) {
    console.error(error);
            toast.error('Error fetching return requests');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReturn = (ret) => {
        setSelectedReturn(ret);
        setStatus(ret.status);
        setAdminComment(ret.admin_comment || '');
        setOrderStatus(ret.order_status);
        setPaymentStatus(ret.payment_status);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await axios.patch(`${BASE_URL}/api/v1/orders/returns/${selectedReturn.id}`, {
                status,
                admin_comment: adminComment,
                order_status: orderStatus,
                payment_status: paymentStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                toast.success('Return request updated successfully');
                fetchReturns();
                setSelectedReturn(null);
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to update return request');
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const filteredReturns = returns.filter(ret =>
        ret.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-600 border-emerald-100 bg-emerald-50/50';
            case 'pending': return 'text-amber-600 border-amber-100 bg-amber-50/50';
            case 'approved': return 'text-blue-600 border-blue-100 bg-blue-50/50';
            case 'rejected': return 'text-rose-600 border-rose-100 bg-rose-50/50';
            default: return 'text-gray-600 border-gray-100 bg-gray-50/50';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="luxury-spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 h-screen animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Return Requests</h1>
                    <p className="text-gray-500 text-sm">Manage product returns, refunds, and customer disputes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all w-full md:w-80"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Pending Returns</p>
                    <p className="text-2xl font-bold text-amber-600">{returns.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Approved</p>
                    <p className="text-2xl font-bold text-blue-600">{returns.filter(r => r.status === 'approved').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">{returns.filter(r => r.status === 'completed').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rejected</p>
                    <p className="text-2xl font-bold text-rose-600">{returns.filter(r => r.status === 'rejected').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Order & Date</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Return Status</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Reason Preview</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredReturns.length > 0 ? (
                                filteredReturns.map((ret) => (
                                    <tr key={ret.id} className="group hover:bg-gray-50/30 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <Link to={`/admin/orders/${ret.order_id}`} className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                                    #{ret.order_id.split('-')[0].toUpperCase()}
                                                    <ExternalLink size={12} className="text-gray-300" />
                                                </Link>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(ret.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{ret.user_name}</span>
                                                <span className="text-[11px] text-gray-400">{ret.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusStyles(ret.status)}`}>
                                                {ret.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-gray-500 truncate max-w-[200px] italic">
                                                "{ret.reason}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => {
                                                    window.scroll(0, 0);
                                                    handleSelectReturn(ret);
                                                }}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all active:scale-95 cursor-pointer shadow-lg shadow-gray-200"
                                            >
                                                <Eye size={14} />
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <RotateCcw size={40} className="text-gray-100" />
                                            <p className="text-gray-400 text-sm font-light">No return requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReturn && (
                <div className="fixed inset-0 z-50 flex justify-center sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Review Return Request</h2>
                                <p className="text-[12px] font-bold text-gray-400 line-clamp-1 uppercase tracking-widest mt-1">Order ID: {selectedReturn.order_id}</p>
                            </div>
                            <button onClick={() => setSelectedReturn(null)} className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <AlertCircle size={14} /> Reason for Return
                                    </h3>
                                    <p className="p-3 sm:p-6 bg-gray-50 rounded-md text-sm text-gray-700 leading-relaxed italic border border-gray-100">
                                        "{selectedReturn.reason}"
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <ImageIcon size={14} /> Evidence Images
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        {Array.isArray(selectedReturn.images) ? selectedReturn.images.map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-md overflow-hidden border border-gray-100 group">
                                                <img
                                                    src={img}
                                                    alt="Evidence" loading='lazy'
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            </div>
                                        )) : (
                                            selectedReturn.images && JSON.parse(selectedReturn.images).map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-md overflow-hidden border border-gray-100 group">
                                                    <img
                                                        src={img}
                                                        alt="Evidence" loading='lazy'
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                                        onClick={() => window.open(img, '_blank')}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    <div className="p-2 sm:p-4 bg-gray-50 rounded-md border border-gray-100">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            <User size={12} /> Customer
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{selectedReturn.user_name}</p>
                                    </div>
                                    <div className="p-2 sm:p-4 bg-gray-50 rounded-md border border-gray-100">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            <Mail size={12} /> Email
                                        </div>
                                        <p className="text-xs font-medium text-gray-900 truncate">{selectedReturn.user_email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 sm:p-6 rounded-3xl border border-gray-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-indigo-600" /> Take Action
                                </h3>

                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Return Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full cursor-pointer px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="completed">Completed (Refunded)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Order Status</label>
                                        <select
                                            value={orderStatus}
                                            onChange={(e) => setOrderStatus(e.target.value)}
                                            className="w-full cursor-pointer px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                        >
                                            <option value="delivered">Delivered</option>
                                            <option value="returned">Returned</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                            <CreditCard size={12} /> Payment Status
                                        </label>
                                        <select
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                            className="w-full cursor-pointer px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                        >
                                            <option value="paid">Paid</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Admin Comment (Visible to Customer)</label>
                                        <textarea
                                            value={adminComment}
                                            onChange={(e) => setAdminComment(e.target.value)}
                                            placeholder="Write your feedback for the customer..."
                                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 h-32 resize-none"
                                        />
                                    </div>

                                    <button
                                        disabled={updating}
                                        className="w-full cursor-pointer py-4 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                    >
                                        {updating ? "Processing..." : "Update Request Status"}
                                    </button>

                                    <Link to={`/admin/orders/${selectedReturn.order_id}`} className="block text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors pt-2">
                                        View Full Order Details
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReturns;
