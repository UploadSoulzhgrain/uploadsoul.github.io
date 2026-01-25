
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 如果环境变量缺失，使用占位符防止 white-screen-of-death (白屏崩溃)
// 这样即使用户忘记配置 Vercel 环境变量，网站首页依然能访问，只是 Auth 功能不可用。
const validUrl = supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co'

const validKey = supabaseAnonKey || 'placeholder-key'

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables missing. Auth features will be disabled.')
}

export const supabase = createClient(validUrl, validKey)
