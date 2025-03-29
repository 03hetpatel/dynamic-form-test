import { useContext } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";

const PricingModal = () => {
  const { setStep } = useContext(AppContext);
  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="BRITE Pricing Model" />
        <div>
          <div className="max-h-[calc(100vh-450px)] overflow-auto pr-3 mb-5">
            <div className="p-3 rounded container-card my-5 space-y-5">
              <div className="bg-[#e5e7ea] p-5 space-y-2 max-w-[900px] mx-auto">
                <div className="text-xl font-semibold">
                  Hormone Subscription Pricing
                </div>
                <div>
                  BRITE operates on a subscription-based model for hormone
                  therapy. Your practice is charged a monthly or annual
                  subscription, based on the number of hormones prescribed to
                  patients — not per order.
                </div>
                <div>
                  Please refer to the BRITE Hormone Pricing Chart below for
                  details.
                </div>
              </div>
              <div className="bg-[#e5e7ea] p-5 space-y-5 max-w-[550px] mx-auto">
                <div className="text-2xl font-semibold text-center">
                  Pricing for BRITE Subscription for Women (Any Hormone
                  Combination)
                </div>
                <div className="grid grid-cols-3 justify-center text-center">
                  <div>
                    <div className="font-bold text-lg">Count</div>
                    <div>1 hormone</div>
                    <div>2 hormones</div>
                    <div>3 hormones</div>
                    <div>4 hormones</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Monthly</div>
                    <div>$46</div>
                    <div>$74</div>
                    <div>$111</div>
                    <div>$124</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Annual (10% off)</div>
                    <div>$496.80</div>
                    <div>$799.20</div>
                    <div>$1198.80</div>
                    <div>$1339.20</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#e5e7ea] p-5 space-y-5 max-w-[550px] mx-auto">
                <div className="text-2xl font-semibold text-center">
                  Pricing for BRITE Subscription for Men
                </div>
                <div className="text-sm">
                  The subscription pricing for men includes PDE5 inhibitors
                  (Tadalafil/Sildenafil) when prescribed alongside
                  testosterone—so there’s no additional charge. However, if the
                  male patient is not on a hormone subscription and you
                  prescribe only a PDE5 inhibitor, it will be billed separately
                  as an individual medication.
                </div>
                <div className="grid grid-cols-3 justify-center text-center">
                  <div>
                    <div className="font-bold text-lg">Hormone</div>
                    <div>Hormone</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Monthly</div>
                    <div>$83</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Annual (10% off)</div>
                    <div>$896.40</div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Footer
        handleNextStep={() => {}}
        handlePreviousStep={() => {
          setStep(11);
        }}
      />
    </div>
  );
};

export default PricingModal;
