// components/layout.js

import { NextPage } from "next";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ListType, User } from "../types";
import { CreateList } from "./CreateList";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
  user: User;
  lists: ListType[];
}

export const Layout: NextPage<Props> = ({ children, user, lists }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (router.query.createList) setShowModal(true);
  }, [router]);

  function closeSidebar() {
    setShowSidebar(false);
  }

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  return (
    <div className={styles.container}>
      {showSidebar && (
        <Sidebar user={user} lists={lists} closeSidebar={closeSidebar} />
      )}

      <div className={styles.main}>
        <div className={styles.mainHeader}>
          {user && !showSidebar && (
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
