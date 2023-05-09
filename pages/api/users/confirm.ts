import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique( // 토큰을 찾아본다.
    {
      where: {
        payload: token,
      },
      include: { user: true }   // 토큰 정보 얻기
    }
  )
  if (!foundToken) return res.status(404).end(); // 토큰이 없다면 404
  req.session.user = {
    id: foundToken.userId,    // 토큰이 존재하면 보유한 유저의 id를 session에 넣음
  }
  // 토큰이 이미 많이 생성 되어있을 때 에러 방지용 코드.
  const foundCount = await client.token.count({
    where: {
      userId: foundToken.userId,
    },
  });


  if (foundCount > 2) { // 방금 생성된 토큰을 제외한 나머지 삭제.
    await client.token.deleteMany({
      where: {
        userId: foundToken.userId,
        createdAt: { notIn: foundToken.createdAt },
      },
    }).then((res) => {
      console.log(res);
    }, (err) => {
      if (err) console.log(err);
    });
  }



  
  await req.session.save();  // session 저장
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,  // 찾은 token의 userid와 같은 userid를 가진 토큰 전부 삭제
    }
  })
  res.json({ ok: true });
}

export default withApiSession(withHandler({methods:["POST"], handler, isPrivate:false}));
