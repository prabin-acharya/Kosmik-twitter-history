import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import Link from "next/link";
import { TweetExpanded } from "../../components/TweetExpanded";

interface TweetDetails {
  data: {
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
    author_id: number;
  };
  includes?: {};
}

const TweetId: NextPage = () => {
  const [tweet, setTweet] = useState<TweetDetails>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tweetId = router.query.tweetId;

  useEffect(() => {
    const fetchTweet = async () => {
      const res = await fetch(`/api/tweet/${tweetId}`);
      const data = await res.json();
      setTweet(data.tweet);
      setLoading(false);
    };

    tweetId && fetchTweet();
  }, [tweetId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Tweet</h2>
      {tweet && <TweetExpanded data={tweet?.data} includes={tweet?.includes} />}
    </div>
  );
};

export default TweetId;
