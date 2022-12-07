import { NextPage } from "next";
import Image from "next/image";
import React from "react";

import { formatDate } from "./utils";

import styles from "./Tweet.module.css";

interface Props {
  data: {
    id: number;
    text: string;
    created_at: Date;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
    profile_image_url: string;
    username: string;
    name: string;
    author_id: number;
  };
  includes?: {
    users?: {
      id: number;
      username: string;
      name: string;
      profile_image_url: string;
    }[];
  };
}

export const TweetExpanded: NextPage<Props> = ({ data, includes }) => {
  const authorId = data.author_id;
  const author_profile_image_url = includes?.users?.find(
    (user) => user.id === authorId
  )?.profile_image_url;

  const author = includes?.users?.find((user) => user.id === authorId);

  return (
    <div className={styles.container}>
      <div className={styles.tweet}>
        <div className={styles.tweetHeader}>
          <div className={styles.tweetHeaderLeft}>
            {author_profile_image_url && (
              <Image
                className={styles.tweetHeaderAvatar}
                src={author_profile_image_url}
                alt="avatar"
                width={30}
                height={30}
              />
            )}

            <div className={styles.tweetHeaderName}>
              <a href={`https://twitter.com/${data.username}`}>
                <strong>{author?.name}</strong>
              </a>
              <span className={styles.tweetHeaderHandle}>
                @{author?.username}
              </span>
            </div>
          </div>

          <div className={styles.tweetHeaderRight}>
            <span className={styles.tweetHeaderDate}>
              {formatDate(data.created_at)}
            </span>
          </div>
        </div>

        <div className={styles.tweetBody}>
          <p className={styles.tweetText}>{data.text}</p>
        </div>

        <div className={styles.tweetFooter}>
          <div className={styles.tweetFooterLike}>
            <span className={styles.tweetFooterLikeCount}>
              {data.public_metrics?.like_count}
            </span>
            <span className={styles.tweetFooterLikeLabel}>Likes</span>
          </div>

          <div className={styles.tweetFooterReply}>
            <span className={styles.tweetFooterReplyCount}>
              {data.public_metrics?.reply_count}
            </span>
            <span className={styles.tweetFooterReplyLabel}>Replies</span>
          </div>

          <div className={styles.tweetFooterRetweet}>
            <span className={styles.tweetFooterRetweetCount}>
              {data.public_metrics?.retweet_count}
            </span>
            <span className={styles.tweetFooterRetweetLabel}>Retweets</span>
          </div>

          <div className={styles.tweetFooterQuote}>
            <span className={styles.tweetFooterQuoteCount}>
              {data.public_metrics?.quote_count}
            </span>
            <span className={styles.tweetFooterQuoteLabel}>Quotes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
