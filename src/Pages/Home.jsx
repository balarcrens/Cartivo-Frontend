/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import {
    ChevronLeft, ChevronRight,
    ArrowRight, Truck,
    RotateCcw, Headphones, CreditCard, Mail, Layout
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa'
import ProductCard from '../Components/Product/ProductCard';
import HomeSkeleton from '../Components/Common/HomeSkeleton';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState({
        heroBanners: [],
        categories: [],
        featuredArrivals: [],
        winterEssentials: [],
        trendingNow: [],
        groceryBestsellers: [],
        homeAppliancesBestsellers: []
    });

    const fetchHomeData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/home`);
            if (res.data.status === 'success') {
                setHomeData(res.data.data);
            }
        } catch (error) {
    console.error(error);
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    const socialFeed = [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&h=600&fit=crop"
    ];

    if (loading) {
        return <HomeSkeleton />;
    }

    return (
        <main className="bg-white pb-16 overflow-x-hidden font-outfit">
            <div className="mx-auto max-w-7xl px-4 lg:px-12 py-12">
                <div className="grid grid-cols-1 gap-3 sm:gap-6">
                    <div className={`${homeData.heroBanners.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} overflow-hidden relative group`}>
                        {homeData.heroBanners.length > 0 ? (
                            <>
                                <Swiper
                                    modules={[Autoplay, Pagination, EffectFade]}
                                    effect="fade"
                                    autoplay={{ delay: 6000 }}
                                    pagination={{ clickable: true, el: '.hero-pagination' }}
                                    loop={homeData.heroBanners.length > 1}
                                    className="h-[420px] sm:h-[500px] md:h-[600px] border border-gray-100"
                                >
                                    {homeData.heroBanners.map((slide) => (
                                        <SwiperSlide key={slide.id}>
                                            <div className="relative h-full w-full rounded-md overflow-hidden bg-[#f9f9f9]">
                                                <img
                                                    src={slide.image_url}
                                                    className="w-full h-full object-cover"
                                                    alt={slide.title} loading='lazy'
                                                />
                                                <div className="absolute inset-0 flex items-end sm:items-center">
                                                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                                                    <div className="relative z-10 w-full p-6 sm:p-12 md:p-20">
                                                        <div className="max-w-md text-white">
                                                            <span className="text-[12px] tracking-[0.2em] uppercase text-gray-300 mb-4 block font-medium">
                                                                {slide.subtitle || 'Premium Collection'}
                                                            </span>
                                                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4 tracking-tight uppercase">
                                                                {slide.title}
                                                            </h1>
                                                            <p className="text-gray-300 text-sm sm:text-base font-normal mb-10 leading-relaxed opacity-80 line-clamp-1 sm:line-clamp-2">
                                                                {slide.description}
                                                            </p>
                                                            <button
                                                                onClick={() => navigate(slide.link_url || '/search')}
                                                                className="bg-white cursor-pointer text-black px-4 py-2 sm:px-8 sm:py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                                                            >
                                                                {slide.button_text || 'Order Now'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute right-2 bottom-2">
                                                    <img src="/icon.png" loading='lazy' alt="CartivoIcon" className='w-10 rounded-lg' />
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="hero-pagination absolute bottom-7 z-10 flex justify-center w-full gap-2" />
                            </>
                        ) : (
                            <div className="h-[420px] sm:h-[500px] md:h-[600px] bg-gray-50 flex items-center justify-center rounded-md border border-dashed border-gray-200">
                                <div className="text-center space-y-4">
                                    <Layout size={48} className="mx-auto text-gray-200" />
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No Active Promotions</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="py-12 border-y border-gray-50 bg-[#fafafa]">
                <div className="mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <Truck className="w-6 h-6 text-gray-900 stroke-1" />
                            <h4 className="text-[12px] font-bold uppercase tracking-widest">Global Shipping</h4>
                            <p className="text-[12px] text-gray-400 font-medium tracking-wide">Complimentary on all orders</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <RotateCcw className="w-6 h-6 text-gray-900 stroke-1" />
                            <h4 className="text-[12px] font-bold uppercase tracking-widest">Seamless Returns</h4>
                            <p className="text-[12px] text-gray-400 font-medium tracking-wide">30-day extended window</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <CreditCard className="w-6 h-6 text-gray-900 stroke-1" />
                            <h4 className="text-[12px] font-bold uppercase tracking-widest">Secure Checkout</h4>
                            <p className="text-[12px] text-gray-400 font-medium tracking-wide">Encrypted payment gateway</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <Headphones className="w-6 h-6 text-gray-900 stroke-1" />
                            <h4 className="text-[12px] font-bold uppercase tracking-widest">Expert Support</h4>
                            <p className="text-[12px] text-gray-400 font-medium tracking-wide">Dedicated concierge team</p>
                        </div>
                    </div>
                </div>
            </section>

            {homeData.categories.length > 0 && (
                <section className="py-10 sm:py-20 max-w-7xl mx-auto bg-white border-t border-gray-50">
                    <div className="mx-auto px-4 lg:px-10">
                        <div className="flex items-center justify-between mb-16 px-4">
                            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight uppercase">Curated Categories</h2>
                            <a href="/category/all" className="text-gray-400 hover:text-gray-900 font-medium text-sm uppercase tracking-widest transition-all flex items-center gap-2">
                                Explore All <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={24}
                            slidesPerView={2}
                            navigation={{ nextEl: '.cat-next', prevEl: '.cat-prev' }}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                                1280: { slidesPerView: 6 },
                            }}
                            className="relative group"
                        >
                            {homeData.categories.map((cat, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="group cursor-pointer text-center" onClick={() => navigate(`/category/${cat.slug}`)}>
                                        <div className="w-40 h-40 overflow-hidden rounded-full bg-[#f8f8f8] mx-auto mb-4 border border-transparent group-hover:border-gray-200 transition-all duration-500">
                                            <img src={cat.image || 'https://placehold.co/400x400?text=' + cat.name} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" loading='lazy' />
                                        </div>
                                        <span className="text-[12px] text-center font-semibold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">{cat.name}</span>
                                    </div>
                                </SwiperSlide>
                            ))}

                            <button className="cat-prev absolute -left-4 top-[40%] -translate-y-1/2 z-20 p-4 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 hover:text-white">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="cat-next absolute -right-4 top-[40%] -translate-y-1/2 z-20 p-4 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 hover:text-white">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </Swiper>
                    </div>
                </section>
            )}

            {homeData.featuredArrivals.length > 0 && (
                <section className="py-10 sm:py-20">
                    <div className="mx-auto px-4 lg:px-14">
                        <div className="text-center mb-16 space-y-4 reveal active">
                            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight uppercase">Featured Arrivals</h2>
                            <div className="w-12 h-0.5 bg-gray-900 mx-auto" />
                        </div>

                        <div className="relative group/swiper sm:px-2 md:px-4">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={2}
                                navigation={{ nextEl: '.featured-next', prevEl: '.featured-prev' }}
                                breakpoints={{
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                    1536: { slidesPerView: 6 }
                                }}
                                className="!pb-14"
                            >
                                {homeData.featuredArrivals.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="featured-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="featured-next absolute right-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-10 sm:py-20 border-y border-gray-50">
                <div className="mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 sm:gap-12">
                        <div className="relative group overflow-hidden h-[350px] sm:h-[450px] bg-[#f9f9f9] p-3 sm:p-16 flex flex-col sm:flex-row items-center justify-between">
                            <img src="/veg-bg.png" alt="" className="absolute sm:right-2.5 right-5 bottom-2.5 h-fit w-1/2 rounded-tl-4xl rounded-br-4xl object-contain mix-blend-multiply opacity-90 transition-transform duration-[2000ms] group-hover:scale-105" loading='lazy' />
                            <div className="relative z-10 max-w-sm sm:max-w-xs">
                                <span className="text-gray-400 font-semibold uppercase tracking-[0.3em] text-[12px] mb-4 block">Organic Harvest</span>
                                <h3 className="text-gray-900 text-4xl font-semibold mb-6 tracking-tight uppercase">Pure Nature in Every Bite</h3>
                                <button onClick={() => navigate('/category/grocery')} className="text-gray-900 font-bold text-sm uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
                                    Shop Collection
                                </button>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden h-[350px] sm:h-[450px] bg-[#f9f9f9] p-3 sm:p-16 flex flex-col sm:flex-row items-center justify-end text-right">
                            <img src="/samsung-bg.png" alt="" className="absolute left-2.5 top-2.5 h-fit w-1/2 object-contain mix-blend-multiply rounded-tr-4xl rounded-bl-4xl opacity-90 transition-transform duration-[2000ms] group-hover:scale-105" loading='lazy' />
                            <div className="relative z-10  max-w-sm sm:max-w-xs">
                                <span className="text-gray-400 font-semibold uppercase tracking-[0.3em] text-[12px] mb-4 block">Tech Innovation</span>
                                <h3 className="text-gray-900 text-4xl font-semibold mb-6 tracking-tight uppercase">Evolved Intelligence</h3>
                                <button onClick={() => navigate('/category/electronics')} className="text-gray-900 font-bold text-sm uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
                                    Discover Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {homeData.winterEssentials.length > 0 && (
                <section className="py-10 sm:py-20">
                    <div className="mx-auto px-4 lg:px-14">
                        <div className="flex flex-col sm:flex-row items-center overflow-x-auto justify-between mb-16 px-4 gap-6">
                            <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-[0.2em]">Winter Essentials</h2>
                        </div>

                        <div className="relative group/swiper sm:px-2 md:px-4">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={2}
                                navigation={{ nextEl: '.winter-next', prevEl: '.winter-prev' }}
                                breakpoints={{
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                    1536: { slidesPerView: 6 }
                                }}
                                className="!pb-14"
                            >
                                {homeData.winterEssentials.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="winter-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="winter-next absolute right-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="mx-auto px-4 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                        <div className="space-y-8 relative z-10">
                            <span className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[12px]">Since 2026</span>
                            <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight uppercase">Mastery in Every <br /> <span className="italic font-serif">Single Detail</span></h2>
                            <p className="text-gray-400 text-sm sm:text-base max-w-lg leading-relaxed font-light">
                                Our commitment to craftsmanship goes beyond the surface. We source only the finest materials from across the globe to bring you products that aren't just beautiful, but are built to last a lifetime.
                            </p>
                            <div className="pt-8">
                                <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest pb-4 transition-all">
                                    Our Craftsmanship Story <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="aspect-[4/5] overflow-hidden bg-gray-800">
                                <img
                                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop"
                                    alt="Craftsmanship"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3000ms]" loading='lazy'
                                />
                            </div>
                            <div className="absolute -bottom-8 sm:-left-8 bg-white text-black p-8 block">
                                <p className="text-2xl font-serif italic mb-2">"Quality is not an act, it is a habit."</p>
                                <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">— Aristotle</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {homeData.trendingNow.length > 0 && (
                <section className="py-10 sm:py-20">
                    <div className="mx-auto px-4 lg:px-14">
                        <div className="text-center mb-20 space-y-4">
                            <span className="text-gray-400 text-[12px] font-bold uppercase tracking-[0.4em]">Curated Picks</span>
                            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight uppercase">Trending This Week</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-8">
                            {homeData.trendingNow.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {homeData.groceryBestsellers.length > 0 && (
                <section className="py-10 sm:py-20">
                    <div className="mx-auto px-4 lg:px-14">
                        <div className="text-center mb-20 space-y-4">
                            <span className="text-gray-400 text-[12px] font-bold uppercase tracking-[0.4em]">Curated Picks</span>
                            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight uppercase">Bestseller in Grocery</h2>
                        </div>

                        <div className="relative group/swiper sm:px-2 md:px-4">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={2}
                                navigation={{ nextEl: '.grocery-next', prevEl: '.grocery-prev' }}
                                breakpoints={{
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                    1536: { slidesPerView: 6 }
                                }}
                                className="!pb-14"
                            >
                                {homeData.groceryBestsellers.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="grocery-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="grocery-next absolute right-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {homeData.homeAppliancesBestsellers.length > 0 && (
                <section className="py-10 sm:py-20">
                    <div className="mx-auto px-4 lg:px-14">
                        <div className="text-center mb-20 space-y-4">
                            <span className="text-gray-400 text-[12px] font-bold uppercase tracking-[0.4em]">Curated Picks</span>
                            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight uppercase">Bestseller in Home appliances</h2>
                        </div>

                        <div className="relative group/swiper sm:px-2 md:px-4">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={7}
                                slidesPerView={2}
                                navigation={{ nextEl: '.home-next', prevEl: '.home-prev' }}
                                breakpoints={{
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                    1536: { slidesPerView: 6 }
                                }}
                                className="!pb-14"
                            >
                                {homeData.homeAppliancesBestsellers.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="home-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="home-next absolute right-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-white shadow-lg opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-gray-900 hover:text-white border border-gray-100">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-8 sm:py-16 border-t group border-gray-50">
                <div className="mx-auto px-4 lg:px-12 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <FaInstagram className="w-10 h-10 p-1 rounded-md transition-all duration-300 ease-linear mx-auto text-gray-900 stroke-1 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white" />
                        <h2 className="text-2xl font-semibold uppercase tracking-widest">Join Our Lifestyle</h2>
                        <p className="text-gray-400 font-medium tracking-wide">Follow @cartivo_luxury for daily inspiration and exclusive previews.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-8">
                            {socialFeed.map((img, idx) => (
                                <div key={idx} className="aspect-square overflow-hidden group/item cursor-pointer relative">
                                    <img src={img} alt="" loading='lazy' className="w-full h-full object-cover group group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                        <FaInstagram className="text-white w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 sm:py-16 bg-[#f8f8f8]">
                <div className="mx-auto px-4 lg:px-12">
                    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 border border-gray-100 text-center space-y-8">
                        <Mail className="w-8 h-8 mx-auto text-gray-900 stroke-1" />
                        <h2 className="text-2xl sm:text-3xl font-semibold uppercase tracking-[0.3em]">Join The Inner Circle</h2>
                        <p className="text-gray-400 text-sm sm:text-sm max-w-md mx-auto leading-relaxed">
                            Subscribe to receive exclusive offers, early access to new collections, and a window into the world of Cartivo.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="flex-grow bg-[#fafafa] border border-gray-100 px-6 py-4 font-medium focus:outline-none focus:border-gray-400 transition-colors"
                            />
                            <button className="bg-gray-900 cursor-pointer text-white px-10 py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-[12px] text-gray-300">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hero-pagination .swiper-pagination-bullet {
                    width: 30px;
                    height: 2.5px;
                    border-radius: 0;
                    background: black;
                    opacity: 0.5;   
                    transition: all 0.5s ease;
                }
                .hero-pagination .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: white;
                    width: 50px;
                }
                .swiper-button-disabled {
                    opacity: 0 !important;
                    pointer-events: none;
                }
                .reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s ease-out;
                }
                .reveal.active {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .luxury-spinner {
                    width: 40px;
                    height: 40px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #000;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            ` }} />
        </main>
    );
}