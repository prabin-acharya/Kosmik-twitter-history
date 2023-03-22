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
  const [lists, setLists] = useState<ListType[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/me`);

      if (!res.ok) {
        res.status === 403 && router.push("/signin");
        res.status === 429 && router.push("/500");
        res.status === 401 && (await refreshToken());
      }

      const data = await res.json();

      setUser(data.user);
      setLists(data.lists);
      setFollowing(data.following);
      setUserLoading(false);
    };

    const refreshToken = async () => {
      console.log("Refresh Token");
      const res = await fetch("/api/auth/refresh");
      console.log(res);
      if (!res.ok) {
        router.push("/signin");
      }
    };

    fetchUser();
  }, [router]);

  // handle app layout changes
  const handleListsChange = (updatedLists: ListType[]) => {
    setLists(updatedLists);
  };

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (router.query.createList) openSidebar();
  }, [router]);

  function closeSidebar() {
    setShowSidebar(false);
  }

  function openSidebar() {
    setShowSidebar(true);
  }

  //

  if (
    router.pathname === "/signin" ||
    router.pathname === "/500" ||
    router.pathname === "/404"
  )
    return <Component {...pageProps} />;

  if (isUserLoading || !user || !lists) {
    return <Spinner />;
  }

  return (
    <Layout
      user={user}
      following={following}
      lists={lists}
      showSidebar={showSidebar}
      closeSidebar={closeSidebar}
    >
      <Component
        {...pageProps}
        user={user}
        following={following}
        lists={lists}
        openSidebar={openSidebar}
      />
    </Layout>
  );
}
