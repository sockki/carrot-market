import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import WriteArea from "@/components/writearea";
import useMutation from "@/libs/client/useMutation";
import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateForm {
    name: string;
    price: string;
    description: string;
}

interface CreateRes {
    ok: boolean;
    stream: Stream;
}

const Uploaditem: NextPage = () => {
    const router = useRouter();
    const [createStream, { data, loading }] = useMutation<CreateRes>(`/api/streams`);
    const { register, handleSubmit } = useForm<CreateForm>();
    const onValid = (form: CreateForm) => {
        if (loading) return;
        createStream(form);
    };
    useEffect(() => {
        if (data && data.ok) {
            router.push(`/streams/${data.stream.id}`)
        }
    }, [data,router])
    return (
        <Layout seotitle={"Stream"} canGoBack>
            <form onSubmit={handleSubmit(onValid)} className="px-4 py-16">
                <div className="mb-5">
                    <Input register={register("name", { required: true })} required label="Name" name="name" type="text" />
                </div>
                <div className="mb-5">
                    <Input register={register("price", { required: true, valueAsNumber: true })} required label="Price" name="price" kind="money" type="number" />
                </div>
                <div>
                    <WriteArea register={register("description", { required: true })} label={true} name="Description" placeholder="" />
                </div>
                <div className="mt-2">
                    <Button name={loading ? "Loading..." : "Upload live"} />
                </div>
            </form>
        </Layout>
    );
};

export default Uploaditem;