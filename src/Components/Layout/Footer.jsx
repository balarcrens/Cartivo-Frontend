import React from 'react';
import {
    Store, Truck, CreditCard, Headphones,
    ChevronDown
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom';

export default function Footer() {
    const footerLinks = [
        {
            title: "About",
            links: [
                { name: "About Us", path: "/about-us" },
                { name: "News", path: "#" },
                { name: "Investors", path: "#" },
                { name: "Careers", path: "#" },
                { name: "Policies", path: "/privacy-policy" },
            ]
        },
        {
            title: "Order & Purchases",
            links: [
                { name: "Check order Status", path: "/orders" },
                { name: "Shipping, Delivery & Pickup", path: "/warranty-policy" },
                { name: "Returns & Exchanges", path: "/return-policy" },
                { name: "Price Match Guarantee", path: "#" },
                { name: "Gift Cards", path: "#" }
            ]
        },
        {
            title: "Popular Categories",
            links: [
                { name: "Electronics", path: "/category/electronics" },
                { name: "Fashion", path: "/category/fashion" },
                { name: "Health & Beauty", path: "/category/health-beauty" },
                { name: "Home & Garden", path: "/category/home-garden" },
                { name: "Sports", path: "/category/sports" }
            ]
        },
        {
            title: "Support & Services",
            links: [
                { name: "Contact Us", path: "/contact-us" },
                { name: "FAQs", path: "/faq" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "Shipping Policy", path: "/shipping-policy" },
                { name: "Money Back Guarantee", path: "/return-policy" }
            ]
        }
    ];

    const paymentMethods = [
        { name: 'VISA', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg' },
        { name: 'Mastercard', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png' },
        { name: 'UPI', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/3840px-UPI-Logo-vector.svg.png' },
        { name: 'Google Pay', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1280px-Google_Pay_Logo.svg.png' },
        { name: 'Paytm', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Paytm_Logo.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original' },
    ];

    return (
        <footer className="bg-gray-50 pt-12 pb-6 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {[
                        {
                            icon: Store,
                            title: "Free in-store pick up",
                            desc: "24/7 Amazing services",
                            color: "text-indigo-600 bg-indigo-50"
                        },
                        {
                            icon: Truck,
                            title: "Free Shipping",
                            desc: "24/7 Amazing services",
                            color: "text-green-600 bg-green-50"
                        },
                        {
                            icon: CreditCard,
                            title: "Flexible Payment",
                            desc: "24/7 Amazing services",
                            color: "text-orange-600 bg-orange-50"
                        },
                        {
                            icon: Headphones,
                            title: "Convenient help",
                            desc: "24/7 Amazing services",
                            color: "text-pink-600 bg-pink-50"
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className={`p-3 rounded-xl ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {footerLinks.map((col, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-gray-900 mb-6 text-sm">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link to={link.path} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 border-t border-gray-200 mb-8">
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-sm">Region Country</h4>
                        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <img src="https://flagcdn.com/w20/in.png" loading='lazy' alt="India Flag" className="w-5 h-auto rounded-sm" />
                            <span className="text-sm font-medium text-gray-700">India</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="font-bold text-gray-900 mb-4 text-sm">
                            Download Our App
                        </h4>

                        <div className="flex gap-4">
                            {/* App Store */}
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="Download on the App Store"
                                    className="h-10 w-auto" loading='lazy'
                                />
                            </a>

                            {/* Google Play */}
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Get it on Google Play"
                                    className="h-10 w-auto" loading='lazy'
                                />
                            </a>
                        </div>
                    </div>

                    <div className="lg:text-right">
                        <h4 className="font-bold text-gray-900 mb-4 text-sm">Stay Connected</h4>

                        <div className="flex lg:justify-end gap-3">
                            {[
                                {
                                    icon: FaFacebook,
                                    hover: "hover:bg-[#1877F2] hover:text-white"
                                },
                                {
                                    icon: FaTwitter,
                                    hover: "hover:bg-[#1DA1F2] hover:text-white"
                                },
                                {
                                    icon: FaInstagram,
                                    hover: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white"
                                },
                                {
                                    icon: FaLinkedin,
                                    hover: "hover:bg-[#0A66C2] hover:text-white"
                                }
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 transform hover:-translate-y-0.5 ${item.hover}`}
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-8 border-t border-gray-100 justify-center">
                    {paymentMethods.map((method, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg px-4 py-2 transition"
                        >
                            <img
                                src={method.img}
                                alt={method.name}
                                className="h-6 w-auto object-contain"
                                loading='lazy'
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© Cartivo All Rights Reserved</p>
                    <div className="flex gap-1 flex-wrap divide-x divide-gray-400">
                        <Link to="/privacy-policy" className="px-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-use" className="px-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            Terms of Use
                        </Link>
                        <Link to="/warranty-policy" className="px-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            Warranty Policy
                        </Link>
                        <Link to="/return-policy" className="px-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            Return Policy
                        </Link>
                        <Link to="/cookie-policy" className="px-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
