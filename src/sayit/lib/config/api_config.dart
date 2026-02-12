/// API 配置
/// 用于管理后端 API 地址
class ApiConfig {
  // 本地开发环境
  static const String localBaseUrl = 'http://localhost:3001';
  
  // 生产环境（部署到阿里云函数计算后，需要替换为实际地址）
  static const String productionBaseUrl = 'https://your-function-compute-url.cn-hangzhou.fc.aliyuncs.com';
  
  // 当前使用的环境
  // 开发时使用 localBaseUrl
  // 生产时使用 productionBaseUrl
  static const String baseUrl = localBaseUrl;
  
  // 是否在生产环境
  static const bool isProduction = false;
}
