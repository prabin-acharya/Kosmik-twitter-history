import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi, TwitterV2IncludesHelper } from "twitter-api-v2";

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

  const refreshedClient = new TwitterApi(access_Token);

  const username = req.query.username;

  const userId = (
    await refreshedClient.v2.userByUsername(username as string, {
      "user.fields": ["id"],
    })
  ).data.id;

  const user = await refreshedClient.v2.user(userId, {
    "user.fields": [
      "id",
      "name",
      "username",
      "profile_image_url",
      "description",
      "public_metrics",
      "url",
      "entities",
    ],
  });

  const ownedLists = await refreshedClient.v2.listsOwned(userId, {
    max_results: 100,
    "list.fields": ["private"],
  });

  const followedListsPaginator = await refreshedClient.v2.listFollowed(userId, {
    expansions: ["owner_id"],
    "list.fields": [
      "description",
      "owner_id",
      "member_count",
      "follower_count",
    ],
    "user.fields": ["name", "username", "profile_image_url"],
  });

  const followedLists = [];
  const includes = new TwitterV2IncludesHelper(followedListsPaginator);

  for await (const list of followedListsPaginator) {
    const owner = includes.listOwner(list);
    followedLists.push({
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
    user: user,
    lists: {
      followedLists,
      ownedLists: ownedLists.data.data || [],
    },
  });
}
