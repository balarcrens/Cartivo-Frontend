/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import CartContext from '../../Context/Cart/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, cartSubtotal, removeFromCart, clearCart, updateQuantity, loading } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[600] shadow-2xl flex flex-col"
                    >
                        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-13">
                                    <img src="/shopping_bag.jpg" alt="" loading='lazy' />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Shopping Bag</h2>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 cursor-pointer rounded-full transition-colors text-gray-400 hover:text-red-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-hidden">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex sm:flex-nowrap flex-wrap sm:gap-3 group">
                                        <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.product_images?.[0] || 'https://placehold.co/150'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading='lazy'
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between p-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="text-sm font-bold text-gray-900 text-wrap line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                        {item.product_name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-300 cursor-pointer hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.variant_name && (
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                        {item.variant_name}
                                                    </p>
                                                )}
                                                <p className="hidden sm:block text-sm font-bold text-indigo-600 mt-2">
                                                    ₹{Number(item.price).toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-white cursor-pointer rounded-lg transition-all text-gray-400 hover:text-gray-900"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-white cursor-pointer rounded-lg transition-all text-gray-400 hover:text-gray-900"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-black text-gray-900">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-10 h-10 text-indigo-200" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Your bag is empty</h3>
                                        <p className="text-sm text-gray-400 mt-1 max-w-[200px]">Looks like you haven't added any luxury pieces yet.</p>
                                    </div>
                                    <button
                                        onClick={() => { setIsCartOpen(false); navigate('/'); }}
                                        className="px-8 py-3 cursor-pointer bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-indigo-600 transition-all shadow-lg shadow-gray-100 active:scale-95"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-3 sm:p-6 bg-gray-50/50 border-t border-gray-100 space-y-3">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Subtotal</span>
                                        <span className="text-sm font-bold text-gray-900">₹{Number(cartSubtotal).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Shipping</span>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Estimated Total</span>
                                        <span className="text-xl font-black text-indigo-600">₹{Number(cartSubtotal).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        const existingSession = JSON.parse(localStorage.getItem('checkout_session') || '[]');
                                        
                                        // Merge cart items into session
                                        cartItems.forEach(cartItem => {
                                            const existingIndex = existingSession.findIndex(sessionItem => 
                                                sessionItem.product_id === cartItem.product_id && 
                                                sessionItem.variant_id === cartItem.variant_id
                                            );

                                            if (existingIndex > -1) {
                                                existingSession[existingIndex].quantity += cartItem.quantity;
                                            } else {
                                                existingSession.push(cartItem);
                                            }
                                        });

                                        localStorage.setItem('checkout_session', JSON.stringify(existingSession));
                                        await clearCart();
                                        setIsCartOpen(false);
                                        navigate('/checkout');
                                    }}
                                    className="w-full bg-gray-900 cursor-pointer text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-gray-200 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                    Secure SSL encrypted checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
