import { NextPage } from "next";
import { useEffect, useState } from "react";
import { ListType, User } from "../../types";

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
  console.log(user, "###");
  const [lists, setLists] = useState<ListType[]>();

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
      console.log("#######################", res);
      const flatLists = res.map((user) => user.lists).flat();
      const suggLists = flatLists.filter((list) => usersLists.includes(list));

      // const suggLists = flatLists.filter(list=>

      // javacript check if item is in array

      setLists(suggLists);
    };

    fetchSuggLists();
  }, [usersLists, user]);

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

  return (
    <div>
      <h1>Discover</h1>
      {lists?.map((list) => (
        <div key={list.id}>
          <h2>{list.name}</h2>
          <p>{list.description}</p>

          <button
            onClick={() => {
              followList(list);
            }}
          >
            Follow
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Discover;
