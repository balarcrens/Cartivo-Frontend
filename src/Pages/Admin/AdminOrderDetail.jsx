/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import { ChevronLeft, MapPin, CreditCard, Calendar, User, Mail, Phone, Save, History } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrderDetail = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [comment, setComment] = useState('');
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchOrderDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setOrderData(res.data.data);
                setNewStatus(res.data.data.order.status);
                setNewPaymentStatus(res.data.data.order.payment_status);
                setUserId(res.data.data.order.user_id);
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to fetch order detail', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId, token]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setUserData(res.data.data.user);
                }
            } catch (error) {
    console.error(error);
                toast.error('Failed to fetch user', error);
            }
        }
        fetchUserInfo();
    }, [userId, token]);

    const handleUpdateStatus = async () => {
        try {
            setUpdating(true);
            const res = await axios.patch(`http://localhost:5000/api/v1/orders/${orderId}`, {
                status: newStatus,
                payment_status: newPaymentStatus,
                comment: comment || `Status updated by Admin`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                toast.success('Order updated successfully');
                setComment('');
                fetchOrderDetail();
            }
        } catch (error) {
    console.error(error);
            toast.error('Failed to update order', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="luxury-spinner"></div>
            </div>
        );
    }

    if (!orderData) return <div className="p-8 text-center bg-white rounded-3xl premium-border">Order not found</div>;

    const { order, items, history } = orderData;
    const address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

    return (
        <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <button onClick={() => navigate('/admin/orders')} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors mb-6 group cursor-pointer hover:underline underline-offset-6">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Orders
                </button>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-light text-gray-900 uppercase tracking-tight">
                                Order <span className="italic font-serif">#{order.id.split('-')[0].toUpperCase()}</span>
                            </h1>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${order.status === 'delivered' ? 'text-emerald-600 border-emerald-100' : 'text-amber-600 border-amber-100'}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 font-light">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleString()}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span className="uppercase tracking-widest font-medium text-black">Customer ID: {order.user_id.split('-')[0]}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="returned">Returned</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Status</label>
                                    <select
                                        value={newPaymentStatus}
                                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Update Comment</label>
                                <textarea
                                    placeholder="Add a note about this status change..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all min-h-[100px] resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 disabled:opacity-50 cursor-pointer"
                                >
                                    {updating ? 'Updating...' : <><Save size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-50">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Order Items ({items.length})</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {items.map((item, idx) => (
                                <div key={idx} className="p-6 sm:p-8 flex gap-8 hover:bg-gray-50/30 transition-colors">
                                    <div className="w-24 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-gray-50">
                                        <img
                                            src={item.product_image || 'https://placehold.co/100x130?text=Product'}
                                            alt={item.product_name} loading='lazy'
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow py-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{item.product_name}</h3>
                                            <span className="text-base font-bold text-gray-900 tracking-tight">₹{parseFloat(item.price).toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-1 mb-4">
                                            {item.variant_name && (
                                                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">{item.variant_name}</p>
                                            )}
                                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">SKU:</span>
                                            <span className="text-[10px] font-mono text-gray-400">PROD-{item.product_id.split('-')[0].toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-50">
                            <div className="space-y-4 max-w-sm ml-auto">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{parseFloat(order.total_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600">FREE</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                                        <span>Discount</span>
                                        <span className="text-rose-600">-₹{parseFloat(order.discount_amount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Grand Total</span>
                                    <span className="text-3xl font-bold text-gray-900 tracking-tighter">₹{parseFloat(order.final_price).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center gap-3">
                            <History className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Status History</h2>
                        </div>
                        <div className="p-6 sm:p-8">
                            <div className="relative space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                {history.map((h, idx) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100 ${idx === 0 ? 'bg-green-600' : 'bg-gray-200'}`} />
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">{h.status}</span>
                                            <span className="text-sm text-gray-400">{new Date(h.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-light leading-relaxed">{h.comment || 'No comment provided'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="px-8 py-4 border-b border-gray-50">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-400" /> Customer Insights
                            </h2>
                        </div>
                        <div className="p-8 pt-4 space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold">
                                    {userData?.name?.charAt(0) || order.user_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{userData?.name || order.user_name}</h3>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-300" />
                                    <span>{userData?.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-300" />
                                    <span>{userData?.phone || address.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="px-8 py-4 border-b border-gray-50">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" /> Shipping Destination
                            </h2>
                        </div>
                        <div className="p-8 space-y-4">
                            <p className="text-sm font-bold text-gray-900">{address.full_name}</p>
                            <div className="text-sm font-light text-gray-500 leading-relaxed space-y-1">
                                <p>{address.address_line1}</p>
                                {address.address_line2 && <p>{address.address_line2}</p>}
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                                <p className="font-bold text-gray-900">{address.country}</p>
                            </div>
                            <div className="pt-4 flex items-center gap-2">
                                <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-500 uppercase tracking-widest">Home Delivery</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="px-8 py-4 border-b border-gray-50">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400" /> Transaction Detail
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Method</span>
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">{order.payment_method}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border ${order.payment_status === 'paid' ? 'text-emerald-600 border-emerald-100' : 'text-amber-600 border-amber-100'}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Transaction ID</p>
                                <p className="text-xs font-mono text-gray-600 truncate">TXN_{order.id.replace(/-/g, '').toUpperCase().slice(0, 16)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
