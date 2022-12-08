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
  mentions: {
    username: string;
    id: number;
    start: number;
    end: number;
  }[];
}

interface User {
  id: number;
  name: string;
  username: string;
}

interface userTimeline {
  user: { data: User; following: User[] };
  tweets: tweet[];
}

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
    owner: {
      id: number;
      name: string;
      username: string;
      profile_image_url: string;
    };
  }[];
}

const Home: NextPage = () => {
  const [userTimeline, setUserTimeline] = useState<userTimeline>();
  const [lists, setLists] = useState<List>();
  const [selectUsers, setSelectUsers] = useState<User[]>([]);
  const [selectedLists, setSelectedLists] = useState<
    {
      id: number;
      name: string;
      private: Boolean;
    }[]
  >([]);

  const [date, setDate] = useState<{
    from: string | undefined;
    to: string | undefined;
  }>({
    from: "2014-12-01",
    to: "2020-12-08",
  });

  const [isLoading, setisLoading] = useState(true);

  const fetchCustom = async () => {
    setisLoading(true);
    let url = `/api/home?`;
    if (selectedLists.length > 0) {
      url += `listId=${selectedLists[0]?.id}`;
    } else if (selectUsers.length > 0) {
      url += `&userIds=${selectUsers.map((user) => user.id).join(",")}`;
    }

    if (date.from && date.to) {
      url += `&from=${date.from}&to=${date.to}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setUserTimeline(data);
    setisLoading(false);
  };

  // first fetch
  useEffect(() => {
    const fetchHome = async () => {
      const res = await fetch(`/api/home`);
      const data = await res.json();
      setUserTimeline(data);
      setisLoading(false);
    };

    const fetchLists = async () => {
      const res = await fetch("/api/lists");
      const data = await res.json();
      setLists(data);
    };

    Promise.all([fetchHome(), fetchLists()]);
  }, [selectedLists]);

  return (
    <div className={styles.container}>
      {/* create a container div with two columns, one on left occupying 30% of screen and other on the right */}
      <div className={styles.sidebar}>
        {!userTimeline?.user?.data?.name && (
          <Link href={"/api/auth"}>Authorize Twitter</Link>
        )}

        <div className={styles.header}>
          <div className={styles.name}>
            <span> - {userTimeline?.user?.data?.name} </span>
            <span>@{userTimeline?.user?.data?.username}</span>
          </div>
        </div>

        <div className={styles.search}>
          <h4>Search</h4>

          <label htmlFor="from">From</label>
          <input
            type="date"
            id="from"
            name="from"
            value={date.from}
            onChange={(e) => setDate({ ...date, from: e.target.value })}
          />

          <label htmlFor="to">To</label>
          <input
            type="date"
            id="to"
            name="to"
            value={date.to}
            onChange={(e) => setDate({ ...date, to: e.target.value })}
          />

          {selectedLists?.map((list) => (
            <div key={list.id}>
              <span>{list.name}</span>
              <button
                onClick={() => {
                  setSelectedLists(
                    selectedLists.filter((l) => l.id !== list.id)
                  );
                }}
              >
                X
              </button>
            </div>
          ))}

          {selectUsers?.map((user) => (
            <div key={user.id}>
              <span>{user.name}</span>
              <button
                onClick={() => {
                  setSelectUsers(selectUsers.filter((u) => u.id !== user.id));
                }}
              >
                X
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              fetchCustom();
            }}
          >
            Go
          </button>
        </div>

        <div className={styles.lists}>
          <h4>Lists</h4>
          <h5>Followed</h5>
          <ul>
            {lists?.followedLists?.slice(0, 10)?.map((list) => (
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
          <h5>Owned</h5>
          <ul>
            {lists?.ownedLists?.slice(0, 5)?.map((list) => (
              <li
                key={list.id}
                onClick={() => {
                  setSelectUsers([]);
                  setSelectedLists([...selectedLists, list]);
                }}
              >
                <b>{list.name}</b>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.following}>
          <h4>Recent Follows</h4>
          <ul>
            {userTimeline?.user?.following?.slice(0, 10)?.map((user) => (
              <li
                key={user.username}
                onClick={() => {
                  setSelectedLists([]);
                  setSelectUsers([
                    ...selectUsers,
                    { id: user.id, name: user.name, username: user.username },
                  ]);
                }}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <b>Home</b>
        </div>
        {isLoading ? (
          <div className={styles.tweetContainer}>
            <b>Loading...</b>
          </div>
        ) : (
          <div className={styles.tweetContainer}>
            {userTimeline?.tweets?.map((tweet) => (
              <div
                key={tweet.id}
                // onClick={() => router.push(`/tweet/${tweet.id}`)}
              >
                <Tweet
                  tweet={tweet}
                  ownedLists={
                    lists && lists.ownedLists ? lists?.ownedLists : []
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

// console.log(dateString);

// // Convert the date string to a number of milliseconds

// const date2 = Date.parse(dateString);
// console.log(date2);

// // Create a Date object from the number of milliseconds
// const dateObject = new Date(date);

// console.log(dateObject);
