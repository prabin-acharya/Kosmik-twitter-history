import { NextPage } from "next";
import Image from "next/image";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Tweet } from "../../components/Tweet";
import styles from "./../../styles/List.module.css";

import { ListType, TweetType, User } from "../../types";

interface Props {
  user: User;
  lists: ListType[];
  handleListsChange: (updatedList: ListType[]) => void;
}

export const ListPage: NextPage<Props> = ({
  user,
  lists,
  handleListsChange,
}) => {
  const router = useRouter();
  const { listId } = router.query;

  const [list, setList] = useState<ListType>();
  const [tweets, setTweets] = useState<TweetType[]>();
  const [showModal, setShowModal] = useState(false);

  const followedLists = lists.filter((list) => list.owner.id !== user.id);
  const ownedLists = lists.filter((list) => list.owner.id === user.id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/list/${listId}`);
      const data = await res.json();
      setList(data.list);

      const tweets = await fetch(`/api/list/${listId}/timeline`);
      const tweetsData = await tweets.json();
      setTweets(tweetsData.tweets);
    };

    if (listId) {
      fetchData();
    }
  }, [listId]);

  useEffect(() => {
    if (router.query.showMembers) {
      setShowModal(true);
    }
    console.log(router);
  }, [router, router.pathname]);

  const actionList = async (list: ListType, action: string) => {
    try {
      const res = await fetch(`/api/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: list.id,
          action,
        }),
      });
      const data = await res.json();
      if (list) {
        const updatedLists =
          action === "followList"
            ? [...lists, list]
            : lists.filter((l) => l.id !== list.id);
        handleListsChange(updatedLists);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const usersListsIds = lists.map((list) => list.id);

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  function closeModal() {
    setShowModal(false);
  }

  if (!listId || !list) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <h1>{list.name}</h1>
        <div
          className={styles.owner}
          onClick={() => router.push(`/${list.owner.username}`)}
        >
          <Image
            src={list.owner.profile_image_url}
            alt="Picture of the author"
            width={50}
            height={50}
          />
          <span>
            <b>{list.owner.name}</b>
          </span>
          <span className={styles.subtext}>@{list.owner.username}</span>
        </div>
        {list.description && <p>{list.description}Hello world!</p>}
        <div className={styles.metrics}>
          <span className={styles.memberCount}>
            <b
              onClick={() => {
                setShowModal(true);
              }}
            >
              {list.member_count}
            </b>
            <span className={styles.subtext}>Members</span>
          </span>
          <span>
            <b>{list.follower_count}</b>
            <span className={styles.subtext}>Followers</span>
          </span>
        </div>
        {usersListsIds.includes(list.id) ? (
          <button
            className={styles.unFollowButton}
            onClick={() => {
              actionList(list, "unFollowList");
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            className={styles.followButton}
            onClick={() => {
              actionList(list, "followList");
            }}
          >
            Follow
          </button>
        )}
      </div>
      {!tweets ? (
        <Spinner />
      ) : (
        <div className={styles.listTimeline}>
          {tweets?.map((tweet) => (
            <div
              key={tweet.id}
              // onClick={() => router.push(`/tweet/${tweet.id}`)}
            >
              <Tweet tweet={tweet} ownedLists={ownedLists} />
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <MembersModal listId={listId as string} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ListPage;

interface MembersModalProps {
  listId: string;
  closeModal: () => void;
}

const MembersModal: NextPage<MembersModalProps> = ({ listId, closeModal }) => {
  const [members, setMembers] = useState<User[]>();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/list/${listId}/members`);
      const data = await res.json();
      setMembers(data.members);
      console.log(data);
    };

    fetchData();
  }, [listId]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {!members ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h1>Members</h1>
              <span
                className={styles.closeModal}
                onClick={() => {
                  closeModal();
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
              </span>
            </div>
            <div className={styles.main}>
              <ul>
                {members?.map((member) => (
                  <li
                    key={member.id}
                    onClick={() => router.push(`/${member.username}`)}
                  >
                    <Image
                      src={member.profile_image_url}
                      alt="Picture of the author"
                      width={50}
                      height={50}
                    />
                    <div className={styles.memberInfo}>
                      <span>
                        <b>{member.name}</b>
                      </span>
                      <span className={styles.subtext}>@{member.username}</span>
                      <span>{member.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
