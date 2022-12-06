// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import { Client } from "twitter-api-sdk";
import { TwitterApi } from "twitter-api-v2";
import clientPromise from "./../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
  });

  const callbackURL = process.env.TWITTER_CALLBACK_URL as string; // e.g. http://localhost:3000/api/twitter/callback

  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    {
      scope: [
        "tweet.read",
        "users.read",
        "offline.access",
        "bookmark.read",
        "follows.read",
        "list.read",
      ],
    }
  );

  try {
    const client = await clientPromise;
    const db = client.db("twihistory-nextjs");
    await db.collection("authTwitter").insertOne({
      codeVerifier,
      state,
    });

    res.redirect(url);
  } catch (err) {
    console.log(err);
  }
}
