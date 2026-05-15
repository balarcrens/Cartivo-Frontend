import React from 'react';
import Skeleton, { SkeletonStyles } from './Skeleton';

const HeroSkeleton = () => (
    <div className="mx-auto max-w-7xl px-4 lg:px-12 py-12">
        <div className="grid grid-cols-1 gap-3 sm:gap-6">
            <div className="lg:col-span-8 overflow-hidden relative">
                <Skeleton className="h-[420px] sm:h-[500px] md:h-[600px] w-full" />
                <div className="absolute inset-0 flex items-end sm:items-center p-6 sm:p-12 md:p-20">
                    <div className="w-full max-w-md space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-2/3" />
                        <div className="pt-6">
                            <Skeleton className="h-12 w-40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const FeaturesSkeleton = () => (
    <section className="py-12 border-y border-gray-50 bg-[#fafafa]">
        <div className="mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3">
                        <Skeleton className="w-6 h-6" circle />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-32" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CategorySkeleton = () => (
    <section className="py-10 sm:py-20 max-w-7xl mx-auto">
        <div className="mx-auto px-4 lg:px-10">
            <div className="flex items-center justify-between mb-16 px-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-10 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center flex-shrink-0">
                        <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 mb-4" circle />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProductCardSkeleton = () => (
    <div className="flex flex-col h-full space-y-4 bg-white border border-transparent">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-2 px-2 pb-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-10" />
            </div>
        </div>
    </div>
);

const ProductSectionSkeleton = ({ subtitle = true }) => (
    <section className="py-10 sm:py-20">
        <div className="mx-auto px-4 lg:px-14">
            <div className="text-center mb-16 space-y-4">
                {subtitle && <Skeleton className="h-3 w-24 mx-auto" />}
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-0.5 w-12 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </section>
);

const TwoColumnBannerSkeleton = () => (
    <section className="py-10 sm:py-20 border-y border-gray-50">
        <div className="mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative">
                    <Skeleton className="h-[350px] sm:h-[450px] w-full" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-xs space-y-4">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
                <div className="relative">
                    <Skeleton className="h-[350px] sm:h-[450px] w-full" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-center items-end text-right ml-auto max-w-xs space-y-4">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const CraftsmanshipSkeleton = () => (
    <section className="py-24 bg-gray-900 overflow-hidden">
        <div className="mx-auto px-4 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                <div className="space-y-8">
                    <Skeleton className="h-3 w-24 bg-gray-800" />
                    <Skeleton className="h-16 w-full bg-gray-800" />
                    <Skeleton className="h-24 w-full bg-gray-800" />
                    <Skeleton className="h-8 w-48 bg-gray-800" />
                </div>
                <Skeleton className="aspect-[4/5] w-full bg-gray-800" />
            </div>
        </div>
    </section>
);

const SocialFeedSkeleton = () => (
    <section className="py-8 sm:py-16 border-t border-gray-50">
        <div className="mx-auto px-4 lg:px-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="w-10 h-10 mx-auto" circle />
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-full max-w-md mx-auto" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="aspect-square w-full" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const NewsletterSkeleton = () => (
    <section className="py-8 sm:py-16 bg-[#f8f8f8]">
        <div className="mx-auto px-4 lg:px-12">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 border border-gray-100 text-center space-y-8">
                <Skeleton className="w-8 h-8 mx-auto" circle />
                <Skeleton className="h-10 w-80 mx-auto" />
                <Skeleton className="h-4 w-full max-w-md mx-auto" />
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                    <Skeleton className="h-14 flex-grow" />
                    <Skeleton className="h-14 w-40" />
                </div>
                <Skeleton className="h-3 w-64 mx-auto" />
            </div>
        </div>
    </section>
);

const HomeSkeleton = () => {
    return (
        <div className="bg-white min-h-screen font-outfit">
            <SkeletonStyles />
            <HeroSkeleton />
            <FeaturesSkeleton />
            <CategorySkeleton />
            <ProductSectionSkeleton subtitle={false} /> {/* Featured Arrivals */}
            <TwoColumnBannerSkeleton />
            <ProductSectionSkeleton subtitle={false} /> {/* Winter Essentials */}
            <CraftsmanshipSkeleton />
            <ProductSectionSkeleton /> {/* Trending Now */}
            <ProductSectionSkeleton /> {/* Grocery Bestsellers */}
            <ProductSectionSkeleton /> {/* Home Appliances Bestsellers */}
            <SocialFeedSkeleton />
            <NewsletterSkeleton />
        </div>
    );
};

export default HomeSkeleton;
