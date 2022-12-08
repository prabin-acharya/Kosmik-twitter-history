import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect } from "react";

import { ListModal } from "./ListModal";

import styles from "./ListMenu.module.css";

interface Props {
  mentions: {
    username: string;
    id: number;
    start?: number;
    end?: number;
  }[];
}

export const ListMenu: NextPage<Props> = ({ mentions }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className={styles.container}>
      <ul>
        {mentions?.map((mention) => (
          <li
            key={mention.id}
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            Add @{mention.username} to list
          </li>
        ))}
      </ul>
      {showModal && (
        <>
          <ListModal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <div>
              <button onClick={() => setShowModal(false)}>Close Modal</button>
            </div>
          </ListModal>
        </>
      )}
    </div>
  );
};
