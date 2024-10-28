import React from "react";
import { Document, Page } from "react-pdf";
import { XCircle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  //horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@material-tailwind/react";

const SelectedPages = ({ pages, file, setPages, handleClear }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) {
      console.warn("Drag ended with no active or over element:", {
        active,
        over,
      });
      return; // Exit if there are no valid drag targets
    }

    if (active.id !== over.id) {
      setPages((pages) => {
        const oldIndex = pages.indexOf(active.id);
        const newIndex = pages.indexOf(over.id);
        return arrayMove(pages, oldIndex, newIndex);
      });
    }
  };
  return (
    <div className="mx-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold mb-3">Selected Pages Preview</h3>
        {/* <Button onClick={handleClear}>clear all</Button> */}
        <Button
          variant="filled"
          color="red"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 capitalize shadow-md hover:shadow-lg transition-shadow"
          onClick={handleClear}
        >
          <XCircle className="h-4 w-4" />
          <span>Clear Selection</span>
        </Button>
      </div>

      <div className="h-[535px] border rounded-lg p-4 bg-gray-50 shadow-lg">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pages} strategy={rectSortingStrategy}>
            <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
              {pages.map((pageNum) => (
                <SortablePreviewItem key={pageNum} id={pageNum} file={file} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const SortablePreviewItem = ({ id, file }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative cursor-move"
    >
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <Document file={file}>
          <Page pageNumber={id} width={150} className="bg-white" />
        </Document>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          Page {id}
        </div>
      </div>
    </div>
  );
};

export default SelectedPages;

// import React, { useState, useRef } from "react";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Button,
//   Checkbox,
// } from "@material-tailwind/react";
// import {
//   ArrowUpTrayIcon,
//   DocumentIcon,
//   XCircleIcon,
// } from "@heroicons/react/24/solid";
// import { Document, Page } from "react-pdf";
// import { PDFDocument } from "pdf-lib"; // Import PDF-lib
// import { Failed } from "../helper/popup";
// import PDFInput from "../components/PDFInput";

// const Home = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [selectedPages, setSelectedPages] = useState([]);
//   const fileInputRef = useRef(null);

//   // const handlePageSelect = (pageId) => {
//   //   setSelectedPages((prev) => {
//   //     if (prev.includes(pageId)) {
//   //       return prev.filter((id) => id !== pageId);
//   //     } else {
//   //       return [...prev, pageId];
//   //     }
//   //   });
//   // };

//   const handlePageSelect = (pageId) => {
//     setSelectedPages((prev) => {
//       if (prev.includes(pageId)) {
//         return prev.filter((id) => id !== pageId);
//       } else {
//         return [...prev, pageId].sort((a, b) => a - b);
//       }
//     });
//   };

//   const handleCreateNewPdf = async () => {
//     if (selectedPages.length === 0) {
//       Failed("Please select at least one page");
//       return;
//     }
//     try {
//       const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
//       const newPdfDoc = await PDFDocument.create();
//       for (const pageNum of selectedPages) {
//         const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
//         newPdfDoc.addPage(copiedPage);
//       }
//       const pdfBytes = await newPdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       console.log(url);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = selectedFile.name;
//       link.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       Failed("Error creating PDF");
//     }
//   };

//   const clearSelection = () => {
//     setSelectedFile(null);
//     setNumPages(null);
//     setSelectedPages([]);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader color="gray" className="p-5">
//         <h2 className="text-2xl font-bold text-gray-800">PDF Upload Manager</h2>
//       </CardHeader>

//       <CardBody>
//         <PDFInput
//           fileInputRef={fileInputRef}
//           setSelectedFile={setSelectedFile}
//           setSelectedPages={setSelectedPages}
//         />

//         {selectedFile && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <DocumentIcon className="w-6 h-6 text-blue-500 mr-2" />
//                 <span className="font-medium">{selectedFile.name}</span>
//               </div>
//               <Button
//                 color="red"
//                 variant="text"
//                 className="flex items-center"
//                 onClick={clearSelection}
//               >
//                 <XCircleIcon className="w-4 h-4 mr-1" />
//                 Remove
//               </Button>
//             </div>
//             <div className="w-full h-[calc(100vh-200px)] border rounded-lg p-4">
//               <div className="h-full overflow-y-auto">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   <Document
//                     file={selectedFile}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                   >
//                     {Array.from({ length: numPages }, (_, index) => (
//                       <div
//                         key={index}
//                         className="relative flex flex-col items-center"
//                       >
//                         <div className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                           <Page
//                             pageNumber={index + 1}
//                             width={200}
//                             className="bg-white"
//                           />
//                           <div className="absolute top-2 left-2 z-10">
//                             <Checkbox
//                               checked={selectedPages.includes(index + 1)}
//                               onChange={() => handlePageSelect(index + 1)}
//                               className="bg-white"
//                             />
//                           </div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600">
//                           Page {index + 1}
//                         </p>
//                       </div>
//                     ))}
//                   </Document>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* )} */}
//       </CardBody>

//       {selectedFile && (
//         <CardFooter className="flex justify-between items-center">
//           <p className="text-sm text-gray-600">
//             {selectedPages.length} pages selected
//           </p>
//           <Button
//             color="blue"
//             disabled={selectedPages.length === 0}
//             onClick={handleCreateNewPdf}
//           >
//             Create New PDF
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// //export default Home;
{
  /* <div className="mb-6 m-3">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-3">
                      Selected Pages Preview
                    </h3>
                    <Button onClick={handleClearAll}>clear all</Button>
                  </div>

                  <div className="h-[535px] border rounded-lg p-4 bg-gray-50 shadow-lg">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedPages}
                        strategy={rectSortingStrategy}
                      >
                        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                          {selectedPages.map((pageNum) => (
                            <SortablePreviewItem
                              key={pageNum}
                              id={pageNum}
                              file={selectedFile}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div> */
}
