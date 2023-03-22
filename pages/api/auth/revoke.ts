import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const twitterClient = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    });

    const result = twitterClient.revokeOAuth2Token(
      req.cookies.access_Token as string
    );

    // res.setHeader("Set-Cookie", [
    //   `access_Token=${accessToken}; HttpOnly; SameSite=Strict;Max-Age=${expiresIn}first; Path=/`,
    //   `refresh_Token=${refreshToken}; HttpOnly; SameSite=Strict; Path=/`,
    // ]);

    res.status(200).send({ message: "User logged out", result });
  } catch (error) {
    res.status(401).json({
      Error: " Something went wrong",
    });
  }
}
