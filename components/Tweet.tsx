import { NextPage } from "next";
import Image from "next/image";
import React from "react";

import { formatDate } from "./utils";

import Link from "next/link";
import styles from "./Tweet.module.css";

interface Props {
  tweet: {
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
  };
}

export const Tweet: NextPage<Props> = ({ tweet }) => {
  return (
    <div className={styles.container}>
      <Link href={`https://twitter.com/${tweet.username}/status/${tweet.id}`}>
        <div className={styles.tweet}>
          <div className={styles.tweetHeader}>
            <div className={styles.tweetHeaderLeft}>
              <Image
                className={styles.tweetHeaderAvatar}
                src={tweet.profile_image_url}
                alt="avatar"
                width={30}
                height={30}
              />
              <div className={styles.tweetHeaderName}>
                <a href={`https://twitter.com/${tweet.username}`}>
                  <strong>{tweet.name}</strong>
                </a>
                <span className={styles.tweetHeaderHandle}>
                  @{tweet.username}
                </span>
              </div>
            </div>

            <div className={styles.tweetHeaderRight}>
              <span className={styles.tweetHeaderDate}>
                {formatDate(tweet.created_at)}
              </span>
            </div>
          </div>

          <div className={styles.tweetBody}>
            <p className={styles.tweetText}>{tweet.text}</p>
          </div>

          <div className={styles.tweetFooter}>
            <div className={styles.tweetFooterLike}>
              <span className={styles.tweetFooterLikeCount}>
                {tweet.public_metrics?.like_count}
              </span>
              <span className={styles.tweetFooterLikeLabel}>Likes</span>
            </div>

            <div className={styles.tweetFooterReply}>
              <span className={styles.tweetFooterReplyCount}>
                {tweet.public_metrics?.reply_count}
              </span>
              <span className={styles.tweetFooterReplyLabel}>Replies</span>
            </div>

            <div className={styles.tweetFooterRetweet}>
              <span className={styles.tweetFooterRetweetCount}>
                {tweet.public_metrics?.retweet_count}
              </span>
              <span className={styles.tweetFooterRetweetLabel}>Retweets</span>
            </div>

            <div className={styles.tweetFooterQuote}>
              <span className={styles.tweetFooterQuoteCount}>
                {tweet.public_metrics?.quote_count}
              </span>
              <span className={styles.tweetFooterQuoteLabel}>Quotes</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
