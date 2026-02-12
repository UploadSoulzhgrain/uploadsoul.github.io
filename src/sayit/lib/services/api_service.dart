import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  // 使用配置文件中的 API 地址
  static String get baseUrl => ApiConfig.baseUrl;

  /// 生成访谈问题
  /// 前端只传参数：history (对话历史), currentTopic (当前主题)
  static Future<String> generateInterviewQuestion(
    List<String> history,
    String currentTopic,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/interview-question'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'history': history,
          'currentTopic': currentTopic,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['question'] as String? ?? "那时候，还有什么细节是您特别难忘的吗？";
      } else {
        print('API error: ${response.statusCode} - ${response.body}');
        return "当时您身边还有谁在一起？他们说了什么吗？";
      }
    } catch (error) {
      print('Network error: $error');
      return "当时您身边还有谁在一起？他们说了什么吗？";
    }
  }

  /// 生成下一个提示
  /// 前端只传参数：userMemory (用户分享的记忆)
  static Future<String> generateNextPrompt(String userMemory) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/next-prompt'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userMemory': userMemory,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['prompt'] as String? ?? "那时候还有什么让您难忘的事吗？";
      } else {
        print('API error: ${response.statusCode} - ${response.body}');
        return "那时留下的珍贵记忆，现在回想起来是什么滋味？";
      }
    } catch (error) {
      print('Network error: $error');
      return "那时留下的珍贵记忆，现在回想起来是什么滋味？";
    }
  }

  /// 生成共情回应
  /// 前端只传参数：userVenting (用户倾诉的内容)
  static Future<String> generateEmpathicResponse(String userVenting) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/empathic-response'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userVenting': userVenting,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] as String? ?? "我都听到了，这里永远是你安静的避风港。";
      } else {
        print('API error: ${response.statusCode} - ${response.body}');
        return "说出来吧，我在听，这里很安全。";
      }
    } catch (error) {
      print('Network error: $error');
      return "说出来吧，我在听，这里很安全。";
    }
  }
}
