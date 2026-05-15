import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
    Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/orders/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setOrders(res.data.data.orders);
                }
            } catch (error) {
    console.error(error);
                toast.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'delivered': return 'text-emerald-600 border-emerald-100';
            case 'pending': return 'text-amber-600 border-amber-100';
            case 'processing': return 'text-blue-600 border-blue-100';
            case 'shipped': return 'text-indigo-600 border-indigo-100';
            case 'cancelled': return 'text-rose-600 border-rose-100';
            default: return 'text-gray-600 border-gray-100';
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Orders Management</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage your customer orders across all channels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all w-full md:w-80"
                        />
                    </div>                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{orders.filter(o => o.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Delivered</p>
                    <p className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg premium-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{orders.filter(order => order.payment_status === 'paid').reduce((acc, o) => acc + parseFloat(o.final_price), 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg premium-border shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Order Information</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer Details</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Order Status</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Payment</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Amount</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/30 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                    {order.id.split('-')[0].toUpperCase()}
                                                    <ArrowUpRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">{order.user_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {order.payment_status}
                                                </span>
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">{order.payment_method}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-sm font-bold text-gray-900 tracking-tight">₹{parseFloat(order.final_price).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all active:scale-95 cursor-pointer shadow-lg shadow-gray-200"
                                            >
                                                <Eye size={14} />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <ShoppingBag size={40} className="text-gray-100" />
                                            <p className="text-gray-400 text-sm font-light">No orders found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
