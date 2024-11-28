import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <header className="header">
      <h1 className="title">
        <Link to="/" className="title-link">케픽</Link>
        <span className="subtitle">, 내 마음대로 만드는 케이크</span>
      </h1>
      <nav className="nav">
        <Link to="/" className="nav-link">홈</Link>
        {!isLoggedIn ? (
          <Link to="/login" className="nav-link">로그인</Link>
        ) : (
          <>
            <Link to="/mypage" className="nav-link">마이페이지</Link>
            <button className="nav-link logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
