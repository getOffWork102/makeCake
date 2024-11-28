import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WritePage.css";

const WritePage = ({ addBox }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    shape: [],
    size: [],
    sheet: [],
    cream: [],
    lettering: "",
    designFile: null,
    additionalNotes: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  // 파일 입력 핸들러
  const handleFileChange = (e) => {
    setFormData({ ...formData, designFile: e.target.files[0] });
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    try {
      // 백엔드로 데이터 전송
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "designFile" && formData[key]) {
          data.append(key, formData[key]); // 파일 처리
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => data.append(`${key}[]`, item)); // 배열 처리
        } else {
          data.append(key, formData[key]); // 일반 데이터 처리
        }
      });

      const response = await axios.post("/api/orders", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 성공 시 박스 추가
      addBox(response.data);
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("의뢰 요청 중 오류 발생:", error);
      alert("의뢰를 요청하는 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container">
      <h1>주문 의뢰서</h1>
      <form>
        <div className="form-group">
          <label>픽업 날짜 및 시간</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          <input type="time" name="time" value={formData.time} onChange={handleChange} step="3600" />
        </div>
        <div className="form-group">
          <label>케이크 모양</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="원"
                onChange={(e) => handleCheckboxChange(e, "shape")}
              />
              원
            </label>
            <label>
              <input
                type="checkbox"
                value="정사각형"
                onChange={(e) => handleCheckboxChange(e, "shape")}
              />
              정사각형
            </label>
            <label>
              <input
                type="checkbox"
                value="하트"
                onChange={(e) => handleCheckboxChange(e, "shape")}
              />
              하트
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>레터링 입력</label>
          <input
            type="text"
            name="lettering"
            value={formData.lettering}
            onChange={handleChange}
            placeholder="레터링 입력"
            required
          />
        </div>
        <div className="form-group">
          <label>도안 파일 업로드</label>
          <input
            type="file"
            name="designFile"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label>추가 의뢰 내용</label>
          <input
            type="text"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="추가 의뢰 내용 입력"
          />
        </div>
        <div className="button-container">
          <button type="button" className="submit-button" onClick={handleSubmit}>
            의뢰하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;