import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";
import { AwsInstance } from "twilio/lib/rest/accounts/v1/credential/aws";



async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: {id}, session: { user } } = req;
  
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
  });
  if(!product) {
    return res.status(404).end();
  }

  const alreadyExists = await client.fav.findFirst({
    where: {  // 제품에 하트가 눌려져 있는지 확인
        productId: Number(id),
        userId: user?.id,
    }
  })
  if(alreadyExists) {
    //delete
    await client.fav.delete({  // delete를 사용할 때는 unique data인 fav.id로만 지울 수 있다. 그것을 얻을 수 없는 경우 deleteMany 사용
        where: {
            id: alreadyExists.id,
        }
    })
  }
  else {
    //create
    await client.fav.create({
        data: {
            user: {
                connect: {
                    id: user?.id,
                }
            },
            product: {
                connect: {
                    id: Number(id),
                }
            }
        }
    })
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
