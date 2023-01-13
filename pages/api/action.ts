import { NextApiRequest, NextApiResponse } from "next";
import {
  TweetPublicMetricsV2,
  TwitterApi,
  TwitterV2IncludesHelper,
} from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_Token = req.cookies.access_Token as string;

  if (!access_Token) {
    res.status(401).json({
      Error: " User not authenticated. No tokens.",
    });
    return;
  }

  if (!req.body) {
    return res.status(400).json({ error: "Missing body." });
  }

  const action = req.body.action;

  if (!action) {
    return res.status(400).json({ error: "Missing action." });
  }

  try {
    const twitterClient = new TwitterApi(access_Token);

    const userId = (await twitterClient.v2.me()).data.id;

    let response;

    switch (action) {
      case "likeTweet":
        console.log("like");
        const likeRes = await twitterClient.v2.like(userId, req.body.tweetId);
        console.log(likeRes);
        break;

      case "retweet":
        console.log("retweet");
        const retweetRes = await twitterClient.v2.retweet(
          userId,
          req.body.tweetId
        );
        console.log(retweetRes);
        break;

      case "bookmarkTweet":
        console.log("bookmarkTweet");
        const bookmarkedRes = await twitterClient.v2.bookmark(req.body.tweetId);
        console.log(bookmarkedRes);
        break;

      case "addMemberToList":
        console.log("addToList");
        response = await twitterClient.v2.addListMember(
          req.body.listId,
          req.body.memberId
        );
        break;

      case "createList":
        console.log("createList");
        const members = req.body.members || [];
        const createdList = await twitterClient.v2.createList({
          name: req.body.name,
          description: req.body.description,
          private: req.body.isPrivate,
        });

        members.forEach(async (member: string) => {
          const addedMember = await twitterClient.v2.addListMember(
            createdList.data.id,
            member
          );
          response = addedMember;
        });

        break;

      case "followList":
        console.log("followList");
        response = await twitterClient.v2.subscribeToList(
          userId,
          req.body.listId
        );
        break;

      case "unFollowList":
        console.log("unfollowList");
        response = await twitterClient.v2.unsubscribeOfList(
          userId,
          req.body.listId
        );
        break;

      default:
        console.log("default");
        break;
    }

    console.log(response);

    res.status(201).json({
      res: response,
    });
  } catch (error: any) {
    res.status(error.data.status).json({
      Error: error.data.detail,
    });
  }
}
