// components/layout.js

import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { CreateList } from "./CreateList";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
  user: User;
  lists: List;
}

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface List {
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
  followedLists: {
    id: number;
    name: string;
    description: string;
    member_count: number;
    follower_count: number;
    owner: User;
    private: false;
  }[];
}

export const Layout: NextPage<Props> = ({ children, user, lists }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.container}>
      {showSidebar && <Sidebar user={user} lists={lists} />}

      <div className={styles.main}>
        <div className={styles.mainHeader}>
          {user && (
            <Image
              src={user?.profile_image_url as string}
              width={30}
              height={30}
              alt="fd"
              onClick={() => {
                setShowSidebar(true);
              }}
            />
          )}
          <h1>Kosmik</h1>
        </div>
        {children}
      </div>
      {showModal && <CreateList setShowModal={setShowModal} />}
    </div>
  );
};

export default Layout;
