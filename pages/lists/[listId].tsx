import { NextPage } from "next";
import Image from "next/image";
import router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Spinner } from "../../components/Spinner";
import { Tweet } from "../../components/Tweet";
import styles from "./../../styles/List.module.css";

import { ListType, TweetType, User } from "../../types";

interface Props {
  user: User;
  following: User[];
  lists: ListType[];
  handleListsChange: (updatedList: ListType[]) => void;
  showSidebar: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const ListPage: NextPage<Props> = ({
  user,
  following,
  lists,
  handleListsChange,
  showSidebar,
  openSidebar,
}) => {
  const router = useRouter();
  const { listId } = router.query;
  const [list, setList] = useState<ListType>();
  const [tweets, setTweets] = useState<TweetType[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const ownedLists = lists.filter((list) => list.owner.id === user.id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/list/${listId}`);
      const data = await res.json();
      setList(data.list);

      const tweets = await fetch(`/api/list/${listId}/timeline`);
      const tweetsData = await tweets.json();
      setTweets(tweetsData.tweets);
      setIsLoading(false);
    };

    if (listId) {
      fetchData();
    }

    return () => {
      setList(undefined);
      setTweets([]);
      setIsLoading(true);
    };
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

  const isOwnedList = list?.owner.id === user.id;

  if (isLoading || !listId || !list) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => {
            router.back();
          }}
        >
          <BiArrowBack className={styles.backArrow} />
        </div>

        {user && !showSidebar && (
          <Image
            src={user?.profile_image_url as string}
            width={30}
            height={30}
            alt="fd"
            onClick={() => {
              openSidebar();
            }}
          />
        )}
        <h1>Kosmik</h1>
      </div>
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
          <span
            className={styles.memberCount}
            onClick={() => {
              setShowModal(true);
            }}
          >
            <b>{list.member_count}</b>
            <span className={styles.subtext}>Members</span>
          </span>
          <span>
            <b>{list.follower_count}</b>
            <span className={styles.subtext}>Followers</span>
          </span>
        </div>
        {isOwnedList ? (
          <button
            className={styles.editButton}
            onClick={() => {
              setShowModal(true);
            }}
          >
            edit list
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>

      {!tweets ? (
        <Spinner />
      ) : (
        <div className={styles.listTimeline}>
          {tweets?.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} ownedLists={ownedLists} />
          ))}
        </div>
      )}
      {showModal && (
        <MembersModal
          list={list}
          closeModal={closeModal}
          user={user}
          following={following}
        />
      )}
    </div>
  );
};

export default ListPage;

interface MembersModalProps {
  list: ListType;
  following: User[];
  user: User;
  closeModal: () => void;
}

const MembersModal: NextPage<MembersModalProps> = ({
  list,
  closeModal,
  following,
  user,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [showMembers, setShowMembers] = useState(true);

  const [member, setMember] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  // const [members, setMembers] = useState<User[]>([]);

  const router = useRouter();

  const memberRef = useRef<HTMLInputElement | null>(null);
  const suggestionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        memberRef.current &&
        !memberRef.current.contains(e.target as Node) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node)
      ) {
        setShowSuggestion(false);

        if (!member) {
          setMembers([]);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [member]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/list/${list.id}/members`);
      const data = await res.json();
      setMembers(data.members);
      console.log(data);
    };

    fetchData();
  }, [list.id]);

  const handleClickSuggestedMember = (user: User) => {
    console.log(members.includes(user));
    !members.includes(user) && setMembers([...members, user]);
    setMember("");
    setShowSuggestion(false);
  };

  const removeSelecetdMember = (user: User) => {
    const updatedMembers = members.filter((member) => member.id !== user.id);
    console.log(updatedMembers, user);
    setMembers(updatedMembers);
  };

  const lastUser = member.split(",").pop() as string;
  const suggestions = following.filter((user) =>
    user.username.toLocaleLowerCase().startsWith(lastUser.toLowerCase())
  );

  const isOwnedList = list?.owner.id === user.id;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {!members ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.modalHeaderContainer}>
              <div className={styles.modalHeader}>
                <h1>{list.name}</h1>

                <span
                  className={styles.closeModal}
                  onClick={() => {
                    closeModal();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </span>
              </div>
              {isOwnedList && (
                <div className={styles.modalRoutes}>
                  <div className={showMembers ? styles.active : styles.passive}>
                    <h2
                      onClick={() => {
                        setShowMembers(true);
                      }}
                    >
                      Members
                    </h2>
                  </div>
                  <div
                    className={!showMembers ? styles.active : styles.passive}
                  >
                    <h2
                      onClick={() => {
                        setShowMembers(false);
                      }}
                    >
                      Add Members
                    </h2>
                  </div>
                </div>
              )}
            </div>
            {showMembers ? (
              <>
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
                          <span className={styles.subtext}>
                            @{member.username}
                          </span>
                          <span>{member.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className={styles.main}>
                  <div className={styles.addMembers}>
                    <h3>Add members</h3>
                    <div className={styles.selectedMembers}>
                      <ul>
                        {members.map((member) => (
                          <li key={member.id} className={styles.member}>
                            <Image
                              src={member.profile_image_url}
                              alt="profile image"
                              width={20}
                              height={20}
                            />
                            <span>@{member.username}</span>
                            {/* svg cross  */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="currentColor"
                              onClick={() => removeSelecetdMember(member)}
                            >
                              <line x1="16" y1="10" x2="10" y2="16"></line>
                              <line x1="10" y1="10" x2="16" y2="16"></line>
                            </svg>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.members}>
                      <input
                        type="text"
                        name="members"
                        value={member}
                        onChange={(e) => setMember(e.target.value)}
                        onFocus={() => {
                          setShowSuggestion(true);
                        }}
                        // onBlur={() => {
                        //   setShowSuggestion(false);
                        // }}
                        ref={memberRef}
                        placeholder="Search people by username"
                        autoComplete="off"
                      />
                      {showSuggestion && (
                        <div className={styles.suggestions} ref={suggestionRef}>
                          <ul>
                            {suggestions.slice(0, 4).map((user) => (
                              <li
                                key={user.id}
                                onClick={() => {
                                  handleClickSuggestedMember(user);
                                }}
                              >
                                <Image
                                  src={user.profile_image_url}
                                  alt="profile image"
                                  width={30}
                                  height={30}
                                />
                                <div>
                                  <span>{user.name}</span>
                                  <span>@{user.username}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
