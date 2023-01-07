import { NextPage } from "next";
import Image from "next/image";
import router from "next/router";
import { useEffect, useState } from "react";
import { ListType, User } from "../../types";
import styles from "./../../styles/discover.module.css";

interface Props {
  user: User;
  lists: ListType[];
  handleListsChange: (updatedList: ListType[]) => void;
}

export const Discover: NextPage<Props> = ({
  user,
  lists: usersLists,
  handleListsChange,
}) => {
  const [lists, setLists] = useState<ListType[]>();

  const usersListsIds = usersLists.map((list) => list.id);

  useEffect(() => {
    const followedLists = usersLists.filter(
      (list) => list.owner.id !== user.id
    );
    const followedListOwnerUsernames = followedLists.map(
      (list) => list.owner.username
    );

    const fetchSuggLists = async () => {
      const res = await Promise.all(
        followedListOwnerUsernames.map(async (username) => {
          const res = await fetch(`/api/user/${username}`);
          const data = await res.json();
          return data;
        })
      );
      console.log(res, "&&&&&");
      const flatLists = res.map((user) => user.lists).flat();
      const suggLists = flatLists.filter(
        (list) => !usersListsIds.includes(list.id)
      );
      console.log(suggLists, "suggLists");
      setLists(suggLists);
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

  console.log(lists);

  return (
    <div>
      <h1>Discover Lists</h1>
      <ul>
        {lists?.map((list) => (
          <li key={list.id} className={styles.list}>
            <div>
              <h4
                onClick={() => {
                  router.push(`/lists/${list.id}`);
                }}
              >
                {list.name}
              </h4>
              <div className={styles.owner}>
                <Image
                  src={user.profile_image_url}
                  alt={`${user.name} profile image`}
                  width={16}
                  height={16}
                />
                <span>{user.name}</span>
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
  );
};

export default Discover;
