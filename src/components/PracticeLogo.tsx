import { useContext, useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";

const deployedUrl =
  "https://script.google.com/macros/s/AKfycbzyclRmJ9UWEPjWa5Yspe_5J8fOhwKDwszpm2jBLyrdM5M8RBxEgI8shqtW2z-WU7KPgA/exec";

const PracticeLogo: React.FC = () => {
  const { setStep } = useContext(AppContext);
  const handleInputChange = useInputChange();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");

  console.log(fileUrl, "====fileUrl");
  const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const base64File = reader.result.split(",")[1]; // Extract the base64 part
        const requestBody = JSON.stringify({
          filename: selectedFile.name,
          mimetype: selectedFile.type,
          fileData: base64File,
        });

        try {
          const response = await fetch(corsProxyUrl + deployedUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBody,
          });

          if (!response.ok) {
            console.error("Response not OK:", response.statusText);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setFileUrl(data.fileUrl);
          alert("File uploaded successfully!");
        } catch (error: any) {
          console.error("Upload error:", error);
          alert("Upload failed: " + error.message);
        }
      }
    };
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Upload your Practice Logo" />
        <div className="mb-5">
          <Dropzone
            onDrop={(files: File[]) => {
              if (files.length > 0) {
                setSelectedFile(files[0]);
                handleInputChange("logo", files);
              }
            }}
          >
            <div className="md:flex grid items-center justify-between gap-5 py-5">
              <div className="flex items-center gap-3">
                <AiOutlineCloudUpload size={60} className="text-[#45bda6]" />
                <div>
                  <div className="text-[#666666] text-xl font-bold">
                    Drag and drop files here
                  </div>
                  <div className="text-sm text-[#666666] font-bold">
                    Max File Size: 10.6MB
                  </div>
                </div>
              </div>
              <div>
                <Button
                  color="#45bda6"
                  variant="outline"
                  className="!text-lg !px-22 max-sm:!px-10 !h-12"
                >
                  Browse Files
                </Button>
                <div>{selectedFile?.name || "No file selected"}</div>
              </div>
            </div>
          </Dropzone>

          <button className="cursor-pointer" onClick={handleUpload}>
            Upload
          </button>

          {/* {fileUrl && (
            <div>
              <p>
                File uploaded successfully!{" "}
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </p>
            </div>
          )} */}
        </div>
      </div>
      <Footer
        handleNextStep={() => setStep(3)}
        handlePreviousStep={() => setStep(1)}
      />
    </div>
  );
};

export default PracticeLogo;
