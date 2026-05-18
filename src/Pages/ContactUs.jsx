import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/contacts`, formData);
            if (res.data.status === 'success') {
                toast.success('Thank you for contacting us! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
    console.error(error);
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-outfit">
                        Let's <span className="text-indigo-600">Connect</span>
                    </h1>
                    <p className="text-gray-500 text-xl max-w-2xl mx-auto font-inter">
                        Have a question or just want to say hello? Our team is always here to help you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                info: "support@cartivo.com",
                                sub: "Response within 24 hours",
                                color: "text-indigo-600 bg-indigo-50"
                            },
                            {
                                icon: Phone,
                                title: "Call Us",
                                info: "+1 (555) 123-4567",
                                sub: "Mon-Fri, 9am - 6pm EST",
                                color: "text-purple-600 bg-purple-50"
                            },
                            {
                                icon: MapPin,
                                title: "Visit Us",
                                info: "123 Luxury Lane, Suite 456",
                                sub: "E-commerce City, EC 12345",
                                color: "text-pink-600 bg-pink-50"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg flex items-start gap-6 border border-gray-100">
                                <div className={`p-2 rounded-lg bg-gray-50 ${item.color.split(' ')[0]}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 font-outfit">{item.title}</h4>
                                    <p className="text-gray-900 font-semibold mb-1">{item.info}</p>
                                    <p className="text-gray-500 text-sm">{item.sub}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-gray-900 p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                                    <span className="font-bold text-lg font-outfit">Live Support</span>
                                </div>
                                <p className="text-gray-400 mb-6 font-inter text-sm">
                                    Need immediate assistance? Our live agents are available right now to chat.
                                </p>
                                <button className="w-full cursor-pointer bg-white text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm">
                                    Start Chat
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl overflow-hidden sm:border border-gray-100 h-full">
                            <div className="p-6 sm:p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 font-outfit">Send us a Message</h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-lg bg-gray-50 border border-gray-100 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-50 outline-none transition-all font-inter"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="example@gmail.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-lg bg-gray-50 border border-gray-100 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-50 outline-none transition-all font-inter"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-lg bg-gray-50 border border-gray-100 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-50 outline-none transition-all font-inter"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            rows="6"
                                            required
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-lg bg-gray-50 border border-gray-100 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-50 outline-none transition-all font-inter resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center gap-3 w-full md:w-auto shadow-lg shadow-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                Sending...
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="relative h-[400px] rounded-2xl overflow-hidden  border border-gray-100">
                        <img
                            src="/contact.png"
                            alt="Our Location Map" loading='lazy'
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gray-900/5"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white sm:px-6 p-2 sm:py-3 rounded-xl shadow-2xl flex items-center sm:gap-4 gap-2 border border-gray-100">
                            <div className="w-10 h-10 bg-gray-900 p-2 rounded-lg flex items-center justify-center text-white">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 font-outfit">Cartivo</h4>
                                <p className="text-gray-500 text-sm font-inter">Luxury District, Floor 42</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 sm:gap-6">
                        <div className="p-5 bg-gray-50 text-gray-900 rounded-xl">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-outfit">Working Hours</h4>
                            <p className="text-gray-500 font-inter text-sm">Monday - Friday: 09:00 AM - 06:00 PM</p>
                            <p className="text-gray-500 font-inter text-sm">Saturday: 10:00 AM - 02:00 PM</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 sm:gap-6">
                        <div className="p-5 bg-gray-50 text-gray-900 rounded-xl">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-outfit">Help Center</h4>
                            <p className="text-gray-500 font-inter text-sm">Browse our extensive FAQ database for quick answers to common questions.</p>
                            <a href="#" className="text-indigo-600 font-bold hover:underline mt-2 inline-block text-sm">Visit FAQ Center</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
