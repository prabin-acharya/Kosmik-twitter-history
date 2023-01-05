import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Tweet } from "../../components/Tweet";
import styles from "./../../styles/List.module.css";

import { List, Lists, TweetType, User } from "../../types";

interface Props {
  lists: Lists;
  handleListsChange: (
    ownedLists: Lists["ownedLists"],
    followedLists: Lists["followedLists"]
  ) => void;
}

export const ListPage: NextPage<Props> = ({ lists, handleListsChange }) => {
  const router = useRouter();
  const { listId } = router.query;

  const [list, setList] = useState<List>();
  const [tweets, setTweets] = useState<TweetType[]>();

  const followList = async () => {
    try {
      const res = await fetch(`/api/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId,
          action: "followList",
        }),
      });
      const data = await res.json();
      if (list) {
        const newFollowedList = [...lists.followedLists, list];
        handleListsChange(lists.ownedLists, newFollowedList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/list/${listId}`);
      const data = await res.json();
      setList(data.list);

      const tweets = await fetch(`/api/list/${listId}/timeline`);
      const tweetsData = await tweets.json();
      setTweets(tweetsData.tweets);
    };

    if (listId) {
      fetchData();
    }
  }, [listId]);

  if (!listId || !list) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <h1>{list.name}</h1>
        <div
          className={styles.owner}
          onClick={() => router.push(`/${list.owner.username}`)}
        >
          <Image
            src={list.owner.profile_image_url}
            alt="Picture of the author"
            width={50}
            height={50}
          />
          <span>
            <b>{list.owner.name}</b>
          </span>
          <span className={styles.subtext}>@{list.owner.username}</span>
        </div>
        {list.description && <p>{list.description}Hello world!</p>}
        <div className={styles.metrics}>
          <span>
            <b>{list.member_count}</b>
            <span className={styles.subtext}>Members</span>
          </span>
          <span>
            <b>{list.follower_count}</b>
            <span className={styles.subtext}>Followers</span>
          </span>
        </div>
        <button onClick={followList}>Follow</button>
      </div>
      {!tweets ? (
        <Spinner />
      ) : (
        <div className={styles.listTimeline}>
          {tweets?.map((tweet) => (
            <div
              key={tweet.id}
              // onClick={() => router.push(`/tweet/${tweet.id}`)}
            >
              <Tweet
                tweet={tweet}
                ownedLists={lists && lists.ownedLists ? lists?.ownedLists : []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPage;
