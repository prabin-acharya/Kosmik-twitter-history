import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect } from "react";

import styles from "./UserDetail.module.css";

interface Props {
  user?: {
    data: {
      id: number;
      name: string;
      username: string;
      description: string;
    };
  };
  authorId: number;
}

interface UserData {
  id: number;
  name: string;
  username: string;
  description: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

export const UserDetail: NextPage<Props> = ({ user, authorId }) => {
  const [userData, setUserData] = React.useState<UserData>();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/user/" + authorId);
      const data = await res.json();
      setUserData(data.user.data);
      setLoading(false);
    };

    fetchUserData();
  }, [authorId]);

  if (loading) return <div className={styles.container}>loading...</div>;

  return (
    <div className={styles.container}>
      {/* <ul>{authorId}</ul> */}
      <ul>{userData?.description}</ul>
    </div>
  );
};

{
  /* name, username, profile_image, description///pinned_tweet?
      followiers_count, following_count */
}
