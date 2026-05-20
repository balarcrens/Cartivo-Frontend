/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../Context/Auth/authContext';
import html2pdf from 'html2pdf.js';
import InvoiceTemplate from '../Components/Invoice/InvoiceTemplate';
import {
    ChevronLeft, Package, Truck, CheckCircle2, Clock,
    MapPin, CreditCard, ShoppingBag, Calendar, AlertCircle, RotateCcw, Camera, X, Upload,
    Clock1
} from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const ReturnFacility = ({ order, token }) => {
    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [returnRequest, setReturnRequest] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchReturnStatus = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/orders/${order.id}/return-status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setReturnRequest(res.data.data.return_request);
                }
            } catch (error) {
                console.error(error);
                console.error("Error fetching return status:", error);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchReturnStatus();
    }, [order.id, token]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason || images.length === 0) {
            return toast.error("Reason and product images are required");
        }

        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/orders/request-return`, {
                order_id: order.id,
                reason,
                images
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                toast.success("Return request submitted successfully");
                setReturnRequest(res.data.data.return_request);
                setShowForm(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit return request");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return null;

    // Check eligibility
    const orderDate = new Date(order.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isEligible = order.status === 'delivered' && diffDays <= 7;

    if (returnRequest) {
        return (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm">
                <div className="flex items-center gap-3 mb-4">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900">Return Requested</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest">
                        <span className="text-amber-600">Status:</span>
                        <span className="font-bold text-amber-900">{returnRequest.status}</span>
                    </div>
                    {returnRequest.status === 'pending' &&
                        <span className="text-green-500 flex gap-2"> <Clock1 /> Please check the status daily for return request update</span>
                    }
                    <p className="text-sm text-amber-700 leading-relaxed italic">
                        " {returnRequest.reason} "
                    </p>
                    {returnRequest.admin_comment && (
                        <div className="mt-4 pt-4 border-t border-amber-200">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900 block mb-1">Support Team:</span>
                            <p className="text-sm text-amber-800">{returnRequest.admin_comment}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!isEligible) return null;

    return (
        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
            {!showForm ? (
                <div className="text-center">
                    <RotateCcw className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">Want to return?</h3>
                    <p className="text-[11px] text-gray-400 mb-6 uppercase tracking-widest">You have {8 - diffDays} days left to return this order.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all cursor-pointer"
                    >
                        Initiate Return
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Return Form</h3>
                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-black">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Reason for Return</label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please explain why you want to return this product..."
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-gray-900 h-32 resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Product Images (Required)</label>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square border border-gray-100 rounded-sm overflow-hidden group">
                                    <img src={img} alt="preview" loading='lazy' className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3 text-rose-500" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 6 && (
                                <label className="aspect-square border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                                    <Camera className="w-5 h-5 text-gray-300" />
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Submitting..." : (
                            <><Upload className="w-4 h-4" /> Submit Request</>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const invoiceRef = useRef(null);

    const handleDownload = async () => {
        try {
            if (!orderData) return;
            setDownloading(true);

            // Small delay to ensure the hidden component is rendered
            await new Promise((resolve) => setTimeout(resolve, 500));

            const element = invoiceRef.current;
            const { order } = orderData;

            const opt = {
                margin: 0,
                filename: `Invoice_${order.id.split('-')[0].toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    allowTaint: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                },
            };

            await html2pdf()
                .set(opt)
                .from(element)
                .save();

        } catch (error) {
            console.error(error);
            toast.error('Failed to download PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === 'success') {
                    setOrderData(res.data.data);
                }
            } catch (error) {
                console.error(error);
                console.error('Error fetching order detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="luxury-spinner"></div>
            </div>
        );
    }

    if (!orderData) return <div>Order not found</div>;

    const { order, items, history } = orderData;
    const address = typeof order?.shipping_address === 'string' ? JSON.parse(order?.shipping_address) : order?.shipping_address;

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: <Clock className="w-5 h-5" />, date: order.created_at },
        { status: 'processing', label: 'Processing', icon: <Package className="w-5 h-5" />, date: history.find(h => h.status === 'processing')?.created_at },
        { status: 'shipped', label: 'In Transit', icon: <Truck className="w-5 h-5" />, date: history.find(h => h.status === 'shipped')?.created_at },
        { status: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="w-5 h-5" />, date: history.find(h => h.status === 'delivered')?.created_at },
    ];

    const currentStatusIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/orders" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors mb-6 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
                    </Link>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900 uppercase tracking-tight mb-2">
                                Order <span className="italic font-serif">#{order.id.split('-')[0].toUpperCase()}</span>
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-light">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}</span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                <span className="uppercase tracking-widest font-medium text-indigo-600">{order.payment_method}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className={`bg-gray-900 cursor-pointer text-white px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {downloading ? 'Generating...' : 'Download Invoice'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        <div className="bg-white border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-900">
                                            Delivery Status
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.status === 'delivered'
                                                ? 'Your package has been delivered successfully.'
                                                : 'Your order is on the way.'}
                                        </p>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${order.status === 'delivered'
                                        ? 'text-green-700 border border-green-200'
                                        : order.status === 'shipped'
                                            ? 'text-blue-700 border border-blue-200'
                                            : 'text-amber-700 border border-amber-200'
                                        }`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-8 sm:px-8">
                                <div className="relative">
                                    <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gray-200" />

                                    <div className="absolute left-[23px] top-0 w-[2px] bg-green-600 transition-all duration-700"
                                        style={{
                                            height: order.status === 'delivered'
                                                ? '100%'
                                                : `${currentStatusIndex <= 0
                                                    ? '0%'
                                                    : `${(currentStatusIndex / (steps.length - 1)) * 100}%`
                                                }`
                                        }}
                                    />

                                    <div className="space-y-10">
                                        {steps.map((step, idx) => {
                                            const isDelivered = order.status === 'delivered';
                                            const isCompleted = isDelivered
                                                ? idx <= currentStatusIndex
                                                : idx < currentStatusIndex;
                                            const isCurrent = !isDelivered && idx === currentStatusIndex;
                                            const isUpcoming = idx > currentStatusIndex;

                                            return (
                                                <div key={idx} className="relative flex items-start gap-5">
                                                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                                                            ${isCompleted
                                                            ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100'
                                                            : isCurrent
                                                                ? 'bg-white border-green-600 text-green-600 ring-4 ring-green-50'
                                                                : 'bg-white border-gray-200 text-gray-300'
                                                        }`}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        ) : (
                                                            step.icon
                                                        )}
                                                    </div>

                                                    <div className="flex-1 pt-1">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <h3 className={`text-sm font-semibold tracking-wide ${isCompleted || isCurrent
                                                                ? 'text-gray-900'
                                                                : 'text-gray-400'
                                                                }`}>
                                                                {step.label}
                                                            </h3>

                                                            {isCurrent && (
                                                                <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                                                                    Current Status
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                                            {step.status === 'pending' &&
                                                                'Your order has been confirmed.'}

                                                            {step.status === 'processing' &&
                                                                'Seller is preparing your package.'}

                                                            {step.status === 'shipped' &&
                                                                'Package has left the warehouse and is in transit.'}

                                                            {step.status === 'delivered' &&
                                                                'Package delivered successfully.'}
                                                        </p>

                                                        {step.date && (
                                                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                                                <Calendar className="w-3.5 h-3.5" />

                                                                {new Date(step.date).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: '2-digit'
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {order.status !== 'delivered' && (
                                <div className="border-t border-gray-100 px-6 py-4 sm:px-8 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-green-600" />

                                        <p className="text-sm text-gray-600">
                                            Estimated delivery by{' '}
                                            <span className="font-semibold text-gray-900">
                                                {new Date(
                                                    new Date(order.created_at).getTime() +
                                                    5 * 24 * 60 * 60 * 1000
                                                ).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long'
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white border border-gray-100 overflow-hidden rounded-sm">
                            <div className="sm:p-8 p-4 border-b border-gray-50">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Order Items ({items?.length})</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {items.map((item, idx) => (
                                    <div key={idx} className="sm:p-8 p-4 flex gap-8">
                                        <div className="w-24 h-32 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.product_image || 'https://placehold.co/100x130?text=Product'}
                                                alt={item.product_name} loading='lazy'
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-sm line-clamp-2 font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                                    <Link to={`/product/${item.slug}`}>{item?.product_name}</Link>
                                                </h3>
                                                <span className="text-sm font-bold text-gray-900">₹{parseFloat(item.price).toLocaleString()}</span>
                                            </div>
                                            <div className="space-y-1 mb-3">
                                                {item.variant_name && (
                                                    <p className="text-[12px] uppercase tracking-widest text-gray-400">{item?.variant_name}</p>
                                                )}
                                                <p className="text-[12px] uppercase tracking-widest text-gray-400">Quantity: {item?.quantity}</p>
                                            </div>
                                            <button onClick={() => navigate(`/product/${item.slug}#reviews`)} className="text-[11px] cursor-pointer font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-600 pb-0.5 hover:text-indigo-800 hover:border-indigo-800 transition-all">
                                                Write a Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        <div className="bg-white border border-gray-100 sm:p-8 p-4 rounded-sm">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" /> Order Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-light text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-medium">₹{parseFloat(order.total_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-light text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-medium">FREE</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-sm font-light text-gray-500">
                                        <span>Discount</span>
                                        <span className="text-rose-500 font-medium">-₹{parseFloat(order.discount_amount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 tracking-tighter">₹{parseFloat(order.final_price).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 sm:p-8 p-4 rounded-sm">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Shipping Details
                            </h2>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-gray-900">{address?.full_name}</p>
                                {address && <p className="text-sm font-light text-gray-500 leading-relaxed">
                                    {address?.address_line1},<br />
                                    {address?.address_line2 && <>{address?.address_line2},<br /></>}
                                    {address?.city}, {address?.state} - {address?.pincode}<br />
                                    {address?.country}
                                </p>}
                                <p className="text-sm font-light text-gray-500 mt-4 flex items-center gap-2">
                                    <span className="font-bold text-xs uppercase tracking-widest text-gray-300">Phone:</span> {address?.phone}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 sm:p-8 p-4 rounded-sm">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment Information
                            </h2>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900 uppercase tracking-widest">{order?.payment_method}</span>
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${order?.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {order?.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        <ReturnFacility order={order} token={token} />

                        <div className="sm:p-8 py-6 p-4 border border-dashed border-gray-200 rounded-sm flex flex-col items-center text-center">
                            <AlertCircle className="w-6 h-6 text-gray-300 mb-4" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">Need Assistance?</h3>
                            <p className="text-[12px] text-gray-400 font-light mb-6">If you have any questions regarding your order, our concierge is here to help.</p>
                            <button onClick={() => navigate('/contact-us')} className="text-[12px] cursor-pointer font-bold uppercase tracking-widest border-b border-gray-900 pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-all">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                <div className="fixed left-[-9999px] top-0">
                    <div ref={invoiceRef}>
                        <InvoiceTemplate order={order} items={items} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;