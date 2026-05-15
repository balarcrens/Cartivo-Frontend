import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProgressBar from './ProgressBar';
import CartSidebar from './CartSidebar';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen scrollbar-hidden">
            <Header />
            <CartSidebar />

            <main className="flex-grow">
                <div className="animate-in fade-in duration-700">
                    <Outlet />
                </div>
                <ProgressBar />
            </main>

            <Footer />
        </div>
    );
}
