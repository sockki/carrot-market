import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";



async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { query: { id }, session: { user } } = req;
    const post = await client.post.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!post) {
        return res.status(404).end()
    }
    const alreadExists = await client.wondering.findFirst({
        where: {
            userId: user?.id,
            postId: Number(id),
        }
    })

    if (alreadExists) {
        await client.wondering.delete({
            where: {
                id: alreadExists.id
            }
        })
    } else {
        await client.wondering.create({
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
                }
            },
        })
    }
    res.json({
        ok: true,
    });
}

export default withApiSession(withHandler({
    methods: ["POST"],
    handler,
})
);
