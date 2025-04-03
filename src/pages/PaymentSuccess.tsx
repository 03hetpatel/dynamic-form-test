import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { Loader } from "@mantine/core";

const PaymentSuccess = () => {
  const { formData, setFormData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Function to handle file upload
  const handleUpload = async (): Promise<string | undefined> => {
    const selectedFile = formData.logo; // logo should be our stored file data object
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    let base64File = "";
    // Check if selectedFile is a File (Blob) or our stored object.
    if (selectedFile instanceof File) {
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
      base64File = selectedFile.dataUrl.split(",")[1];
    } else {
      alert("Invalid file object");
      return;
    }

    const requestBody = {
      filename: selectedFile.name || "",
      mimetype: selectedFile.type || "",
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

  useEffect(() => {
    // Read the success flag from session storage
    // If payment was successful, send the form data.
    const sendData = async () => {
      const scriptURL = import.meta.env.VITE_SCRIPT_URI; // your Apps Script URL
      try {
        const fileUrl = await handleUpload();
        console.log(fileUrl, "===fileUrl");
        if (!fileUrl) return;
        const updatedFormData = { ...formData, logo: fileUrl };
        console.log("Updated Form Data:", updatedFormData);
        await fetch(scriptURL, {
          method: "POST",
          mode: "no-cors", // Using no-cors because of Apps Script restrictions
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        });
        // Mark success as handled and redirect if needed.
        sessionStorage.setItem("isSuccess", "false");
        sessionStorage.setItem("step", "1");
        setFormData({});
        sessionStorage.clear();
        window.location.href = "/success"; // Redirect to a confirmation page
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form.");
      } finally {
        setLoading(false);
      }

      sendData();
    };
  }, [formData, setFormData]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader color="#45bda6" size="xl" type="dots" />
      </div>
    );
  }

  return (
    <div>
      <img
        className="h-screen w-full object-cover max-[700px]:hidden"
        src="./payment_success_desktop.jpg"
        alt="Payment Success Desktop"
      />
      <img
        className="h-screen w-full object-cover min-[700px]:hidden"
        src="./payment_success_mobile.jpg"
        alt="Payment Success Mobile"
      />
    </div>
  );
};

export default PaymentSuccess;
