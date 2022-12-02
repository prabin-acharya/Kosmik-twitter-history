// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import internal from "stream";
import { Client } from "twitter-api-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new Client(process.env.BEARER_TOKEN as string);

  const { data } = await client.users.findUserByUsername("PalmerLuckey", {
    "user.fields": ["profile_image_url", "name", "username", "description"],
  });
  if (!data) throw new Error("Couldn't find user");

  let following = await client.users.usersIdFollowing(data.id, {
    max_results: 5,
    "user.fields": ["id", "name", "description", "public_metrics"],
  });

  const sortedFollowing = following?.data
    ?.sort(
      (a, b) =>
        (b.public_metrics?.followers_count ?? 0) -
        (a.public_metrics?.followers_count ?? 0)
    )
    .map((user) => {
      return {
        id: user.id,
        name: user.name,
        description: user.description,
        publicMetrics: user.public_metrics,
      };
    });

  const tweets = await client.tweets.usersIdTweets(data.id, {
    max_results: 5,
    start_time: "2020-05-05T00:00:00.52Z",
    end_time: "2020-07-05T00:00:00.52Z",
    "tweet.fields": ["id", "text", "created_at", "public_metrics", "source"],
  });

  const sortedTweets = tweets?.data
    ?.sort(
      (a, b) =>
        (b.public_metrics?.retweet_count ?? 0) -
        (a.public_metrics?.retweet_count ?? 0)
    )
    .map((tweet) => {
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
        profile_image_url: data.profile_image_url,
        username: data.username,
        name: data.name,
      };
    });

  res
    .status(200)
    .json({ data, tweets: sortedTweets, following: sortedFollowing });
}

// Client {
//   bookmarks: {
//     getUsersIdBookmarks: [Function: getUsersIdBookmarks],
//     postUsersIdBookmarks: [Function: postUsersIdBookmarks],
//     usersIdBookmarksDelete: [Function: usersIdBookmarksDelete]
//   },
//   compliance: {
//     listBatchComplianceJobs: [Function: listBatchComplianceJobs],
//     createBatchComplianceJob: [Function: createBatchComplianceJob],
//     getBatchComplianceJob: [Function: getBatchComplianceJob]
//   },
//   general: { getOpenApiSpec: [Function: getOpenApiSpec] },
//   lists: {
//     listIdCreate: [Function: listIdCreate],
//     listIdDelete: [Function: listIdDelete],
//     listIdGet: [Function: listIdGet],
//     listIdUpdate: [Function: listIdUpdate],
//     listAddMember: [Function: listAddMember],
//     listRemoveMember: [Function: listRemoveMember],
//     userFollowedLists: [Function: userFollowedLists],
//     listUserFollow: [Function: listUserFollow],
//     listUserUnfollow: [Function: listUserUnfollow],
//     getUserListMemberships: [Function: getUserListMemberships],
//     listUserOwnedLists: [Function: listUserOwnedLists],
//     listUserPinnedLists: [Function: listUserPinnedLists],
//     listUserPin: [Function: listUserPin],
//     listUserUnpin: [Function: listUserUnpin]
//   },
//   spaces: {
//     findSpacesByIds: [Function: findSpacesByIds],
//     findSpacesByCreatorIds: [Function: findSpacesByCreatorIds],
//     searchSpaces: [Function: searchSpaces],
//     findSpaceById: [Function: findSpaceById],
//     spaceBuyers: [Function: spaceBuyers],
//     spaceTweets: [Function: spaceTweets]
//   },
//   tweets: {
//     listsIdTweets: [Function: listsIdTweets],
//     findTweetsById: [Function: findTweetsById],
//     createTweet: [Function: createTweet],
//     tweetCountsFullArchiveSearch: [Function: tweetCountsFullArchiveSearch],
//     tweetCountsRecentSearch: [Function: tweetCountsRecentSearch],
//     sampleStream: [Function: sampleStream],
//     tweetsFullarchiveSearch: [Function: tweetsFullarchiveSearch],
//     tweetsRecentSearch: [Function: tweetsRecentSearch],
//     searchStream: [Function: searchStream],
//     getRules: [Function: getRules],
//     addOrDeleteRules: [Function: addOrDeleteRules],
//     deleteTweetById: [Function: deleteTweetById],
//     findTweetById: [Function: findTweetById],
//     findTweetsThatQuoteATweet: [Function: findTweetsThatQuoteATweet],
//     hideReplyById: [Function: hideReplyById],
//     usersIdLikedTweets: [Function: usersIdLikedTweets],
//     usersIdLike: [Function: usersIdLike],
//     usersIdUnlike: [Function: usersIdUnlike],
//     usersIdMentions: [Function: usersIdMentions],
//     usersIdRetweets: [Function: usersIdRetweets],
//     usersIdUnretweets: [Function: usersIdUnretweets],
//     usersIdTimeline: [Function: usersIdTimeline],
//     usersIdTweets: [Function: usersIdTweets]
//   },
//   users: {
//     listGetFollowers: [Function: listGetFollowers],
//     listGetMembers: [Function: listGetMembers],
//     tweetsIdLikingUsers: [Function: tweetsIdLikingUsers],
//     tweetsIdRetweetingUsers: [Function: tweetsIdRetweetingUsers],
//     findUsersById: [Function: findUsersById],
//     findUsersByUsername: [Function: findUsersByUsername],
//     findUserByUsername: [Function: findUserByUsername],
//     findMyUser: [Function: findMyUser],
//     findUserById: [Function: findUserById],
//     usersIdBlocking: [Function: usersIdBlocking],
//     usersIdBlock: [Function: usersIdBlock],
//     usersIdFollowers: [Function: usersIdFollowers],
//     usersIdFollowing: [Function: usersIdFollowing],
//     usersIdFollow: [Function: usersIdFollow],
//     usersIdMuting: [Function: usersIdMuting],
//     usersIdMute: [Function: usersIdMute],
//     usersIdUnblock: [Function: usersIdUnblock],
//     usersIdUnfollow: [Function: usersIdUnfollow],
//     usersIdUnmute: [Function: usersIdUnmute]
//   },
//   version: '1.1.0',
//   twitterApiOpenApiVersion: '2.45'
// }
