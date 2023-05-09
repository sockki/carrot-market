import Chatting from "@/components/chat";
import Layout from "@/components/layout";
import Thatguel from "@/components/thatwrite";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { pavatar } from "@/libs/client/utils";
import { Chat } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";
import Preview from "twilio/lib/rest/Preview";
import client from "@/libs/server/client";

interface ChatMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface ChatProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  reservation: boolean;
  confirm: boolean;
}
interface ChatWithMesaage extends Chat {
  chatMessages: ChatMessage[];
  product: ChatProduct;
}

interface ChatRes {
  ok: boolean;
  chat: ChatWithMesaage;
}

interface MessageForm {
  message: string;
}

interface PageProps {
  chat: ChatWithMesaage;
  id: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ChatRes>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { loading: sendMessageLoading }] = useMutation(
    `/api/chats/${router.query.id}`
  );
  const onValid = (form: MessageForm) => {
    if (sendMessageLoading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chat: {
            ...prev.chat,
            chatMessages: [
              ...prev.chat.chatMessages,
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

  const [senddicision, { loading: DicisionLoading }] = useMutation(
    `/api/products/${data?.chat.productId}/dicision`
  );
  const onDicision = (cate: any) => {
    if (DicisionLoading) return;
    senddicision({ cate });
    mutate();
  };

  return (
    <Layout seotitle={"Chat"} canGoBack>
      <div className="flex py-3 ml-5 border-b-[1.5px]">
        <div className="relative w-20 h-20">
          <Image
            alt=""
            fill
            src={pavatar(data?.chat.product?.image)}
            className="object-cover bg-slate-300 rounded-md"
          />
        </div>
        <div className="flex-col space-y-2 ml-6 mt-3">
          <div className="text-sm font-semibold text-gray-900">
            {data?.chat.product.name}
          </div>
          <div className="font-semibold mt-1 text-gray-900">
            {data?.chat.product.price}$
          </div>
        </div>
        <div className="flex items-center justify-center ml-52">
          {data?.chat.sellerId === user?.id ? (
            data?.chat.product.confirm ? (
              <button className="px-3 py-1 font-semibold text-gray-100 rounded-xl bg-gray-400">
                예약 대기 중
              </button>
            ) : (
              <button
                onClick={() => onDicision("confirm")}
                className="px-3 py-1 font-semibold text-gray-100 rounded-xl bg-orange-400"
              >
                예약 승인
              </button>
            )
          ) : data?.chat.product.confirm ? (
            data?.chat.product.reservation ? (
              <div>
                <button className="px-3 py-1 mt-1 font-semibold text-gray-100 rounded-xl bg-gray-400">
                  예약 완료
                </button>
                <button className="px-3 py-1 mt-1 font-semibold text-gray-100 rounded-xl bg-orange-400">
                  리뷰 남기기
                </button>
              </div>
            ) : (
              <button
                onClick={() => onDicision("reservation")}
                className="px-3 py-1 font-semibold text-gray-100 rounded-xl bg-orange-400"
              >
                구매 예약
              </button>
            )
          ) : (
            <button className="px-3 py-1 font-semibold text-gray-100 rounded-xl bg-gray-400">
              예약 승인 대기 중
            </button>
          )}
        </div>
      </div>
      <div className="pt-10 px-4 pb-24 space-y-4">
        {data?.chat?.chatMessages?.map((message) => (
          <Chatting
            key={message?.id}
            reversed={message?.user?.id === user?.id}
            text={message?.message}
            ava={message?.user?.avatar}
          />
        ))}
        <form onSubmit={handleSubmit(onValid)}>
          <Thatguel register={register("message", { required: true })} />
        </form>
      </div>
    </Layout>
  );
};

const Page: NextPage<PageProps> = ({ chat, id } : PageProps) => {
  const fallback = {
    [`/api/chats/${id}`]: {
      ok: true,
      chat,
    },
  };

  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <ChatDetail />
    </SWRConfig>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking", // 첫번쨰 유저가 도착시에 html이 없으면 nextjs가 SSR 을 진행
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const chat = await client.chat.findUnique({
    where: {
      id: Number(ctx?.params?.id),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          reservation: true,
          confirm: true,
        },
      },
      chatMessages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!chat) {
    return {
      props: {},
    };
  }

  return {
    props: { chat: JSON.parse(JSON.stringify(chat)), id: ctx.params.id },
    revalidate: 30,
  };
};

export default Page;
