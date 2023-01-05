import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner";
import styles from "./../styles/username.module.css";

export interface User {
  id: number;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
}

interface Lists {
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
    owner: User;
    private: false;
  }[];
}

export const Profile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState<User>();
  const [lists, setLists] = useState<Lists>();

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

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <Image
          src={user.profile_image_url}
          alt={`${user.name} profile image`}
          width={60}
          height={60}
        />
        <h1>{user.name}</h1>
        <h2>@{user.username}</h2>
        <span>{user.description}</span>
      </div>
      <hr />

      <div className={styles.lists}>
        {lists?.ownedLists.length === 0 && lists?.followedLists.length === 0 ? (
          <span>@{username} do not own or follow any lists.</span>
        ) : (
          <>
            <h2>Lists</h2>

            {lists && lists?.ownedLists?.length > 0 && <h3>Owned Lists</h3>}

            <ul>
              {lists?.ownedLists.map((list) => (
                <li key={list.id} className={styles.list}>
                  <div>
                    <h4> {list.name}</h4>
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
                  <button>Follow</button>
                </li>
              ))}
            </ul>

            {lists && lists?.followedLists?.length > 0 && (
              <h3>Followed Lists</h3>
            )}

            <ul>
              {lists?.followedLists.map((list) => (
                <li key={list.id} className={styles.list}>
                  <div>
                    <h4>{list.name}</h4>
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
                  <button>Follow</button>
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
