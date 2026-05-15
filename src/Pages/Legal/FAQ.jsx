import React, { useState } from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            category: "Orders & Payments",
            questions: [
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, Net Banking, and popular digital wallets. For select locations, we also offer Cash on Delivery."
                },
                {
                    q: "Can I cancel my order after it's placed?",
                    a: "Orders can be cancelled within 1 hour of placement. After this window, the order enters our luxury curation process and cannot be cancelled. However, you can initiate a return after delivery."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Absolutely. We use industry-standard SSL encryption and partner with certified payment gateways like Razorpay to ensure your financial data is never stored on our servers."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "How long will it take to receive my order?",
                    a: "Metropolitan orders usually arrive within 1-2 business days. For the rest of India, expect 3-5 business days. International shipping takes 5-8 business days."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Yes, we ship to over 50 countries. Shipping costs and customs duties vary by destination and will be calculated at checkout."
                },
                {
                    q: "How can I track my shipment?",
                    a: "Once dispatched, you'll receive a tracking link via email and SMS. You can also monitor your order status in real-time through your Account Dashboard."
                }
            ]
        },
        {
            category: "Returns & Authenticity",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We offer a 7-day return policy for wrong products, manufacturing defects, or technical issues. Items must be returned in their original luxury packaging with all tags intact."
                },
                {
                    q: "Are the products authentic?",
                    a: "Authenticity is our foundation. Every item on Cartivo is sourced directly FROM public.brands or authorized distributors and is verified by our experts."
                },
                {
                    q: "Does my product come with a warranty?",
                    a: "Most electronic and luxury functional goods come with a brand warranty. Please check the Warranty Policy page for specific details regarding your acquisition."
                }
            ]
        }
    ];

    const toggleFAQ = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <LegalLayout title="Frequently Asked Questions" lastUpdated="May 15, 2026">
            <div className="relative mb-12">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for questions..."
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-amber-400 transition-all font-inter text-gray-900"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-12">
                {faqData.map((section, sIdx) => (
                    <div key={sIdx}>
                        <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-gray-200"></span>
                            {section.category}
                        </h2>
                        <div className="space-y-4">
                            {section.questions.filter(item => 
                                item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.a.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((item, qIdx) => {
                                const uniqueIdx = `${sIdx}-${qIdx}`;
                                const isOpen = openIndex === uniqueIdx;
                                return (
                                    <div 
                                        key={qIdx} 
                                        className={`border transition-all duration-300 rounded-2xl overflow-hidden ${isOpen ? 'border-amber-200 bg-amber-50/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                    >
                                        <button 
                                            onClick={() => toggleFAQ(uniqueIdx)}
                                            className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                                        >
                                            <span className="text-sm font-bold text-gray-900 pr-8">{item.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div 
                                            className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed font-inter">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 bg-gray-900 rounded-3xl text-center">
                <HelpCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">Still have questions?</h3>
                <p className="text-gray-400 mb-6 font-inter">Our concierge team is available 24/7 to assist with your inquiries.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-8 py-3 cursor-pointer bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all">Chat with us</button>
                    <button className="px-8 py-3 cursor-pointer border border-gray-700 text-white rounded-full font-bold hover:bg-gray-800 transition-all">Email Concierge</button>
                </div>
            </div>
        </LegalLayout>
    );
}
