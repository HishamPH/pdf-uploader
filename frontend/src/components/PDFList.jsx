import React from "react";
import { Document, Page } from "react-pdf";
import { DownloadIcon } from "lucide-react";

const PDFList = ({ list }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {list.map((pdf, index) => (
        <div
          key={index}
          className="relative border rounded-lg p-4 bg-white shadow-md"
        >
          <div className="flex flex-col items-center">
            {/* Display small preview of the first page of the PDF */}
            <Document file={pdf.url}>
              <Page pageNumber={1} width={150} />
            </Document>
            <div className="mt-2 text-sm text-gray-600">
              {/* Show the name of the PDF */}
              <span title={pdf.originalName}>{pdf.originalName}</span>
            </div>
          </div>
          {/* Download button */}
          <div className="absolute bottom-2 right-2">
            <a
              href={pdf.url}
              download={pdf.originalName}
              className="text-blue-600 hover:text-blue-800"
            >
              <DownloadIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDFList;
