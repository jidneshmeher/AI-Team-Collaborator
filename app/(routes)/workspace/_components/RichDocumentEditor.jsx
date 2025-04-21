import React, { use, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import { TextVariantTune } from "@editorjs/text-variant-tune";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import Paragraph from "@editorjs/paragraph";
import GenerateAITemplate from "./GenerateAITemplate";
import html2pdf from "html2pdf.js"

function RichDocumentEditor({ params, setDownloadPDF }) {
  const param = use(params);
  const ref = useRef(null);
  const { user } = useUser();
  const [documentOutput, setDocumentOutput] = useState([]);
  let isFetched = false;

  // Initialize EditorJS
  useEffect(() => {
    if (user) {
      InitEditor();
    }
  }, [user]);

  const SaveDocument = () => {
    if (!ref.current) return;

    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, "documentOutput", param?.documentid);
      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress?.emailAddress,
      });
    });
  };

  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(
      doc(db, "documentOutput", param?.documentid),
      (doc) => {
        if (
          doc.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress ||
          !isFetched
        ) {
          doc.data()?.editedBy &&
            ref.current?.render(JSON.parse(doc.data()?.output));
        }
        isFetched = true;
      }
    );

    return () => unsubscribe();
  };

  const InitEditor = () => {
    if (!ref.current) {
      ref.current = new EditorJS({
        holder: "editorjs",
        onChange: () => SaveDocument(),
        onReady: () => GetDocumentOutput(),
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+A",
            config: {
              alertTypes: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
                "light",
                "dark",
              ],
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
            config: { defaultStyle: "unordered" },
          },
          checklist: {
            class: Checklist,
            shortcut: "CMD+SHIFT+C",
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+P",
          },
        },
      });
    }
  };

  const handleDownloadPDF = () => {
    const editorElement = document.getElementById("editorjs");
    if (!editorElement) {
      console.error("Editor element not found.");
      return;
    }
  
    // Create a wrapper div for styling
    const clonedElement = editorElement.cloneNode(true);
    clonedElement.style.width = "80%"; // Set width to 80% for better readability
    clonedElement.style.margin = "auto"; // Center align
    clonedElement.style.padding = "20px"; // Add left padding
    clonedElement.style.backgroundColor = "#fff"; // Ensure white background
    clonedElement.style.color = "#000"; // Ensure dark text color
  
    // Use html2pdf with styling options
    html2pdf()
      .set({
        margin: [10, 10, 10, 10], // Top, Right, Bottom, Left margins
        filename: "document.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(clonedElement)
      .save();
  };

  useEffect(() => {
    setDownloadPDF(() => handleDownloadPDF);  // Pass function reference correctly
  }, [setDownloadPDF]);

  return (
    <div>
      <div id="editorjs" className="ml-10 w-[70%]"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10">
        <GenerateAITemplate
          setGenerateAIOutput={(output) => {
            if (!ref.current) {
              console.error("Editor is not initialized");
              return;
            }

            try {
              output.blocks.forEach((block) => {
                // Ensure block.data is defined to avoid errors
                const blockData = block.data || {};
                ref.current.blocks.insert(
                  block.type,
                  blockData,
                  {},
                  ref.current.blocks.getBlocksCount()
                );
              });
            } catch (error) {
              console.error("Error inserting AI output:", error);
            }
          }}
        />
      </div>
    </div>
  );
}

export default RichDocumentEditor;
