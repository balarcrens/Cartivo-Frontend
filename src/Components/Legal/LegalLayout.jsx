import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../Common/SEO';

export default function LegalLayout({ title, lastUpdated, children }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title={`${title} | Cartivo`}
                description={`Official Cartivo ${title}. Last updated: ${lastUpdated}. Review our terms and policies.`}
                keywords={`${title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')}, cartivo policy, legal documents, ecommerce terms, cartivo`}
            />
            <div className="relative overflow-hidden bg-gray-50 py-20 border-b border-gray-100">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-outfit tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-inter">
                        <span className="w-8 h-[1px] bg-gray-300"></span>
                        <span>Last Updated: {lastUpdated}</span>
                        <span className="w-8 h-[1px] bg-gray-300"></span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-12 classic-shadow premium-border animate-in">
                    <div className="prose prose-indigo max-w-none prose-headings:font-outfit prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
                        {children}
                    </div>
                </div>

                <div className="mt-12 text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-white/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">Have questions about our policies?</h3>
                    <p className="text-gray-600 mb-6 font-inter">Our support team is here to help you understand our terms and how we protect your data.</p>
                    <button onClick={() => navigate('/contact-us')} className="px-8 py-3 cursor-pointer bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}
