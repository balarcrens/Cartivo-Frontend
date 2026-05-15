import { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../Admin/AdminSidebar';
import AuthContext from '../../Context/Auth/authContext';
import { User, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth/signin');
    };

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <AdminSidebar onLogout={handleLogout} isCollapsed={isCollapsed} />

            <main className="flex-grow flex flex-col min-w-0">
                <header className="h-15 sm:h-20 bg-white/80 backdrop-blur-md border-b border-gray-50 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-all text-gray-500 hover:text-black"
                        >
                            {isCollapsed ? <Menu size={22} /> : <X size={22} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-semibold tracking-tight">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 group-hover:scale-105 transition-transform overflow-hidden border border-gray-100">
                                {user?.profile_image ? (
                                    <img src={user.profile_image} loading='lazy' alt="Admin" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-3 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-700 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
