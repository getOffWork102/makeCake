// LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password: pw }),
      });

      console.log("서버 응답:", response);
  
      if (response.ok) {
        const { token } = await response.json();
        onLogin(token); // 로그인 성공 시 토큰 처리
        setError("");
        navigate("/"); // 메인 페이지로 이동
      } else {
        const errorData = await response.json();
        setError(errorData.message || "아이디 또는 비밀번호가 틀렸습니다.");
        console.log("로그인 실패:", errorData.message);
      }
    } catch (err) {
      setError(`로그인 요청 중 오류 발생: ${err.message}`);
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
        <button onClick={() => navigate("/signup")}>회원가입</button>
      </div>
    </div>
  );
};

export default LoginPage;
