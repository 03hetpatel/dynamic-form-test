import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import { Loader } from "@mantine/core";

const PaymentSuccess = () => {
  const { formData, setFormData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const selectedFile = formData.logo; // Assuming logo is the file input in formData
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
      return data.fileUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    }
  };
  const sendData = async () => {
    const scriptURL = import.meta.env.VITE_SCRIPT_URI;

    setLoading(true);
    try {
      const fileUrl = await handleUpload();
      const updatedFormData = { ...formData, logo: fileUrl };
      console.log(updatedFormData, "===updatedFormData===");
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // Prevents CORS errors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      sessionStorage.setItem("isSuccess", "false");
      sessionStorage.setItem("step", "1");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = sessionStorage.getItem("isSuccess");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!isSuccess || isSuccess === "false") {
      window.location.href = "/brite-pracice-onboarding";
      setFormData({});
      sessionStorage.clear();
    } else {
      sendData();
    }
  }, [isSuccess, setFormData, sendData]);

  return (
    <div>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Loader color="#45bda6" size="xl" type="dots" />
        </div>
      ) : (
        <div>
          <img
            className="h-screen w-full object-cover max-[700px]:hidden"
            src="./payment_success_desktop.jpg"
            alt=""
          />
          <img
            className="h-screen w-full object-cover min-[700px]:hidden"
            src="./payment_success_mobile.jpg"
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
