import Item from "@/components/item";
import Layout from "@/components/layout";
import ProductList from "@/components/product-list";
import type { NextPage } from "next";

const Buy: NextPage = () => {
  return (
    <Layout seotitle={"buy"} canGoBack>
      <div className="flex px-4 flex-col space-y-5 py-10">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
}

export default Buy;