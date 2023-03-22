import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Spinner } from "../components/Spinner";
import { ListType, User } from "../types";
import styles from "./../styles/username.module.css";

interface Props {
  lists: ListType[];
  handleListsChange: (updatedLists: ListType[]) => void;
  showSidebar: boolean;
  openSidebar: () => void;
}

export const Profile: NextPage<Props> = ({
  lists: usersLists,
  handleListsChange,
  showSidebar,
  openSidebar,
}) => {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState<User>();
  const [lists, setLists] = useState<ListType[]>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/user/${username}`);
      const data = await res.json();
      console.log(data, "---");
      setUser(data.user.data);
      setLists(data.lists);
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const actionList = async (list: ListType, action: string) => {
    const res = await fetch(`/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listId: list.id,
        action,
      }),
    });
    if (list) {
      const updatedLists =
        action === "followList"
          ? [...usersLists, list]
          : usersLists.filter((l) => l.id !== list.id);
      handleListsChange(updatedLists);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  const ownedLists = lists?.filter((list) => list.owner.id === user.id) || [];
  const followedLists =
    lists?.filter((list) => list.owner.id !== user.id) || [];

  const usersListsIds = usersLists.map((list) => list.id);

  const isOwner = user.username === username;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => {
            router.back();
          }}
        >
          <BiArrowBack className={styles.backArrow} />
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
      <div className={styles.profile}>
        <Image
          src={user.profile_image_url}
          alt={`${user.name} profile image`}
          width={60}
          height={60}
        />
        <h1>{user.name}</h1>
        <span className={styles.username}>@{user.username}</span>
        <span>{user.description}</span>
      </div>

      <div className={styles.lists}>
        {ownedLists.length === 0 && followedLists.length === 0 ? (
          <span>@{username} do not own or follow any lists.</span>
        ) : (
          <>
            <h2>Lists</h2>

            {ownedLists.length > 0 && <h3>Owned Lists</h3>}

            <ul>
              {ownedLists.map((list) => (
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
                  {!isOwner && (
                    <>
                      {usersListsIds.includes(list.id) ? (
                        <button
                          className={styles.unFollowButton}
                          onClick={() => {
                            actionList(list, "unFollowList");
                          }}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className={styles.followButton}
                          onClick={() => {
                            actionList(list, "followList");
                          }}
                        >
                          Follow
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>

            {followedLists.length > 0 && <h3>Followed Lists</h3>}

            <ul>
              {followedLists.map((list) => (
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
                        src={list.owner.profile_image_url}
                        alt={`${list.owner.name} profile image`}
                        width={16}
                        height={16}
                      />
                      <div>
                        <span>{list.owner.name}</span>
                        <span>{list.owner.username}</span>
                        {/* <span>{list.members_count} members</span> */}
                      </div>
                    </div>
                  </div>
                  {usersListsIds.includes(list.id) ? (
                    <button
                      className={styles.unFollowButton}
                      onClick={() => {
                        actionList(list, "unFollowList");
                      }}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className={styles.followButton}
                      onClick={() => {
                        actionList(list, "followList");
                      }}
                    >
                      Follow
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
