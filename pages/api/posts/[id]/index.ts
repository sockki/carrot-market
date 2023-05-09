import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";



async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: {id}, session: { user} } = req
  const post = await client.post.findUnique({
    where: {
        id: Number(id),
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
                answer:true,
                id: true,
                createdAt: true,
                user: {
                    select: {
                        id:true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        },
        _count: {
            select: {
                Answer: true,
                Wondering: true,
            }
        }
    },
  });
  if(!post) {
    return res.status(405).end();
  }
  const isWondering = Boolean(
    await client.wondering.findFirst({
        where: {
            postId: Number(id),
            userId:user?.id,
        },
        select: {
            id: true,
        }
      })
  );
  res.json({
    ok:true,
    post,
    isWondering,
  });
}

export default withApiSession(withHandler({
    methods:["GET"],
    handler,
})
);
