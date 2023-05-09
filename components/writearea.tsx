import { UseFormRegisterReturn } from "react-hook-form";

interface IWrite {
    label: boolean;
    name: string;
    placeholder: string;
    register?: UseFormRegisterReturn;
    [key: string]: any;
}

export default function WriteArea({
    label,
    name,
    placeholder,
    register,
    ...rest
}: IWrite) {
    return (
        <div>
            {label ? (
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">{name}</label>
            ) : null}
            <textarea id={name} {...register} className="mt-1 shadow-sm w-full  focus:ring-orange-500 rounded-md border-gray-400 focus:border-orange-500" rows={4} placeholder={placeholder} {...rest} />
        </div>
    );
}