import { NextPage } from "next";
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
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
}

export const ListMenu: NextPage<Props> = ({ mentions, ownedLists }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedMention, setSelectedMention] = React.useState({});
  return (
    <div className={styles.container}>
      <ul>
        {mentions?.map((mention) => (
          <li
            key={mention.id}
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
              setSelectedMention(mention);
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
            selectedMention={selectedMention}
            ownedLists={ownedLists}
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
