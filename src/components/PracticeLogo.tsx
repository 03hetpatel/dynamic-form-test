import { useContext, useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";

interface StoredFileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  dataUrl: string;
}

const PracticeLogo: React.FC = () => {
  const { setStep, formData } = useContext(AppContext);
  const handleInputChange = useInputChange();

  // formData.logo might be a StoredFileData object rather than a File.
  const [selectedFile, setSelectedFile] = useState<
    File | StoredFileData | null
  >(formData.logo ?? null);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      // Read the file as a data URL so we can store it
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Store an object with both file meta and base64 data
        const fileData: StoredFileData = {
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

    let base64File = "";
    // Check if selectedFile is a File (Blob) or our stored object.
    if (selectedFile instanceof File) {
      // If it's a File, use FileReader to get the data URL.
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]); // Extract base64 content
          } else {
            reject("Failed to read file as data URL");
          }
        };
        reader.onerror = reject;
      });
    } else if ("dataUrl" in selectedFile) {
      // If it's our stored file data, extract base64 content directly.
      base64File = selectedFile.dataUrl.split(",")[1];
    } else {
      alert("Invalid file object");
      return;
    }

    const requestBody = {
      filename: typeof selectedFile === "object" ? selectedFile.name : "",
      mimetype: typeof selectedFile === "object" ? selectedFile.type : "",
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
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Upload your Practice Logo" />
        <div className="mb-5">
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
                <div>
                  {selectedFile
                    ? "name" in selectedFile
                      ? selectedFile.name
                      : ""
                    : "No file selected"}
                </div>
              </div>
            </div>
          </Dropzone>
        </div>
        <button onClick={handleUpload}>Upload</button>
      </div>
      <Footer
        handleNextStep={() => setStep(3)}
        handlePreviousStep={() => setStep(1)}
      />
    </div>
  );
};

export default PracticeLogo;
