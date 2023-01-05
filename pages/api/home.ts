import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
  TweetV2UserTimelineParams,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";

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
  const access_Token = req.cookies.access_Token as string;

  if (!access_Token) {
    res.status(401).json({
      Error: " User not authenticated",
    });
    return;
  }

  const from = req.query.from as string;
  const to = req.query.to as string;

  let dateFrom = new Date(req.query.from as string);
  let dateTo = new Date(req.query.to as string);

  console.log(from, to);

  if (!from || !to) {
    [dateFrom, dateTo] = randomDate();
  }

  const client = new TwitterApi(access_Token);

  const following = await client.v2.following((await client.v2.me()).data.id);

  const randomizedFollowing = shuffleArray(following.data)?.slice(0, 7);

  let members;

  members = randomizedFollowing || [];

  const randomizedFollowingOrderedTweets = members.map(async (user) => {
    const options: Partial<TweetV2UserTimelineParams> = {
      max_results: 10,
      start_time: dateFrom.toISOString(),
      end_time: dateTo.toISOString(),

      "tweet.fields": [
        "id",
        "text",
        "created_at",
        "public_metrics",
        "source",
        "entities",
      ],
      "user.fields": ["id", "name", "public_metrics", "profile_image_url"],
      expansions: [
        "author_id",
        "entities.mentions.username",
        "referenced_tweets.id",
        "in_reply_to_user_id",
      ],
      "media.fields": ["url"],
    };

    const userTimeline = await (
      await client.v2.userTimeline(user.id, options)
    ).next();

    const next_token = userTimeline.meta.next_token;

    const includes = new TwitterV2IncludesHelper(userTimeline);

    const tweets = [];

    for (const tweet of userTimeline.tweets) {
      const user = includes.author(tweet);
      tweets.push({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
        profile_image_url: user?.profile_image_url,
        username: user?.username,
        name: user?.name,
        authorId: user?.id,
        entities: tweet.entities,
        mentions: tweet.entities?.mentions,
      });
    }

    return tweets;
  });

  const UsersTweets = await Promise.all(randomizedFollowingOrderedTweets);

  const tweets = UsersTweets.flat();

  const shuffledTweets = shuffleArray(tweets);

  res.status(201).json({
    tweets: shuffledTweets,
  });
}

//
//
//
//
//
//
//
//
//
//
//
//

// now do list
// Steps:-
// fetch user's list
// fetch list timeline

// and timeline of selected accounts
// Steps:-
// eg Karpathy, dan_abramov,

// api docs say timeline can only be fetched to last 7 days or 800 mentions/rev chronological;  3200 tweets
// but can we fetch old tweets from specific date range?
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomDate(
  start: Date = new Date(2014, 12, 1),
  end: Date = new Date(2020, 12, 8)
) {
  const dateFrom = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  const dateTo = new Date(dateFrom);
  dateTo.setMonth(dateTo.getMonth() + 2);
  return [dateFrom, dateTo];
}
