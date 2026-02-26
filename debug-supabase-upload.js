import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 错误: Supabase 环境变量缺失 (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log('🚀 开始测试 Supabase 连接与上传...');
    console.log('🔗 URL:', supabaseUrl);

    const fileName = 'test.txt';
    const content = 'Hello Supabase! This is a test file for UploadSoul Virtual Lover.';
    const buffer = Buffer.from(content);

    try {
        // 1. 尝试上传
        console.log(`正在上传 "${fileName}" 到 "audio_responses" 存储桶...`);
        const { data, error } = await supabase.storage
            .from('audio_responses')
            .upload(fileName, buffer, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            if (error.statusCode === '404' || error.status === 400) {
                console.error('❌ 失败: 找不到 "audio_responses" 存储桶。请在 Supabase Dashboard 手动创建它。');
            } else {
                console.error('❌ 上传出错:', error);
            }
            return;
        }

        console.log('✅ 上传成功!');

        // 2. 获取公网 URL
        const { data: { publicUrl } } = supabase.storage
            .from('audio_responses')
            .getPublicUrl(fileName);

        console.log('\n📄 文件公网 URL:');
        console.log(publicUrl);
        console.log('\n请尝试在浏览器打开上面的链接，如果能显示内容，说明测试全通过！');

    } catch (err) {
        console.error('💥 发生未预期错误:', err.message);
    }
}

testUpload();
