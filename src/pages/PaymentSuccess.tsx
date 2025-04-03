import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";

const PaymentSuccess = () => {
  const { formData, setFormData } = useContext(AppContext);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const selectedFile = formData.logo;
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
          setFileUrl(data.fileUrl);
          alert("File uploaded successfully!");
        } catch (error: any) {
          console.error("Upload error:", error);
          alert("Upload failed: " + error.message);
        }
      }
    };
  };

  const sendData = async () => {
    const scriptURL = import.meta.env.VITE_SCRIPT_URI;
    setLoading(true);
    try {
      await handleUpload(); // Call the upload function before sending data
      const updatedFormData = { ...formData, logo: fileUrl };
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

  return !isSuccess || isSuccess === "false" ? (
    <div>Wait...</div>
  ) : loading ? (
    <div>Loading</div>
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
  );
};

export default PaymentSuccess;
