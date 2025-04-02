import { useContext, useState, useEffect } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import useInputChange from "../hooks/useInputChange";

declare global {
  interface Window {
    gapi: any;
  }
}

// Google API Credentials (Replace with yours)
const API_KEY = "AIzaSyD-DJsLtcvxZjT_X3HvdTjYl-GXBZBCW9I";
const CLIENT_ID = "218742194724-841edggba85v3hd7k3la5aorbpbli7ik.apps.googleusercontent.com";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const PracticeLogo: React.FC = () => {
  const { setStep } = useContext(AppContext);
  const handleInputChange = useInputChange();
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  // Load Google API Script
  useEffect(() => {
    const loadGapiScript = () => {
      if (!window.gapi) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.onload = () => {
          console.log("Google API script loaded.");
          window.gapi.load("client:auth2", async () => {
            try {
              await window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
              });
  
              console.log("Google API client initialized.");
              setGapiLoaded(true);
  
              const authInstance = window.gapi.auth2.getAuthInstance();
              console.log(authInstance,'========authInstance========')
              if (authInstance) {
                const isSignedIn = authInstance.isSignedIn.get();
                console.log(isSignedIn,'======isSignedIn====')
                setAuthLoaded(isSignedIn);
                console.log("User is signed in:", isSignedIn);
                authInstance.isSignedIn.listen(setAuthLoaded);
              } else {
                console.error("Google Auth instance not found.");
              }
            } catch (error) {
              console.error("Error initializing Google API:", error);
            }
          });
        };
        document.body.appendChild(script);
      }
    };
  
    loadGapiScript();
  }, []);
  

  // Upload File to Google Drive
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    if (!gapiLoaded || !authLoaded) {
      alert("Google API not fully loaded. Try again later.");
      return;
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    const accessToken = window.gapi.auth.getToken().access_token;
    const metadata = {
      name: selectedFile.name,
      mimeType: selectedFile.type,
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
        body: formData,
      });

      const data = await response.json();
      if (data.id) {
        const fileLink = `https://drive.google.com/file/d/${data.id}/view`;
        setUploadedFileUrl(fileLink);
        alert("File uploaded successfully! " + fileLink);
      } else {
        alert("Upload failed! Try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
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
                  <div className="text-[#666666] text-xl font-bold">Drag and drop files here</div>
                  <div className="text-sm text-[#666666] font-bold">Max File Size: 10.6MB</div>
                </div>
              </div>
              <div>
                <Button color="#45bda6" variant="outline" className="!text-lg !px-22 max-sm:!px-10 !h-12">
                  Browse Files
                </Button>
                <div>{selectedFile?.name || "No file selected"}</div>
              </div>
            </div>
          </Dropzone>
        </div>

        {selectedFile && (
          <Button
            color="green"
            className="!text-lg !h-12"
            onClick={handleUpload}
            disabled={!authLoaded}
          >
            Upload to Google Drive
          </Button>
        )}

        {uploadedFileUrl && (
          <div className="mt-5">
            <p>File Uploaded Successfully:</p>
            <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              View Uploaded File
            </a>
          </div>
        )}
      </div>
      <Footer
        handleNextStep={() => {
          setStep(3);
        }}
        handlePreviousStep={() => {
          setStep(1);
        }}
      />
    </div>
  );
};

export default PracticeLogo;
