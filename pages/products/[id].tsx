import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { avatar, cls, pavatar } from "@/libs/client/utils";
import { Chat, Product, User } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import client from "@/libs/server/client";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface InewChat {
  ok: boolean;
  chat: Chat;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: BoundMutatae } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    toggleFav({});
    if (!data) return; // cashed 된 data를 mutate 하는 함수 // 벡엔드에 요청을 보낸뒤에 data를 mutate 한다.
    BoundMutatae((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false); // 화면에서 얻은 데이터만 mutate
    //mutate("/api/users/me", (prev: any) => ({ok: !prev.ok}), false) // 화면 밖의 데이터를 mutate
  };

  const [makechat, { data: makechatdata, loading: makechatloading }] =
    useMutation<InewChat>(`/api/chats`);
  const onTalkClick = (productId: any, sellerId: any) => {
    if (makechatloading) return;
    makechat({ productId, sellerId });
  };

  useEffect(() => {
    if (makechatdata?.ok) {
      router.push(`/chats/${makechatdata?.chat?.id}`);
    }
  }, [makechatdata, router]);

  if(router.isFallback) {
    return (
      <Layout title="Loading for you....." seotitle="Loading...">
        <span>please waiting....</span>
      </Layout>
    )
  }

  return (
    <Layout seotitle={"Product"} canGoBack>
      <div className="px-4 py-10">
        <div className="mb-6">
          <div className="relative pb-80">
            <Image
              alt=""
              fill
              src={pavatar(product?.image)}
              className="object-cover bg-slate-300"
            />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <Image
              alt=""
              width={48}
              height={48}
              src={avatar(product?.user?.avatar)}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {product?.user?.name}
              </p>
              <Link
                href={`/users/profile/${product?.user?.id}`}
                legacyBehavior
              >
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <p className="text-3xl mt-3 text-gray-900">
              {product?.price}$
            </p>
            <p className="text-base my-6 text-gray-600">
              {product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              {user?.id === product.user.id ? (
                <button className="flex-1 bg-gray-500 text-white py-3 rounded-md focus:outline-none">
                  Talk to seller
                </button>
              ) : (
                <button
                  onClick={() =>
                    onTalkClick(product.id, product.user.id)
                  }
                  className="flex-1 bg-orange-500 text-white py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium focus:ring-orange-500 hover:bg-orange-600"
                >
                  {makechatloading ? "Loading...." : "Talk to seller"}
                </button>
              )}
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-200",
                  data?.isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product: Product) => (
              <Link
                key={product?.id}
                href={`../products/${product.id}`}
                legacyBehavior
              >
                <a>
                  <div className="h-56 w-3/4 mb-4 bg-slate-300" />
                  <h3 className="text-gray-700 -mb-1">{product?.name}</h3>
                  <p className="text-sm font-semibold text-gray-900">
                    {product?.price}$
                  </p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
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
  const product = await client.product.findUnique({
    where: {
      id: Number(ctx?.params?.id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      NOT: {
        id: product?.id,
      },
    },
  });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    },
  };
};

export default ItemDetail;
