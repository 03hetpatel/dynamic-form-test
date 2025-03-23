import { useContext, useState } from "react";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import { showToast } from "../common/toast";

const OperationHubMessage = () => {
  const { setStep } = useContext(AppContext);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container-home bg-main">
      <div className="max-h-[calc(100vh-150px)] max-[450px]:max-h-[calc(100vh-250px)] overflow-auto pr-3">
        <div className="p-10 py-7 max-[450px]:!px-2 font-bold text-center text-3xl max-[450px]:text-xl">
          Introduction to the Operations Hub
        </div>
        <div className="max-h-[calc(100vh-450px)] overflow-auto rounded-md space-y-2 max-[450px]:px-5 px-10 mb-10">
          <div>
            The Operations Hub is your practice’s all-in-one portal (its
            separate from provider portal) for managing daily operations
            including:
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-white p-1.5 rounded-full" />
              Administrative tasks
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-white p-1.5 rounded-full" />
              Patient management
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-white p-1.5 rounded-full" />
              Financial tracking
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-white p-1.5 rounded-full" />
              Support & Queries
            </div>
          </div>
          <div>
            As the practice owner(s), you will automatically receive full
            access, including all roles and all locations under your practice.
          </div>
          <div>
            If you have additional team members, such as assistants or
            accountants, you can grant them specific access according to their
            roles. Each team member can be assigned the roles of Assistant,
            Finance, and/or Analyst and can be provided access to specific
            practice locations as needed.
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="checkbox"
              className="cursor-pointer mt-1"
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
              }}
            />
            <label htmlFor="checkbox" className="ml-2 mt-1 cursor-pointer">
              I acknowledge that I have read and understand the purpose of the
              Operations Hub for managing my practice operations.
            </label>
          </div>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          isChecked
            ? setStep(10)
            : showToast(
                "Please acknowledge that you have read and understand the purpose of the Operations Hub before proceeding",
                "error"
              );
        }}
        handlePreviousStep={() => setStep(8)}
      />
    </div>
  );
};

export default OperationHubMessage;
