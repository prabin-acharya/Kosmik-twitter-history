import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { Spinner } from "../components/Spinner";
import "../styles/globals.css";

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface List {
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
  followedLists: {
    id: number;
    name: string;
    description: string;
    member_count: number;
    follower_count: number;
    owner: User;
    private: false;
  }[];
}

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>();
  const [isUserLoading, setUserLoading] = useState(true);
  const [lists, setLists] = useState<List>();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/me`);

      const data = await res.json();
      console.log(data, "??");
      setUser(data?.user?.data);
      setLists(data?.lists);
      setUserLoading(false);
    };

    fetchUser();
  }, [router]);

  if (router.pathname === "/signin") return <Component {...pageProps} />;

  if (!isUserLoading && !user) {
    router.push("/signin");
  }

  if (isUserLoading || !user || !lists) {
    return <Spinner />;
  }

  const handleListsChange = (
    ownedLists: List["ownedLists"],
    followedLists: List["followedLists"]
  ) => {
    setLists({
      ownedLists: [...ownedLists],
      followedLists: [...followedLists],
    });
  };

  return (
    <Layout user={user} lists={lists}>
      <Component
        {...pageProps}
        lists={lists}
        handleListsChange={handleListsChange}
      />
    </Layout>
  );
}
