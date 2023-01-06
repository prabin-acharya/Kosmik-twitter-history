import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { Spinner } from "../components/Spinner";
import "../styles/globals.css";
import { ListType, User } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>();
  const [isUserLoading, setUserLoading] = useState(true);
  const [lists, setLists] = useState<ListType[]>();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/me`);
      const data = await res.json();
      setUser(data?.user?.data);
      setLists(data?.lists);
      setUserLoading(false);
    };

    fetchUser();
  }, []);

  if (router.pathname === "/signin") return <Component {...pageProps} />;

  if (!isUserLoading && !user) {
    router.push("/signin");
  }

  if (isUserLoading || !user || !lists) {
    return <Spinner />;
  }

  const handleListsChange = (updatedLists: ListType[]) => {
    setLists(updatedLists);
  };

  return (
    <Layout user={user} lists={lists}>
      <Component
        {...pageProps}
        user={user}
        lists={lists}
        handleListsChange={handleListsChange}
      />
    </Layout>
  );
}
