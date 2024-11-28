import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const userType = "의뢰인"; // 유저 유형 임시 설정
  const [boxes, setBoxes] = useState([]);

  const addBox = () => {
    setBoxes((prevBoxes) => [...prevBoxes, {}]); // 새로운 박스 추가
  };

  return (
    <div className="main-container">
      <div className="banner-container">
        <div className="banner-box"></div>
        {userType === "의뢰인" && (
          <Link to="/write" className="special-button" onClick={addBox}>
            글쓰기
          </Link>
        )}
      </div>
      <div className="boxes-container">
        {boxes.map((_, index) => (
          <div key={index} className="white-box">
            박스 {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
