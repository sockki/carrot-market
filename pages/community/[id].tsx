import Button from "@/components/button";
import Layout from "@/components/layout";
import WriteArea from "@/components/writearea";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { Answer, Post, User } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import client from "@/libs/server/client";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostwithUser extends Post {
  user: User;
  _count: {
    Answer: Number;
    Wondering: Number;
  };
  Answer: AnswerWithUser[];
}

interface CommunityPostRes {
  ok: boolean;
  post: PostwithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerRes {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage<CommunityPostRes> = ({
  post
}) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data, mutate } = useSWR<CommunityPostRes>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerRes>(`/api/posts/${router.query.id}/answers`);
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        // 누를 때 마다 wondering +1, isWondering에 따라서 색깔 바뀌기
        ...data, // 코드가 긴것은 Wondering만 다루기 위해서
        post: {
          ...data?.post,
          _count: {
            ...data?.post._count,
            Wondering: data.isWondering
              ? Number(data?.post?._count?.Wondering) - 1
              : Number(data?.post?._count?.Wondering) + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!loading) {
      wonder({});
    }
  };
  const onVaild = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset]);
  return (
    <Layout seotitle={"community"} canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {post?.user?.name}
            </p>
            <Link
              href={`/users/profile/${post?.user?.id}`}
              legacyBehavior
            >
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q. </span>
            {post?.question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button
              onClick={onWonderClick}
              className={cls(
                "flex space-x-2 items-center text-sm",
                data?.isWondering ? "text-green-400" : ""
              )}
            >
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
              <span>{`궁금해요 ${data?.post?._count.Wondering}`}</span>
            </button>
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
              <span>{`답변 ${data?.post?._count.Answer}`}</span>
            </span>
          </div>
        </div>
        <div className="px-4 my-5 space-y-5">
          {post?.Answer?.map((answer) => (
            <div key={answer?.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {answer?.user?.name}
                </span>
                <span className="text-xs text-gray-500 block ">{`${String(
                  answer?.createdAt
                ).substring(0, 10)}  ${String(answer.createdAt).substring(
                  11,
                  16
                )}`}</span>
                <p className="text-gray-700 mt-2">{answer?.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="px-4" onSubmit={handleSubmit(onVaild)}>
          <WriteArea
            label={false}
            name="answer"
            placeholder="Ask a question!"
            type="text"
            register={register("answer", { required: true, minLength: 5 })}
          />
          <Button name={answerLoading ? "Loading..." : "Reply"} />
        </form>
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
  const post = await client.post.findUnique({
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
      Answer: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  if (!post) {
    return {
      props: {}
    };
  }

  return {
    props: {post: JSON.parse(JSON.stringify(post)),},
  };
};

export default CommunityPostDetail;
