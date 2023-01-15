import { NextPage } from "next";

export default function Custom500() {
  return (
    <h1
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        color: "rosybrown",
      }}
    >
      Too many requests. Try again in 10 minutes
    </h1>
  );
}
