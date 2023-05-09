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
      body: { productId, sellerId },
      session: { user },
    } = req;
    const alreadyexist = await client.chat.findFirst({
      where: {
        productId: Number(productId),
        sellerId: Number(sellerId),
        buyerId: user?.id,
      },
    });
    if (!alreadyexist) {
      const newchat = await client.chat.create({
        data: {
          product: {
            connect: {
              id: Number(productId),
            },
          },
          seller: {
            connect: {
              id: Number(sellerId),
            },
          },
          buyer: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      res.json({
        ok: true,
        chat: newchat,
      });
      await res.revalidate("/chats");
    } else {
      res.json({
        ok: true,
        chat: alreadyexist,
      });
    }
  }
  else if(req.method === "GET") {
    const { user } = req.session;
    const buyerchats = await client.chat.findMany({
        where: {
            buyerId: user?.id,
        },
        include: {
            seller: {
                select: {
                    id:true,
                    name: true,
                    avatar: true,
                }
            },
            chatMessages: {
              select: {
                message: true,
              }
            }
        }
    })
    const sellerchats = await client.chat.findMany({
        where: {
            sellerId: user?.id,
        },
        include: {
            buyer: {
                select: {
                    id:true,
                    name: true,
                    avatar: true,
                }
            },
            chatMessages: {
              select: {
                message: true,
              }
            }
        }
    })
    res.json({
        ok:true,
        buyerchats,
        sellerchats,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
  })
);
