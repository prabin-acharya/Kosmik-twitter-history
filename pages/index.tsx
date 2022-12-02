import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

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

  return (
    <div className={styles.container}>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default Home;
