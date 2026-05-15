/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../Context/Auth/authContext";
import { MapPin, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function AddressForm() {
    const navigate = useNavigate();
    const { signupData, clearSignupData, login } = useContext(AuthContext);
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!signupData) {
            navigate("/auth/signup");
        }
    }, [signupData, navigate]);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = { ...signupData, address };
            const res = await axios.post(`${BASE_URL}/api/v1/auth/signup`, payload);
            if (res.data.success || res.data.token) {
                await login(res.data.data.user, res.data.token);
                navigate('/');
                clearSignupData();
                toast.success('Registered Successfully');
            }
        } catch (error) {
    console.error(error);
            toast.error("Registration failed");
            setError(error.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen bg-[#fafafa] items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2rem] overflow-hidden border border-gray-100"
            >
                <div className="hidden md:block relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-800/80 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80"
                        alt="Logistics" loading='lazy'
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                        <div>
                            <h2 className="text-4xl font-outfit font-bold leading-tight">
                                Almost there! <br />
                                <span className="text-blue-200">Where should we</span> <br />
                                deliver your style?
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-lg text-blue-100 font-light">
                                "Logistics is the ball and chain of armored warfare."
                            </p>
                            <div className="w-12 h-1 bg-white/30 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-8">
                        <Link
                            to="/auth/signup"
                            className="flex items-center gap-2 text-indigo-600 text-sm font-bold mb-8 hover:-translate-x-1 transition-transform w-fit group"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Profile
                        </Link>
                        <div className="flex gap-2 mb-6">
                            <div className="h-1.5 w-16 bg-indigo-100 rounded-full" />
                            <div className="h-1.5 w-16 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]" />
                        </div>
                        <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-2">Delivery Address</h1>
                        <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">2</span>
                            Shipping Details
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Street Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="street"
                                        placeholder="123 ABC Street"
                                        value={address.street}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">City</label>
                                <input
                                    name="city"
                                    placeholder="City"
                                    value={address.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
                                <input
                                    name="state"
                                    placeholder="State"
                                    value={address.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Country</label>
                                <input
                                    name="country"
                                    placeholder="Country"
                                    value={address.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Postal Code</label>
                                <input
                                    name="postalCode"
                                    placeholder="395006"
                                    value={address.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-medium px-1 italic">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer btn-gradient text-white py-4.5 rounded-2xl font-bold flex justify-center items-center gap-2 group mt-6 shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Complete Account Setup
                                    <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                                </>
                            )}
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