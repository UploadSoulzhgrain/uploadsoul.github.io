import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sayit/theme/app_theme.dart';
// AI 服务已移至后端，不再需要前端初始化
import 'package:sayit/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // AI 服务已移至后端 Serverless 函数
  // 前端不再需要初始化 AI 服务
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Add providers here if needed
      ],
      child: MaterialApp(
        title: 'SayIt (说吧)',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const App(),
      ),
    );
  }
}
