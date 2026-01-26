import React, { useEffect, useState } from "react";
import { Upload, X, Check } from "lucide-react";
import apiService from "../../services/apiService";

const PRIMARY_COLOR = "#307358";

const SchedulePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);

    useEffect(() => {
        read_schedule_pdf("COLLEGE");
    });

    const read_schedule_pdf = (schedule_pdf) => {
        apiService
            .get(`staff/read-schedule-pdf/${schedule_pdf}`)
            .then((res) => {
                const pdf_url = res.data.data.pdf_file;
                setPdfPreviewUrl(pdf_url);
            })
            .catch((err) => {
                console.error("Something went wrong!", err);
            })
            .finally(() => setLoadingScreen(false));
    };

    const openModal = () => {
        setModalOpen(true);
        setSelectedFile(null);
        const input = document.getElementById("pdfInput");
        if (input) input.value = null;
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedFile(null);
        const input = document.getElementById("pdfInput");
        if (input) input.value = null;
    };

    // Upload PDF to Laravel
    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await apiService.post(
                "staff/save-schedule-pdf",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.data.success) {
                alert("File uploaded successfully!");
                closeModal();
            } else {
                alert("Upload failed: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while uploading.");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading schedule...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    Student Class Schedule
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    View and manage the schedules of students for all classes
                    and sessions
                </p>
            </div>

            {/* ACTION */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    <Upload size={18} />
                    Upload PDF Schedule
                </button>
            </div>

            {/* PDF PREVIEW */}
            {pdfPreviewUrl && (
                <div
                    className="mt-4 border rounded-xl overflow-hidden sm:h-80 "
                    style={{ height: "calc(100vh - 200px)" }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <object
                        data={pdfPreviewUrl}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <p className="text-sm text-slate-500 p-4">
                            PDF preview is not supported in this browser.
                        </p>
                    </object>
                </div>
            )}

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-5 sm:p-6 relative shadow-xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                            Upload PDF Schedule
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mb-5">
                            Please upload a PDF file containing the class
                            schedule.
                        </p>

                        {/* DROP AREA */}
                        <div
                            onClick={() =>
                                document.getElementById("pdfInput").click()
                            }
                            className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:border-slate-400 transition"
                        >
                            <Upload
                                className="mx-auto mb-3 text-slate-400"
                                size={36}
                            />

                            {!selectedFile ? (
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Click to select a PDF file
                                </p>
                            ) : (
                                <p className="text-sm text-slate-700 font-medium truncate">
                                    📄 {selectedFile.name}
                                </p>
                            )}

                            <input
                                id="pdfInput"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    setSelectedFile(file);
                                }}
                            />
                        </div>

                        {/* CONFIRM */}
                        <button
                            disabled={!selectedFile || loading}
                            onClick={handleConfirmUpload}
                            className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                                selectedFile
                                    ? "text-white"
                                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                            }`}
                            style={{
                                backgroundColor: selectedFile
                                    ? PRIMARY_COLOR
                                    : undefined,
                            }}
                        >
                            <Check size={18} />
                            {loading ? "Uploading..." : "Confirm Upload"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
