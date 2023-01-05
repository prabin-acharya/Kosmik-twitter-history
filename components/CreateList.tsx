import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./CreateList.module.css";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateList: NextPage<Props> = ({ setShowModal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const router = useRouter();

  const createList = async () => {
    console.log("###################333");
    const res = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "createList",
        name,
        description,
        isPrivate,
      }),
    });
    const data = await res.json();
    console.log(data);
    const id = data.res.data.id;
    setShowModal(false);
    router.push(`/lists/${id}`);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.main}>
          <div className={styles.header}>
            <h2>Create a list</h2>
            {/* <button
              onClick={() => {
                setShowModal(false);
              }}
            > */}
            {/*   custom close button cross with no background just a cross   */}
            <div
              className={styles.close}
              onClick={() => {
                setShowModal(false);
                router.push("/");
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
          <div className={styles.body}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              id="name"
            />

            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
            />

            <label htmlFor="private" className={styles.private}>
              Make private
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                name="private"
                id="private"
                className={styles.privateCheckbox}
              />
            </label>

            <button
              onClick={() => {
                createList();
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
