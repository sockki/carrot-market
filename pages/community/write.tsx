import Button from "@/components/button";
import Layout from "@/components/layout";
import WriteArea from "@/components/writearea";
import useCoords from "@/libs/client/useCoords";
import useMutation from "@/libs/client/useMutation";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface WriteForm {
    question: string;
}

interface WriteRes{
    ok:boolean;
    post: Post;
}

const Write: NextPage = () => {
    const { latitude, longitude} = useCoords();
    const router = useRouter();
    const { register, handleSubmit } = useForm<WriteForm>();
    const [post, {loading, data}] = useMutation<WriteRes>("/api/posts")
    const onValid = (data: WriteForm) => {
        if (loading) return;
        post({...data, latitude, longitude});
    };
    useEffect(() => {
        if(data && data.ok){
            router.push(`/community/${data.post.id}`);
        }
    },[data, router]);
    return (
        <Layout seotitle={"community"} canGoBack>
            <form onSubmit={handleSubmit(onValid)} className="px-4 py-4">
                <WriteArea
                    register={register("question",{ required: true, minLength:5})}
                    label={false}
                    name=""
                    placeholder="Write a question!"
                />
                <Button name={loading ? "Loading..." : "Submit"} />
            </form>
        </Layout>
    );
}

export default Write;