import { NextPage } from "next";
import Image from "next/image";
import router from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { ListType, User } from "../../types";
import styles from "./../../styles/discover.module.css";

interface Props {
  user: User;
  lists: ListType[];
  handleListsChange: (updatedList: ListType[]) => void;
  showSidebar: boolean;
  openSidebar: () => void;
}

export const Discover: NextPage<Props> = ({
  user,
  lists: usersLists,
  handleListsChange,
  showSidebar,
  openSidebar,
}) => {
  const [lists, setLists] = useState<ListType[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const usersListsIds = usersLists.map((list) => list.id);

  useEffect(() => {
    const followedLists = usersLists.filter(
      (list) => list.owner.id !== user.id
    );
    const followedListOwnerUsernames = followedLists.map(
      (list) => list.owner.username
    );

    const fetchSuggLists = async () => {
      const lists = await Promise.all(
        followedListOwnerUsernames.map(async (username) => {
          const res = await fetch(`/api/user/${username}`);
          const data = await res.json();
          return data;
        })
      );
      console.log(lists, "res");
      const flatLists = lists.map((user) => user.lists).flat();

      const suggestedLists = flatLists.filter(
        (list) => !usersListsIds.includes(list.id)
      );
      console.log(suggestedLists, "suggLists");
      setLists(suggestedLists);
      setLoading(false);
    };

    fetchSuggLists();
  }, [user.id, usersLists, usersListsIds]);

  const followList = async (list: ListType) => {
    try {
      const res = await fetch(`/api/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: list.id,
          action: "followList",
        }),
      });
      const data = await res.json();
      if (list) {
        const newFollowedList = [...usersLists, list];
        handleListsChange(newFollowedList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* go back arrow */}
        <div
          className={styles.backArrow}
          onClick={() => {
            router.back();
          }}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.backArrow}
            viewBox="0 0 12 12"
            fill="currentColor"
            onClick={() => {
              router.back();
            }}
          >
            <path
              fillRule="evenodd"
              d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg> */}
          back
        </div>

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
      <div className={styles.main}>
        <ul>
          {lists?.map((list) => (
            <li
              key={list.id}
              className={styles.list}
              onClick={() => {
                router.push(`/lists/${list.id}`);
              }}
            >
              <div>
                <h4>{list.name}</h4>
                <div className={styles.owner}>
                  <Image
                    src={list.owner.profile_image_url}
                    alt={`${user.name} profile image`}
                    width={16}
                    height={16}
                  />
                  <span>{list.owner.name}</span>
                </div>
              </div>

              <button
                className={styles.followButton}
                onClick={() => {
                  followList(list);
                }}
              >
                Follow
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Discover;
