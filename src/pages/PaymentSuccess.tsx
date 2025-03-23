import { useContext, useEffect, useRef } from "react";
import AppContext from "../context/AppContext";

const PaymentSuccess = () => {
  const { formData, setFormData } = useContext(AppContext);

  const sendData = async () => {
    const scriptURL = import.meta.env.VITE_SCRIPT_URI;

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // Prevents CORS errors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      sessionStorage.setItem("isSuccess", "false");
      sessionStorage.setItem("step", "1");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
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
