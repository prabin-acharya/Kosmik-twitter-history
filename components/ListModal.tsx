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
    console.log("55555555555555555555");
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
    console.log(data);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {children}

        <h1>Hello from the Modal!</h1>
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
  );
};
