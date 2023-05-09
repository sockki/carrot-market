import { UseFormRegisterReturn } from "react-hook-form";

interface Iinput {
  register?: UseFormRegisterReturn;
  [key: string]: any;
}

export default function Thatguel({
  register,
  ...rest
}: Iinput) {
  return (
    <div className="fixed w-full mx-auto max-w-md bottom-10 inset-x-0">
      <div className="flex relative items-center">
        <input 
          {...register}
          {...rest}
          type="text"
          className="shadow-md rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
        />
        <div className="absolute pointer inset-y-0 flex py-1.5 pr-1.5 right-0">
          <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 cursor-pointer text-sm text-white">&rarr;</button>
        </div>
      </div>
    </div>
  )
}