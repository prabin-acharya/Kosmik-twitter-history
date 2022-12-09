import { NextPage } from "next";

import styles from "./Spinner.module.css";

interface Props {}

export const Spinner: NextPage<Props> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <svg
          className={styles.svgCircle}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className={styles.circle} cx="50" cy="50" r="45" />
        </svg>
      </div>
    </div>
  );
};
