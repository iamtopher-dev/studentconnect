import React from "react";
import Logo from "../../assets/images/site_logo.svg"; 
const logoText = "Student Connect"; // Replace with your app name or initials

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <div className="flex gap-4">
                {logoText.split("").map((letter, index) => (
                    <span
                        key={index}
                        className="text-6xl font-extrabold text-[#2E7D67] animate-wave"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            <p className="mt-8 text-gray-600 text-lg font-medium tracking-wide">
                Loading, please wait…
            </p>

            <style>
                {`
                    @keyframes wave {
                        0%, 60%, 100% { transform: translateY(0); }
                        30% { transform: translateY(-20px); }
                    }
                    .animate-wave {
                        display: inline-block;
                        animation: wave 1s ease-in-out infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default PageLoader;
