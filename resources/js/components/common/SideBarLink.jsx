import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const baseStyles = "flex p-2 items-center group rounded";
const variants = {
    default: "bg-transparent",
    active: "bg-primary text-white",
};
const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export const SiderBarLinkSingle = ({
    icon,
    label,
    url = "#",
    className = "",
    ...props
}) => {
    return (
        <li>
            <NavLink
                to={url}
                end
                className={({ isActive }) =>
                    `${baseStyles} ${className} ${
                        isActive ? variants.active : variants.default
                    }`
                }
                {...props}
            >
                {icon}
                <span className="ms-3 text-sm">{label}</span>
            </NavLink>
        </li>
    );
};

export const SiderBarLinkMultiple = ({
    label,
    icon,
    items = [],
    size = "md",
    className = "",
}) => {
    const [open, setOpen] = useState(false);

    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center p-2 w-full text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
                {icon}

                <span className="flex-1 ms-3 text-sm text-left whitespace-nowrap">
                    {label}
                </span>
                <svg
                    className={`w-3 h-3 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {open && (
                <ul className="py-2 space-y-2">
                    {items.map((item) => (
                        <li key={item.url}>
                            <NavLink
                                to={item.url}
                                end   
                                className={({ isActive }) =>
                                    `${baseStyles} ${
                                        sizes[size]
                                    } ${className} ${
                                        isActive
                                            ? variants.active
                                            : variants.default
                                    }`
                                }
                            >
                                <span className="ms-3 text-sm">
                                    {item.label}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};
