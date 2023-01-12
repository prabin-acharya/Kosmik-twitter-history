// components/layout.js

import { NextPage } from "next";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ListType, User } from "../types";
import { CreateListModal } from "./CreateListModal";
import styles from "./layout.module.css";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
  user: User;
  lists: ListType[];
  showSidebar: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  following: User[];
}

export const Layout: NextPage<Props> = ({
  children,
  user,
  lists,
  showSidebar,
  closeSidebar,
  following,
}) => {
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const router = useRouter();

  // disable scroll on modal open
  useEffect(() => {
    if (showCreateListModal) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCreateListModal]);

  // open/close CreateList Modal
  useEffect(() => {
    router.query.createList && setShowCreateListModal(true);
    router.query.addMemberToList && setShowAddToListModal(true);

    return () => {
      setShowCreateListModal(false);
      setShowAddToListModal(false);
    };
  }, [router.query]);

  // open/close Add To List Modal

  return (
    <div className={styles.container}>
      {showSidebar && (
        <Sidebar user={user} lists={lists} closeSidebar={closeSidebar} />
      )}
      <div className={styles.page}>{children}</div>
      {showCreateListModal && (
        <CreateListModal
          setShowCreateListModal={setShowCreateListModal}
          user={user}
          following={following}
        />
      )}
    </div>
  );
};

export default Layout;
