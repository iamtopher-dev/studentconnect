import React from "react";
import { NavLink } from "react-router-dom";

const baseStyles = "block font-medium py-2 px-3 bg-transparent";

const variants = {
  default: "text-gray-600 hover:text-green-600 duration-300",
  active: "text-green-600 font-bold duration-300",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Link = ({
  label,
  url = "#",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <li>
      <NavLink
        to={url}
        className={({ isActive }) =>
          `${baseStyles} ${sizes[size]} ${className} ${
            isActive ? variants.active : variants.default
          }`
        }
        {...props}
      >
        {label}
      </NavLink>
    </li>
  );
};

export default Link;
