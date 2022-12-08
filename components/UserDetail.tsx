import { NextPage } from "next";
import Image from "next/image";
import React from "react";

import styles from "./UserDetail.module.css";

interface Props {}

export const UserDetail: NextPage<Props> = () => {
  return (
    <div className={styles.container}>
      {/* 
                name, username, profile_image, description///pinned_tweet?
                followiers_count, following_count
             */}
      <ul>
        <li>a</li>
        <li>b</li>
      </ul>
    </div>
  );
};
