import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ options, placeholder = "Login", onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option) => {
        if (onSelect) onSelect(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-primary bg-white rounded-lg focus:outline-none"
            >
                {placeholder}
                <ChevronDown size={16} />
            </button>

            {/* Menu */}
            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 z-10 mt-2 min-w-max bg-white border border-gray-200 rounded-lg shadow-lg">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="block w-full whitespace-nowrap px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
