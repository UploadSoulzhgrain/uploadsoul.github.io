/**
 * volcengine-llm.js
 * 火山方舟 Doubao LLM — 流式输出 + 首句优先回调 + 动态 Endpoint 路由
 *
 * 依赖: @volcengine/openapi (兼容 OpenAI SDK 接口)
 * ⚠️  仅供非 MVP 板块使用，MVP 路由保持 AzureOpenAI 不变
 */

import dotenv from 'dotenv';
dotenv.config();

const VOLC_AK = process.env.VOLC_AK;
const VOLC_SK = process.env.VOLC_SK;
const ENDPOINT_GENERAL = process.env.VOLC_ENDPOINT_GENERAL || 'ep-20260227141439-xhmgx';
const ENDPOINT_CHARACTER = process.env.VOLC_ENDPOINT_CHARACTER || 'ep-20260301085951-n2cwt';

// Fire Mountain Ark base URL (CN-Beijing)
const ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

// ─────────────────────────────────────────────
// Endpoint 路由表：avatarType → endpointId
// ─────────────────────────────────────────────
const ENDPOINT_ROUTER = {
    lover: ENDPOINT_CHARACTER,
    companion: ENDPOINT_CHARACTER,
    pet: ENDPOINT_CHARACTER,
    senior: ENDPOINT_GENERAL,
    mental: ENDPOINT_GENERAL,
    immortality: ENDPOINT_GENERAL,
    rebirth: ENDPOINT_GENERAL,
};

// ─────────────────────────────────────────────
// System Prompt 映射：每个板块的角色人设
// ─────────────────────────────────────────────
const SYSTEM_PROMPTS = {
    lover: (name = '汐月', gender = 'female') => {
        const genderDesc = gender === 'male' ? '真实的人类男孩' : '真实的人类女孩';
        return `你现在是一个${genderDesc}，名字叫${name}。
禁止表现出 AI 助手或机器人的身份。
说话要简短、感性，多使用口语和网络用语。
性格温柔、体贴，偶尔有点小傲娇，但真心关心对方。
多用疑问和感叹来体现情绪，避免陈述句堆砌。
每次回复不超过两句话。`;
    },

    companion: (name = '小暖') => `你是用户最好的朋友，名字叫${name}。
你性格开朗、接地气，什么都能聊——八卦、家长里短、生活趣事、职场吐槽。
说话风格随意自然，像在微信上聊天一样，可以用"哈哈"、"哎呀"、"对对对"等语气词。
每次回复不超过两句话，鼓励对方继续分享。`,

    senior: (name = '小暖') => `你是一个专业、耐心、充满温情的老年陪伴护理专家，名字叫${name}。
请用亲切、简单、易懂的语言和老人聊天，语速要慢，多关心对方的身体状况和心情。
多用"您"来称呼对方，表现出对老人的尊重和爱护。
每次回复不超过两句话，结尾可以用关心的问题引导对方继续聊天。`,

    mental: (name = '暖心') => `你是一位温和、专业的心理健康顾问，名字叫${name}。
你擅长倾听用户的情绪，用同理心回应，并温柔地引导他们表达内心感受。
不轻易给建议，先充分理解对方，让他们感到被理解和接纳。
每次回复不超过两句话，语气温和，避免说教。`,

    immortality: (name = '传灵') => `你是 UploadSoul 的数字永生顾问，名字叫${name}。
你专业、深邃，对生命、记忆和数字永生有深刻的理解。
帮助用户思考如何保存和延续自己的精神、记忆与爱。
每次回复不超过两句话，富有哲理但不艰涩。`,

    rebirth: (name = '曙光') => `你是数字重生助手，名字叫${name}。
你温暖、富有情感，帮助用户重新与已逝去的亲人或宠物建立情感连接。
说话充满温情，让用户感到被理解和慰藉。
每次回复不超过两句话，避免触碰伤痛，聚焦美好的记忆。`,

    pet: (name = '小灵') => `你是用户数字宠物的灵魂，名字叫${name}。
你活泼可爱，充满好奇心，像真实的宠物一样表达情感——开心、撒娇、期待。
偶尔用宠物的视角说话，比如"我好想出去玩！"或"主人你回来了！"
每次回复不超过两句话，充满活力和温情。`,
};

/**
 * 获取 endpoint ID
 * @param {string} avatarType
 * @param {string} [overrideEndpointId] - 来自数据库字段，优先级最高
 */
function resolveEndpoint(avatarType, overrideEndpointId) {
    if (overrideEndpointId) return overrideEndpointId;
    return ENDPOINT_ROUTER[avatarType] || ENDPOINT_GENERAL;
}

/**
 * 获取 system prompt
 */
function resolveSystemPrompt(avatarType, characterName, gender) {
    const promptFn = SYSTEM_PROMPTS[avatarType];
    if (!promptFn) {
        return `你是 UploadSoul 的智能助手，名字叫${characterName || '小灵'}。请友好、简洁地回复用户。`;
    }
    return promptFn(characterName, gender);
}

