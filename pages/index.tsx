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

interface user {
  id: number;
  name: string;
  username: string;
}

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<tweet[]>([]);
  const [user, setUser] = useState<user>();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await fetch("/api/auth/home");
    const data = await res.json();
    console.log(data);
    setUser(data.user);
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
      <div className={styles.header}>
        <div className={styles.name}>
          <span> - {user?.name} </span>
          <span>@{user?.username}</span>
        </div>
      </div>

      {!user?.name && (
        <Link href={"http://127.0.0.1:3000/api/auth"}>Authorize Twitter</Link>
      )}
      <button onClick={() => {}}>CLick me</button>
    </div>
  );
};

export default Home;
