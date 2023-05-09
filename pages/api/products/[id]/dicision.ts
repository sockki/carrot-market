import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body: { cate },
  } = req;
  if (cate === "confirm") {
    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        confirm: true,
      },
    });
  } else if (cate === "reservation") {
    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        reservation: true,
      },
    });
  }
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
