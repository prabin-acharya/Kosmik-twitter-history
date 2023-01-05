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
  username: string;
  id: number;
}

export const ListMenu: NextPage<Props> = ({
  mentions,
  ownedLists,
  username,
  id,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedMention, setSelectedMention] = React.useState({});

  const handleBookmark = () => {};

  return (
    <div className={styles.container}>
      <ul>
        <li
          onClick={() => {
            window.open(
              `https://twitter.com/${username}/status/${id}`,
              "_blank"
            );
          }}
        >
          Open in Twitter
        </li>
        <li
          onClick={() => {
            handleBookmark;
          }}
        >
          Bookmark
        </li>

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
          </ListModal>
        </>
      )}
    </div>
  );
};
