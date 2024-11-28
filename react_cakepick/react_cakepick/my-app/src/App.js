import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import MyPage from "./components/MyPage/MyPage";
import WritePage from "./components/WritePage/WritePage";
import NotFound from "./components/NotFound";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boxes, setBoxes] = useState([]); // MainPage 박스 관리

  const handleLogin = (id, pw) => { //supabase
    if (id === "1234" && pw === "1234") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const addBox = () => {
    setBoxes((prevBoxes) => [...prevBoxes, {}]); // 박스 추가
  };

  return (
    <div className="app">
      <Router>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="content">
          <Routes>
            <Route path="/" element={<MainPage boxes={boxes} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/write" element={<WritePage addBox={addBox} />} />
            {isLoggedIn && <Route path="/mypage" element={<MyPage />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
