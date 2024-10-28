import { Document, Page } from "react-pdf";
import { DownloadIcon, Download, Trash2 } from "lucide-react";
import { Card } from "@material-tailwind/react";
import { Success, Failed } from "../helper/popup";
import axiosInstance from "../api/axiosInterceptor";

const PDFList = ({ setPdfs, list }) => {
  const handleDownload = async (pdf) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdf.url);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = pdf.originalName || "download.pdf"; // Use provided filename or default

      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL to free up memory
      window.URL.revokeObjectURL(blobUrl);
      Success("the pdf was downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (pdfId) => {
    try {
      const res = await axiosInstance.delete(`/user/delete-pdf/${pdfId}`);
      const data = res.data;
      setPdfs((prev) => prev.filter((item) => item._id !== pdfId));
      Success(res.data.message);
    } catch (err) {
      Failed(err.response ? err.response.data.message : err.message);
      console.log(err.message);
    }
  };
  return (
    <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {list.map((pdf, index) => (
        <div
          key={index}
          className="relative border rounded-lg overflow-hidden bg-white shadow-md w-48 group"
          style={{ height: "300px" }}
        >
          {/* Delete button - visible only on hover */}
          <button
            onClick={() => handleDelete(pdf._id)}
            className="absolute top-2 right-2 z-20 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
            aria-label="Delete PDF"
            type="button"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>

          {/* PDF preview section with hover overlay */}
          <div className="h-3/4 overflow-hidden relative">
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 z-10" />

            {/* PDF preview */}
            <Document file={pdf.url}>
              <Page pageNumber={1} width={192} />
            </Document>
          </div>

          {/* Bottom info section */}
          <div className="absolute bottom-0 w-full h-1/4 bg-gray-100 rounded-b-lg flex justify-between items-center p-2">
            {/* Filename with tooltip */}
            <div className="flex-1 min-w-0 mr-2">
              <span
                title={pdf.originalName}
                className="text-sm text-gray-600 block truncate"
              >
                {pdf.originalName}
              </span>
            </div>

            {/* Download button */}
            <button
              onClick={() => handleDownload(pdf)}
              className="text-blue-600 hover:text-blue-800 flex-shrink-0"
              aria-label="Download PDF"
              type="button"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default PDFList;
