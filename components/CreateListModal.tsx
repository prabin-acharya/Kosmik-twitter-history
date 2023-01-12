import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { User } from "../types";
import styles from "./CreateListModal.module.css";

interface Props {
  setShowCreateListModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  following: User[];
}

export const CreateListModal: NextPage<Props> = ({
  setShowCreateListModal,
  user,
  following,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [member, setMember] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [members, setMembers] = useState<User[]>([]);

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

  const createList = async () => {
    const membersIds = members.map((member) => member.id) || [];
    console.log(membersIds);
    const res = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "createList",
        name,
        description,
        isPrivate,
        members: membersIds,
      }),
    });
    const data = await res.json();
    console.log(data);
    const id = data.res.data.id;
    setShowCreateListModal(false);
    router.push(`/lists/${id}`);
  };

  const lastUser = member.split(",").pop() as string;
  const suggestions = following.filter((user) =>
    user.username.toLocaleLowerCase().startsWith(lastUser.toLowerCase())
  );

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

  console.log(router);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.main}>
          <div className={styles.header}>
            <h2>Create a list</h2>
            {/* <button
              onClick={() => {
                setShowCreateListModal(false);
              }}
            > */}
            {/*   custom close button cross with no background just a cross   */}
            <div
              className={styles.close}
              onClick={() => {
                setShowCreateListModal(false);
                // router.push("/");
                router.back();
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
            </div>
          </div>
          <div className={styles.body}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createList();
              }}
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                id="name"
              />

              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
              />

              <label htmlFor="private" className={styles.private}>
                Private
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  name="private"
                  id="private"
                  className={styles.privateCheckbox}
                />
              </label>

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

              <button
                type="submit"
                // onClick={() => {
                //   createList();
                // }}
              >
                Create List
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
