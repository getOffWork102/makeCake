import React from "react";

const NotFound = () => {
  const style = {
    color: "var(--highColor)", // 주색2
    textAlign: "center",
    fontSize: "100px", // 큰 글씨
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    whiteSpace: "nowrap", // 줄바꿈 방지
  };

  return <h1 style={style}>404 - Page Not Found</h1>;
};

export default NotFound;
