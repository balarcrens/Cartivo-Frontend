import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';
import { Cookie, ShieldCheck, Settings, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
    return (
        <LegalLayout title="Cookie Policy" lastUpdated="May 15, 2026">
            <section className="mb-10">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-4 sm:p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8">
                    <Cookie className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                    <p className="text-sm text-indigo-900 leading-relaxed">
                        Cartivo Luxury uses cookies to enhance your shopping experience, analyze site traffic, and personalize our digital boutique to your preferences.
                    </p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What are Cookies?</h2>
                <p className="mb-4">
                    Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember information about your visit, such as your preferred language and cart items.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Info className="w-6 h-6 text-indigo-600" />
                    2. Types of Cookies We Use
                </h2>
                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Essential Cookies</h3>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                            Necessary for the website to function. They enable basic features like page navigation, secure areas, and shopping cart persistence. The website cannot function properly without these cookies.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Performance & Analytics</h3>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                            Help us understand how visitors interact with our boutique by collecting and reporting information anonymously. This data allows us to improve the layout and speed of our services.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Personalization Cookies</h3>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                            Allow us to remember choices you make (such as your username or region) and provide enhanced, more personal features and tailored product recommendations.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    3. Managing Your Preferences
                </h2>
                <p className="mb-4">
                    Most web browsers allow you to control cookies through their settings. You can set your browser to block all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our boutique.
                </p>
                <div className="mt-6 p-4 border-l-4 border-amber-400 bg-amber-50">
                    <p className="text-sm text-amber-900 font-medium">
                        To learn more about how to manage and delete cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline">allaboutcookies.org</a>.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    4. Privacy & Data Security
                </h2>
                <p>
                    Cookie data is treated with the same level of security as any other personal data on Cartivo. For more information on how we protect your information, please read our <Link to="/privacy-policy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
                </p>
            </section>
        </LegalLayout>
    );
}
