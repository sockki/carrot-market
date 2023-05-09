import { UseFormRegisterReturn } from "react-hook-form";

interface Iinput {
    label: string;
    name: string;
    kind?: "text" | "phone" | "money";
    [key: string]: any;
    type: string;
    register?: UseFormRegisterReturn;
    required?:boolean;
}

export default function Input({
    label,
    name,
    kind = "text",
    register,
    type,
    ...rest
}: Iinput) {
    return (
        <div>
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            {kind === "text" ? (
                <div className="rounded-md relative flex  items-center shadow-sm">
                    <input
                        id={name}
                        {...register}
                        type={type}
                        {...rest}
                        className="appearance-none w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "phone" ? (
                <div className="flex rounded-md shadow-sm ">
                    <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none">+82</span>
                    <input
                        id={name}
                        {...register}
                        type={type}
                        {...rest}
                        className="py-2 px-4 w-full border border-gray-400 rounded-md rounded-l-none  placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "money" ? (
                <div className="rounded-md flex items-center relative shadow-sm">
                    <div className="absolute left-0 pl-3 pointer-events-none flex items-center justify-center">
                        <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                        id={name}
                        {...register}
                        type={type}
                        {...rest}
                        className="appearance-none pl-7 w-full px-3 py-2 border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
                        <span className="text-gray-500">USD</span>
                    </div>
                </div>
            ) : null}
        </div>
    )
}