import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Tag,
    TicketPercent,
    LogOut,
    ChevronRight,
    Home,
    Award,
    Layout,
    Mail,
    RotateCcw
} from 'lucide-react';

const AdminSidebar = ({ onLogout, isCollapsed }) => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
        { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
        { name: 'Brands', icon: <Award size={20} />, path: '/admin/brands' },
        { name: 'Coupons', icon: <TicketPercent size={20} />, path: '/admin/coupons' },
        { name: 'Returns', icon: <RotateCcw size={20} />, path: '/admin/returns' },
        { name: 'Manage Hero', icon: <Layout size={20} />, path: '/admin/hero' },
        { name: 'Contact Messages', icon: <Mail size={20} />, path: '/admin/contacts' },
        { name: 'Home', icon: <Home size={20} />, path: '/' },
    ];

    return (
        <aside className={`bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out z-40
            ${isCollapsed ? 'w-20' : 'w-70'} relative`}>
            <div className="p-3 sm:py-6 border-b border-gray-50 flex items-center justify-center transition-all duration-300 ease-in-out">
                <img src={isCollapsed ? '/icon.png' : '/logo_v2.png'} alt="Cartivo" className='h-9' loading='lazy' />
            </div>

            <nav className="flex-grow p-2 sm:p-3 space-y-2 overflow-y-auto scrollbar-hidden">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        title={isCollapsed ? item.name : ''}
                        className={({ isActive }) => `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2 sm:px-3 py-3 transition-all duration-300 group
                            ${isActive ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                    >
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className={`transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className="text-sm font-medium tracking-wide animate-in fade-in duration-300 whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1`} />
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-gray-50">
                <button
                    onClick={onLogout}
                    title={isCollapsed ? 'Logout' : ''}
                    className={`w-full cursor-pointer flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 font-medium group`}
                >
                    <LogOut size={20} className="transition-transform shrink-0" />
                    {!isCollapsed && (
                        <span className="text-sm animate-in fade-in duration-300 whitespace-nowrap">Logout</span>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
