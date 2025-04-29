import { useContext, useState } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";
import { showToast } from "../common/toast";

const Hormone = () => {
  const { setStep } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleInputChange = useInputChange();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    handleInputChange("hormone", option);
    setStep(14);
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="In addition to hormones, what will your practice pay for?" />
        <div className="text-base max-[450px]:text-sm text-center pb-3 text-color">
          This will set your default shipping preference (Practice or Patients).
          A new feature is coming soon that will let you update this default or
          change it per order—but for now, your selection will be saved as
          permanent.
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleOptionSelect("Shipping Only")}
            className={`!px-2 sm:!px-5 ${
              selectedOption === "Shipping Only"
                ? "!bg-[#45bda6] !text-black"
                : ""
            } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
            Shipping Only
          </button>
          <button
            onClick={() => {
              handleOptionSelect("Other Medications Only");
            }}
            className={`!px-2 sm:!px-5 ${
              selectedOption === "Other Medications Only"
                ? "!bg-[#45bda6] !text-black"
                : ""
            } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
            Other Medications Only
          </button>
          <button
            onClick={() => {
              handleOptionSelect("Both Medications & Shipping");
            }}
            className={`!px-2 sm:!px-5 ${
              selectedOption === "Both Medications & Shipping"
                ? "!bg-[#45bda6] !text-black"
                : ""
            } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
            Both Medications & Shipping
          </button>
          <button
            onClick={() => {
              handleOptionSelect("Neither (Patient Pays for Everything)");
            }}
            className={`!px-2 sm:!px-5 ${
              selectedOption === "Neither (Patient Pays for Everything)"
                ? "!bg-[#45bda6] !text-black"
                : ""
            } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
            Neither (Patient pays for both shipping and other medications)
          </button>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          if (!selectedOption) {
            showToast("Please select an option before proceeding.", "error");
            return;
          }
          setStep(14);
        }}
        handlePreviousStep={() => setStep(12)}
      />
    </div>
  );
};

export default Hormone;
