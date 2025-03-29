import { useContext } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";

const PracticeLogo = () => {
  const { setStep } = useContext(AppContext);

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Upload your Practice Logo" />
        <div className="mb-5">
          <Dropzone onDrop={() => {}}>
            <div className="md:flex grid items-center justify-between gap-5 py-5">
              <div className="flex items-center gap-3">
                <AiOutlineCloudUpload size={60} className="text-[#45bda6]" />
                <div>
                  <div className="text-[#666666] text-xl font-bold">
                    Drag and drop files here
                  </div>
                  <div className="text-sm text-[#666666] font-bold">
                    Max File Size: 10.6MB
                  </div>
                </div>
              </div>
              <div>
                <Button
                  color="#45bda6"
                  variant="outline"
                  className="!text-lg !px-22 max-sm:!px-10 !h-12"
                >
                  Browse Files
                </Button>
              </div>
            </div>
          </Dropzone>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          setStep(3);
        }}
        handlePreviousStep={() => {
          setStep(1);
        }}
      />
    </div>
  );
};

export default PracticeLogo;
