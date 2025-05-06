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
        <div className="py-7 max-[450px]:!px-2 font-bold text-center text-3xl max-[450px]:text-xl text-[#d1d1d1]">
          Introduction to the Operations Hub
        </div>
        <div className="flex justify-center">
          <div style={{ padding: '50% 0 0 0', position: 'relative', width: '100%', maxWidth: '56rem' }}>
            <iframe
              src="https://player.vimeo.com/video/1043032001?h=48520cb991&badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Hormone Testing_ When Results Vary"
            ></iframe>
          </div>
        </div>
        <div
          style={{ background: '#e5e7ea' }}
          className="mx-auto mt-8 mb-8 px-6 py-4 rounded-md max-w-[62rem] w-full text-base text-black"
        >
          In the next step, we'll ask whether you have any additional team members who need access to the <b>Operations Hub</b>. If you choose <b>"Just me"</b>, you'll receive portal access yourself. If you select <b>"I have team members"</b>, you'll be able to add them on the following page. As mentioned in the video, you can assign one or more roles – <b>Assistant, Finance, or Analyst</b> and one or more location to each member.
        </div>
        <div className="flex items-center overflow-auto max-w-[62rem] px-6 mb-10">
          <input
            type="checkbox"
            id="checkbox"
            className="cursor-pointer mt-1"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <label htmlFor="checkbox" className="ml-2 cursor-pointer">
            I acknowledge that I have read and understand the purpose of the
            Operations Hub for managing my practice operations.
          </label>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          isChecked
            ? setStep(15)
            : showToast(
                "Please acknowledge that you have read and understand the purpose of the Operations Hub before proceeding",
                "error"
              );
        }}
        handlePreviousStep={() => setStep(13)}
      />
    </div>
  );
};

export default OperationHubMessage;
