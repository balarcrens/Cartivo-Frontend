import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const pos = window.scrollY;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollValue = Math.round((pos * 100) / height);

            setProgress(scrollValue);
            setIsVisible(pos > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            onClick={scrollToTop}
            className={`fixed bottom-15 right-8 z-[500] active:scale-70 cursor-pointer transition-all duration-700 ease-in-out ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90 pointer-events-none"
                }`}
        >
            <div className="relative group">
                <div
                    className="h-14 w-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                    style={{
                        background: `conic-gradient(#000000 ${progress}%, #f1f1f1 ${progress}%)`
                    }}
                >
                    <div className="h-[88%] w-[88%] rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <ChevronUp className="w-5 h-5 text-black transition-colors duration-500 mb-[-1px]" />
                        </div>
                    </div>
                </div>

                <div className="absolute -inset-2 bg-black/5 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
            </div>
        </div>
    );
}