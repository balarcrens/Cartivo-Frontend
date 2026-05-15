/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import FilterSidebar from '../Components/Product/FilterSidebar';
import ProductCard from '../Components/Product/ProductCard';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filters State
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sort, setSort] = useState('newest');

    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialData();
        fetchBrands();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [query, searchParams]);

    const fetchInitialData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/categories/tree`);
            setCategories(res.data.data.categories);
        } catch (error) {
    console.error(error);
            console.error("Error fetching categories", error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/brands`);
            setBrands(res.data.data.brands || []);
        } catch (error) {
    console.error(error);
            console.error("Error fetching brands", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams);
            params.set('search', query);
            const res = await axios.get(`${BASE_URL}/api/v1/products?${params.toString()}`);
            setProducts(res.data.data.products);
        } catch (error) {
    console.error(error);
            console.error("Error fetching search results", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandToggle = (brandSlug) => {
        const newBrands = selectedBrands.includes(brandSlug)
            ? selectedBrands.filter(b => b !== brandSlug)
            : [...selectedBrands, brandSlug];

        setSelectedBrands(newBrands);
        if (newBrands.length > 0) {
            searchParams.set('brand', newBrands.join(','));
        } else {
            searchParams.delete('brand');
        }
        setSearchParams(searchParams);
    };

    const handlePriceChange = (range) => {
        setPriceRange(range);
        searchParams.set('minPrice', range[0]);
        searchParams.set('maxPrice', range[1]);
        setSearchParams(searchParams);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        searchParams.set('sort', newSort);
        setSearchParams(searchParams);
    };

    const handleClearAll = () => {
        setSelectedBrands([]);
        setPriceRange([0, 200000]);
        setSort('newest');
        const newParams = new URLSearchParams();
        newParams.set('q', query);
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="relative bg-[#fcfcfc] border-b border-gray-100 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 relative z-10">
                    <div className="flex flex-col items-center text-center sm:space-y-3">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">
                            <Search className="w-4 h-4" />
                            <span>Search Results</span>
                        </div>
                        {query && <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                            &ldquo;{query}&rdquo;
                        </h1>}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:w-80 lg:shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar
                                categories={categories}
                                activeCategory={null}
                                onCategoryChange={(slug) => navigate(`/category/${slug}`)}
                                brands={brands}
                                selectedBrands={selectedBrands}
                                onBrandToggle={handleBrandToggle}
                                priceRange={priceRange}
                                onPriceChange={handlePriceChange}
                                onClearAll={handleClearAll}
                                isOpen={true}
                                isMobile={false}
                            />
                        </div>
                    </aside>

                    <main className="flex-grow">
                        <div className="flex flex-col mb-12 pt-2 sticky top-16 z-40 bg-white">
                            <div className="flex items-center justify-between pb-2 sm:pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        className={`flex items-center cursor-pointer gap-2 text-[10px] font-black uppercase tracking-widest transition-all lg:hidden ${isSidebarOpen ? 'text-indigo-600' : 'hover:text-gray-500'}`}
                                    >
                                        <Filter className={`w-4 h-4 ${isSidebarOpen ? 'fill-indigo-50' : ''}`} />
                                        {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                                    </button>
                                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Results for: <span className="text-gray-900">{query}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-6">
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                                            Sort By: {sort.replace('-', ' ')} <ChevronDown className="w-3 h-3" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                                            {['newest', 'low to high', 'high to low', 'popular'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSortChange(s)}
                                                    className="w-full text-left cursor-pointer px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                                                >
                                                    {s.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Filters */}
                            <div className="lg:hidden">
                                <FilterSidebar
                                    categories={categories}
                                    activeCategory={null}
                                    onCategoryChange={(slug) => navigate(`/category/${slug}`)}
                                    brands={brands}
                                    selectedBrands={selectedBrands}
                                    onBrandToggle={handleBrandToggle}
                                    priceRange={priceRange}
                                    onPriceChange={handlePriceChange}
                                    onClearAll={handleClearAll}
                                    isOpen={isSidebarOpen}
                                    onClose={() => setIsSidebarOpen(false)}
                                    isMobile={true}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse space-y-6">
                                        <div className="aspect-square bg-gray-50 rounded-2xl" />
                                        <div className="space-y-3">
                                            <div className="h-2 w-1/4 bg-gray-50" />
                                            <div className="h-3 w-3/4 bg-gray-50" />
                                            <div className="h-4 w-1/2 bg-gray-50" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
                                <div className="w-16 h-[1px] bg-gray-200" />
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                                    No items found matching your search
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
