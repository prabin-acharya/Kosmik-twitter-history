import { NextApiRequest, NextApiResponse } from "next";
import {
  ApiResponseError,
  TweetPublicMetricsV2,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";
import { UserDetail } from "../../components/UserDetail";

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

  const twitterClient = new TwitterApi(access_Token);

  res.status(200).json({ hell: "oo" });
}
