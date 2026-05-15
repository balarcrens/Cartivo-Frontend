/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../Context/Auth/authContext';
import {
    Search,
    Trash2,
    Mail,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    Archive,
    Reply,
    MoreVertical,
    Calendar,
    Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const AdminContacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { token } = useContext(AuthContext);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/v1/contacts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setMessages(res.data.data);
            }
        } catch (error) {
    console.error(error);
            toast.error('Error fetching messages');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [token]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this message?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/contacts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchMessages();
                toast.success('Message deleted successfully');
            } catch (error) {
    console.error(error);
                toast.error('Failed to delete message');
                console.error(error);
            }
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/v1/contacts/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Message marked as ${status}`);
            fetchMessages();
        } catch (error) {
    console.error(error);
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="luxury-spinner"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-8 font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2 uppercase">Contact Inquiries</h1>
                    <p className="text-gray-500 text-sm font-medium">Manage and respond to customer messages.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all w-full shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Inquiries</p>
                    <p className="text-3xl font-black text-gray-900">{messages.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pending Action</p>
                    <p className="text-3xl font-black text-amber-500">{messages.filter(m => m.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Resolved</p>
                    <p className="text-3xl font-black text-emerald-500">{messages.filter(m => m.status === 'replied').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Read</p>
                    <p className="text-3xl font-black text-indigo-500">{messages.filter(m => m.status === 'read').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sender</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message Details</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{msg.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} /> {msg.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="max-w-md">
                                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1 line-clamp-1">
                                                    {msg.subject || 'No Subject'}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    {formatDate(msg.created_at).split(',')[0]}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {formatDate(msg.created_at).split(',')[1]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${msg.status === 'replied' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                                msg.status === 'pending' ? 'text-amber-600 bg-amber-50 border-amber-100 animate-pulse' :
                                                    msg.status === 'read' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                                                        'text-gray-600 bg-gray-50 border-gray-100'
                                                }`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                {msg.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateStatus(msg.id, 'read')}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Mark as Read"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=${encodeURIComponent(`Re: ${msg.subject || ''}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 cursor-pointer text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all inline-flex"
                                                    title="Reply via Gmail"
                                                >
                                                    <Reply size={18} />
                                                </a>
                                                <button
                                                    onClick={() => updateStatus(msg.id, 'replied')}
                                                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Mark as Replied"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(msg.id, 'archived')}
                                                    className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Archive"
                                                >
                                                    <Archive size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-2 cursor-pointer text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                                <MessageSquare size={32} />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold">No messages found</p>
                                                <p className="text-gray-500 text-xs">When customers contact you, their inquiries will appear here.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing {filteredMessages.length} of {messages.length} inquiries
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 cursor-not-allowed opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 cursor-not-allowed opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContacts;
