
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getAI() {
    // Vite uses import.meta.env for environment variables
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    return new GoogleGenAI(apiKey);
  }

  /**
   * Conducts a guided interview. Takes the context of the conversation and generates 
   * the next logical, deep-diving question to build a cohesive memoir chapter.
   */
  static async generateInterviewQuestion(history: string[], currentTopic: string): Promise<string> {
    try {
      const ai = this.getAI();
      const context = history.length > 0 ? `当前对话记录如下：\n${history.join('\n')}` : `目前还没有对话。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一位专业的人生传记作家。当前的主题是：“${currentTopic}”。
        你的任务是通过深度访谈，引导对方说出具体、生动、有情感色彩的细节。
        ${context}
        请根据以上信息，提出下一个“引导式”问题。要求：
        1. 语气温和、尊重，像一位博学的朋友。
        2. 问题要具体且具有启发性（例如：问“那时的阳光照在身上是什么感觉”或“空气中弥漫着怎样的气息”）。
        3. 严禁使用任何带有“老”、“爷爷/奶奶”等暗示年龄的词汇，称呼对方为“您”。
        4. 每次只提一个问题，且不超过20个字。`,
      });

      return response.text?.trim() || "那时候，还有什么细节是您特别难忘的吗？";
    } catch (err) {
      console.error("Gemini interview generation failed:", err);
      return "当时您身边还有谁在一起？他们说了什么吗？";
    }
  }

  /**
   * Generates a nostalgic, gentle follow-up question based on the user's previous memory.
   */
  static async generateNextPrompt(userMemory: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `基于用户分享的这段经历：“${userMemory}”，请作为一个专注且具有同理心的记录者，提一个深情且能引发更多往事细节的后续问题（不超过15个字）。目标是让对方感到被尊重和理解，并愿意分享更多人生智慧。请称呼对方为“您”，不要使用任何长辈/晚辈的称呼。`,
      });

      return response.text?.trim() || "那时候还有什么让您难忘的事吗？";
    } catch (err) {
      console.error("Gemini prompt generation failed:", err);
      return "那时留下的珍贵记忆，现在回想起来是什么滋味？";
    }
  }

  /**
   * Generates a deeply empathetic, validating response for someone venting their emotions.
   */
  static async generateEmpathicResponse(userVenting: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `用户正在倾诉一段情绪或心事：“${userVenting}”。请作为一个深沉、睿智、平等且从不评判的“聆听者”，给出一段温暖、包容且极具同理心的回应（不超过25个字）。语气要像灵魂伴侣或挚友，让用户感到安全。`,
      });

      return response.text?.trim() || "我都听到了，这里永远是你安静的避风港。";
    } catch (err) {
      console.error("Gemini venting response failed:", err);
      return "说出来吧，我在听，这里很安全。";
    }
  }
}
