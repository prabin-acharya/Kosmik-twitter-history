import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import Router, { useRouter } from "next/router";
import { CreateList } from "../components/CreateList";
import { Spinner } from "../components/Spinner";
import { Tweet } from "../components/Tweet";

import { ListType, TweetType, User } from "../types";

// server side props
export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies;

  return {
    props: {
      cookies,
    },
  };
}

interface Props {
  user: User;
  lists: ListType[];
  handleListsChange: (updatedLists: ListType[]) => void;
}

const Home: NextPage<Props> = ({ user, lists, handleListsChange }) => {
  const [userTimeline, setUserTimeline] = useState<TweetType[]>();
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
    };

    if (router.pathname !== "/lists/create") fetchHome(url);
  }, [router.query.from, router.query.to, router.pathname]);

  const ownedLists = lists.filter((list) => list.owner.id === user.id);
  const followedLists = lists.filter((list) => list.owner.id !== user.id);
  return (
    <div className={styles.tweetsContainer}>
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
              <Tweet tweet={tweet} ownedLists={ownedLists} />
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
