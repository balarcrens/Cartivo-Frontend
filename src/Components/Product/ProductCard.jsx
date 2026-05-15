import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import WishlistContext from '../../Context/Wishlist/WishlistContext';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const isWishlisted = isInWishlist(product.id);

    return (
        <div className="group/card cursor-pointer flex flex-col h-full bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100">
            <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
                <Link to={`/product/${product.slug}`}>
                    <img
                        src={product.images?.[0] || product.image || `https://placehold.co/500x670?text=${product.title}`}
                        alt={product.name || product.title}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-110"
                    />
                </Link>

                {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest z-10">
                        Sale
                    </div>
                )}

                {(product.stock <= 0 || product.status === 'out_of_stock') && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                        <div className="bg-rose-500 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transform -rotate-12 border-2 border-white">
                            Out of Stock
                        </div>
                    </div>
                )}

                <div className="absolute top-3 right-3 translate-x-4 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-500 z-10 flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        className={`p-2.5 rounded-full cursor-pointer transition-all shadow-md active:scale-90 ${isWishlisted
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'bg-white text-gray-900 hover:text-rose-500'
                            }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-500 pointer-events-none" />
            </div>

            <Link to={`/product/${product.slug}`} className="flex flex-col flex-grow pt-5 pb-3 px-2">
                <div className="mb-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] block mb-1">
                        {product.category_name || "New Collection"}
                    </span>
                    <h3 className="text-[11px] sm:text-sm font-semibold text-gray-900 line-clamp-2 uppercase group-hover/card:text-gray-500 transition-colors">
                        {product.name || product.title}
                    </h3>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">₹{product.price}</span>
                        {product.discount > 0 && (
                            <span className="text-[11px] text-gray-400 line-through font-medium">₹{Number(product.price.replace(/,/g, '')) + 500}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-sm">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {/* <span className="text-gray-900 text-[10px] font-bold">{averageRating}</span> */}
                        <span className="text-gray-900 text-[10px] font-bold">0</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};


export default ProductCard;
