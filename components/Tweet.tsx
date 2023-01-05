import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdOutlineMoreHoriz } from "react-icons/md";

import { TweetType } from "../types";
import { ListMenu } from "./ListMenu";
import styles from "./Tweet.module.css";
import { UserDetail } from "./UserDetail";
import { formatDate } from "./utils";

interface Props {
  tweet: TweetType;
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
}

export const Tweet: NextPage<Props> = ({ tweet, ownedLists }) => {
  const [showUserPopup, setShowUserPopup] = useState<Boolean>(false);
  const [showMenu, setShowMenu] = useState<Boolean>(false);
  const [liked, setLiked] = useState<Boolean>(false);

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

  const closeMenu = () => {
    setShowMenu(false);
  };

  const likeTweet = async () => {
    try {
      const res = await fetch(`/api/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tweetId: tweet.id,
          action: "likeTweet",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(true);
      }
    } catch (error) {
      console.log(error);
    }
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
          </div>

          <div className={styles.tweetHeaderRight}>
            <span
              className={styles.tweetMenu}
              onClick={handleClickMenu}
              ref={menuRef}
            >
              <MdOutlineMoreHoriz className={styles.tweetMenuIcon} />
              {showMenu && (
                <ListMenu
                  mentions={tweet.mentions}
                  ownedLists={ownedLists}
                  username={tweet.username}
                  id={tweet.id}
                />
              )}
            </span>
            <span className={styles.tweetHeaderDate}>
              {formatDate(tweet.created_at)}
            </span>
          </div>
        </div>
        {showUserPopup && <UserDetail authorId={tweet.authorId} />}

        <div className={styles.tweetBody}>{entitiesToText(tweet)}</div>

        <div className={styles.tweetFooter}>
          <div className={styles.tweetFooterLike}>
            <AiOutlineHeart
              className={
                !liked
                  ? styles.tweetFooterLikeIcon
                  : styles.tweetFooterLikeIconFill
              }
              onClick={likeTweet}
            />
            <span className={styles.tweetFooterLikeCount}>
              {tweet.public_metrics?.like_count}
            </span>
          </div>

          <div className={styles.tweetFooterRetweet}>
            <AiOutlineRetweet className={styles.tweetFooterRetweetIcon} />
            <span className={styles.tweetFooterRetweetCount}>
              {tweet.public_metrics?.retweet_count +
                tweet.public_metrics?.quote_count}
            </span>
          </div>

          <div className={styles.tweetFooterReply}>
            <FaComment className={styles.tweetFooterReplyIcon} />
            <span className={styles.tweetFooterReplyCount}>
              {tweet.public_metrics?.reply_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const entitiesToText = (tweet: TweetType) => {
  let mentions = tweet?.mentions?.map((mention, index) => ({
    key: index,
    screen_name: mention.username,
    start: mention.start,
    end: mention.end,
    url: undefined,
  }));

  let links = tweet.entities?.urls?.map((url, index) => ({
    key: index + 1000,
    url: url.expanded_url,
    short_url: url.display_url,
    start: url.start,
    end: url.end,
    screen_name: undefined,
  }));

  if (!links) links = [];
  if (!mentions) mentions = [];

  if (!mentions && !links) {
    return tweet.text;
  }

  const entities = [...mentions, ...links].sort((a, b) => a.start - b.start);

  let currentIndex = 0;
  const parts: (string | JSX.Element)[] = [];

  for (const entity of entities) {
    if (currentIndex < entity.start) {
      parts.push(tweet.text.substring(currentIndex, entity.start));
    }
    if (entity?.screen_name) {
      parts.push(
        <a
          key={entity.key}
          href={`https://twitter.com/${entity.screen_name}`}
          target="_blank"
          rel="noreferrer"
        >
          @{entity.screen_name}
        </a>
      );
    } else if (entity.url) {
      parts.push(
        <a key={entity.key} href={entity.url} target="_blank" rel="noreferrer">
          {entity.short_url}
        </a>
      );
    }
    currentIndex = entity.end;
  }

  if (currentIndex < tweet.text.length) {
    parts.push(tweet.text.substring(currentIndex));
  }

  return parts;
};
