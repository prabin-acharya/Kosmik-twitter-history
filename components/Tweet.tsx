import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { ListMenu } from "./ListMenu";
import { UserDetail } from "./UserDetail";

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
    authorId: number;
    mentions: {
      username: string;
      id: number;
      start: number;
      end: number;
    }[];
  };
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
}

interface UserDetail {
  user: {
    data: {
      id: number;
      name: string;
      username: string;
      description: string;
    };
  };
}

export const Tweet: NextPage<Props> = ({ tweet, ownedLists }) => {
  const [showUserPopup, setShowUserPopup] = useState<Boolean>(false);
  const [showMenu, setShowMenu] = useState<Boolean>(false);

  const handleMouseEnter = async () => {
    if (!showUserPopup) {
      setShowUserPopup(true);
    }
  };

  const handleMouseLeave = async () => {
    setShowUserPopup(false);
  };

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleClickMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.tweet}
        // onClick={() => {
        //   window.open(
        //     `https://twitter.com/${tweet.username}/status/${tweet.id}`,
        //     "_blank"
        //   );
        // }}
      >
        <div className={styles.tweetHeader}>
          <div
            className={styles.tweetHeaderLeft}
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
            <span className={styles.tweetHeaderDate}>
              {formatDate(tweet.created_at)}
            </span>
          </div>

          <div className={styles.tweetHeaderRight}>
            <span
              className={styles.tweetMore}
              onClick={handleClickMenu}
              ref={menuRef}
            >
              ...
              {showMenu && (
                <ListMenu mentions={tweet.mentions} ownedLists={ownedLists} />
              )}
            </span>
          </div>
        </div>
        {showUserPopup && <UserDetail authorId={tweet.authorId} />}

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
    </div>
  );
};
