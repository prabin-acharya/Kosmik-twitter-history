import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
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

  const listId = req.query.listId;
  const userIdsString = req.query?.userIds;

  let userIds;
  if (userIdsString && typeof userIdsString === "string") {
    userIds = userIdsString.split(",");
  }

  let from = req.query.from;
  let to = req.query.to;

  let { dateFrom, dateTo } = randomDate();

  if (from || to) {
    dateFrom = new Date(from as string);
    dateTo = new Date(to as string);
  }

  const refreshedClient = new TwitterApi(access_Token);

  const user: { data: User; following?: User[] } = await refreshedClient.v2.me({
    "user.fields": ["id", "name", "username", "profile_image_url"],
  });

  const following = await refreshedClient.v2.following(user.data.id);
  user.following = following.data;

  const randomizedFollowing = getShuffledArray(following.data)?.slice(0, 7);

  // get memebers of the list

  let members = [];

  if (listId) {
    const membersOfList = await refreshedClient.v2.listMembers(
      listId as string
    );

    const listMembers = [];

    for await (const user of membersOfList) {
      listMembers.push({
        id: user.id,
        name: user.name,
        username: user.username,
      });
    }

    members = listMembers.slice(0, 50);
  } else if (userIds) {
    members = userIds.map((id) => {
      return {
        id,
      };
    });
  } else {
    members = randomizedFollowing ? randomizedFollowing : [];
  }

  const randomizedFollowingOrderedTweets:
    | Promise<
        | {
            id: string;
            text: string;
            created_at: string | undefined;
            public_metrics: TweetPublicMetricsV2 | undefined;
            profile_image_url: string | undefined;
            username: string | undefined;
            name: string | undefined;
          }[]
        | undefined
      >[]
    | undefined = members?.map(async (user) => {
    try {
      const userTimeline = await refreshedClient.v2.userTimeline(user.id, {
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
        expansions: [
          "author_id",
          "entities.mentions.username",
          "referenced_tweets.id",
          "in_reply_to_user_id",
        ],
        "media.fields": ["url"],
        "user.fields": ["id", "name", "public_metrics", "profile_image_url"],
      });

      const includes = new TwitterV2IncludesHelper(userTimeline);

      const oldTweetsOnly = [];
      for (const tweet of userTimeline.tweets) {
        const user = includes.author(tweet);
        oldTweetsOnly.push({
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

      return oldTweetsOnly;
    } catch (error) {
      console.log(error);
    }
  });

  if (!randomizedFollowingOrderedTweets) return res.status(200).json({});

  const allOldTweetsOnly = await Promise.all(randomizedFollowingOrderedTweets);

  const flattenedTweets = allOldTweetsOnly?.flat();

  const shuffledTweets = getShuffledArray(flattenedTweets);

  // Lists followed by the user
  //
  //

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

  const userOwnedLists = await refreshedClient.v2.listsOwned(user.data.id, {
    max_results: 100,
    "list.fields": ["private"],
  });

  res.status(201).json({
    home: {
      user: user,
      tweets: shuffledTweets,
    },

    lists: {
      followedLists: lists,
      ownedLists: userOwnedLists.data.data,
    },
  });
}

// now do list
// Steps:-
// fetch user's list
// fetch list timeline

// and timeline of selected accounts
// Steps:-
// eg Karpathy, dan_abramov,

// api docs say timeline can only be fetched to last 7 days or 800 mentions/rev chronological;  3200 tweets
// but can we fetch old tweets from specific date range?
function getShuffledArray(array: any[]) {
  if (array.length < 3) {
    return;
  }

  // Create a copy of the array so we don't modify the original
  const arrayCopy = array.slice();

  // Shuffle the array in place using the Fisher-Yates shuffle algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  // Return the first three items from the shuffled array
  return arrayCopy;
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
  return { dateFrom, dateTo };
}