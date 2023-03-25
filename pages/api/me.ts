import { NextApiRequest, NextApiResponse } from "next";
import {
  ApiResponseError,
  TweetPublicMetricsV2,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";

interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_Token = req.cookies.access_Token as string;

  if (!access_Token) {
    res.status(403).json({
      Error: " User not authenticated",
    });
    return;
  }

  try {
    const twitterClient = new TwitterApi(access_Token);

    const user = await twitterClient.v2.me({
      "user.fields": [
        "id",
        "name",
        "username",
        "profile_image_url",
        "description",
      ],
    });

    const following = await twitterClient.v2.following(user.data.id, {
      "user.fields": ["id", "name", "username", "profile_image_url"],
      max_results: 500,
    });

    const followedListsPaginator = await twitterClient.v2.listFollowed(
      user.data.id,
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

    const ownedListsPaginator = await twitterClient.v2.listsOwned(
      user.data.id,
      {
        max_results: 100,
        "list.fields": [
          "private",
          "created_at",
          "description",
          "member_count",
          "follower_count",
        ],
      }
    );

    const ownedLists = ownedListsPaginator.data.data.map((list) => {
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
    });

    res.status(200).json({
      user: user.data,
      following: following.data,
      lists: [...ownedLists, ...followedLists],
    });
  } catch (error: any) {
    res.status(error.data.status).json({
      Error: error.data.detail,
    });
  }
}
