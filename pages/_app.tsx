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
  const [responseStatus, setResponseStatus] = useState<number>();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/me`);
      const data = await res.json();

      if (res.status !== 200) {
        setResponseStatus(res.status);
      }

      setUser(data.user);
      setLists(data.lists);
      setFollowing(data.following);
      setUserLoading(false);
    };

    fetchUser();
  }, []);

  // handle app
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

  if (router.pathname === "/signin") return <Component {...pageProps} />;

  // handle response

  switch (responseStatus) {
    case 500:
      console.log("500: Too many requests");

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Too many requests. Try agian in 10 minutes.
        </div>
      );
    case 401:
      console.log("401: Unauthorized");
      // Unauthorized
      // refresh token???
      router.push("/signin");
    // fetch("/api/auth/refresh");

    case 404:
      return <div>404</div>;
    default:
      break;
  }

  // if (!isUserLoading && !user) {
  //   router.push("/signin");
  // }

  if (isUserLoading || !user || !lists) {
    return <Spinner />;
  }

  return (
    <Layout
      user={user}
      lists={lists}
      showSidebar={showSidebar}
      openSidebar={openSidebar}
      closeSidebar={closeSidebar}
      following={following}
    >
      <Component
        {...pageProps}
        user={user}
        following={following}
        lists={lists}
        handleListsChange={handleListsChange}
        showSidebar={showSidebar}
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
      />
    </Layout>
  );
}
