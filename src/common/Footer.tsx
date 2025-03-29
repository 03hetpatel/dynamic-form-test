import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { totalSteps } from "../hooks/useGetComponent";
import { loadStripe } from "@stripe/stripe-js";

interface IFooterProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const Footer = ({ handleNextStep, handlePreviousStep }: IFooterProps) => {
  const [loading, setLoading] = useState(false);
  const { step } = useContext(AppContext);

  useEffect(() => {
    setLoading(false);
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setLoading(false);
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  

  const testPublicKey = import.meta.env.VITE_PUBLIC_KEY;
  const testPriceId = import.meta.env.VITE_PRICE_ID;
  // const livePublicKey =
  //   "pk_live_51NJjPpD341iGIhAdQaGd2KMeGgaND4NynhvX8XezEwvGskZIEa3381zHJRfBBK9cYyoV6YN3XBAqanS6KFBtp4KU00U27Ple54";
  // const livePriceId = "price_1QzxPuD341iGIhAddqXu6mEN";

  const stripePromise = loadStripe(testPublicKey);

  const handleStripeCheckout = async () => {
    sessionStorage.setItem("isSuccess", "true");
    setLoading(true);
    const stripe = await stripePromise;

    if (!stripe) {
      alert("Stripe failed to load.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: testPriceId, quantity: 1 }],
        mode: "payment",
        successUrl: window.location.origin + "/payment-success",
        cancelUrl: window.location.origin + "/cancel",
      });
      setLoading(false);
      if (error) {
        console.error("Stripe error:", error);
        alert("Payment failed. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-b-md text-white mb-5 w-full pb-3 font-semibold flex justify-between px-5">
        <div>
          {step !== 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex items-center gap-1 cursor-pointer jiggle-left bg-[#4FB4A5] px-3 sm:px-7 rounded-xl py-3"
            >
              <FaArrowLeft className="mt-0.5 mx-1 arrow-left" />
              <div className="tracking-widest text-sm font-bold sm:text-lg">
                PREVIOUS
              </div>
            </button>
          )}
        </div>

        <div>
          {step !== totalSteps + 1 && step !== 10 && step !== 16 && (
            <button
              onClick={
                step === totalSteps ? handleStripeCheckout : handleNextStep
              }
              disabled={loading}
              className={`flex bg-[#4FB4A5]  px-3 sm:px-7 rounded-xl py-3 items-center gap-1 cursor-pointer jiggle-right ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="tracking-widest text-sm font-bold sm:text-lg">
                {loading ? "Loading..." : step === totalSteps ? "NEXT" : "NEXT"}
              </div>
              {!loading && <FaArrowRight className="mt-0.5 mx-1 arrow-right" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
