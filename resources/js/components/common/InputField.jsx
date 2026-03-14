const InputField = ({
    label,
    value,
    type = "text",
    readOnly = false,
    required = false,
    name,
    onChange,
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required={required}
            className={`w-full px-5 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
    </div>
);

export default InputField;
