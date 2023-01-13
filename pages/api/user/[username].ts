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

  try {
    const twitterClient = new TwitterApi(access_Token);

    const username = req.query.username;

    const userId = (
      await twitterClient.v2.userByUsername(username as string, {
        "user.fields": ["id"],
      })
    ).data.id;

    const user = await twitterClient.v2.user(userId, {
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

    const ownedListsPaginator = await twitterClient.v2.listsOwned(userId, {
      max_results: 100,
      "list.fields": [
        "private",
        "created_at",
        "description",
        "member_count",
        "follower_count",
      ],
    });

    const ownedLists =
      ownedListsPaginator.data.data?.map((list) => {
        return {
          id: list.id,
          name: list.name,
          description: list.description,
          member_count: list.member_count,
          follower_count: list.follower_count,
          created_at: list.created_at,
          private: list.private,
          owner: {
            id: user.data.id,
            name: user.data.name,
            username: user.data.username,
            profile_image_url: user.data.profile_image_url,
          },
        };
      }) || [];

    const followedListsPaginator = await twitterClient.v2.listFollowed(userId, {
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
        private: false,
      });
    }

    res.status(200).json({
      user: user,
      lists: [...ownedLists, ...followedLists],
    });
  } catch (error: any) {
    res.status(error.data.status).json({
      Error: error.data.detail,
    });
  }
}
