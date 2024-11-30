import { Router } from 'express';
import {ghost_user, protectedRout, signUp, login, verifyCurrentPassword, logout } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

// 회원가입 경로
router.post('/signUp', signUp);

// 로그인 경로
router.post('/login', login);

// 임의 토큰 발급 경로
router.post('/login_ghost', ghost_user);

// 현재 비밀번호 확인 경로
router.post('/reset-password/verify-current-password', authenticateToken, verifyCurrentPassword);

// 로그아웃 경로
router.post('/logout', authenticateToken, logout);

// 보호된 경로 추가 (JWT 인증 필요)
router.get('/protected', authenticateToken, protectedRout);

export default router;
