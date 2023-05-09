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
      body: { question, latitude, longitude }, 
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });
    await res.revalidate("/community");
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {query: {latitude, longitude}} = req;
    const latitudeparsed = parseFloat(String(latitude));
    const longitudeparsed = parseFloat(String(longitude));
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Wondering: true,
            Answer: true,
          },
        },
      },
      where: {
        latitude: {
          gte: latitudeparsed - 0.01,
          lte: latitudeparsed + 0.01,
        },
        longitude: {
          gte: longitudeparsed - 0.01,
          lte: longitudeparsed + 0.01,
        }
      }
    });
    res.json({
      ok: true,
      posts,
    })
  }


}

export default withApiSession(withHandler({
  methods: ["GET", "POST"],
  handler,
})
);
