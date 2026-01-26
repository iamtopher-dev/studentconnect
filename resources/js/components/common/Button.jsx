import React from "react";

const baseStyles =
  "rounded-lg text-sm px-8 py-2 text-center duration-300 transition-all flex items-center justify-center gap-2 font-medium";

const variants = {
  primary:
    "border border-primary hover:bg-green-800 text-white bg-primary focus:ring-4 focus:outline-none focus:ring-green-200 disabled:opacity-70",
  secondary:
    "border hover:bg-primary hover:text-white border-primary focus:ring-4 focus:outline-none focus:ring-green-200 disabled:opacity-70",
};

const Button = ({
  type = "button",
  label,
  variant = "primary",
  addClass = "",
  loading = false,
  icon: Icon, // ✅ pass icon component here (e.g., LogIn from lucide-react)
  iconPosition = "left", // "left" or "right"
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${addClass}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}

      {/* Icon (left side by default) */}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}

      {/* Label */}
      <span>{loading ? "Loading..." : label}</span>

      {/* Icon (right side if specified) */}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
