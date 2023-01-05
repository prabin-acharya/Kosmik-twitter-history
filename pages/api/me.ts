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

  //     // if (!access_Token) {
  //   // res.status(401).json({
  //   //   Error: " User not authenticated",
  //   // });
  //   res.redirect("/sigini");

  //   return;
  //   // }
  // }

  const refreshedClient = new TwitterApi(access_Token);

  const user: { data: User; following?: User[] } = await refreshedClient.v2.me({
    "user.fields": ["id", "name", "username", "profile_image_url"],
  });

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
    user,
    lists: {
      ownedLists: userOwnedLists.data.data,
      followedLists: lists,
    },
  });
}
