import { NextPage } from "next";
import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "./ListMenu.module.css";
import { ListModal } from "./ListModal";

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
        <li>Open in Twitter</li>
        <li>Bookmark</li>

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
            <div className={styles.listModalHeader}>
              <h2>Lists</h2>
              <button onClick={() => setShowModal(false)}>
                <IoClose />
              </button>
            </div>
          </ListModal>
        </>
      )}
    </div>
  );
};
