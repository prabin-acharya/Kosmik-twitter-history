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

  return (
    <div className={styles.tweet}>
      <div
        className={styles.avatar}
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
      </div>
      <div className={styles.tweetContent}>
        <div className={styles.header}>
          <div className={styles.user}>
            <span>{tweet.name}</span>
            <span className={styles.handle}>@{tweet.username}</span>
          </div>

          <div className={styles.menu} onClick={handleClickMenu} ref={menuRef}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-1awozwy">
              <g>
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </g>
            </svg>
            {showMenu && (
              <ListMenu
                mentions={tweet.mentions}
                ownedLists={ownedLists}
                username={tweet.username}
                id={tweet.id}
              />
            )}
          </div>
        </div>
        {showUserPopup && <UserDetail username={tweet.username} />}

        <div className={styles.tweetBody}>{entitiesToText(tweet)}</div>
        <div className={styles.date}> {formatDate(tweet.created_at)}</div>
      </div>

      {/*  <div
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
            <span className={styles.tweetHeaderHandle}>@{tweet.username}</span>
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
        </div> */}
      {/* </div> */}

      {/* <div className={styles.tweetBody}>{entitiesToText(tweet)}</div> */}
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
