import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sayit/types.dart';
import 'package:sayit/views/home.dart';
import 'package:sayit/views/login.dart';
import 'package:sayit/views/memoir_room.dart';
import 'package:sayit/views/collection.dart';
import 'package:sayit/views/time_capsule.dart';
import 'package:sayit/views/settings.dart';
import 'package:sayit/views/memoir_preview.dart';
import 'package:sayit/views/mood_tree_hollow.dart';
import 'package:sayit/views/letter_to_future.dart';
import 'package:sayit/components/bottom_nav.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  bool _isLoggedIn = false;
  bool _isCheckingAuth = true;
  AppView _currentView = AppView.home;
  String? _activeTopic;

  void _navigateToMemoirWithTopic(String topic) {
    setState(() {
      _activeTopic = topic;
      _currentView = AppView.memoirRoom;
    });
  }

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    setState(() {
      _isLoggedIn = token != null;
      _isCheckingAuth = false;
    });
  }

  void _handleLoginSuccess() {
    setState(() {
      _isLoggedIn = true;
    });
  }

  void _handleBackToHome() {
    setState(() {
      _activeTopic = null;
      _currentView = AppView.home;
    });
  }

  Widget _renderView() {
    switch (_currentView) {
      case AppView.home:
        return Home(
          onNavigate: (view) => setState(() => _currentView = view),
          onStartInterview: _navigateToMemoirWithTopic,
        );
      case AppView.memoirRoom:
        return MemoirRoom(
          onBack: _handleBackToHome,
          initialTopic: _activeTopic,
        );
      case AppView.collection:
        return Collection(
          onSelectChapter: () => setState(() => _currentView = AppView.memoirPreview),
        );
      case AppView.timeCapsule:
        return TimeCapsule(
          onStartWriting: () => setState(() => _currentView = AppView.letterToFuture),
        );
      case AppView.letterToFuture:
        return LetterToFuture(
          onBack: () => setState(() => _currentView = AppView.timeCapsule),
        );
      case AppView.settings:
        return Settings(
          onBack: () => setState(() => _currentView = AppView.home),
        );
      case AppView.memoirPreview:
        return MemoirPreview(
          onBack: () => setState(() => _currentView = AppView.collection),
        );
      case AppView.moodTreeHollow:
        return MoodTreeHollow(
          onBack: () => setState(() => _currentView = AppView.home),
        );
      default:
        return Home(
          onNavigate: (view) => setState(() => _currentView = view),
          onStartInterview: _navigateToMemoirWithTopic,
        );
    }
  }

  bool _shouldShowBottomNav() {
    return _currentView != AppView.memoirRoom &&
        _currentView != AppView.memoirPreview &&
        _currentView != AppView.moodTreeHollow &&
        _currentView != AppView.letterToFuture;
  }

  @override
  Widget build(BuildContext context) {
    // 检查登录状态
    if (_isCheckingAuth) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // 未登录，显示登录页面
    if (!_isLoggedIn) {
      return LoginPage(onLoginSuccess: _handleLoginSuccess);
    }

    // 已登录，显示主应用
    return Scaffold(
      body: SafeArea(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          margin: EdgeInsets.symmetric(horizontal: MediaQuery.of(context).size.width > 400 ? (MediaQuery.of(context).size.width - 400) / 2 : 0),
          child: Column(
            children: [
              Expanded(
                child: _renderView(),
              ),
              if (_shouldShowBottomNav())
                BottomNav(
                  activeView: _currentView,
                  onNavigate: (view) => setState(() => _currentView = view),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
