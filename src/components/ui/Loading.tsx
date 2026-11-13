import { AiOutlineLoading3Quarters } from "react-icons/ai";


export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
    </div>
  );
}