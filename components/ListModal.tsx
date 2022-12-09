import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import styles from "./ListModal.module.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
  selectedMention: any;
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
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
  ownedLists,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  if (!modalOpen) {
    return null;
  }

  const addToList = async (selectedMention: number, listId: number) => {
    const res = await fetch("/api/addToList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listId,
        selectedMention,
      }),
    });
    const data = await res.json();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {children}

        <div className={styles.main}>
          <ul>
            {ownedLists?.slice(0, 5).map((list) => (
              <div key={list.id}>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    addToList(selectedMention.id, list.id);
                  }}
                >
                  {list.name}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
