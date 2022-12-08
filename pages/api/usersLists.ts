import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";

import clientPromise from "../../lib/mongodb";

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

  console.log("=============================", userId);

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

  // Get User Owned Lists
  // const lists = await refreshedClient.v2.listsByUserId(user.data.id);

  console.log("++++++++++++++++++++++++++++++==", user.data.id);

  // get user info

  const lists = await refreshedClient.v2.listsOwned(user.data.id, {
    max_results: 100,
    "list.fields": ["private"],
  });

  res.status(200).json({
    lists: lists.data,
  });
}
