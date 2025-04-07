import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { Button, TextInput } from "@mantine/core";
import Footer from "../common/Footer";
import { showToast } from "../common/toast";

interface IOwnerDetails {
  fullName: string;
  email: string;
  phone: string;
}

const AdditionalOwner = () => {
  const { formData, setFormData, setStep } = useContext(AppContext);
  const owners = formData?.owners || [];
  const [errors, setErrors] = useState<Record<number, Partial<IOwnerDetails>>>(
    {}
  );
  const ownerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addNewOwner = () => {
    const newOwner: IOwnerDetails = { fullName: "", email: "", phone: "" };
    setFormData({ ...formData, owners: [...owners, newOwner] });

    setTimeout(() => {
      const lastIndex = owners.length;
      ownerRefs.current[lastIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeOwner = (index: number) => {
    const updatedOwners = (owners as IOwnerDetails[]).filter(
      (_owner, i) => i !== index
    );
    setFormData({ ...formData, owners: updatedOwners });

    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  const handleOwnerChange = (
    index: number,
    field: keyof IOwnerDetails,
    value: string
  ) => {
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10); // Remove non-digits, limit to 10 digits
      if (value.length >= 7) {
        value = `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 4) {
        value = `(${value.slice(0, 3)})-${value.slice(3)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }

    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setFormData({ ...formData, owners: updatedOwners });
    validateField(index, field, value);
  };

  const validateField = (
    index: number,
    field: keyof IOwnerDetails,
    value: string
  ) => {
    let error = "";

    if (!value.trim()) {
      error =
        field === "fullName"
          ? "Full name is required."
          : field === "email"
          ? "Email address is required."
          : "Enter a valid phone number.";
    } else if (
      field === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/.test(value)
    ) {
      error = "Enter a valid email address.";
    } else if (field === "phone") {
      const cleanedPhone = value.replace(/\D/g, "");
      if (cleanedPhone.length !== 10) {
        error = "Phone number must be 10 digits.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [field]: error },
    }));
  };

  const handleNext = () => {
    let isValid = true;
    const newErrors: Record<number, Partial<IOwnerDetails>> = {};
    let firstErrorShown = false;

    (owners as IOwnerDetails[]).forEach((owner, index) => {
      Object.keys(owner).forEach((key) => {
        const field = key as keyof IOwnerDetails;
        const value = owner[field].trim();
        let error = "";

        // Full Name Validation
        if (field === "fullName") {
          if (!value) {
            error = "Full name is required.";
          } else if (value.length < 3) {
            error = "Full name must be at least 3 characters long.";
          }
        }

        // Email Validation
        else if (
          field === "email" &&
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/.test(value)
        ) {
          error = value
            ? "Enter a valid email address."
            : "Email address is required.";
        }

        // Phone Number Validation
        else if (field === "phone") {
          const cleanedPhone = value.replace(/\D/g, "");
          if (!cleanedPhone) {
            error = "Enter a valid phone number.";
          } else if (cleanedPhone.length !== 10) {
            error = "Phone number must be 10 digits.";
          }
        } else if (formData?.email === value) {
          error = "Owner email cannot be same as practice email.";
        }

        if (error) {
          isValid = false;
          newErrors[index] = { ...newErrors[index], [field]: error };

          if (!firstErrorShown) {
            showToast(
              `${error.endsWith(".") ? error.slice(0, -1) : error} for Owner ${
                index + 1
              }.`,
              "error"
            );

            firstErrorShown = true;
          }
        }
      });
    });

    setErrors(newErrors);
    if (isValid) setStep(9);
  };

  useEffect(() => {
    if (owners.length === 0) {
      addNewOwner();
    }
  }, []);

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Additional Practice Owner(s) Information" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Since you selected 'More Than One Owner,' please enter the second
          owner's details below. If there are additional owners, click '+ Add
          More Practice Owner(s)' to include them.
        </div>
        <div className="max-h-[calc(100vh-450px)] overflow-auto pr-3">
          {(owners as IOwnerDetails[]).map((owner, index) => (
            <div
              key={index}
              ref={(el) => {
                ownerRefs.current[index] = el;
              }}
              className="my-3"
            >
              <div className="grid container-card sm:grid-cols-[1fr_1fr_1fr_50px] items-center gap-x-2 w-full">
                {Object.keys(owner).map((key) => {
                  const field = key as keyof IOwnerDetails;
                  return (
                    <div key={field} className="w-full ">
                      <TextInput
                        label={field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        value={owner[field]}
                        className="w-full"
                        placeholder={
                          field === "fullName"
                            ? "e.g., Ben N. Cloth"
                            : field === "email"
                            ? "e.g., whostolemypants@nomorelaundry.toon"
                            : field === "phone"
                            ? "(XXX)-XXX-XXXX"
                            : ""
                        }
                        onChange={(e) =>
                          handleOwnerChange(index, field, e.target.value)
                        }
                        error={errors[index]?.[field]}
                      />
                    </div>
                  );
                })}
                {owners.length > 1 && (
                  <div className="flex justify-end w-full">
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      className="mt-8 !bg-red-500 !text-white"
                      onClick={() => removeOwner(index)}
                    >
                      <span className="sm:hidden">Remove</span>
                      <span className="hidden sm:inline bg-red-500 text-white">
                        X
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          className="sm:!px-10 !text-lg !h-[52px] !mb-5 mt-5 add-button"
          onClick={addNewOwner}
        >
          + Add More Franchise Owner(s)
        </Button>
      </div>
      <Footer
        handleNextStep={handleNext}
        handlePreviousStep={() => setStep(7)}
      />
    </div>
  );
};

export default AdditionalOwner;
