import * as authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
import multer from "multer";
import httpStatus from 'http-status-codes';
import { tokenBlacklist } from '../app.js';

// multer 설정
const upload = multer({ storage: multer.memoryStorage() });

// 보호된 경로에서 실행될 컨트롤러 함수
export const protectedRout = (req, res) => {
  res.status(200).json({
    message: '인증된 사용자만 접근 가능합니다',
    user: req.user  // JWT 토큰에서 추출한 사용자 정보
  });
};

// 사용자 정보 호출
export const getUserData = async (req, res) => {
  const userId = req.user.id;  // JWT 토큰에서 가져온 사용자 ID
  try {
    console.log(userId);
    const userData = await authService.getUserById(userId);  // 서비스 호출
    console.log(userData);
    return res.status(200).json(userData);  // 사용자 데이터를 클라이언트에 반환
  } catch (error) {
    return res.status(500).json({ message: "사용자 정보 조회 실패" });
  }
};

// 현재 비밀번호 확인
export const verifyCurrentPassword = async (req, res) => {
  const { currentPassword } = req.body;
  const userId = req.user.id;  // JWT로부터 사용자 ID를 가져옴

  try {
    // 사용자 ID로 사용자 정보 가져오기
    const user = await authService.getUserByPassword(userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 비밀번호 검증
    const isPasswordValid = await authService.comparePassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: '현재 비밀번호가 틀렸습니다.' });
    }

    // 비밀번호가 맞으면 성공 응답
    return res.status(httpStatus.OK).json({ success: true, message: '비밀번호 확인 성공' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '비밀번호 확인 실패: ' + error.message });
  }
};

//회원가입
export const signUp = async (req, res) => {
  upload.fields([
    { name: "portfolio1", maxCount: 1 },
    { name: "portfolio2", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "파일 업로드 실패: " + err.message });
    }

    console.log("req.body:", req.body); // userType 값 확인

    const { type: userType, nickname, id, password } = req.body;
    const files = req.files;

    try {
      // 포트폴리오 업로드 및 메타데이터 저장
      for (const key of ["portfolio1", "portfolio2"]) {
        if (files[key] && files[key][0]) {
          const file = files[key][0];
          const imageUrl = await authService.uploadPortfolio(id, file, key); // 서비스 호출
          await authService.saveImageMetadata(imageUrl, file.originalname);  // 서비스 호출
        }
      }

      // 사용자 데이터 저장
      await authService.registerUser( userType, nickname, id, password); // 서비스 호출

      res.status(201).json({ message: "회원가입 성공" });
    } catch (error) {
      res.status(500).json({ message: "회원가입 실패: " + error.message });
    }
  });
};

// 임의 토큰 발급 함수
export const ghost_user = async (req, res) => {
  const { id } = req.body;

  try {
    // id로 사용자 찾기
    const user = await authService.getUserByID(id);
    
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // JWT 토큰 생성 (비밀 키를 환경 변수에서 가져옴)
    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phone_number },
      process.env.JWT_SECRET,  // 이 부분에서 비밀 키 사용
    );

    // 사용자에게 토큰 반환
    return res.status(httpStatus.OK).json({ token });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "임의 로그인 실패: " + error.message });
  }
};

// 로그인 함수
export const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    console.log(`로그인 요청: ID = ${id}, Password = ${password}`);
    // id로 사용자 찾기
    const user = await authService.getUserByID(id);
    if (!user) {
      console.log("사용자를 찾을 수 없음");
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 검증
    const isPasswordValid = await authService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("비밀번호가 일치하지 않음");
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    console.log("로그인 성공");
    // JWT 토큰 생성 (비밀 키를 환경 변수에서 가져옴)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,  // 이 부분에서 비밀 키 사용
    );

    // 사용자에게 토큰 반환
    return res.status(httpStatus.OK).json({ token });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "로그인 실패: " + error.message });
  }
};

// 로그아웃 처리
export const logout = (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];  // Authorization 헤더에서 JWT 토큰 추출

  // 블랙리스트에 토큰 추가
  tokenBlacklist.push(token);

  // 응답: 로그아웃 완료 메시지
  return res.status(200).json({ message: "로그아웃 완료" });
};

// 인증 미들웨어에서 블랙리스트에 있는 토큰 차단
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);  // 토큰이 없으면 401 Unauthorized 반환
  }

  // 토큰이 블랙리스트에 있는지 확인
  if (tokenBlacklist.includes(token)) {
    return res.sendStatus(403);  // 블랙리스트에 있는 토큰이면 403 Forbidden 반환
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);  // 토큰 검증 실패 시 403 반환
    req.user = user;  // 토큰 검증 성공 시 사용자 정보를 req.user에 저장
    next();
  });
};
