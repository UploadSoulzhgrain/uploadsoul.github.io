/**
 * test-volcengine-llm.js
 * Quick verification: LLM streaming + first-sentence extraction
 *
 * Run: node tests/test-volcengine-llm.js
 */

import dotenv from 'dotenv';
dotenv.config();
import { volcengineLLMStream } from '../api/lib/volcengine-llm.js';

console.log('=== Volcengine LLM Stream Test ===');
console.log('Endpoint Character:', process.env.VOLC_ENDPOINT_CHARACTER);
console.log('Endpoint General:  ', process.env.VOLC_ENDPOINT_GENERAL);
console.log();

// Test 1: Lover (character endpoint)
console.log('--- Test 1: Lover (character-250228) ---');
await volcengineLLMStream({
    messages: [{ role: 'user', content: '你好，今天天气怎么样？' }],
    avatarType: 'lover',
    characterName: '汐月',
    gender: 'female',
    onToken: (t) => process.stdout.write(t),
    onFirstSentence: (s) => {
        console.log('\n[FIRST SENTENCE]:', JSON.stringify(s));
    },
    onDone: (full) => {
        console.log('\n[DONE] Full:', JSON.stringify(full));
    }
});

console.log('\n');

// Test 2: Senior (general endpoint)
console.log('--- Test 2: Senior Care (Doubao-1.5-pro) ---');
await volcengineLLMStream({
    messages: [{ role: 'user', content: '我最近感觉心情不太好。' }],
    avatarType: 'senior',
    characterName: '小暖',
    onToken: (t) => process.stdout.write(t),
    onFirstSentence: (s) => {
        console.log('\n[FIRST SENTENCE]:', JSON.stringify(s));
    },
    onDone: (full) => {
        console.log('\n[DONE] Full:', JSON.stringify(full));
    }
});

console.log('\n=== All tests passed ===');
