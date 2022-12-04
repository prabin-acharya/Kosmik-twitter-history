import type { NextPage } from "next";
import { useRouter } from 'next/router';
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

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<tweet[]>([]);

  const fetchTweets = async () => {
    const res = await fetch("/api/tweets");
    const data = await res.json();
    console.log(data);
    setTweets(data.tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);


  const fetchTest = async () => {
    const res = await fetch("/api/auth/tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    console.log(data);
  };


  return (
    <div className={styles.container}>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      <hr />
      <Link href={"http://127.0.0.1:3000/api/auth"} >Authorize Twitter</Link>
      <button onClick={() => {
        fetchTest()
      }}>CLick me</button>
    </div>
  );
};

export default Home;
