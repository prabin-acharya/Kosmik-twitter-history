import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi, TwitterV2IncludesHelper } from "twitter-api-v2";
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

  const following = await refreshedClient.v2.following(user.data.id);

  user.following = following.data;

  const firstId = following.data[8];

  const oldTweets = await refreshedClient.v2.userTimeline(firstId.id, {
    max_results: 9,
    end_time: "2020-07-05T00:00:00.52Z",
    "tweet.fields": ["id", "text", "created_at", "public_metrics", "source"],
    expansions: [
      "author_id",
      "entities.mentions.username",
      "referenced_tweets.id",
      "in_reply_to_user_id",
    ],
    "user.fields": [
      "id",
      "name",
      "description",
      "public_metrics",
      "profile_image_url",
    ],
  });

  console.log("########################################");

  // console.log(oldTweets);
  // for await (const tweets of oldTweets) {
  //   const includes = tweets.
  // }

  // const oldTweetsOnly = oldTweets.tweets;

  // console.log(oldTweetsOnly[0]);

  const includes = new TwitterV2IncludesHelper(oldTweets);
  //helper method for getting the user object from the includes userTimeline

  const oldTweetsOnly = [];

  for (const tweet of oldTweets.tweets) {
    const user = includes.author(tweet);
    oldTweetsOnly.push({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics,
      profile_image_url: user?.profile_image_url,
      username: user?.username,
      name: user?.name,
    });
  }

  res.status(200).json({
    user: user,
    oldTweets: oldTweetsOnly,
    oldTweetsDetail: oldTweets,
  });
}
