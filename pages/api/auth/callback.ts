import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import clientPromise from "./../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;

  const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
  });

  const client = await clientPromise;
  const db = client.db("twihistory-nextjs");

  const users = await db.collection("authTwitter").findOne({ state: state });

  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code: code as string,
    codeVerifier: users.codeVerifier,
    redirectUri: process.env.TWITTER_CALLBACK_URL as string,
  });

  res.setHeader("Set-Cookie", [
    `access_Token=${accessToken}; HttpOnly; SameSite=Strict; Path=/`,
    `refresh_Token=${refreshToken}; HttpOnly; SameSite=Strict; Path=/`,
  ]);

  res.redirect(process.env.APP_URL as string);
}

// import type { NextApiRequest, NextApiResponse } from "next";
// import { TwitterApi } from "twitter-api-v2";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Extract state and code from query string
//   const { state, code } = req.query;
//   // Get the saved codeVerifier from session
//   const { codeVerifier, state: sessionState } = req.session;

//   if (!codeVerifier || !state || !sessionState || !code) {
//     return res.status(400).send("You denied the app or your session expired!");
//   }
//   if (state !== sessionState) {
//     return res.status(400).send("Stored tokens didnt match!");
//   }

//   // Obtain access token
//   const client = new TwitterApi({
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//   });

//   client
//     .loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
//     .then(
//       async ({
//         client: loggedClient,
//         accessToken,
//         refreshToken,
//         expiresIn,
//       }) => {
//         // {loggedClient} is an authenticated client in behalf of some user
//         // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
//         // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

//         // Example request
//         const { data: userObject } = await loggedClient.v2.me();
//       }
//     )
//     .catch(() => res.status(403).send("Invalid verifier or access tokens!"));
//   //   res.status(200).json({ name: "John Doe" });
// }
