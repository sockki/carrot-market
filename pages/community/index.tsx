import Bottombtn from "@/components/bottombtn";
import Layout from "@/components/layout";
import useCoords from "@/libs/client/useCoords";
import { Post, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import client from "@/libs/server/client";

interface PostWithUser extends Post {
    user: User;
    _count: {
        Wondering:number;
        Answer:number;
    }
}

interface PostsResponse {
    posts:PostWithUser[];
}

const Community: NextPage = () => {
    const { latitude, longitude} = useCoords();
    const { data } = useSWR<PostsResponse>( latitude && longitude ? `/api/posts?latitude=${latitude}&longitude=${longitude}` : null);
    return (
        <Layout seotitle={"community"} hasTabBar title="동네생활">
            <div className="py-16 px-4 space-y-8">
                {data?.posts?.map((post) => (
                    <Link key={post?.id} href={`/community/${post?.id}`} legacyBehavior>
                        <a className="flex flex-col items-start">
                            <span className="flex items-center px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">동네질문</span>
                            <div className="mt-2 text-gray-700">
                                <span className="text-orange-500 font-medium">Q. </span>
                                {post?.question}
                            </div>
                            <div className="mt-3 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                                <span>{post?.user?.name}</span>
                                <span>{`${String(post?.createdAt).substring(0,10)}  ${String(post?.createdAt).substring(11,16)}`}</span>
                            </div>
                            <div className="flex space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px] w-full">
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>궁금해요 {post?._count?.Wondering}</span>
                                </span>
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                    <span>답변 {post?._count?.Answer}</span>
                                </span>
                            </div>
                        </a>
                    </Link>
                )
                )}
                <Bottombtn href="/community/write">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                    </svg>
                </Bottombtn>
            </div>
        </Layout>
    );
};

const Page: NextPage<PostsResponse> = ({posts}) => {
    return (
      <SWRConfig value={{
        fallback : {
          "/api/posts" : {
            ok: true,
            posts
          }
        }
      }}>
        <Community />
      </SWRConfig>
    );
  };


export async function getStaticProps() {
    console.log("building")
    const posts = await client.post.findMany({
        include: {
            user:true
        },
    });
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
        },
    };
}

export default Page;