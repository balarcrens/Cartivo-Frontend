import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';
import { RotateCcw, AlertTriangle, ShieldCheck, Clock, Truck, CreditCard } from 'lucide-react';

export default function ReturnPolicy() {
    const policyFeatures = [
        {
            icon: <Clock className="w-6 h-6 text-amber-600" />,
            title: "7-Day Window",
            description: "Request a return within 7 days of delivery for eligible issues."
        },
        {
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            title: "Eligible Issues",
            description: "Wrong products, manufacturing faults, or technical malfunctions."
        },
        {
            icon: <RotateCcw className="w-6 h-6 text-amber-600" />,
            title: "Easy Process",
            description: "Simple online request followed by a quick verification."
        }
    ];

    return (
        <LegalLayout title="Return & Refund Policy" lastUpdated="May 15, 2026">
            <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {policyFeatures.map((feature, index) => (
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
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    1. Our Return Commitment
                </h2>
                <p className="mb-4">
                    At Cartivo Luxury, we stand behind the exceptional quality of our curated collections. We understand that occasionally, an item may not meet your expectations due to specific issues. We offer a <strong>7-day return policy</strong> for products that meet the criteria outlined below.
                </p>
                <p>
                    Please note that due to the exclusive nature of our luxury goods, returns are only accepted for specific valid reasons to maintain the integrity of our inventory.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Eligibility for Returns</h2>
                <p className="mb-6 italic text-amber-600 font-medium">
                    Returns must be initiated within 7 days of the delivery date.
                </p>
                <p className="mb-4">You are eligible for a return if the product you received:</p>
                <ul className="list-disc pl-6 space-y-4 mb-6">
                    <li>
                        <strong>Wrong Product:</strong> The item delivered does not match the product described in your order confirmation.
                    </li>
                    <li>
                        <strong>Manufacturing Fault:</strong> The item has a clear defect or flaw that occurred during the production process.
                    </li>
                    <li>
                        <strong>Technical Issue:</strong> For electronic or functional goods, the item does not operate according to its technical specifications.
                    </li>
                </ul>
                <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                    <h4 className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-2">Important Condition:</h4>
                    <p className="text-xs text-rose-700 leading-relaxed uppercase tracking-wider">
                        Items must be returned in their original condition, unused, with all luxury packaging, authenticity cards, dust bags, and security tags intact. Any sign of wear or tampering will void the return eligibility.
                    </p>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-indigo-600" />
                    3. Return Process
                </h2>
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                        <strong>Initiate Request:</strong> Contact our concierge team via the Contact Us page or email support@cartivo.com with your order number and clear photographs of the issue.
                    </li>
                    <li>
                        <strong>Verification:</strong> Our quality assurance team will review your request within 24-48 hours.
                    </li>
                    <li>
                        <strong>Pick-up:</strong> Once approved, we will arrange a complimentary secure pick-up from your delivery address.
                    </li>
                    <li>
                        <strong>Inspection:</strong> Upon receiving the item at our warehouse, it will undergo a final inspection to confirm the reported issue and the condition of the product.
                    </li>
                </ol>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    4. Refunds & Store Credit
                </h2>
                <p className="mb-4">
                    Once your return is inspected and approved, we will process your refund. You can choose between:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                    <li><strong>Original Payment Method:</strong> Refund will be credited back to your original source of payment within 7-10 business days.</li>
                    <li><strong>Store Credit:</strong> Immediate credit to your Cartivo account for future luxury acquisitions.</li>
                </ul>
                <p className="text-sm text-gray-500">
                    * Please note that shipping charges (if any) and small processing fees from payment gateways may be non-refundable.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Non-Returnable Items</h2>
                <p className="mb-4">For hygiene and security reasons, the following items cannot be returned:</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        "Personalized/Custom Items",
                        "Innerwear & Swimwear",
                        "Beauty & Skincare Products",
                        "Items with broken security seals",
                        "Gift Cards",
                        "Final Sale Items"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            {item}
                        </div>
                    ))}
                </div>
            </section>
        </LegalLayout>
    );
}
