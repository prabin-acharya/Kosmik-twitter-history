import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import styles from "./ListModal.module.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

export const ListModal: NextPage<Props> = ({
  children,
  isOpen,
  onRequestClose,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  if (!modalOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};
