import client from "@/libs/server/client";
import smtpTransport from "@/libs/server/email";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID,process.env.TWILIO_TOKEN);


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const user = phone ? {phone} : email ? {email} : null;
  if(!user) return res.status(400).json({ok: false});
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {       // 있다면 찾아내고
            ...user,
          },
          create: {        // 없다면 만들어낸다.
            name: "Somebody",
            ...user,
          },
        },
      },
    },
  });

  /*
  if(email) {
    user = await client.user.findUnique({
      where : {
        email,
      },
    });
    if(user) console.log("found")
    if(!user) {
      console.log("Did not find")
      user = await client.user.create({
        data: {
          name:"Anonymous",
          email,
        }
      })
    }
    console.log(user);
  }
  if(phone) {
    user = await client.user.findUnique({
      where : {
        phone: +phone,
      },
    });
    if(user) console.log("found")
    if(!user) {
      console.log("Did not find")
      user = await client.user.create({
        data: {
          name:"Anonymous",
          phone: +phone,
        }
      })
    }
    console.log(user);
  }
  */
  if(phone) {
    /*
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.MESSAGE_SERVICES_SID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}`
    });
    console.log(message);
    */
  }
  else if (email) {
    /*
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Nomad Carrot Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
      if (error) {
        console.log(error);
        return null;
      } 
      else {
        console.log(responses);
        return null;
      }
    }
    );
    smtpTransport.close();
    console.log(result);
    */
  }
  return res.json({
    ok: true,
    token
  });
}

export default withHandler({methods:["POST"],handler, isPrivate:false});



/* withHandler를 호출하면 withHandler는 다른 function을 return 하기 때문에

 export default async function(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST") {
            return res.status(405).end();
    }
    try {
      await handler(req, res)  
    } catch(error) {
      console.log(error);
      return res.status(500).json({ error })
            
    }

  위의 함수가 nextJS에서 실행이 된다.
*/
