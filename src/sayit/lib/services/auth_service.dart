import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class AuthService {
  static String get baseUrl => ApiConfig.baseUrl;

  /// 发送验证码
  /// 前端只传参数：phone (手机号)
  static Future<Map<String, dynamic>> sendVerificationCode(String phone) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/send-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        final error = jsonDecode(response.body) as Map<String, dynamic>;
        throw Exception(error['message'] ?? '发送验证码失败');
      }
    } catch (error) {
      print('Send verification code error: $error');
      rethrow;
    }
  }

  /// 验证登录
  /// 前端只传参数：phone (手机号), code (验证码)
  static Future<Map<String, dynamic>> login(String phone, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'code': code,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        final error = jsonDecode(response.body) as Map<String, dynamic>;
        throw Exception(error['message'] ?? '登录失败');
      }
    } catch (error) {
      print('Login error: $error');
      rethrow;
    }
  }
}
