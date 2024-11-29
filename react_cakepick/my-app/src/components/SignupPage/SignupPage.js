import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    type: "",
    nickname: "",
    id: "",
    password: "",
    confirmPassword: "",
    portfolio1: null,
    portfolio2: null,
  });
  const [error, setError] = useState("");
  const [hoverText, setHoverText] = useState("");
  const [fileError, setFileError] = useState({ portfolio1: false, portfolio2: false }); // 파일 에러 상태
  const navigate = useNavigate();

  const isImageFile = (file) => {
    return file && file.type.startsWith("image/");
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [key]: file });

    // 이미지 파일인지 확인
    setFileError({ ...fileError, [key]: !isImageFile(file) });
  };

  const handleSignup = async () => {
    const { type, nickname, id, password, confirmPassword, portfolio1, portfolio2 } = formData;
  
    if (!type || !nickname || !id || !password || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
  
    if (type === "디자이너" && (!portfolio1 || !portfolio2 || fileError.portfolio1 || fileError.portfolio2)) {
      setError("포트폴리오를 모두 올바르게 첨부해주세요.");
      return;
    }
  
    try {
      // FormData 생성
      const formDataToSend = new FormData();
      formDataToSend.append("nickname", nickname);
      formDataToSend.append("id", id);
      formDataToSend.append("password", password);
      if (portfolio1) formDataToSend.append("portfolio1", portfolio1);
      if (portfolio2) formDataToSend.append("portfolio2", portfolio2);
  
      // API 호출
      const response = await fetch("http://localhost:5000/api/signUp", {
        method: "POST",
        body: formDataToSend, // FormData 전송
      });
  
      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(`회원가입 실패: ${errorData.message}`);
      }
    } catch (err) {
      setError(`회원가입 요청 중 오류 발생: ${err.message}`);
    }
  };
  
  

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <div className="signup-type">
        <label>유형</label>
        <div className="signup-options">
          <label>
            <input
              type="radio"
              name="type"
              value="의뢰인"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            의뢰인
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="디자이너"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            디자이너
          </label>
        </div>
      </div>
      <div className="signup-field">
        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          placeholder="닉네임을 입력하세요"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        />
      </div>
      <div className="signup-field">
        <label>아이디</label>
        <input
          type="text"
          name="id"
          placeholder="아이디를 입력하세요"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        />
      </div>
      <div className="signup-field">
        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      <div className="signup-field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>
      {formData.type === "디자이너" && (
        <>
          <label className="portfolio-title">포트폴리오</label>
          <div className="portfolio-container">
            <div
              className={`portfolio-box ${
                fileError.portfolio1 ? "portfolio-error" : formData.portfolio1 ? "portfolio-uploaded" : ""
              }`}
              onMouseEnter={() => setHoverText("자격증을 첨부하세요.")}
              onMouseLeave={() => setHoverText("")}
            >
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "portfolio1")}
              />
            </div>
            <div
              className={`portfolio-box ${
                fileError.portfolio2 ? "portfolio-error" : formData.portfolio2 ? "portfolio-uploaded" : ""
              }`}
              onMouseEnter={() => setHoverText("케이크 사진을 첨부하세요.")}
              onMouseLeave={() => setHoverText("")}
            >
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "portfolio2")}
              />
            </div>
          </div>
        </>
      )}
      {hoverText && <div className="hover-text">{hoverText}</div>}
      {error && <div className="error-message">{error}</div>}
      <button className="signup-button" onClick={handleSignup}>
        회원가입
      </button>
    </div>
  );
};

export default SignupPage;
