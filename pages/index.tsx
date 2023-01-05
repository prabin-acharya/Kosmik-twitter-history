import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import Link from "next/link";
import Router, { useRouter } from "next/router";
import { CreateList } from "../components/CreateList";
import { Spinner } from "../components/Spinner";
import { Tweet } from "../components/Tweet";

// server side props
export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies;

  return {
    props: {
      cookies,
    },
  };
}

interface Tweet {
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
  entities: {
    urls: {
      url: string;
      start: number;
      end: number;
      expanded_url: string;
      display_url: string;
    }[];

    hashtags: {
      tag: string;
      start: number;
      end: number;
    }[];

    mentions: {
      username: string;
      id: number;
      start: number;
      end: number;
    }[];

    annotations: {
      start: number;
      end: number;
      probability: number;
      type: string;
      normalized_text: string;
    }[];

    media: {
      start: number;
      end: number;
      type: string;
      url: string;
      preview_image_url: string;
    }[];
  };
}

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image_url?: string;
}

//

interface List {
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
  followedLists: {
    id: number;
    name: string;
    description: string;
    members_count: number;
    followers_count: number;
    owner: User;
    private: false;
  }[];
}

interface Props {
  cookies: any;
  hamro: string;
  lists: List;
  handleListsChange: (
    ownedLists: List["ownedLists"],
    followedLists: List["followedLists"]
  ) => void;
}

const Home: NextPage<Props> = ({ lists, handleListsChange }) => {
  const [userTimeline, setUserTimeline] = useState<Tweet[]>();
  const [timelineLoading, setTimelineLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const from = router.query.from as string;
    const to = router.query.to as string;

    let url = `/api/home`;

    if (from && to) {
      url = `/api/home?from=${from}&to=${to}`;
    }

    const fetchHome = async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      setUserTimeline(data.tweets);
      setTimelineLoading(false);
      console.log(data);
    };

    fetchHome(url);
  }, [router.query]);

  return (
    <div className={styles.container}>
      {timelineLoading ? (
        <div className={styles.tweetContainer}>
          <div className={styles.loading}>
            <Spinner />
          </div>
        </div>
      ) : (
        <div className={styles.tweetContainer}>
          {userTimeline?.map((tweet) => (
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
    // {showModal && <CreateList setShowModal={setShowModal} />}
    // </div>
  );
};

export default Home;
