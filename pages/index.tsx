import type { NextPage } from "next";
import Image from "next/image";
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

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<tweet[]>([]);
  const [userDetails, setUserDetails] = useState<userDetails>();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await fetch("/api/auth/home");
    const data = await res.json();
    console.log(data);
    setUserDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // if (loading) {
  //   return <div>loading...</div>;
  // }

  return (
    <div className={styles.container}>
      {/* create a container div with two columns, one on left occupying 30% of screen and other on the right */}
      <div className={styles.sidebar}>
        <div className={styles.following}>
          <ul>
            {userDetails?.user?.following?.slice(0, 10)?.map((user) => (
              <li key={user.username}>{user.username}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.name}>
            <span> - {userDetails?.user?.data?.name} </span>
            <span>@{userDetails?.user?.data?.username}</span>
          </div>
        </div>

        {!userDetails?.user?.data?.name && (
          <Link href={"http://127.0.0.1:3000/api/auth"}>Authorize Twitter</Link>
        )}
        <button onClick={() => {}}>CLick me</button>
      </div>
    </div>
  );
};

export default Home;
