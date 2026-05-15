import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';
import { Truck, Globe, ShieldCheck, Clock, MapPin, PackageCheck } from 'lucide-react';

export default function ShippingPolicy() {
    const shippingFeatures = [
        {
            icon: <Truck className="w-6 h-6 text-amber-600" />,
            title: "Premium Delivery",
            description: "Complementary express shipping on all luxury acquisitions."
        },
        {
            icon: <Globe className="w-6 h-6 text-amber-600" />,
            title: "Global Reach",
            description: "Seamless delivery to over 50 countries worldwide."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
            title: "Insured Transit",
            description: "Every shipment is fully insured until it reaches your doorstep."
        }
    ];

    return (
        <LegalLayout title="Shipping & Delivery Policy" lastUpdated="May 15, 2026">
            <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {shippingFeatures.map((feature, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors group">
                            <div className="mb-4 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">{feature.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    1. Delivery Timelines
                </h2>
                <p className="mb-4">
                    We understand the anticipation of receiving your luxury items. Our logistics partners prioritize speed and safety to ensure your order arrives in pristine condition.
                </p>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Region</th>
                                <th className="py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Processing Time</th>
                                <th className="py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Transit Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-gray-50">
                                <td className="py-4 font-bold text-gray-900">Metropolitan Cities</td>
                                <td className="py-4 text-gray-500 uppercase tracking-tighter">24 Hours</td>
                                <td className="py-4 text-gray-900 font-medium">1 - 2 Business Days</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 font-bold text-gray-900">Rest of India</td>
                                <td className="py-4 text-gray-500 uppercase tracking-tighter">24 Hours</td>
                                <td className="py-4 text-gray-900 font-medium">3 - 5 Business Days</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 font-bold text-gray-900">International</td>
                                <td className="py-4 text-gray-500 uppercase tracking-tighter">48 Hours</td>
                                <td className="py-4 text-gray-900 font-medium">5 - 8 Business Days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    2. Tracking Your Order
                </h2>
                <p className="mb-4">
                    Transparency is key to a luxury experience. Once your order is dispatched, you will receive:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                    <li>An email confirmation with a high-priority tracking link.</li>
                    <li>SMS updates at every major transit milestone.</li>
                    <li>Real-time tracking through your Cartivo account dashboard.</li>
                </ul>
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-xs text-indigo-700 leading-relaxed uppercase tracking-widest font-bold">
                        Note: For high-value acquisitions, a secure PIN will be sent to your registered mobile number, which must be shared with the delivery partner to finalize the hand-over.
                    </p>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <PackageCheck className="w-6 h-6 text-indigo-600" />
                    3. Packaging & Presentation
                </h2>
                <p className="mb-4">
                    Your items are not just shipped; they are curated. Every order arrives in our signature eco-conscious luxury packaging, designed to protect the item and provide a memorable unboxing experience.
                </p>
                <p className="text-sm text-gray-500 italic">
                    * Discrete outer packaging is used for all shipments to ensure security and privacy during transit.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Custom Duties & Taxes</h2>
                <p className="mb-4">
                    For domestic orders within India, all prices are inclusive of GST.
                </p>
                <p>
                    For international orders, custom duties and local taxes may be applicable depending on your country's regulations. These charges are the responsibility of the recipient and will be collected by the shipping carrier at the time of delivery.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Shipping Restrictions</h2>
                <p className="mb-4">
                    We currently do not ship to P.O. Boxes or APO/FPO addresses to ensure secure, hand-to-hand delivery for all luxury goods.
                </p>
                <p>
                    Certain items (e.g., fragrances, batteries) may have restricted shipping methods due to international safety regulations. We will inform you during checkout if any such restrictions apply to your order.
                </p>
            </section>
        </LegalLayout>
    );
}
