/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    Search,
    User,
    Mail,
    Phone,
    Shield,
    Trash2,
    MoreVertical,
    UserPlus,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    Filter,
    ChevronLeft,
    ChevronRight,
    SearchX
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useContext(AuthContext);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setUsers(res.data.data.users);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleUpdateUser = async (id, data) => {
        try {
            const res = await axios.patch(`${BASE_URL}/api/v1/users/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setUsers(users.map(user => user.id === id ? { ...user, ...data } : user));
                toast.success('User updated successfullly');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure want to delete this user?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(users.filter(user => user.id !== id));
                toast.success('User deleted successfullly');
            } catch (error) {
                console.error(error);
                toast.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleStyles = (role) => {
        switch (role) {
            case 'admin': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'vendor': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'customer': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'suspended': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-[12px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing User Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 italic">User Directory</h1>
                    <p className="text-gray-500 text-sm font-medium">Manage and oversee your platform members.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3.5 bg-white rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all w-full md:w-96 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-7 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Members</p>
                    <p className="text-3xl font-black text-gray-900">{users.length}</p>
                </div>
                <div className="bg-white p-7 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Active Now</p>
                    <p className="text-3xl font-black text-emerald-600">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="bg-white p-7 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Administrators</p>
                    <p className="text-3xl font-black text-indigo-600">{users.filter(u => u.role === 'admin').length}</p>
                </div>
                <div className="bg-white p-7 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Suspended</p>
                    <p className="text-3xl font-black text-rose-600">{users.filter(u => u.status === 'suspended').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Member</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Contact Info</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Privileges</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Account Status</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Joined Date</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">{user.name}</span>
                                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {user.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail size={12} className="text-gray-400" />
                                                    <span className="text-sm font-medium">{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone size={12} className="text-gray-400" />
                                                        <span className="text-xs font-medium">{user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                                className={`px-3 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none transition-all appearance-none ${getRoleStyles(user.role)}`}
                                            >
                                                <option value="customer">User</option>
                                                <option value="vendor">Vendor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={user.status}
                                                onChange={(e) => handleUpdateUser(user.id, { status: e.target.value })}
                                                className={`px-3 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none appearance-none transition-all ${getStatusStyles(user.status)}`}
                                            >
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span className="text-xs font-bold">{new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 max-w-xs mx-auto">
                                            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border border-gray-100">
                                                <SearchX size={48} className="text-gray-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-gray-900 text-xl font-black italic">No users found</p>
                                                <p className="text-gray-400 text-sm font-medium">We couldn't find any members matching your current search criteria.</p>
                                            </div>
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="px-8 py-3 bg-black text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg shadow-black/10"
                                            >
                                                Clear Search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Displaying {filteredUsers.length} of {users.length} Registered Members
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="p-2.5 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-black hover:border-black transition-all cursor-not-allowed opacity-50">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
