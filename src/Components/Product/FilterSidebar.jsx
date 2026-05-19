/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ChevronDown, X, Filter, Tag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";

const FilterSidebar = ({
    categories,
    activeCategory,
    onCategoryChange,
    brands,
    selectedBrands,
    onBrandToggle,
    priceRange,
    onPriceChange,
    onClearAll,
    isOpen,
    onClose,
    isMobile = false
}) => {
    const sidebarContent = (
        <div className={`flex flex-col h-full ${isMobile ? 'bg-white rounded-b-3xl overflow-hidden' : 'bg-white'}`}>
            <div className="flex-grow overflow-y-auto p-2 px-4 sm:p-4 space-y-6">
                {isMobile && (
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Filter className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-widest text-gray-900">Filters</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">Shop Categories</h3>
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => onCategoryChange('all')}
                            className={`w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCategory === 'all' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <span className="text-[13px] font-bold tracking-tight">All Collections</span>
                            {activeCategory === 'all' && <Check className="w-4 h-4" />}
                        </button>

                        <div className="pt-2 space-y-1">
                            {categories.map((cat) => (
                                <CategoryItem
                                    key={cat.id}
                                    category={cat}
                                    activeCategory={activeCategory}
                                    onCategoryChange={onCategoryChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">Price Range</h3>
                    </div>

                    <div className="px-2 pt-2">
                        <Slider
                            range
                            min={0}
                            max={200000}
                            step={1000}
                            value={priceRange}
                            onChange={(value) => onPriceChange(value)}
                            trackStyle={[{ backgroundColor: "#4f46e5", height: 4 }]}
                            handleStyle={[
                                { borderColor: "#4f46e5", height: 20, width: 20, marginTop: -8, backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", opacity: 1 },
                                { borderColor: "#4f46e5", height: 20, width: 20, marginTop: -8, backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", opacity: 1 }
                            ]}
                            railStyle={{ backgroundColor: "#f3f4f6", height: 4 }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Min Price</span>
                            <span className="text-sm font-black text-gray-900 italic serif">₹{priceRange[0].toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Max Price</span>
                            <span className="text-sm font-black text-gray-900 italic serif">₹{priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            [0, 10000],
                            [10000, 50000],
                            [50000, 100000],
                            [100000, 200000]
                        ].map(([min, max]) => (
                            <button
                                key={min}
                                onClick={() => onPriceChange([min, max])}
                                className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${priceRange[0] === min && priceRange[1] === max
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                ₹{(min / 1000).toFixed(0)}k - ₹{(max / 1000).toFixed(0)}k
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">Premium Brands</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                        {brands.length > 0 ? brands.map((brand) => (
                            <label key={brand.id} className="flex items-center justify-between p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-5 h-5 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer hidden"
                                            checked={selectedBrands.includes(brand.slug)}
                                            onChange={() => onBrandToggle(brand.slug)}
                                        />
                                        <div className="w-full h-full border-2 border-gray-200 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all group-hover:border-indigo-300" />
                                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                                    </div>
                                    <span className={`text-[13px] font-bold transition-colors ${selectedBrands.includes(brand.slug) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                                        {brand.name}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 group-hover:text-indigo-400 transition-colors uppercase">Select</span>
                            </label>
                        )) : (
                            <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Tag className="w-6 h-6 text-gray-300 mx-auto mb-2 opacity-50" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">No brands available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-2 sm:p-4 border-t border-gray-100 bg-white/80 backdrop-blur-md z-10">
                <div className="flex flex-col gap-3">
                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            Show Results
                        </button>
                    )}
                    <button
                        onClick={onClearAll}
                        className="w-full cursor-pointer py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center gap-2 group"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Clear All Filters
                    </button>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100vh' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100vh' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-screen h-[90dvh] z-[9999] shadow-2xl"
                            style={{ position: 'fixed' }}
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <aside className="border-r border-gray-100 flex flex-col h-full bg-white sticky top-16 max-h-[calc(100vh-64px)] overflow-hidden">
            {sidebarContent}
        </aside>
    );
};

const CategoryItem = ({ category, activeCategory, onCategoryChange, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const isActive = activeCategory === category.slug;

    return (
        <div className="space-y-1">
            <div
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer group transition-all ${isActive ? 'text-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                style={{ paddingLeft: `${(level * 12) + 16}px` }}
                onClick={() => {
                    onCategoryChange(category.slug);
                    if (hasChildren) setIsOpen(!isOpen);
                }}
            >
                <div className="flex items-center gap-3">
                    {level > 0 && <span className="w-1 h-1 bg-gray-300 rounded-full" />}
                    <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-indigo-600' : ''}`}>
                        {category.name}
                    </span>
                </div>

                {hasChildren ? (
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-gray-300'}`}>
                        <ChevronDown size={14} />
                    </div>
                ) : (
                    isActive && <Check className="w-4 h-4 text-indigo-600" />
                )}
            </div>

            <AnimatePresence>
                {hasChildren && isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {category.children.map(child => (
                            <CategoryItem
                                key={child.id}
                                category={child}
                                activeCategory={activeCategory}
                                onCategoryChange={onCategoryChange}
                                level={level + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterSidebar;
