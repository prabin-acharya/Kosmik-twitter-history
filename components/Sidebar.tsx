import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ListType, User } from "../types";

interface Props {
  user: User;
  lists: ListType[];
  closeSidebar: () => void;
}

export const Sidebar: NextPage<Props> = ({ user, lists, closeSidebar }) => {
  const [date, setDate] = useState<{
    from: string;
    to: string;
  }>({
    from: "2014-12-01",
    to: "2020-12-08",
  });

  const router = useRouter();

  useEffect(() => {
    const from = router.query.from as string;
    const to = router.query.to as string;

    let url = `/api/home`;

    if (from && to) {
      url = `/api/home?from=${from}&to=${to}`;

      setDate({
        from: from,
        to: to,
      });
    }
    const createList = router.query.createList;
    // if (createList) setShowModal(true);
  }, [router.query]);

  console.log(lists, "$$$");
  const ownedLists = lists.filter((list) => list.owner.id === user.id);
  const followedLists = lists.filter((list) => list.owner.id !== user.id);

  return (
    <>
      {/* <div className={showSidebar ? styles.sidebar : styles.closedSidebar}> */}

      <div
        className={styles.closedSidebar}
        // style={{
        //   display: showSidebar && "block",
        // }}
      >
        <div className={styles.header}>
          <div className={styles.profile}>
            {user?.profile_image_url && (
              <Image
                className={styles.tweetHeaderAvatar}
                src={user?.profile_image_url}
                alt="avatar"
                width={30}
                height={30}
              />
            )}
            <div>
              <span className={styles.name}>{user?.name}</span>
              <span className={styles.username}>@{user?.username}</span>
            </div>
          </div>

          <div
            className={styles.close}
            onClick={() => {
              // setShowSidebar(false);
              closeSidebar();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>

        <div className={styles.search}>
          <h4>Search</h4>

          <label htmlFor="from">From</label>
          <input
            type="date"
            id="from"
            name="from"
            value={date?.from}
            onChange={(e) => setDate({ ...date, from: e.target.value })}
          />

          <label htmlFor="to">To</label>
          <input
            type="date"
            id="to"
            name="to"
            value={date?.to}
            onChange={(e) => setDate({ ...date, to: e.target.value })}
          />

          <button
            onClick={() => {
              const url = `?from=${date?.from}&to=${date?.to}`;
              router.push(url);
            }}
          >
            Go
          </button>
        </div>

        <div className={styles.lists}>
          <h4>Lists</h4>

          <h5>Followed</h5>
          <ul>
            {followedLists?.slice(0, 10)?.map((list) => (
              <li
                key={list.id}
                onClick={() => {
                  router.push(`/lists/${list.id}`);
                }}
              >
                <span className={styles.name}>{list.name}</span>

                <span className={styles.ownerName}>{list.owner.name}</span>
                <span className={styles.ownerUsername}>
                  @{list.owner.username}
                </span>
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
                  router.push(`/lists/${list.id}`);
                }}
              >
                <b>{list.name}</b>
              </li>
            ))}
          </ul>

          <Link
            href={`/?createList=${true}`}
            as={`/lists/create`}
            className={styles.postCard}
          >
            Create a new list
          </Link>
          <br />
          <Link href={`/lists/discover`}>Discover new Lists</Link>
        </div>
      </div>
    </>
  );
};
