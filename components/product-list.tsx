import { ProductWithCount } from "@/pages";
import useSWR from "swr"
import Item from "./item";

interface ProductListProps {
    kind: "favs" | "sales" | "purchases"
}

interface Record {
    id: number;
    product: ProductWithCount
}

interface ProductListRes {
    [key: string]: Record[];
}


export default function ProductList({ kind }: ProductListProps) {
    const { data } = useSWR<ProductListRes>(`/api/users/me/${kind}`);
    return data
        ? <>
            {data?.[kind]?.map((record) => (
                <Item
                    key={record.id}
                    title={record.product.name}
                    id={record.product.id}
                    price={record.product.price}
                    like={record.product._count.Fav}
                    img={record.product.image}
                />
            ))}
        </>
        : null;
}