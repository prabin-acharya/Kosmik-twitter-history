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

  const members = await refreshedClient.v2.listMembers(listId as string, {
    "user.fields": [
      "id",
      "name",
      "username",
      "profile_image_url",
      "description",
    ],
  });

  res.status(200).json({
    members: members.data.data,
  });
}
