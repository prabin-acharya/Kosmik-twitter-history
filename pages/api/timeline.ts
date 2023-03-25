import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
  TweetV2UserTimelineParams,
  TwitterApi,
  TwitterV2IncludesHelper,
  UserV2,
} from "twitter-api-v2";

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

  try {
    const client = new TwitterApi(access_Token);
    const me = await client.v2.me();

    const listId = req.query.listId as string;

    let members: UserV2[] = [];

    if (listId) {
      // list timeline
      const listMembers = await client.v2.listMembers(listId);
      for await (const user of listMembers) {
        members.push({
          id: user.id,
          name: user.name,
          username: user.username,
        });
      }
    } else {
      // home timeline
      members = (await client.v2.following(me.data.id)).data;
    }

    let timelineTweets: string | any[] = [];

    let from = new Date((req.query.from as string) || "2011-01-01");
    let to = new Date((req.query.to as string) || "2021-01-01");

    const intervalTime = to.getTime() - from.getTime();
    const interval = intervalTime / 3;

    members = shuffleArray(members);
    console.log(members.length);
    console.log(members.slice(0, 5));

    const getTweetsTimeline = async (
      dateFrom: Date,
      dateTo: Date,
      members: UserV2[]
    ) => {
      // get 10 tweets for each member

      // const members = following.slice(0, 4);
      members = members.slice(0, 8);

      const randomizedFollowingOrderedTweets = members.map(async (user) => {
        const options: Partial<TweetV2UserTimelineParams> = {
          max_results: 5,
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

        console.log(tweets, "++++++++++++++===");

        return tweets;
      });

      console.log("********************************");

      const UsersTweets = await Promise.all(randomizedFollowingOrderedTweets);

      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6");

      console.log(
        UsersTweets.flat().length,
        "------/n########################"
      );

      return UsersTweets.flat();
    };

    let i = 0;
    while (timelineTweets.length < 10 || i < 3) {
      const dateFrom = new Date(from.getTime() + i * interval);
      const dateTo = new Date(from.getTime() + (i + 1) * interval);

      // const sembers = shuffleArray(following).slice(0, 7);

      const newTweets = await getTweetsTimeline(
        dateFrom,
        dateTo,
        shuffleArray(members).slice(0, 7)
      );
      timelineTweets = [...timelineTweets, ...newTweets];
      i++;
    }

    const shuffledTweets = shuffleArray(timelineTweets);

    res.status(201).json({
      tweets: shuffledTweets,
    });
  } catch (error: any) {
    res.status(error.data.status).json({
      Error: error.data.detail,
    });
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
