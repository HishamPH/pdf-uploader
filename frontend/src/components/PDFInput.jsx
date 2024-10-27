import React, { useState } from "react";
import { Card, Button } from "@material-tailwind/react";
import { Failed } from "../helper/popup";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

const PDFInput = ({ fileInputRef, setSelectedFile, setSelectedPages }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file) => {
    if (!file) return false;
    if (file.type !== "application/pdf") {
      Failed("Please upload a PDF file");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      Failed("File size should not exceed 10MB");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSelectedPages([]);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      handleFileSelect(file);
    }
  };

  return (
    <Card>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">Drag and drop your PDF here or</p>
        <Button
          color="blue"
          className="mt-2"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose a File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileInputChange}
        />
      </div>
    </Card>
  );
};

export default PDFInput;
