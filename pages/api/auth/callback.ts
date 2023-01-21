import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import clientPromise from "./../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;

  const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
  });

  const client = await clientPromise;
  const db = client.db("twihistory-nextjs");

  const users = await db.collection("authTwitter").findOne({ state: state });

  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }

  const {
    client: loggedClient,
    accessToken,
    expiresIn,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code: code as string,
    codeVerifier: users.codeVerifier,
    redirectUri: process.env.TWITTER_CALLBACK_URL as string,
  });

  res.setHeader("Set-Cookie", [
    `access_Token=${accessToken}; HttpOnly; SameSite=Strict;Max-Age=${expiresIn}first; Path=/`,
    `refresh_Token=${refreshToken}; HttpOnly; SameSite=Strict; Path=/`,
  ]);

  await db.collection("authTwitter").deleteOne({ state: state });

  res.redirect(process.env.APP_URL as string);
}
