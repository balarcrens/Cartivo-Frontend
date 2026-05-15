import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2, ChevronRight } from 'lucide-react';
import WishlistContext from '../Context/Wishlist/WishlistContext';
import CartContext from '../Context/Cart/CartContext';
import ProductCard from '../Components/Product/ProductCard';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, wishlistCount, loading } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center animate-in">
                    <div className="luxury-spinner mb-4"></div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Consulting Your Desires</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900">Wishlist</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-light text-gray-900 uppercase tracking-tight mb-4">
                            My <span className="italic font-serif">Wishlist</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-light tracking-wide max-w-md">
                            A curated selection of your most desired pieces. Ready to become part of your collection.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Items</span>
                            <span className="text-2xl font-bold text-gray-900 tracking-tighter">{wishlistCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="flex flex-col group/wishlist">
                                <ProductCard
                                    product={{
                                        id: item.product_id,
                                        name: item.name,
                                        price: item.price,
                                        images: item.images,
                                        slug: item.slug,
                                        category_name: item.category_name
                                    }}
                                />
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => addToCart(item.product_id, null, 1)}
                                        className="flex-grow cursor-pointer bg-white border border-gray-900 text-gray-900 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <ShoppingBag className="w-3 h-3" /> Move to Bag
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.product_id)}
                                        className="cursor-pointer p-3 border border-rose-100 text-rose-500 bg-rose-50/30 active:scale-95 transition-all"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center animate-in">
                        <div className="relative mb-10">
                            <Heart className="w-20 h-20 text-gray-200 animate-ping stroke-[2.5px]" />
                            <Heart className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-1" />
                        </div>
                        <h2 className="text-2xl font-light uppercase tracking-widest text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-400 text-sm font-light mb-10 max-w-xs mx-auto">
                            Explore our boutique and save your favorite pieces here for later.
                        </p>
                        <Link
                            to="/category/all"
                            className="bg-gray-900 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 group active:scale-95 shadow-xl shadow-gray-100"
                        >
                            Explore Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>

            {wishlistItems.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="bg-[#f9f9f9] p-8 sm:p-12 text-center rounded-sm">
                        <h3 className="text-xl font-light uppercase tracking-widest mb-4">Luxury Concierge</h3>
                        <p className="text-gray-400 text-sm font-light mb-8 max-w-md mx-auto">
                            Need help choosing the perfect piece? Our style consultants are available for a private consultation.
                        </p>
                        <button className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
                            Book an Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;