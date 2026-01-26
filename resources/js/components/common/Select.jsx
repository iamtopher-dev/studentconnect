import React from "react";

const Select = ({
  id,
  addClass = "w-full",
  name,
  label,
  options = [],
  required = false,
  placeholder = "Select an option", // ✅ New prop
  ...props
}) => {
  return (
    <div className={`${addClass}`}>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                   dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...props}
      >
        {/* ✅ Placeholder Option */}
        <option value="" disabled selected hidden>
          {placeholder}
        </option>

        {/* ✅ Render Options */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
