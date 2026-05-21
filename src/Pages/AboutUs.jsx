import React from 'react';
import { Users, Target, ShieldCheck, Zap, Award, Heart } from 'lucide-react';
import SEO from '../Components/Common/SEO';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="About Us | Cartivo"
                description="Learn about Cartivo's story, core values, and mission to redefine the luxury e-commerce experience."
                keywords="about us, cartivo story, company mission, brand values, luxury shopping"
            />
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/about_us.jpg"
                    alt="Cartivo Headquarters" loading='lazy'
                    className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-outfit tracking-tight animate-in">
                        We Are <span className="text-indigo-400">Cartivo</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto font-inter leading-relaxed animate-in animation-delay-300">
                        Redefining the luxury shopping experience through innovation, quality, and an unwavering commitment to our customers.
                    </p>
                </div>
            </div>

            <div className="py-18 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold mb-4">Our Story</h2>
                            <h3 className="text-4xl font-extrabold text-gray-900 mb-6 font-outfit">Crafting Excellence Since 2018</h3>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                What started as a small boutique vision in a home office has grown into a global destination for premium products. Cartivo was founded on a simple principle: luxury should be accessible, and quality should never be compromised.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Today, we serve thousands of customers worldwide, curated by a team of dedicated experts who believe that every purchase should be an experience worth remembering.
                            </p>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-8 rounded-xl flex flex-col justify-center items-center text-center border border-gray-200">
                                <span className="text-4xl font-black text-gray-900 mb-2 font-outfit">500k+</span>
                                <span className="text-gray-500 font-medium">Happy Customers</span>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl translate-y-6 flex flex-col justify-center items-center text-center border border-gray-200">
                                <span className="text-4xl font-black text-indigo-600 mb-2 font-outfit">150+</span>
                                <span className="text-gray-500 font-medium">Luxury Brands</span>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl flex flex-col justify-center items-center text-center border border-gray-200">
                                <span className="text-4xl font-black text-purple-600 mb-2 font-outfit">24/7</span>
                                <span className="text-gray-500 font-medium">Customer Support</span>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl translate-y-6 flex flex-col justify-center items-center text-center border border-gray-200">
                                <span className="text-4xl font-black text-gray-900 mb-2 font-outfit">12+</span>
                                <span className="text-gray-500 font-medium">Global Awards</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-18 bg-gray-50">
                <div className="mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold mb-4">Our Core Values</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 font-outfit">What Drives Us Forward</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Uncompromising Quality",
                                desc: "Every product in our collection undergoes rigorous quality checks to ensure it meets our elite standards.",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                icon: Target,
                                title: "Customer Centricity",
                                desc: "Your satisfaction is our north star. We tailor every aspect of our service to provide a seamless experience.",
                                color: "bg-indigo-50 text-indigo-600"
                            },
                            {
                                icon: Zap,
                                title: "Innovation",
                                desc: "We constantly evolve, leveraging technology to make luxury shopping faster, safer, and more enjoyable.",
                                color: "bg-purple-50 text-purple-600"
                            },
                            {
                                icon: Award,
                                title: "Integrity",
                                desc: "Transparency and honesty are at the heart of everything we do, from pricing to our return policies.",
                                color: "bg-orange-50 text-orange-600"
                            },
                            {
                                icon: Heart,
                                title: "Community",
                                desc: "We believe in giving back. A portion of every sale goes towards supporting global sustainability initiatives.",
                                color: "bg-pink-50 text-pink-600"
                            },
                            {
                                icon: Users,
                                title: "Diversity",
                                desc: "Our team is as diverse as our collection, bringing together unique perspectives to serve a global audience.",
                                color: "bg-green-50 text-green-600"
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white relative p-6 sm:p-8 rounded-xl classic-shadow group transition-all duration-300 group border border-gray-100 overflow-hidden">
                                <div className="absolute inset-0 w-0 bg-[#09AFF4] rounded-r-lg transition-all duration-[1400ms] ease-in-out group-hover:w-full z-0" />

                                <div className='relative z-10 m-0 transition-all'>
                                    <div className={`w-14 h-14 bg-gray-50 ${value.color.split(' ')[1]} rounded-lg flex items-center justify-center mb-4 transition-transform`}>
                                        <value.icon className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-bold group-hover:text-black mb-4 font-outfit">{value.title}</h4>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-black font-inter">
                                        {value.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-18 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-900 rounded-2xl p-12 md:p-20 relative">
                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <h2 className="text-white text-4xl md:text-5xl font-bold mb-8 font-outfit leading-tight">
                                Our Mission is to Empower Every Style and Choice.
                            </h2>
                            <p className="text-gray-400 text-xl font-inter leading-relaxed mb-10">
                                We aim to be the world's most trusted platform for luxury goods, where quality meets convenience and every customer feels like a VIP.
                            </p>
                            <button className="bg-white cursor-pointer text-gray-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
                                Join Our Journey
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
