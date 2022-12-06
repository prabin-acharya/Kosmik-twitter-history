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

  // Get lists followed by user
  const followedLists = await refreshedClient.v2.listFollowed(
    (
      await refreshedClient.v2.me()
    ).data.id,
    {
      expansions: ["owner_id"],
      "list.fields": [
        "description",
        "owner_id",
        "member_count",
        "follower_count",
      ],
      "user.fields": ["name", "username", "profile_image_url"],
    }
  );

  const lists = [];
  const includes = new TwitterV2IncludesHelper(followedLists);

  for await (const list of followedLists) {
    const owner = includes.listOwner(list);
    lists.push({
      id: list.id,
      name: list.name,
      description: list.description,
      member_count: list.member_count,
      follower_count: list.follower_count,
      owner: {
        id: owner?.id,
        name: owner?.name,
        username: owner?.username,
        profile_image_url: owner?.profile_image_url,
      },
    });
  }

  res.status(200).json({
    lists,
  });
}
