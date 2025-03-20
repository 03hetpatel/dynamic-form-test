import { TextInput } from "@mantine/core";
import Heading from "../common/Heading";
import useInputChange from "../hooks/useInputChange";
import AppContext from "../context/AppContext";
import { useContext } from "react";
import Footer from "../common/Footer";
import useValidation from "../hooks/useValidation";

const FullName = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  const validationRules = {
    fullName: {
      required: true,
      message: "Full name is required.",
      pattern: {
        value: /^[A-Za-z\s]{3,}$/, // Ensures at least 3 letters (including spaces)
        message: "Full name must be at least 3 letters long.",
      },
    },
  };
  
  const { errors, validateFields, clearError } = useValidation(validationRules);

  const handleNextStep = () => {
    if (validateFields(formData)) {
      setStep(2);
    }
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Franchise Owner's Full Name" />
        <div className="mb-5">
          <TextInput
            value={formData?.fullName}
            error={errors?.fullName}
            placeholder="e.g., John Doe"
            onChange={(e) => {
              handleInputChange("fullName", e.target.value);
              clearError("fullName");
            }}
          />
        </div>
      </div>
      <Footer handleNextStep={handleNextStep} handlePreviousStep={() => {}} />
    </div>
  );
};

export default FullName;
