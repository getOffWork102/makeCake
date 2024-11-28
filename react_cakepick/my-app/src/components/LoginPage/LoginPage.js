import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLogin(id, pw)) {
      setError("");
      navigate("/"); // 메인 페이지로 이동
    } else {
      setError("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="아이디"
        className="login-input"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="login-input"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <input
        type="button"
        value="로그인"
        className="login-button"
        onClick={handleLogin}
      />
      {error && <div className="error-message">{error}</div>}
      <div className="button-group">
        <button onClick={() => alert("아이디 찾기")}>아이디 찾기</button>
        <button onClick={() => alert("비밀번호 찾기")}>비밀번호 찾기</button>
        <button onClick={() => navigate("/signup")}>회원가입</button> {/* 회원가입 페이지로 이동 */}
      </div>
    </div>
  );
};

export default LoginPage;
