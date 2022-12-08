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
  const [ownedLists, setOwnedLists] = useState<
    {
      id: number;
      name: string;
      private: Boolean;
    }[]
  >([]);
  const [selectUsers, setSelectUsers] = useState<
    {
      id: number;
      name: string;
      username: string;
    }[]
  >([]);

  const [listLoading, setListLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedLists, setSelectedLists] = useState<
    {
      id: number;
      name: string;
      private: Boolean;
    }[]
  >([]);

  const fetchCustom = async () => {
    setLoading(true);
    let url = `/api/home?`;
    if (selectedLists.length > 0) {
      url += `listId=${selectedLists[0]?.id}`;
    } else if (selectUsers.length > 0) {
      url += `&userIds=${selectUsers.map((user) => user.id).join(",")}`;
    }

    console.log("===============++++++++++++++++++++++, ", url);

    const res = await fetch(url);
    const data = await res.json();
    setUserDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchHome = async () => {
      const res = await fetch(`/api/home`);
      const data = await res.json();
      setUserDetails(data);
      setLoading(false);
      fetchLists();
    };

    const fetchLists = async () => {
      const res = await fetch("/api/lists");
      const data = await res.json();
      setListFollowed(data.lists);
      setOwnedLists(data.userOwnedLists);
      setListLoading(false);
    };

    fetchHome();
  }, [selectedLists]);

  // const [date, setDate] = useState<string>("");

  // const dateString = date;

  console.log(selectUsers);

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
        <div className={styles.dateSelector}>
          <h4>Date</h4>
          {/* <input type="date" onChange={(e) => setDate(e.target.value)} /> */}
        </div>

        <div className={styles.lists}>
          <h4>Lists</h4>
          <h5>Followed</h5>
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
          <h5>Owned</h5>
          <ul>
            {ownedLists?.slice(0, 5)?.map((list) => (
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
            {userDetails?.user?.following?.slice(0, 10)?.map((user) => (
              <li
                key={user.username}
                onClick={() => {
                  console.log("===");
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
        {loading ? (
          <div className={styles.tweetContainer}>
            <h1>Loading...</h1>
            <h1>Loading...</h1>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className={styles.tweetContainer}>
            {userDetails?.oldTweets?.map((tweet) => (
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
