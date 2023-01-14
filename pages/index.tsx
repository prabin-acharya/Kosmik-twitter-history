import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import { useRouter } from "next/router";
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
  showSidebar: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const Home: NextPage<Props> = ({ user, lists, showSidebar, openSidebar }) => {
  const [userTimeline, setUserTimeline] = useState<TweetType[]>();
  const [timelineLoading, setTimelineLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const from = router.query.from as string;
    const to = router.query.to as string;

    let url = `/api/timeline`;

    if (from && to) {
      url = `/api/timeline?from=${from}&to=${to}`;
    }

    const fetchHome = async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      setUserTimeline(data.tweets);
      setTimelineLoading(false);
    };

    fetchHome(url);
  }, [router.query.from, router.query.to, router.pathname]);

  const ownedLists = lists?.filter((list) => list.owner.id === user.id);
  return (
    <>
      {timelineLoading ? (
        <div className={styles.tweetContainer}>
          <div className={styles.loading}>
            <Spinner />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            {user && !showSidebar && (
              <Image
                src={user?.profile_image_url as string}
                width={30}
                height={30}
                alt="fd"
                onClick={() => {
                  openSidebar();
                }}
              />
            )}
            <h1>Kosmik</h1>
          </div>
          <div className={styles.timeline}>
            {userTimeline?.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} ownedLists={ownedLists} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
