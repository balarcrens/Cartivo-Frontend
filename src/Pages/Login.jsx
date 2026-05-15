/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AuthContext from "../Context/Auth/authContext";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeClosed } from "lucide-react";
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
    const navigate = useNavigate();
    const { login, clearSignupData } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, formData);

            if (res.data.token) {
                login(res.data.data.user, res.data.token);
                clearSignupData();
                navigate("/");
                toast.success('Login Successfully');
            }
        } catch (err) {
            toast.error("Login Failed");
            setError(err.response?.data?.error || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen bg-[#fafafa] items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2rem] overflow-hidden border border-gray-100"
            >
                <div className="hidden md:block relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 to-purple-700/80 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                        alt="Shopping" loading='lazy'
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                        <div>
                            <h2 className="text-4xl font-outfit font-bold leading-tight">
                                Curating the <br />
                                <span className="text-indigo-200">Best Collection</span> <br />
                                for You.
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-lg text-indigo-100 font-light">
                                "Fashion is part of the daily air and it changes all the time, with all the events."
                            </p>
                            <div className="w-12 h-1 bg-white/30 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-3">Welcome Back</h1>
                        <p className="text-gray-500 font-light">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link to="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={isShowPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    onInput={() => { setIsShowIcon(true) }}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
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

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100 font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient cursor-pointer text-white py-4.5 rounded-2xl font-bold flex justify-center items-center gap-2 group shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="tracking-wide">Sign In to Account</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 text-sm font-light">
                            Don’t have an account?{" "}
                            <Link to="/auth/signup" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </section>
    );
}