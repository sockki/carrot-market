import Layout from "@/components/layout";
import { avatar } from "@/libs/client/utils";
import { withSsrSession } from "@/libs/server/withSession";
import { Chat, ChatMessage, User } from "@prisma/client";
import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import client from "@/libs/server/client";
import Image from "next/image";

interface buyerwithseller extends Chat {
  seller: User;
  chatMessages: ChatMessage[];
}

interface sellerwithbuyer extends Chat {
  buyer: User;
  chatMessages: ChatMessage[];
}

interface Ichat {
  ok: boolean;
  buyerchats: buyerwithseller[];
  sellerchats: sellerwithbuyer[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<Ichat>(`/api/chats`);
  return (
    <Layout seotitle={"Chat"} hasTabBar title="채팅">
      <div className="mt-8 divide-y-2">
        <div className="mb-3 ml-2">
          <span>판매채팅</span>
        </div>
        {data?.sellerchats?.map((chat) => (
          <Link key={chat?.id} href={`/chats/${chat?.id}`} legacyBehavior>
            <a className="flex mb-3 px-4 cursor-pointer py-2 items-center space-x-3">
              {chat?.buyer?.avatar ? (
                <div className="relative h-16 w-16">
                <Image
                  alt=""
                  fill
                  src={avatar(chat?.buyer?.avatar)}
                  className="w-16 h-16 bg-slate-500 rounded-full"
                />
              </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-300" />
              )}
              <div>
                <p className="text-gray-700">{chat.buyer.name}</p>
                <p className="text-sm font-medium text-gray-500">
                  {" "}
                  {chat?.chatMessages.at(-1)?.message}{" "}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className="mt-8 mb-8 divide-y-2">
        <div className="mb-3 ml-2">
          <span>구매채팅</span>
        </div>
        {data?.buyerchats?.map((chat) => (
          <Link key={chat?.id} href={`/chats/${chat?.id}`} legacyBehavior>
            <a className="flex mb-3 px-4 cursor-pointer py-2 items-center space-x-3">
              {chat?.seller?.avatar ? (
                <div className="relative h-16 w-16">
                  <Image
                    alt=""
                    fill
                    src={avatar(chat?.seller?.avatar)}
                    className="w-16 h-16 bg-slate-500 rounded-full"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-300" />
              )}
              <div>
                <p className="text-gray-700">{chat?.seller?.name}</p>
                <p className="text-sm font-medium text-gray-500">
                  {" "}
                  {chat?.chatMessages.at(-1)?.message}{" "}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

const Page: NextPage<Ichat> = ({ buyerchats, sellerchats }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/chats": { ok: true, buyerchats, sellerchats },
        },
      }}
    >
      <Chats />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const buyerchats = await client.chat.findMany({
    where: {
      buyerId: req?.session.user?.id,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      chatMessages: {
        select: {
          message: true,
        },
      },
    },
  });
  const sellerchats = await client.chat.findMany({
    where: {
      sellerId: req?.session.user?.id,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      chatMessages: {
        select: {
          message: true,
        },
      },
    },
  });
  return {
    props: {
      buyerchats: JSON.parse(JSON.stringify(buyerchats)),
      sellerchats: JSON.parse(JSON.stringify(sellerchats)),
    },
  };
});

export default Page;
