import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";

import clientPromise from "../../../lib/mongodb";

interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.cookies.session_ID;

  // mongodb
  const client = await clientPromise;
  const db = client.db("twihistory-nextjs");

  const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
  });

  const usersTokens = await db.collection("authTwitter").findOne({
    _id: new ObjectId(userId as string),
  });

  const refresh_token = usersTokens?.refreshToken;

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refresh_token);

  await db.collection("authTwitter").findOneAndUpdate(
    {
      _id: new ObjectId(userId as string),
    },
    {
      $set: {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      },
    }
  );

  const user: { data: User; following?: User[] } =
    await refreshedClient.v2.me();

  //
  const tweetId = req.query.tweetId as string;
  const action = req.body.action as string;

  let response;

  switch (action) {
    case "like":
      response = await refreshedClient.v2.like(user.data.id, tweetId);
      break;
    case "unlike":
      response = await refreshedClient.v2.unlike(user.data.id, tweetId);
      break;
    case "retweet":
      response = await refreshedClient.v2.retweet(user.data.id, tweetId);
      break;
    case "bookmark":
      response = await refreshedClient.v2.bookmark(tweetId);
      break;
    default:
      break;
  }

  //

  res.status(200).json({
    response: response,
  });
}
