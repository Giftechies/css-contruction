"use client"
import React, { useState } from 'react'
import { useForm,FormProvider } from 'react-hook-form'
// import {PostCode,PostDetails,Skip,Cart,Extra} from "@/components/booking/steps"
import PostCode from "@/components/booking/steps/PostCode"
import Extra from "@/components/booking/steps/Extra"
import Cart from "@/components/booking/steps/Cart"
import PostDetails from "@/components/booking/steps/PostDetails"
import Skip from "@/components/booking/steps/Skip"
import   ProgressBar      from "./ProgressBar"
import SectionSubTitle from '../shared/SectionSubTitle'
import { useRouter } from 'next/navigation'


const BoonkingOnline = () => {
    
// 🟢 Default form values
const defaultValues = {
  postcodeArea: "",
  fullPostcode: "",
  deliveryDate: "",
  permitOnHighway: false,
  jobType: "",
  skipSize: [],
  extras: [],
  cart: [],
  customer: {
    name: "",
    phone: "",
    email: "",
    address: "",
  },
};

const {register,handleSubmit} = useForm()

const navigate = useRouter()


const methods = useForm({ defaultValues });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Postcode", component: <PostCode /> },
    { title: "Details", component: <PostDetails /> },
    { title: "Skip Size", component: <Skip goToNextStep={() => setCurrentStep(currentStep + 1)} /> },
    { title: "Extras", component: <Extra /> },
    { title: "Cart", component: <Cart /> },
    // { title: "Checkout", component: <Step6_Checkout /> },
  ];
  const nextStep = async () => {
    // Validate current step before moving forward
    const isValid = await methods.trigger(); // for now: validate all fields
    // if(jobType)
    const type = methods.watch("jobType");
    if (type === "collection") {
    console.log("Redirecting to collection page:", type);
    navigate.push("/collection"); // <-- redirects user
    return; // stop further steps
  }
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {  
      setCurrentStep((s) => s - 1);
    }
  };

const onSubmit = (data) => {
    console.log("✅ Final submit:", data);
    // call API or payment gateway here
  };
  return (
    <>
    
  <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="container  z-30 bg-white-1  mt-8 flex flex-col items-center gap-8 p-4 shadow-md rounded-lg"
      >
        <h1 className='h2 font-[700] font-oswald  text-center  !text-primary title-animation   ' >Your Skip, Ready to Hire</h1>
        {/* Progress bar */}
        <ProgressBar className={'mt-6'}  currentStep={currentStep} setCurrentStep={setCurrentStep} steps={steps} />

        {/* Render current step */}
        <div className="mt-8 w-[70%] mx-auto ">{steps[currentStep].component}</div>

        {/* Navigation buttons */}
        <div className="flex  gap-4 justify-center ">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-primary text-white-1 rounded-full"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className=" px-8 py-2 bg-primary text-white-1 rounded-full"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className=" px-4 py-2 bg-green-600 text-white-1 rounded-full"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
    </>   
  )
}

export default BoonkingOnline