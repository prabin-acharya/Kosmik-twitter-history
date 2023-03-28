import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ListType, User } from "../types";
import styles from "./Sidebar.module.css";

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
    from: "2010-01-01",
    to: "2022-12-01",
  });

  const router = useRouter();
  const [dateError, setDateError] = useState<string>("");

  useEffect(() => {
    const from = router.query.from as string;
    const to = router.query.to as string;

    let url = `/api/timeline`;

    if (from && to) {
      url = `/api/timeline?from=${from}&to=${to}`;

      setDate({
        from: from,
        to: to,
      });
    }
  }, [router.query]);

  const ownedLists = lists.filter((list) => list.owner.id === user.id);
  const followedLists = lists.filter((list) => list.owner.id !== user.id);

  const createListUrl = router.asPath + "?createList=true";

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.header}>
          <div className={styles.profile}>
            <Image
              className={styles.tweetHeaderAvatar}
              src={user?.profile_image_url}
              alt="avatar"
              width={30}
              height={30}
            />
            <span className={styles.name}>{user.name}</span>
          </div>

          {window.innerWidth < 720 && (
            <div
              className={styles.close}
              onClick={() => {
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
          )}
        </div>

        <div className={styles.search}>
          <h4>Search</h4>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isValidDate(date.from) && isValidDate(date.to)) {
                setDateError("");
                const url = `?from=${date?.from}&to=${date?.to}`;
                router.push(url);
                console.log("valid");
              } else {
                setDateError("Please enter a valid date");
              }
            }}
          >
            <div>
              <label htmlFor="from">From: </label>
              <input
                id="from"
                name="from"
                value={date?.from}
                onChange={(e) => setDate({ ...date, from: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="to">To: </label>
              <input
                id="to"
                name="to"
                value={date?.to}
                onChange={(e) => setDate({ ...date, to: e.target.value })}
              />
            </div>

            <div className={styles.error}>{dateError}</div>

            <div className={styles.submit}>
              <button>Go</button>
            </div>
          </form>
        </div>

        <div className={styles.lists}>
          <h4>Lists</h4>

          <h5>Followed</h5>
          <div className={styles.followedLists}>
            <ul>
              {followedLists?.map((list) => (
                <li
                  key={list.id}
                  onClick={() => {
                    router.push(`/lists/${list.id}`);
                  }}
                >
                  <div className={styles.name}>{list.name}</div>
                  <div className={styles.owner}>
                    <Image
                      className={styles.tweetHeaderAvatar}
                      src={list.owner.profile_image_url}
                      alt="avatar"
                      width={20}
                      height={20}
                    />

                    <span className={styles.ownerName}>{list.owner.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <h5>Owned</h5>
          <div className={styles.ownedLists}>
            <ul>
              {ownedLists?.map((list) => (
                <li
                  key={list.id}
                  onClick={() => {
                    router.push(`/lists/${list.id}`);
                  }}
                >
                  <div className={styles.name}>{list.name}</div>
                  <div className={styles.owner}>
                    <Image
                      className={styles.tweetHeaderAvatar}
                      src={list.owner.profile_image_url}
                      alt="avatar"
                      width={20}
                      height={20}
                    />

                    <span className={styles.ownerName}>{list.owner.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/lists/discover`} className={styles.postCard}>
            Discover new Lists
          </Link>
        </div>
      </div>
      <div>
        <Link href={createListUrl} as={`/i/create`} className={styles.postCard}>
          Create a new list
        </Link>
      </div>
    </div>
  );
};

const isValidDate = (dateString: string) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
};
