import { useContext, useEffect, useState, useRef } from "react";
import { Button, TextInput, MultiSelect } from "@mantine/core";
import Heading from "../common/Heading";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import { ILocationDetails } from "./MultipleLocations";
import { showToast } from "../common/toast";

interface IMember {
  staffName: string;
  email: string;
  roles: string[]; // Changed from `role: string`
  primaryDuties: string;
  selectedLocations: string[];
  selectedFullLocations: ILocationDetails[];
}

const AdditionalMembers = () => {
  const { setStep, formData, setFormData } = useContext(AppContext);
  const members = formData?.members || [];
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const lastMemberRef = useRef<HTMLDivElement | null>(null);

  const locationOptions = (
    (formData.locations as ILocationDetails[]) || []
  ).map((location) => ({
    value: location?.locationIdentifier,
    label: location?.streetAddress,
  }));

  const addNewMember = () => {
    const newMember: IMember = {
      staffName: "",
      email: "",
      roles: [],
      primaryDuties: "",
      selectedLocations: [],
      selectedFullLocations: [],
    };
    setFormData({ ...formData, members: [...members, newMember] });

    setTimeout(() => {
      lastMemberRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeMember = (index: number) => {
    const updatedMembers = (members as IMember[]).filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  const handleMemberChange = (index: number, field: string, value: any) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };

    if (field === "selectedLocations") {
      updatedMembers[index].selectedFullLocations = value.map(
        (selectedLocation: string) =>
          formData.locations.find(
            (location: any) => location.locationIdentifier === selectedLocation
          )
      );
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  const handleNextStep = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let firstErrorShown = false;

    (members as IMember[]).forEach((member, index) => {
      const memberErrors: Record<string, string> = {};

      // Validate Staff Name
      if (!member.staffName.trim()) {
        memberErrors.staffName = "Full name is required.";
        if (!firstErrorShown) {
          showToast(
            `Enter the team member's name for Team Member ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      } else if (member.staffName.length < 3) {
        memberErrors.staffName = "Full name must be at least 3 letters long.";
        if (!firstErrorShown) {
          showToast(
            `Full name must be at least 3 letters long for Team Member ${
              index + 1
            }`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/;

      // Validate Email
      if (!member.email.trim()) {
        memberErrors.email = "Email address is required.";
        if (!firstErrorShown) {
          showToast(
            `Enter the team member's email for Team Member ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      } else if (!emailRegex.test(member.email)) {
        memberErrors.email = "Enter a valid email address.";
        if (!firstErrorShown) {
          showToast(
            `Enter a valid email address for Team Member ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      // Validate Roles
      if (!member.roles.length) {
        memberErrors.roles = "Select the permissions in the hub.";
        if (!firstErrorShown) {
          showToast(
            `Select the permissions in the hub for Team Member ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      // Validate Primary Duties
      if (!member.primaryDuties.trim()) {
        memberErrors.primaryDuties = "Enter the primary duties.";
        if (!firstErrorShown) {
          showToast(
            `Enter the team member's primary duties for Team Member ${
              index + 1
            }`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      // Validate Selected Locations
      if (!member.selectedLocations?.length) {
        memberErrors.selectedLocations = "Select the location(s)";
        if (!firstErrorShown) {
          showToast(
            `Select the location(s) for Team Member ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      if (Object.keys(memberErrors).length) newErrors[index] = memberErrors;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(17);
    }
  };

  useEffect(() => {
    if (members.length === 0) addNewMember();
  }, []);

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Operation Hub: Team Member Access" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Since you selected 'I have team members', enter the details of your
          team members who will need access to the Operations Hub. Click '+ Add
          More Member(s)' to include additional team members as needed.
        </div>
        <div className="max-h-[calc(100vh-450px)] overflow-auto pr-3">
          {(members as IMember[]).map((member, index) => (
            <div
              key={index}
              className="p-3 rounded-md my-5 container-card"
              ref={index === members.length - 1 ? lastMemberRef : null}
            >
              <div className="grid max-[450px]:grid-cols-1 max-[600px]:grid-cols-2 grid-cols-3 gap-5">
                <TextInput
                  label="Team Member's Name"
                  value={member.staffName}
                  placeholder="e.g., John Doe"
                  error={errors[index]?.staffName}
                  onChange={(e) =>
                    handleMemberChange(index, "staffName", e.target.value)
                  }
                />
                <TextInput
                  label="Team Member's Email"
                  value={member.email}
                  error={errors[index]?.email}
                  placeholder="e.g.,  johndoe@primeivhydration.com"
                  onChange={(e) =>
                    handleMemberChange(index, "email", e.target.value)
                  }
                />
                <TextInput
                  label="Team Member's Primary Duties"
                  value={member.primaryDuties}
                  error={errors[index]?.primaryDuties}
                  placeholder="e.g., Assisting Patients, etc."
                  onChange={(e) =>
                    handleMemberChange(index, "primaryDuties", e.target.value)
                  }
                />
              </div>
              <div className="grid max-[450px]:grid-cols-1 grid-cols-2 gap-5 mt-5">
                <MultiSelect
                  label="Permissions in HUB (Select One or More)"
                  data={["Assistant", "Finance", "Analyst"]}
                  value={member.roles} // Updated from `member.role`
                  placeholder={
                    member?.roles?.length
                      ? ""
                      : "Click to select the permission(s)"
                  }
                  error={errors[index]?.roles}
                  onChange={(selectedRoles) =>
                    handleMemberChange(index, "roles", selectedRoles)
                  }
                />

                <MultiSelect
                  label="Location(s)"
                  data={locationOptions}
                  value={member.selectedLocations}
                  error={errors[index]?.selectedLocations}
                  placeholder={
                    member?.selectedLocations?.length
                      ? ""
                      : "Click to select the location(s)"
                  }
                  onChange={(selectedValues) =>
                    handleMemberChange(
                      index,
                      "selectedLocations",
                      selectedValues
                    )
                  }
                />
              </div>
              {members.length > 1 && (
                <div className="flex justify-end w-full">
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    className="mt-3 !bg-red-500 !text-white"
                    onClick={() => removeMember(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          className="!px-10 add-button !text-lg !h-[52px] !mb-5 max-[450px]:!px-5 mt-5 max-[450px]:!text-sm max-[450px]:!h-[40px]"
          onClick={addNewMember}
        >
          + Add More Member(s)
        </Button>
      </div>
      <Footer
        handleNextStep={handleNextStep}
        handlePreviousStep={() => setStep(15)}
      />
    </div>
  );
};

export default AdditionalMembers;
