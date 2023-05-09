import Chatting from "@/components/chat";
import Layout from "@/components/layout";
import Thatguel from "@/components/thatwrite";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface StreamWithMesaage extends Stream {
  strmessages: StreamMessage[];
}

interface StreamRes {
  ok: boolean;
  stream: StreamWithMesaage;
}

interface MessageForm {
  message: string;
}

const LiveDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamRes>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { loading: sendMessageLoading, data: sendMessageData }] =
    useMutation(`/api/streams/${router.query.id}/messages`);
  const onValid = (form: MessageForm) => {
    if (sendMessageLoading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            strmessages: [
              ...prev.stream.strmessages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  console.log(data);
  return (
    <Layout seotitle={"Stream"} canGoBack>
      <div className="py-10 px-4 space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video " />
        <h3 className="font-semibold text-gray-800 text-3xl mt-2">
          {data?.stream?.name}
        </h3>
        <span className="text-xl block mt-3 text-gray-800">
          ${data?.stream?.price}
        </span>
        <p className="text-base my-6 text-gray-600">
          {data?.stream?.description}
        </p>
        <div className="py-10 pb-16 h-[50vh] overflow-y-scroll px-4 space-y-4">
          {data?.stream?.strmessages?.map((message) => (
            <Chatting
              key={message?.id}
              reversed={message?.user?.id === user?.id}
              text={message.message}
              ava={message?.user?.avatar}
            />
          ))}
        </div>
        <form onSubmit={handleSubmit(onValid)}>
          <Thatguel register={register("message", { required: true })} />
        </form>
      </div>
    </Layout>
  );
};

export default LiveDetail;
