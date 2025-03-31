import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { IProvider } from "./MultipleProvider";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_MAPS_API_KEY, ILocationDetails } from "./MultipleLocations";
import { stateData } from "../common/common.utils";
import { showToast } from "../common/toast";

// BRITE Demonstration Kits
// - Select the provider.
// - Select/Add the shipping location.

interface IKitData {
  shippingProvider: string;
  shippingLocation: string;
}

interface IKitEntryErrors {
  shippingProvider?: string;
  shippingLocation?: string;
}

const Kits = () => {
  const { setStep, formData, setFormData } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationObj, setNewLocationObj] = useState<ILocationDetails | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [shippingLocation, setShippingLocation] = useState<string[]>([]);
  // Initialize kitEntries from formData.kits if exists, else default to one empty entry.
  const [kitEntries, setKitEntries] = useState<IKitData[]>(() => {
    return formData?.kits &&
      Array.isArray(formData.kits) &&
      formData.kits.length > 0
      ? formData.kits
      : formData?.providers?.length > 0
      ? formData.providers.map((provider: IProvider) => ({
          shippingProvider: provider?.providerFullName,
          shippingLocation: "",
        }))
      : [{ shippingProvider: "", shippingLocation: "" }];
  });
  const [kitEntryErrors, setKitEntryErrors] = useState<IKitEntryErrors[]>([{}]);
  // Store the index of the kit entry that triggers the modal
  const [modalTriggeredIndex, setModalTriggeredIndex] = useState<number | null>(
    null
  );

  // Ref for the container that holds the kit entries.
  const kitEntriesContainerRef = useRef<HTMLDivElement>(null);
  // Ref to keep track of the previous kitEntries length
  const prevKitEntriesLength = useRef<number>(kitEntries.length);

  // Whenever kitEntries changes, update formData
  useEffect(() => {
    setFormData((prev: any) => ({ ...prev, kits: kitEntries }));
  }, [kitEntries]);

  // Also, if formData.kits changes externally (e.g., coming back to this step), update kitEntries.
  useEffect(() => {
    if (
      formData?.kits &&
      Array.isArray(formData.kits) &&
      formData.kits.length > 0
    ) {
      setKitEntries(formData.kits);
    }
  }, [formData?.kits]);

  useEffect(() => {
    // Get addresses from shippingFullLocations (if available)
    const shippingFull = Array.isArray(formData?.shippingFullLocations)
      ? formData.shippingFullLocations.map(
          (location: ILocationDetails) => location?.streetAddress || ""
        )
      : [];
    // Get addresses from locations (if available)
    const locationAddresses = Array.isArray(formData?.locations)
      ? formData.locations.map(
          (location: ILocationDetails) => location?.streetAddress || ""
        )
      : [];

    // Merge both arrays
    const combinedAddresses = [...shippingFull, ...locationAddresses];

    // Remove duplicates using a Set and filter out any empty strings
    const uniqueAddresses = Array.from(new Set(combinedAddresses)).filter(
      (address) => address !== ""
    );

    setShippingLocation(uniqueAddresses);
  }, [formData?.shippingFullLocations, formData?.locations]);

  // When kitEntries length increases, scroll the container to the bottom smoothly
  useEffect(() => {
    if (kitEntries.length > prevKitEntriesLength.current) {
      if (kitEntriesContainerRef.current) {
        kitEntriesContainerRef.current.scrollTo({
          top: kitEntriesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
    prevKitEntriesLength.current = kitEntries.length;
  }, [kitEntries]);

  const kitProviderOptions = ((formData.providers as IProvider[]) || []).map(
    (provider) => ({
      value: provider?.providerFullName,
      label: provider?.providerFullName,
    })
  );

  const handleAddressSelect = (place: any) => {
    const addressComponents = place.address_components;
    let streetAddress = "";
    let city = "";
    let state = "";
    let zipCode = "";
    addressComponents.forEach((component: any) => {
      if (component.types.includes("street_number")) {
        streetAddress = component.long_name;
      }
      if (component.types.includes("route")) {
        streetAddress += ` ${component.long_name}`;
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        zipCode = component.long_name;
      }
    });
    const newLocation = {
      locationName: "",
      locationIdentifier: "",
      streetAddress,
      city,
      state,
      zipCode,
    };
    setNewLocationObj(newLocation);
  };

  const handleLocalInputChange = (field: string, value: any) => {
    setNewLocationObj({
      ...newLocationObj,
      [field]: value,
    } as ILocationDetails);
  };

  const handleKitEntryChange = (
    index: number,
    field: keyof IKitData,
    value: string | null
  ) => {
    if (
      field === "shippingLocation" &&
      value === "Ship to a Different Address (Click to Enter)"
    ) {
      setIsModalOpen(true);
      setModalTriggeredIndex(index);
      return;
    }
    const newEntries = [...kitEntries];
    newEntries[index] = { ...newEntries[index], [field]: value || "" };
    setKitEntries(newEntries);

    const newErrors = [...kitEntryErrors];
    if (!value) {
      newErrors[index] = {
        ...newErrors[index],
        [field]:
          field === "shippingProvider"
            ? "Select the provider."
            : "Select/Add the shipping location.",
      };
    } else {
      if (newErrors[index]) {
        delete newErrors[index][field];
      }
    }
    setKitEntryErrors(newErrors);
  };

  const handleRemoveKitEntry = (index: number) => {
    // Remove the entry and its corresponding errors
    const newEntries = [...kitEntries];
    newEntries.splice(index, 1);
    setKitEntries(newEntries);
    const newErrors = [...kitEntryErrors];
    newErrors.splice(index, 1);
    setKitEntryErrors(newErrors);
  };

  const handleAddNewLocation = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newLocationObj?.streetAddress)
      newErrors.streetAddress = "Street Address is required";
    if (!newLocationObj?.city) newErrors.city = "City is required";
    if (!newLocationObj?.state) newErrors.state = "State is required";
    if (!newLocationObj?.zipCode) newErrors.zipCode = "Zip Code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!newLocationObj?.streetAddress) {
      return;
    }
    if (shippingLocation.includes(newLocationObj?.streetAddress)) {
      showToast("Location already exists", "error");
      return;
    }

    if (formData.shippingFullLocations) {
      setFormData({
        ...formData,
        shippingFullLocations: [
          ...formData.shippingFullLocations,
          newLocationObj,
        ],
        shippingLocation: newLocationObj?.streetAddress,
      });
    } else {
      setFormData({
        ...formData,
        shippingFullLocations: [newLocationObj],
        shippingLocation: newLocationObj?.streetAddress,
      });
    }

    setShippingLocation([...shippingLocation, newLocationObj?.streetAddress]);

    if (modalTriggeredIndex !== null && newLocationObj?.streetAddress) {
      const updatedEntries = [...kitEntries];
      updatedEntries[modalTriggeredIndex] = {
        ...updatedEntries[modalTriggeredIndex],
        shippingLocation: newLocationObj.streetAddress,
      };
      setKitEntries(updatedEntries);
      const newKitErrors = [...kitEntryErrors];
      if (newKitErrors[modalTriggeredIndex]) {
        delete newKitErrors[modalTriggeredIndex].shippingLocation;
      }
      setKitEntryErrors(newKitErrors);
      setModalTriggeredIndex(null);
    }
    setIsModalOpen(false);
  };

  const handleAddKitEntry = () => {
    setKitEntries([
      ...kitEntries,
      { shippingProvider: "", shippingLocation: "" },
    ]);
    setKitEntryErrors([...kitEntryErrors, {}]);
  };

  const handleNext = () => {
    let hasError = false;
    let toastMessage = "";
    const newKitEntryErrors = kitEntries.map((entry, index) => {
      const entryError: IKitEntryErrors = {};
      if (!entry.shippingProvider) {
        // Error for select component remains plain text
        entryError.shippingProvider = "Select the provider.";
        // Toast message includes entry number
        if (!toastMessage) {
          toastMessage = `Select a provider for Entry ${index + 1}`;
        }
        hasError = true;
      }
      if (!entry.shippingLocation) {
        entryError.shippingLocation = "Select/Add the shipping location.";
        if (!toastMessage) {
          toastMessage = `Select/Add the shipping location for Entry ${
            index + 1
          }`;
        }
        hasError = true;
      }
      return entryError;
    });
    setKitEntryErrors(newKitEntryErrors);
    if (hasError) {
      if (toastMessage) {
        showToast(toastMessage, "error");
      }
      return;
    }
    // formData.kits is already updated via the useEffect on kitEntries
    setStep(12);
  };

  console.log(formData, "==formData");

  return (
    <div className="container-home bg-main">
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} opened={isModalOpen}>
          <div className="border border-gray-300 shadow-md p-3 rounded-md my-5">
            <div>
              <div className="mantine-TextInput-label font-semibold text-sm">
                Address Line 1
              </div>
              <Autocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place: any) => handleAddressSelect(place)}
                onChange={(e) => {
                  handleLocalInputChange("streetAddress", e);
                }}
                options={{
                  types: ["geocode"],
                  componentRestrictions: { country: "us" },
                }}
                className="w-full p-2 border mantine-TextInput-input border-gray-300 rounded"
                placeholder="e.g., 1313 Missing Sock Blvd"
              />
            </div>
            <TextInput
              label="Address Line 2 (Suite, Unit, etc.)"
              placeholder="e.g., Suite 200"
              value={newLocationObj?.streetAddressLine2}
              error={errors.streetAddressLine2}
              onChange={(e) => {
                handleLocalInputChange("streetAddressLine2", e.target.value);
              }}
            />
            <div className="grid max-[450px]:grid-cols-1 grid-cols-2 gap-x-5">
              <TextInput
                value={newLocationObj?.city}
                label="City"
                placeholder="e.g., Looneyburg"
                error={errors.city}
                onChange={(e) => {
                  handleLocalInputChange("city", e.target.value);
                }}
              />
              <Select
                label="State"
                value={newLocationObj?.state}
                error={errors.state}
                onChange={(e) => {
                  handleLocalInputChange("state", e);
                }}
                placeholder="e.g., Florida"
                data={stateData}
              />
            </div>
            <TextInput
              value={newLocationObj?.zipCode}
              label="Zip Code"
              placeholder="e.g., 86753"
              onChange={(e) => {
                handleLocalInputChange("zipCode", e.target.value);
              }}
              error={errors.zipCode}
            />
            <Button className="mt-5" onClick={handleAddNewLocation}>
              Add
            </Button>
          </div>
        </Modal>
      )}
      <div className="px-10 max-[450px]:px-3">
        <Heading text="BRITE Provider Demonstration Kits" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Add provider(s) and their shipping location for the BRITE Provider
          Kits. These kits, packaged in a BRITE shipping box, include a dose
          determination card and four non-active 'hormone' prescriptions:
          Bi-est, Progesterone, Testosterone/DHEA (for women), and Testosterone
          (for men). These are provided at no cost to you.
        </div>
        <div
          ref={kitEntriesContainerRef}
          className="max-h-[calc(100vh-525px)] overflow-auto pr-3"
        >
          {kitEntries.map((entry, index) => (
            <div key={index} className="p-3 rounded container-card my-5">
              <div
                className={`grid ${
                  kitEntries.length > 1
                    ? "sm:grid-cols-[1fr_1fr_70px]"
                    : "sm:grid-cols-2"
                } items-center gap-5 gap-y-2`}
              >
                <Select
                  label="Provider"
                  placeholder="Click to select the provider."
                  value={entry.shippingProvider}
                  onChange={(value) =>
                    handleKitEntryChange(index, "shippingProvider", value)
                  }
                  data={kitProviderOptions}
                  error={kitEntryErrors[index]?.shippingProvider}
                />
                <Select
                  label="Shipping Location"
                  placeholder="Click to select/add the shipping location."
                  value={entry.shippingLocation}
                  onChange={(value) =>
                    handleKitEntryChange(index, "shippingLocation", value)
                  }
                  data={[
                    ...shippingLocation,
                    "Ship to a Different Address (Click to Enter)",
                  ]}
                  error={kitEntryErrors[index]?.shippingLocation}
                />
                {kitEntries.length > 1 && (
                  <div className="text-right mt-2">
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      className="mt-2.5 !bg-red-500 !text-white"
                      onClick={() => handleRemoveKitEntry(index)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          className="!px-10 add-button !text-lg !h-[52px] !mb-5 max-[450px]:!px-5 mt-5 max-[450px]:!text-sm max-[450px]:!h-[40px]"
          onClick={handleAddKitEntry}
        >
          + Send Kits to Additional Provider(s)
        </Button>
      </div>
      <Footer
        handleNextStep={handleNext}
        handlePreviousStep={() => setStep(10)}
      />
    </div>
  );
};

export default Kits;
