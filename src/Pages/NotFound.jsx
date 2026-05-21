/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';
import SEO from '../Components/Common/SEO';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafafa] overflow-hidden font-outfit">
            <SEO 
                title="Page Not Found | Cartivo"
                description="The page you are looking for has either been moved, deleted, or never existed in our luxury collection."
                keywords="404, page not found, lost, error page, cartivo"
            />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 blur-[120px]"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-blue-100 to-indigo-100 blur-[120px]"
                />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6 py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-medium tracking-[0.3em] uppercase text-indigo-600 bg-indigo-50 rounded-full">
                        Error 404
                    </span>
                    <h1 className="relative text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 select-none">
                        404
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-[-40px] md:mt-[-60px] glass p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 backdrop-blur-xl"
                >
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                        Lost in the <span className="font-semibold">Digital Aisles?</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto mb-10">
                        The page you are looking for has either been moved, deleted, or never existed in our curated collection.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/')}
                            className="group relative cursor-pointer overflow-hidden bg-gray-900 text-white px-8 py-4 rounded-xl text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-gray-900/20"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return Home</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(-1)}
                            className="group border cursor-pointer border-gray-200 bg-white/50 text-gray-700 px-8 py-4 rounded-xl text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-50 hover:border-gray-300"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Go Back</span>
                        </motion.button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/search')}
                            className="flex items-center cursor-pointer justify-center gap-2 text-[10px] text-gray-400 hover:text-indigo-600 tracking-widest uppercase transition-colors"
                        >
                            <Search className="w-3 h-3" />
                            Search Site
                        </button>
                        <button
                            className="flex items-center cursor-pointer justify-center gap-2 text-[10px] text-gray-400 hover:text-indigo-600 tracking-widest uppercase transition-colors"
                            onClick={() => navigate('/category/all')}
                        >
                            <Compass className="w-3 h-3" />
                            Browse Shop
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
                        &copy; 2026 Cartivo • Premium E-Commerce
                    </p>
                </motion.div>
            </div>

            <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 opacity-20 select-none">
                <p className="text-[9px] tracking-[0.6em] rotate-[-90deg] origin-left text-black font-medium uppercase whitespace-nowrap">
                    Premium Experience • Stay Curated
                </p>
            </div>
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-20 select-none">
                <p className="text-[9px] tracking-[0.6em] rotate-[90deg] origin-right text-black font-medium uppercase whitespace-nowrap">
                    404 Error • Page Missing
                </p>
            </div>
        </div>
    );
};

export default NotFound;