import { avatar, cls } from "@/libs/client/utils";
import Image from "next/image";

interface IChat {
  reversed?: boolean;
  text: string;
  ava: any;
}

export default function Chatting({ reversed, text, ava }: IChat) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
      )}
    >
      {ava ? (
        <Image
          src={avatar(ava)}
          width={48}
          height={48}
          className="w-8 h-8 rounded-full bg-slate-300"
          alt={""}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-300" />
      )}
      <div className="w-2/5 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{text}</p>
      </div>
    </div>
  );
}
