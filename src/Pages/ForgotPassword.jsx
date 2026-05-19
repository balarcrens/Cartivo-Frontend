/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const res = await axios.post(
                `${BASE_URL}/api/v1/auth/forgot-password`,
                data
            );

            if (res.data.status === 'success') {
                setSubmitted(true);
                toast.success('Reset link sent to your email');
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to send reset link"
            );
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
                className="w-full max-w-md bg-white rounded-[2rem] overflow-hidden border border-gray-100 p-3 md:p-6 shadow-indigo-50/50"
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-3">Forgot Password?</h1>
                    <p className="text-gray-500 font-light px-4">
                        {submitted
                            ? "We've sent a password reset link to your email. Please check your inbox."
                            : "No worries! Enter your email and we'll send you a link to reset your password."}
                    </p>
                </div>

                {!submitted ? (
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email"
                                        }
                                    })}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            {errors.email && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-600 px-2 text-sm rounded-sm font-medium"
                                >
                                    {errors.email.message}
                                </motion.div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient cursor-pointer text-white py-4.5 rounded-2xl font-bold flex justify-center items-center gap-2 group shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="tracking-wide">Send Reset Link</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setSubmitted(false)}
                        className="w-full cursor-pointer py-4.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex justify-center items-center gap-2"
                    >
                        Resend Email
                    </button>
                )}

                <div className="mt-10 text-center">
                    <Link to="/auth/signin" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
