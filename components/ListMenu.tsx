import { NextPage } from "next";
import React from "react";
import { IoClose } from "react-icons/io5";
import { ListType } from "../types";
import { AddToListModal } from "./AddToListModal";
import styles from "./ListMenu.module.css";

interface Props {
  mentions: {
    username: string;
    id: number;
    start?: number;
    end?: number;
  }[];
  ownedLists: ListType[];
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
        <AddToListModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          selectedMention={selectedMention}
          ownedLists={ownedLists}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
};
