import React from "react";
const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};
const Input = ({
    id,
    name,
    label,
    type,
    placeholder = "",
    required = false,
    width = "w-full",
    addClass,
    ...props
}) => {
    return (
        <div className={`${width}`}>
            <label
                for={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                required={required}
                className={`${addClass} shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                {...props}
            />
        </div>
    );
};
export default Input;
