import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect } from "react";
import { Spinner } from "./Spinner";

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
  profile_image_url: string;
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

    // fetchUserData();
  }, [authorId]);

  if (loading || !userData)
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        {userData?.profile_image_url && (
          <Image
            src={userData?.profile_image_url}
            alt="user image"
            width={50}
            height={50}
            className={styles.profileImage}
          />
        )}
        <div>
          <span className={styles.name}>{userData?.name}</span>
          <span className={styles.username}>@{userData?.username}</span>
        </div>
      </div>
      <div className={styles.description}>{userData?.description}</div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>
            {userData?.public_metrics?.following_count > 1000
              ? (userData?.public_metrics.following_count / 1000).toFixed(1) +
                "K"
              : userData?.public_metrics.following_count}
          </span>
          <span className={styles.statName}> Following</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statNumber}>
            {userData?.public_metrics?.followers_count > 1000
              ? (userData?.public_metrics.followers_count / 1000).toFixed(1) +
                "K"
              : userData?.public_metrics.followers_count}
          </span>
          <span className={styles.statName}> Followers</span>
        </div>
      </div>
    </div>
  );
};

{
  /* name, username, profile_image, description///pinned_tweet?
      followiers_count, following_count */
}

{
  /* <ul>{authorId}</ul> */
}
//  <ul>{userData?.description}</ul>;
