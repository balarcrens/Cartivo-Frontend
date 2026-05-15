import React, { useState } from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';
import { Ruler, Shirt, Smartphone, Watch } from 'lucide-react';

export default function SizeGuide() {
    const [activeCategory, setActiveCategory] = useState('Fashion');

    const sizeData = {
        Fashion: {
            icon: <Shirt className="w-5 h-5" />,
            tables: [
                {
                    title: "Men's Luxury Apparel",
                    headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
                    rows: [
                        ["S", "36 - 38", "30 - 32", "33.5"],
                        ["M", "39 - 41", "33 - 35", "34.5"],
                        ["L", "42 - 44", "36 - 38", "35.5"],
                        ["XL", "45 - 47", "39 - 41", "36.5"],
                        ["XXL", "48 - 50", "42 - 44", "37.5"]
                    ]
                },
                {
                    title: "Women's Luxury Apparel",
                    headers: ["Size", "Bust (in)", "Waist (in)", "Hips (in)"],
                    rows: [
                        ["XS", "31 - 32", "24 - 25", "34 - 35"],
                        ["S", "33 - 34", "26 - 27", "36 - 37"],
                        ["M", "35 - 36", "28 - 29", "38 - 39"],
                        ["L", "37 - 39", "30 - 32", "40 - 42"],
                        ["XL", "40 - 42", "33 - 35", "43 - 45"]
                    ]
                }
            ]
        },
        Watches: {
            icon: <Watch className="w-5 h-5" />,
            tables: [
                {
                    title: "Case Diameter Guide",
                    headers: ["Style", "Diameter (mm)", "Wrist Profile"],
                    rows: [
                        ["Vintage/Classic", "34 - 36", "Small"],
                        ["Mid-Size", "38 - 40", "Medium"],
                        ["Sport/Modern", "42 - 44", "Large"],
                        ["Oversized", "45+", "Extra Large"]
                    ]
                }
            ]
        },
        Electronics: {
            icon: <Smartphone className="w-5 h-5" />,
            tables: [
                {
                    title: "Common Display Sizes",
                    headers: ["Device", "Screen Size", "Aspect Ratio"],
                    rows: [
                        ["Compact Smartphone", "5.4\" - 6.1\"", "19.5:9"],
                        ["Standard Smartphone", "6.2\" - 6.4\"", "20:9"],
                        ["Max/Ultra Models", "6.7\" - 6.9\"", "20:9"],
                        ["Tablet", "10.9\" - 12.9\"", "4:3 / 16:10"]
                    ]
                }
            ]
        }
    };

    return (
        <LegalLayout title="Boutique Size Guide" lastUpdated="May 15, 2026">
            <section className="mb-12">
                <div className="flex flex-wrap items-center gap-1 sm:gap-4 p-3 sm:p-6 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
                    <Ruler className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                        Ensuring a perfect fit is essential to the luxury experience. Please use these standardized guides to find your ideal measurements.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.keys(sizeData).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${activeCategory === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        >
                            {sizeData[cat].icon}
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="space-y-12 animate-in">
                    {sizeData[activeCategory].tables.map((table, tIdx) => (
                        <div key={tIdx} className="bg-white rounded-lg sm:border border-gray-100 overflow-hidden sm:shadow-sm">
                            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">{table.title}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            {table.headers.map((header, hIdx) => (
                                                <th key={hIdx} className="px-3 sm:px-8 py-2 sm:py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {table.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className={`px-3 sm:px-8 py-2 sm:py-5 ${cIdx === 0 ? 'font-bold text-gray-900' : 'text-gray-500 font-inter'}`}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-16 p-2 sm:p-8 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">For Apparel:</h4>
                        <ul className="text-xs text-gray-500 space-y-3 leading-relaxed uppercase tracking-wider">
                            <li><strong>Chest:</strong> Measure under arms around the fullest part of the chest.</li>
                            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape slightly loose.</li>
                            <li><strong>Sleeve:</strong> Measure from the center back of your neck, across the shoulder to the elbow and down to the wrist.</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Pro Tip:</h4>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                            If your measurements fall between two sizes, we recommend selecting the larger size for a more comfortable, luxury drape. For slim-fit items, consider your usual size.
                        </p>
                    </div>
                </div>
            </section>
        </LegalLayout>
    );
}
