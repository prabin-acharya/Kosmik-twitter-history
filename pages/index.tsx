import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import Link from "next/link";
import { Tweet } from "../components/Tweet";

interface tweet {
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
}

interface User {
  id: number;
  name: string;
  username: string;
}

interface userDetails {
  user: { data: User; following: User[] };
  oldTweets: tweet[];
}

interface List {
  id: number;
  name: string;
  description: string;
  members_count: number;
  followers_count: number;
  owner: {
    id: number;
    name: string;
    username: string;
    profile_image_url: string;
  };
}

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<tweet[]>([]);
  const [userDetails, setUserDetails] = useState<userDetails>();
  const [listFollowed, setListFollowed] = useState<List[]>();
  const [listLoading, setListLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/home?listId=1539497752140206080");
      const data = await res.json();
      console.log(data);
      setUserDetails(data);
      setLoading(false);
      fetchUserFollowedLists();
    };

    const fetchUserFollowedLists = async () => {
      const res = await fetch("/api/lists");
      const data = await res.json();
      console.log(data);
      setListFollowed(data.lists);
      setListLoading(false);
    };

    fetchUser();
  }, []);

  console.log(userDetails?.user.following.slice(0, 10));
  // if (loading) {
  //   return <div>loading...</div>;
  // }

  return (
    <div className={styles.container}>
      {/* create a container div with two columns, one on left occupying 30% of screen and other on the right */}
      <div className={styles.sidebar}>
        {!userDetails?.user?.data?.name && (
          <Link href={"http://127.0.0.1:3000/api/auth"}>Authorize Twitter</Link>
        )}

        <div className={styles.header}>
          <div className={styles.name}>
            <span> - {userDetails?.user?.data?.name} </span>
            <span>@{userDetails?.user?.data?.username}</span>
          </div>
        </div>

        <div className={styles.search}>
          <h4>Search</h4>
          <input type="text" />
        </div>
        <div className={styles.following}>
          <h4>Recent Follows</h4>
          <ul>
            {userDetails?.user?.following?.slice(0, 10)?.map((user) => (
              <li key={user.username}>{user.username}</li>
            ))}
          </ul>
        </div>
        <div className={styles.lists}>
          <h4>Lists</h4>
          <ul>
            {listFollowed?.slice(0, 10)?.map((list) => (
              <li key={list.id}>
                <b>{list.name}</b>
                <span>{list.id}</span>
                <br />
                <span>by @{list.owner.username}</span>
                <br />
                <span>{list.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <b>Home</b>
        </div>
        <div className={styles.tweetContainer}>
          {userDetails?.oldTweets?.map((tweet) => (
            <div
              key={tweet.id}
              onClick={() => router.push(`/tweet/${tweet.id}`)}
            >
              <Tweet tweet={tweet} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
