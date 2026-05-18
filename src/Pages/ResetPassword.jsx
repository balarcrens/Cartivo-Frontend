/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, Eye, EyeClosed } from "lucide-react";
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);

        try {
            const res = await axios.patch(`${BASE_URL}/api/v1/auth/reset-password/${token}`, {
                password: formData.password
            });

            if (res.data.status === 'success') {
                toast.success('Password reset successfully');
                setSuccess(true);
                setTimeout(() => {
                    navigate("/auth/signin");
                }, 3000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className="flex min-h-screen bg-[#fafafa] items-center justify-center p-4 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-white rounded-[2rem] p-12 text-center shadow-xl shadow-indigo-50/50"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-4">Password Changed!</h1>
                    <p className="text-gray-500 mb-8 font-light">Your password has been reset successfully. You are being redirected to the login page.</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                            className="h-full bg-green-500"
                        />
                    </div>
                </motion.div>
            </section>
        );
    }

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
                    <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-3">Set New Password</h1>
                    <p className="text-gray-500 font-light">Please create a new password that you don't use on other services.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type={isShowPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                {!isShowPassword ? (
                                    <EyeClosed className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" size={20} onClick={() => setIsShowPassword(true)} />
                                ) : (
                                    <Eye size={20} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => setIsShowPassword(false)} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type={isShowConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                {!isShowConfirmPassword ? (
                                    <EyeClosed className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" size={20} onClick={() => setIsShowConfirmPassword(true)} />
                                ) : (
                                    <Eye size={20} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => setIsShowConfirmPassword(false)} />
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-gradient cursor-pointer text-white py-4.5 rounded-2xl font-bold flex justify-center items-center gap-2 group shadow-lg shadow-indigo-100 active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="tracking-wide">Reset Password</span>
                        )}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}
