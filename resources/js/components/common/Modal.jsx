import React from "react";
import Input from "./Input";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children,onSave,loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between  px-6 py-5">
                    <h2 className="text-md font-medium">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 px-6 space-y-8">{children}</div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-6 py-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-sm hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <Button label={`Save`} variant="primary" loading={loading} is onClick={onSave} />
                </div>
            </div>
        </div>
    );
};

export default Modal;
