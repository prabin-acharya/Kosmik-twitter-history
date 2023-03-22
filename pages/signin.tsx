import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FiTwitter } from "react-icons/fi";
import styles from "./../styles/Signin.module.css";

interface Props {}

const Signin: NextPage<Props> = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav>
        <Link href="/">Kosmik</Link>{" "}
      </nav>
      <div className={styles.signin}>
        <h1>What has Happened?</h1>

        <br />

        <button
          onClick={() => {
            router.push("/api/auth");
          }}
        >
          <FiTwitter />
          Log in with Twitter
        </button>
        <div>
          <h2>Steps</h2>
          <ol>
            <li> Log in with Twitter</li>
            <li> Create Lists.</li>
            <li>Explore past twitter.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Signin;
