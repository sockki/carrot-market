import Bottombtn from "@/components/bottombtn";
import Item from "@/components/item";
import Layout from "@/components/layout";
import useUser from "@/libs/client/useUser";
import { Fav, Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import client from "@/libs/server/client";

export interface ProductWithCount extends Product {
  _count: {
    Fav: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductResponse>("/api/products");
  return (
    <Layout seotitle={"Stream"} hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex px-4 flex-col space-y-5 mt-5">
        {data?.products?.map((product) => (
          <Item
            title={product.name}
            id={product.id}
            key={product.id}
            price={product.price}
            like={product?._count?.Fav || 0}
            img={product?.image}
          />
        ))}
        <Bottombtn href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Bottombtn>
      </div>
    </Layout>
  );
};

const Page: NextPage<{products:ProductWithCount[]}> = ({products}: any) => {
  return (
    <SWRConfig value={{
      fallback : {
        "/api/products" : {
          ok: true,
          products
        }
      }
    }}>
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({
    where: {
      reservation: false,
    },
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
