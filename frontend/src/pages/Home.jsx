import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { Failed } from "../helper/popup";
import PDFInput from "../components/PDFInput";
import NavBar from "../components/NavBar";
import axiosInstance from "../api/axiosInterceptor";

import PDFList from "../components/PDFList";
import SelectedPages from "../components/SelectedPages";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get("/user/get-files");
        setPdfs(res.data.result);
      } catch (err) {
        Failed(err.response ? err.response.data.message : err.message);
        console.log(err.message);
      }
    };
    fetchFiles();
  }, []);

  const handlePageSelect = (pageId) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageId)) {
        return prev.filter((id) => id !== pageId);
      } else {
        return [...prev, pageId];
      }
    });
  };

  const handleCreateNewPdf = async () => {
    if (selectedPages.length === 0) {
      Failed("Please select at least one page");
      return;
    }
    try {
      const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
      const newPdfDoc = await PDFDocument.create();
      for (const pageNum of selectedPages) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
        newPdfDoc.addPage(copiedPage);
      }
      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("pdf", blob, selectedFile.name);
      const res = await axiosInstance.post("/user/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data.result);
      setPdfs((prev) => [...prev, res.data.result]);
      setSelectedFile(null);

      // const url = URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = `reordered_${selectedFile.name}`;
      // link.click();
      // URL.revokeObjectURL(url);
    } catch (err) {
      Failed("Error creating PDF");
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setNumPages(null);
    setSelectedPages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSelectAll = () => {
    // Select all pages
    const allPages = Array.from({ length: numPages }, (_, index) => index + 1);
    setSelectedPages(allPages);
  };

  const handleClearAll = () => {
    // Clear all selected pages
    setSelectedPages([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="flex justify-center flex-col items-center">
        {selectedFile ? (
          <Card className="w-11/12 shadow-lg mt-5">
            <div className="mb-2">
              <div className="flex items-center justify-between bg-blue-gray-100 rounded-t-md p-2">
                <div className="flex items-center">
                  <DocumentIcon className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <Button
                  color="red"
                  variant="text"
                  className="flex items-center"
                  onClick={clearSelection}
                >
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid lg:grid-cols-2 m-2 gap-5">
                {/* PDF Pages Grid */}
                <div className=" w-full mx-3">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xl font-semibold">Select Pages</div>

                    <Button
                      className="rounded-none bg-blue-700"
                      onClick={handleSelectAll}
                    >
                      Select all
                    </Button>
                  </div>
                  <div className="max-h-[535px] border rounded-lg p-4 overflow-y-auto shadow-lg">
                    <Document
                      file={selectedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div
                          key={index}
                          className="relative flex flex-col items-center"
                        >
                          <div className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <Page
                              pageNumber={index + 1}
                              width={150}
                              className="bg-white"
                            />
                            <div className="absolute top-2 left-2 z-10">
                              <Checkbox
                                checked={selectedPages.includes(index + 1)}
                                onChange={() => handlePageSelect(index + 1)}
                                className="bg-white"
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Page {index + 1}
                          </p>
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
                {/* Selected Pages Preview */}

                <SelectedPages
                  pages={selectedPages}
                  file={selectedFile}
                  setPages={setSelectedPages}
                  handleClear={handleClearAll}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-3 mx-5 mt-0">
              <p className="text-sm text-gray-600">
                {selectedPages.length} pages selected
              </p>
              <Button
                color="blue"
                disabled={selectedPages.length === 0}
                onClick={handleCreateNewPdf}
                className="rounded-none bg-green-600"
              >
                Create New PDF
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="w-3/4 lg:flex mt-10 gap-8">
              <Card className="lg:w-1/4 p-4 h-fit mb-3">
                {/* Input section for the pdf */}

                <PDFInput
                  fileInputRef={fileInputRef}
                  setSelectedFile={setSelectedFile}
                  setSelectedPages={setSelectedPages}
                />
              </Card>

              {/* List of existing pdfs */}

              <PDFList setPdfs={setPdfs} list={pdfs} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
