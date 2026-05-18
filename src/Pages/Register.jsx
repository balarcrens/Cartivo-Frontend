/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../Context/Auth/authContext";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, EyeClosed, Eye } from "lucide-react";

export default function Register() {
    const { signupData, updateSignupData } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (signupData) {
            setFormData({
                name: signupData.name || "",
                email: signupData.email || "",
                phone: signupData.phone || "",
                password: signupData.password || "",
            });
        }
    }, [signupData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSignupData(formData);
        navigate("/auth/signup/address");
    };

    return (
        <section className="flex min-h-screen bg-[#fafafa] items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2rem] overflow-hidden border border-gray-100"
            >
                <div className="hidden md:block relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-indigo-700/80 z-10" />
                    <img
                        src="/register-bg.avif"
                        alt="Fashion" loading='lazy'
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                        <div>
                            <h2 className="text-4xl font-outfit font-bold leading-tight">
                                Join our <br />
                                <span className="text-purple-200">Creative Community</span> <br />
                                of Shoppers.
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-lg text-purple-100 font-light">
                                "Style is a way to say who you are without having to speak."
                            </p>
                            <div className="w-12 h-1 bg-white/30 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex gap-2 mb-6">
                            <div className="h-1.5 w-16 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]" />
                            <div className="h-1.5 w-16 bg-gray-100 rounded-full" />
                        </div>
                        <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</span>
                            Personal Information
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="gmail@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="12345 67890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="password"
                                        type={isShowPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        onInput={() => { setIsShowIcon(true) }}
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />
                                    {isShowIcon && (
                                        <div className="absolute inset-y-0 right-4 flex items-center">
                                            {!isShowPassword ? (
                                                <EyeClosed className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" size={20} onClick={() => { setIsShowPassword(true) }} />
                                            ) : (
                                                <Eye size={20} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => { setIsShowPassword(false) }} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer btn-gradient text-white py-4.5 rounded-2xl font-bold flex justify-center items-center gap-2 group mt-6 shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            Continue to Address
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>

                        <p className="text-center text-gray-500 text-sm font-light mt-6">
                            Already have an account?{" "}
                            <Link to="/auth/signin" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </section>
    );
}
