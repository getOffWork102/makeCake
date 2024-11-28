import React, { useState } from "react";
import "./MyPage.css";

const MyPage = () => {
  const nickname = "1212멍청이"; // 1234/1234 로그인 시 닉네임 설정
  const userType = "의뢰인"; // 유저 유형
  const [virtualMoney, setVirtualMoney] = useState(100000); // 가상머니 초기 값
  const [showTransactionBox, setShowTransactionBox] = useState(false);
  const [transactionType, setTransactionType] = useState("입금"); // 입금 또는 출금
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");

  const toggleTransactionBox = () => {
    setShowTransactionBox((prev) => !prev);
  };

  const toggleTransactionType = () => {
    setTransactionType((prev) => (prev === "입금" ? "출금" : "입금"));
  };

  const handleTransaction = () => {
    const numericAmount = parseInt(amount, 10);

    if (!account || !amount || isNaN(numericAmount)) {
      alert("계좌번호와 금액을 모두 입력하세요.");
      return;
    }

    if (transactionType === "출금" && numericAmount > virtualMoney) {
      alert("현재 가상머니보다 많은 금액은 출금할 수 없습니다.");
      return;
    }

    if (transactionType === "입금") {
      setVirtualMoney((prev) => prev + numericAmount);
    } else {
      setVirtualMoney((prev) => prev - numericAmount);
    }

    alert(`${transactionType}이 완료되었습니다.`);
    setAccount("");
    setAmount("");
  };

  return (
    <div className="mypage-container">
      <div className="user-layout">
        <div className="user-profile">
          <span className="user-type">{userType}</span>
        </div>
        <div className="user-info">
          <div className="user-nickname">{nickname}</div>
          <div className="user-money">가상머니: {virtualMoney.toLocaleString()}원</div>
          <div className="user-actions">
            <button className="user-edit">정보 수정</button>
            <button className="user-transaction" onClick={toggleTransactionBox}></button>
            <button className="user-chat"></button>
          </div>
        </div>
      </div>
      {showTransactionBox && (
        <div className="transaction-box">
          <h2 className="transaction-title">입금 / 결제</h2>
          <input
            type="text"
            className="account-input"
            placeholder={
              transactionType === "입금"
                ? "카드를 선택해주세요"
                : "계좌번호를 입력하세요"
            }
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <div className="amount-input-container">
            <button
              className="amount-toggle-button"
              onClick={toggleTransactionType}
            >
              {transactionType}
            </button>
            <div className="amount-wrapper">
              <input
                type="text"
                className="amount-input"
                placeholder="금액 입력"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="currency">원</span>
            </div>
          </div>
          <button
            className={`transaction-action ${
              transactionType === "입금" ? "deposit" : "withdraw"
            }`}
            onClick={handleTransaction}
          >
            {transactionType}하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
