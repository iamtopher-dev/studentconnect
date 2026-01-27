import React, { useEffect, useState } from "react";
import { Upload, X, Check } from "lucide-react";
import apiService from "../../services/apiService";

const PRIMARY_COLOR = "#307358";

const StudentSchedulePage = () => {
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

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
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    Class Schedule
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Check your upcoming classes and session details. Stay
                    organized and never miss a class.
                </p>
            </div>

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
        </div>
    );
};

export default StudentSchedulePage;
