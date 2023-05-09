import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";



async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: {id}, session: { user}, body: {answer} } = req;
  const post = await client.post.findUnique({
    where: {
        id: Number(id),
    },
  });
  if(!post) {
    return res.status(404).end()
  }

  const newAnswer = await client.answer.create({
    data: {
        user: {
            connect: {
                id: user?.id,
            },
        },
        post: {
            connect: {
                id: Number(id),
            }
        },
        answer
    }
  })
  await res.revalidate(`/community/${id}`);
  res.json({
    ok:true,
    answer: newAnswer,
  });
}

export default withApiSession(withHandler({
    methods:["POST"],
    handler,
})
);
