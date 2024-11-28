import React from "react";
import { useNavigate } from "react-router-dom";
import "./WritePage.css";

const WritePage = ({ addBox }) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // 박스 추가
    addBox();
    // 메인 페이지로 이동
    navigate("/");
  };

  return (
    <div className="container">
      <h1>주문 의뢰서</h1>
      <form>
        <div className="form-group">
          <label>픽업 날짜 및 시간</label>
          <input type="date" id="date" />
          <input type="time" id="time" step="3600" />
        </div>
        <div className="form-group">
          <label>케이크 모양</label>
          <div className="checkbox-group">
            <div>
              <label htmlFor="round">원</label>
              <input type="checkbox" id="round" value="원" />
            </div>
            <div>
              <label htmlFor="square">정사각형</label>
              <input type="checkbox" id="square" value="정사각형" />
            </div>
            <div>
              <label htmlFor="heart">하트</label>
              <input type="checkbox" id="heart" value="하트" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>케이크 사이즈 (지름)</label>
          <div className="checkbox-group">
            <div>
              <label htmlFor="10cm">10cm</label>
              <input type="checkbox" id="10cm" value="10cm" />
            </div>
            <div>
              <label htmlFor="12cm">12cm</label>
              <input type="checkbox" id="12cm" value="12cm" />
            </div>
            <div>
              <label htmlFor="15cm">15cm</label>
              <input type="checkbox" id="15cm" value="15cm" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>시트</label>
          <div className="checkbox-group">
            <div>
              <label htmlFor="chocolate">초코</label>
              <input type="checkbox" id="chocolate" value="초코" />
            </div>
            <div>
              <label htmlFor="vanilla">바닐라</label>
              <input type="checkbox" id="vanilla" value="바닐라" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>크림</label>
          <div className="checkbox-group">
            <div>
              <label htmlFor="cream-cheese">크림치즈생크림</label>
              <input type="checkbox" id="cream-cheese" value="크림치즈생크림" />
            </div>
            <div>
              <label htmlFor="whipped-cream">생크림</label>
              <input type="checkbox" id="whipped-cream" value="생크림" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>레터링 입력</label>
          <input type="text" className="text" placeholder="레터링 입력" required />
        </div>
        <div className="form-group">
          <label>도안 파일 업로드</label>
          <input type="file" className="file-input" accept="image/*" />
        </div>
        <div className="form-group">
          <label>추가 의뢰 내용</label>
          <input type="text" className="text" placeholder="추가 의뢰 내용 입력" required />
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
