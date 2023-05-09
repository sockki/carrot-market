import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      query: { id },
      body,
      session: { user },
    } = req;
    const message = await client.chatMessage.create({
      data: {
        message: body.message,
        chat: {
          connect: {
            id: Number(id),
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      message,
    });
  }
  else if(req.method === "GET"){
    const { query: {id}} = req;
    const chat = await client.chat.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            product: {
              select: {
                id:true,
                name: true,
                image: true,
                price: true,
                reservation: true,
                confirm: true,
              }
            },
            chatMessages: {
                select: {
                    id:true,
                    message:true,
                    user: {
                        select: {
                            avatar: true,
                            id:true,
                        }
                    }
                }
            }
        },
    });

    res.json({
        ok: true,
        chat,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
