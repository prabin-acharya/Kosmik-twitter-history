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

  const listId = req.query.listId;

  if (!listId) {
    res.status(400).json({
      Error: "List id not provided",
    });
    return;
  }

  const list = await refreshedClient.v2.list(listId as string, {
    "list.fields": ["description", "member_count", "follower_count"],
    "user.fields": ["id", "name", "username", "profile_image_url"],
    expansions: "owner_id",
  });

  res.status(200).json({
    list: {
      ...list.data,
      owner: list.includes?.users?.[0],
    },
  });
}
