import { useContext, useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";

const PracticeLogo: React.FC = () => {
  const { setStep, formData } = useContext(AppContext);

  const handleInputChange = useInputChange();
  const [selectedFile, setSelectedFile] = useState<File | null>(
    formData.logo ?? null
  );

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      // Read the file as a data URL so we can store it
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Store an object with both file meta and base64 data
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dataUrl, // base64 representation
        };
        // Save this object using your context's input change handler.
        handleInputChange("logo", fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const base64File = reader.result.split(",")[1]; // Extract base64 content
        const requestBody = {
          filename: selectedFile.name,
          mimetype: selectedFile.type,
          fileData: base64File,
        };

        try {
          const response = await fetch("/api/proxy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data.fileUrl);
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
          <button onClick={handleUpload}>Upload</button>
          <Dropzone onDrop={handleDrop}>
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
