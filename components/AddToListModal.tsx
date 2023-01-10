import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ListType } from "../types";

import styles from "./AddToListModal.module.css";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedMention: any;
  ownedLists: ListType[];
  setShowModal: (show: boolean) => void;
  showModal: boolean;
}

export const AddToListModal: NextPage<Props> = ({
  isOpen,
  onRequestClose,
  selectedMention,
  ownedLists,
  setShowModal,
  showModal,
}) => {
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  if (!showModal) {
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
        <div className={styles.header}>
          <h2>Lists</h2>
          <div
            className={styles.close}
            onClick={() => {
              setShowModal(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.lists}>
            <ul>
              {ownedLists?.slice(0, 8).map((list) => (
                <li
                  key={list.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // addToList(selectedMention.id, list.id);
                  }}
                >
                  <h3>{list.name}</h3>
                  {/* <p>{list.description}</p> */}
                </li>
              ))}
            </ul>
          </div>
          <Link
            // href="/lists/create"
            href={`/?createList=${true}`}
            as={`/lists/create`}
          >
            Create a new list
          </Link>
        </div>
      </div>
    </div>
  );
};
