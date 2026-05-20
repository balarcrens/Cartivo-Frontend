import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    ArrowUpRight,
    IndianRupee,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/v1/admin/stats`, config),
                    axios.get(`${BASE_URL}/api/v1/admin/recent-orders`, config)
                ]);

                setStats(statsRes.data.data);
                setRecentOrders(ordersRes.data.data.orders);
            } catch (error) {
                console.error(error);
                toast.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="luxury-spinner"></div>
            </div>
        );
    }

    const { totalSales, totalOrders, totalUsers, totalProducts } = stats?.stats || {};

    return (
        <div className="space-y-6 md:space-y-10">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">Overview</h1>
                <p className="text-gray-500 text-xs md:text-sm">Welcome back, here's what's happening with your store today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard
                    title="Revenue"
                    value={`₹${totalSales?.toLocaleString() || '0'}`}
                    icon={<IndianRupee size={20} className="md:w-6 md:h-6" />}
                    color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                />

                <StatCard
                    title="Orders"
                    value={totalOrders || '0'}
                    icon={<ShoppingBag size={20} className="md:w-6 md:h-6" />}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                />

                <StatCard
                    title="Customers"
                    value={totalUsers || '0'}
                    icon={<Users size={20} className="md:w-6 md:h-6" />}
                    color="bg-gradient-to-br from-sky-500 to-blue-600"
                />

                <StatCard
                    title="Products"
                    value={totalProducts || '0'}
                    icon={<Package size={20} className="md:w-6 md:h-6" />}
                    color="bg-gradient-to-br from-pink-400 to-rose-600"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg premium-border classic-shadow overflow-hidden">
                    <div className="p-5 md:p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg md:text-xl font-bold tracking-tight">Recent Orders</h2>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] md:text-xs cursor-pointer font-bold uppercase tracking-widest text-brand-primary hover:underline underline-offset-4 flex items-center gap-1 group">
                            View All <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto scrollbar-hidden">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-5 md:px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-5 md:px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-5 md:px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-5 md:px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-5 md:px-8 py-5 text-xs md:text-sm font-medium text-gray-400 font-mono">#{order.id.slice(0, 8)}...</td>
                                        <td className="px-5 md:px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                    {order.user_name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs md:text-sm font-semibold tracking-tight truncate">{order.user_name}</p>
                                                    <p className="text-sm text-gray-400 truncate">{order.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 md:px-8 py-5">
                                            <span className={`text-[9px] md:text-[10px] font-bold py-0.5 rounded-full uppercase tracking-widest ${order.status === 'delivered' ? 'text-green-600' :
                                                order.status === 'pending' ? 'text-yellow-600' :
                                                    'text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 md:px-8 py-5 text-xs md:text-sm font-bold tracking-tight">₹{parseFloat(order.final_price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`relative overflow-hidden rounded-xl p-5 md:p-6 text-white ${color} premium-border classic-shadow transition-all duration-500 hover:shadow-xl group cursor-pointer`}>
        <div className="relative flex items-start justify-between mb-6 md:mb-8">
            <div className="space-y-2 md:space-y-3">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all duration-500">
                    {icon}
                </div>

                <p className="text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/70 font-semibold truncate">
                    {title}
                </p>
            </div>
        </div>

        <div className="relative flex items-end justify-between">
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight leading-none">
                {value}
            </h3>

            <div className="opacity-10 group-hover:opacity-20 transition duration-500 scale-[1.5] md:scale-[2.5] origin-right">
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;