import Item from "@/components/item";
import Layout from "@/components/layout";
import ProductList from "@/components/product-list";
import type { NextPage } from "next";




const Sold: NextPage = () => {

  return (
    <Layout seotitle={"Sold"} canGoBack>
      <div className="flex px-4 flex-col space-y-5 py-10">
        <ProductList kind="sales"/>
      </div>
    </Layout>
  );
}

export default Sold;