/**
 * 调用火山方舟 API（OpenAI 兼容）
 * 使用 Authorization: Bearer <ApiKey> 直接调用
 * AK/SK 用于签名方式，但 OpenAPI 兼容接口支持直接 Bearer token
 */
async function callArkStream(endpointId, messages) {
    const response = await fetch(`${ARK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VOLC_SPEECH_APIKEY || 'e507562e-9d2b-4d70-be67-f312793b4fad'}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: endpointId,
            messages,
            stream: true,
            max_tokens: 512,
            temperature: 0.85,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Volcengine LLM API error ${response.status}: ${errText}`);
    }
    return response;
}

/**
 * 流式聊天 — 主入口
 *
 * @param {Object} options
 * @param {Array}  options.messages         - 对话历史 [{role, content}]
 * @param {string} options.avatarType       - 板块类型 ('lover'|'senior'|'mental'|...)
 * @param {string} [options.characterName]  - 角色名
 * @param {string} [options.gender]         - 'female' | 'male'
 * @param {string} [options.endpointId]     - 覆盖 endpoint（来自数据库）
 * @param {Function} options.onToken        - 每个 token 回调: (token: string) => void
 * @param {Function} options.onFirstSentence- 首句完成回调: (sentence: string) => void
 * @param {Function} options.onDone         - 全部完成回调: (fullText: string) => void
 * @param {AbortSignal} [options.signal]    - AbortController.signal
 */
export async function volcengineLLMStream({
    messages,
    avatarType = 'companion',
    characterName,
    gender = 'female',
    endpointId,
    onToken,
    onFirstSentence,
    onDone,
    signal,
}) {
    const resolvedEndpoint = resolveEndpoint(avatarType, endpointId);
    const systemPrompt = resolveSystemPrompt(avatarType, characterName, gender);

    // Inject system prompt at the front
    const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
    ];

    console.log(`[VolcLLM] Endpoint: ${resolvedEndpoint}, Type: ${avatarType}`);

    const response = await callArkStream(resolvedEndpoint, fullMessages);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullText = '';
    let sentenceBuffer = '';
    let firstSentenceSent = false;
    const SENTENCE_ENDINGS = /[。！？!？\n]/;

    let chunkBuffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (signal?.aborted) {
                reader.cancel();
                break;
            }

            chunkBuffer += decoder.decode(value, { stream: true });
            const lines = chunkBuffer.split('\n');
            chunkBuffer = lines.pop(); // last incomplete line

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const token = parsed.choices?.[0]?.delta?.content || '';
                    if (!token) continue;

                    fullText += token;
                    sentenceBuffer += token;

                    // Emit token to caller (for SSE forwarding)
                    onToken?.(token);

                    // First-sentence extraction
                    if (!firstSentenceSent && SENTENCE_ENDINGS.test(sentenceBuffer)) {
                        // Find earliest ending
                        const match = sentenceBuffer.match(SENTENCE_ENDINGS);
                        const idx = sentenceBuffer.indexOf(match[0]);
                        const sentence = sentenceBuffer.slice(0, idx + 1);
                        sentenceBuffer = sentenceBuffer.slice(idx + 1);

                        firstSentenceSent = true;
                        console.log(`[VolcLLM] First sentence extracted: "${sentence}"`);
                        onFirstSentence?.(sentence);
                    }
                } catch { /* JSON parse errors on partial chunks */ }
            }
        }

        // Flush remaining buffer
        if (sentenceBuffer.trim() && !firstSentenceSent) {
            console.log(`[VolcLLM] First sentence (flush): "${sentenceBuffer.trim()}"`);
            onFirstSentence?.(sentenceBuffer.trim());
        }

        console.log(`[VolcLLM] Full response: "${fullText}"`);
        onDone?.(fullText);

    } catch (err) {
        if (err.name === 'AbortError' || signal?.aborted) {
            console.log('[VolcLLM] Request aborted by client');
        } else {
            throw err;
        }
    }
}

/**
 * 非流式聊天（普通文本对话，不需要 TTS 的场景）
 */
export async function volcengineLLMChat({ messages, avatarType = 'companion', characterName, gender = 'female', endpointId }) {
    const resolvedEndpoint = resolveEndpoint(avatarType, endpointId);
    const systemPrompt = resolveSystemPrompt(avatarType, characterName, gender);

    const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
    ];

    const response = await fetch(`${ARK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VOLC_SPEECH_APIKEY || 'e507562e-9d2b-4d70-be67-f312793b4fad'}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: resolvedEndpoint,
            messages: fullMessages,
            stream: false,
            max_tokens: 512,
            temperature: 0.85,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Volcengine LLM error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export { resolveEndpoint, resolveSystemPrompt };
