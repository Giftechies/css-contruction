import dynamic from "next/dynamic";

const Form = dynamic(() => import('@/components/form/mult/MultiStepForm'), { ssr: false });
const Animations = dynamic(() => import('@/components/animations/Animations'), { ssr: false });

export default function PickDetailsPage() {
    return (
        <div>
            <Form />
            <Animations />
        </div>
    )
}
