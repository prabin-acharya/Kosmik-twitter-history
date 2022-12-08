import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import styles from "./ListModal.module.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
  selectedMention: any;
}

interface List {
  id: number;
  name: string;
  //   description: string;
  private: boolean;
}

export const ListModal: NextPage<Props> = ({
  children,
  isOpen,
  onRequestClose,
  selectedMention,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const [ownedLists, setOwnedLists] = useState<List[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnedLists = async () => {
      const res = await fetch("/api/usersLists");
      const data = await res.json();
      setOwnedLists(data.lists.data);
      setLoading(false);
      console.log(data);
    };

    fetchOwnedLists();
  }, []);

  if (!modalOpen) {
    return null;
  }

  console.log(selectedMention, "*&*(&*&*&&&&&&&&&&&&&&&&&&&&&&&&&");

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {children}

        {loading ? (
          <div>loading...</div>
        ) : (
          <>
            <h1>Hello from the Modal!</h1>
            <ul>
              {ownedLists?.slice(0, 5).map((list) => (
                <div key={list.id}>
                  <li>{list.name}</li>
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
