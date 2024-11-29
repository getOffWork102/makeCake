import { supabase } from '../utils/supabaseClient.js';
import bcrypt from 'bcrypt';

// id 중복 확인 함수
export const checkID = async (id) => {

  const { data, error } = await supabase
    .from('UserData')  // 사용자가 저장된 테이블
    .select('id')  // 필요한 필드만 선택
    .eq('id', id);

  if (error) {
    throw new Error('id 확인 중 오류 발생: ' + error.message);
  }

  return data.length > 0;  // 사용자가 존재하는지 여부 반환
};

//포트폴리오 이미지 등록함수
export const uploadPortfolio = async (userId, file, key) => {
  const { data, error } = await supabase.storage
    .from("portfolios")
    .upload(`${userId}/${key}-${Date.now()}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(`파일 업로드 실패: ${error.message}`);
  }

  return `https://your-supabase-url.storage.supabase.co/storage/v1/object/public/portfolios/${data.path}`;
};

//포트폴리오 DB 등록함수
export const saveImageMetadata = async (url, name) => {
  const { error } = await supabase.from("images").insert({
    image_url: url,
    image_name: name,
    created_at: new Date(),
  });

  if (error) {
    throw new Error(`이미지 데이터 저장 실패: ${error.message}`);
  }
};

// 사용자 등록 함수
export const registerUser = async (userType, nickname, id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);  // 비밀번호 해싱

  const { error } = await supabase
    .from('UserData')  // 'users' 테이블에 사용자 데이터를 삽입
    .insert([{ 
      userType,
      nickname, 
      id,
      password: hashedPassword 
    }]);

  if (error) {
    throw new Error('사용자 등록 실패: ' + error.message);
  }
};


// id로 사용자 찾기
export const getUserByID = async (id) => {
  try {
    const { data, error } = await supabase
      .from('UserData')  // 'users' 테이블에서 조회
      .select('*')     // 모든 필드 선택
      .eq('id', id)  // 조건: phone_number가 일치하는 행 선택
      .single();       // 단일 결과 반환 (전화번호는 고유해야 함)

    if (error) {
      throw new Error(error.message);
    }

    return data;  // 조회된 사용자 데이터 반환
  } catch (error) {
    throw new Error("사용자 조회 실패: " + error.message);
  }
};

//비밀번호 비교하기
export const comparePassword = async (inputPassword, storedPasswordHash) => {
  try {
    return await bcrypt.compare(inputPassword, storedPasswordHash);
  } catch (error) {
    throw new Error("비밀번호 비교 실패: " + error.message);
  }
};

// 비밀번호 해싱
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


// 유저 비밀번호 가져오기
export const getUserByPassword = async (userId) => {
  try {
    // 데이터베이스에서 사용자 정보를 ID로 조회
    const { data, error } = await supabase
      .from('UserData')  // 'users' 테이블에서 조회
      .select('password')  // 필요한 필드 선택
      .eq('id', userId)  // 조건: id가 일치하는 사용자 선택
      .single();  // 단일 결과 반환

    if (error) {
      throw new Error(error.message);
    }

    console.log(data);  // 조회된 사용자 데이터 로그 출력
    return data;
  } catch (error) {
    throw new Error("사용자 비밀번호 조회 중 오류 발생: " + error.message);
  }
};