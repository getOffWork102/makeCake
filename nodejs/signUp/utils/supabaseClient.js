import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로
const __dirname = dirname(fileURLToPath(import.meta.url));

// .env 파일 명시적으로 로드
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = 'https://cbjwlinadttatcaaybet.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is not defined. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };