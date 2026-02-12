import 'package:flutter/material.dart';
import 'package:sayit/types.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:sayit/services/api_service.dart';

class MemoirRoom extends StatefulWidget {
  final VoidCallback onBack;
  final String? initialTopic;
  final bool forceGuided;

  const MemoirRoom({
    super.key,
    required this.onBack,
    this.initialTopic,
    this.forceGuided = false,
  });

  @override
  State<MemoirRoom> createState() => _MemoirRoomState();
}

class _MemoirRoomState extends State<MemoirRoom> {
  bool _isRecording = false;
  bool _isTextMode = false;
  String _inputText = '';
  bool _isThinking = false;
  bool _isGuidedMode = false;
  String _currentPrompt = '';
  List<String> _conversationHistory = [];
  List<MemorySnippet> _snippets = [];

  @override
  void initState() {
    super.initState();
    _isGuidedMode = widget.forceGuided || widget.initialTopic != null;
    _currentPrompt = widget.initialTopic ?? '记录此刻的心情或一段珍贵的回忆...';
    _snippets = [
      MemorySnippet(
        id: '1',
        timestamp: '五分钟前',
        category: widget.initialTopic != null ? '引导访谈' : '自主记录',
        text: widget.initialTopic != null
            ? '"访谈主题：${widget.initialTopic}"'
            : '"您可以随时开始记录，我会静静聆听。"',
      ),
    ];
  }

  void _toggleRecording() {
    setState(() {
      _isRecording = !_isRecording;
      if (_isRecording) {
        // In a real app, we'd get text from speech-to-text
        Future.delayed(const Duration(seconds: 2), () {
          _handleNewSnippet("那天阳光很好，我走在老家的青石板路上。");
        });
      }
    });
  }

  void _handleSendText() {
    if (_inputText.trim().isEmpty) return;
    _handleNewSnippet(_inputText);
    setState(() {
      _inputText = '';
      _isTextMode = false;
    });
  }

  Future<void> _handleNewSnippet(String text) async {
    final newSnippet = MemorySnippet(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      timestamp: '刚才',
      category: '您的讲述',
      text: '"$text"',
    );

    setState(() {
      _snippets = [newSnippet, ..._snippets];
      _conversationHistory = [..._conversationHistory, '用户说：$text'];
    });

    setState(() => _isThinking = true);
    try {
      if (_isGuidedMode) {
        final nextQuestion = await ApiService.generateInterviewQuestion(
          _conversationHistory,
          _currentPrompt,
        );
        setState(() {
          _currentPrompt = nextQuestion;
          _conversationHistory = [..._conversationHistory, 'AI提问：$nextQuestion'];
        });
      } else {
        final nextPrompt = await ApiService.generateNextPrompt(text);
        setState(() => _currentPrompt = nextPrompt);
      }
    } catch (err) {
      print("AI response failed: $err");
    } finally {
      setState(() => _isThinking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            decoration: BoxDecoration(
              color: AppTheme.cream.withOpacity(0.95),
              border: Border(
                bottom: BorderSide(color: AppTheme.amberGold.withOpacity(0.2)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton.icon(
                  onPressed: widget.onBack,
                  icon: const Icon(Icons.chevron_left, size: 24),
                  label: const Text('返回', style: TextStyle(fontWeight: FontWeight.bold)),
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.darkBrown.withOpacity(0.7),
                  ),
                ),
                Column(
                  children: [
                    const Text(
                      '时光留声机',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      _isGuidedMode ? 'AI Guided Interview' : 'Autonomous Recording',
                      style: TextStyle(
                        fontSize: 10,
                        color: AppTheme.amberGold,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.history),
                  color: AppTheme.darkBrown.withOpacity(0.7),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          // Mode Switcher
          Padding(
            padding: const EdgeInsets.all(16),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.amberGold.withOpacity(0.05),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.amberGold.withOpacity(0.2)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildModeButton('AI 引导模式', true),
                  _buildModeButton('自主记录模式', false),
                ],
              ),
            ),
          ),

          // Main Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Prompt Display
                  Column(
                    children: [
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppTheme.softSepia,
                              border: Border.all(color: Colors.white, width: 8),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 12,
                                ),
                              ],
                            ),
                            child: Icon(
                              _isRecording
                                  ? Icons.graphic_eq
                                  : _isThinking
                                      ? Icons.hourglass_top
                                      : _isGuidedMode
                                          ? Icons.auto_awesome
                                          : Icons.settings_voice,
                              size: 40,
                              color: AppTheme.amberGold,
                            ),
                          ),
                          if (_isGuidedMode)
                            Positioned(
                              bottom: -4,
                              right: -4,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.amberGold,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  '访谈员',
                                  style: TextStyle(
                                    fontSize: 8,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Text(
                        _isThinking
                            ? '正在为您整理...'
                            : _isGuidedMode
                                ? '访谈建议'
                                : '随心所记',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppTheme.amberGold,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _currentPrompt,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 48),

                  // Divider
                  Row(
                    children: [
                      Expanded(child: Divider(color: AppTheme.amberGold.withOpacity(0.2))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Text(
                          _isGuidedMode ? '访谈实录' : '碎片记录',
                          style: TextStyle(
                            fontSize: 10,
                            color: AppTheme.amberGold,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ),
                      Expanded(child: Divider(color: AppTheme.amberGold.withOpacity(0.2))),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Snippets List
                  ..._snippets.map((snippet) => _buildSnippetCard(snippet)),
                ],
              ),
            ),
          ),

          // Interaction Footer
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  AppTheme.cream,
                  AppTheme.cream,
                ],
              ),
            ),
            child: _isTextMode ? _buildTextInput() : _buildVoiceInput(),
          ),
        ],
      ),
    );
  }

  Widget _buildModeButton(String label, bool isGuided) {
    final isSelected = _isGuidedMode == isGuided;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _isGuidedMode = isGuided),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.amberGold : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : AppTheme.amberGold.withOpacity(0.6),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSnippetCard(MemorySnippet snippet) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.amberGold.withOpacity(0.05)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${snippet.timestamp} · ${snippet.category}',
                  style: TextStyle(
                    fontSize: 9,
                    color: AppTheme.darkBrown.withOpacity(0.4),
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  snippet.text,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.darkBrown.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),
          if (_isGuidedMode)
            Icon(Icons.verified_user, size: 16, color: AppTheme.amberGold.withOpacity(0.2)),
        ],
      ),
    );
  }

  Widget _buildTextInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.amberGold.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.amberGold.withOpacity(0.05),
            blurRadius: 20,
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            autofocus: true,
            maxLines: 4,
            style: const TextStyle(fontSize: 16),
            decoration: InputDecoration(
              hintText: _isGuidedMode ? "回答访谈员..." : "写下您的记忆...",
              border: InputBorder.none,
              hintStyle: TextStyle(color: AppTheme.darkBrown.withOpacity(0.2)),
            ),
            controller: TextEditingController(text: _inputText)
              ..selection = TextSelection.collapsed(offset: _inputText.length),
            onChanged: (value) => setState(() => _inputText = value),
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () => setState(() => _isTextMode = false),
                icon: const Icon(Icons.mic),
                label: const Text('返回语音'),
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.darkBrown.withOpacity(0.5),
                ),
              ),
              ElevatedButton(
                onPressed: _inputText.trim().isEmpty || _isThinking ? null : _handleSendText,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.amberGold,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                ),
                child: const Text('投递记忆'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceInput() {
    return Column(
      children: [
        Row(
          children: [
            IconButton(
              onPressed: () => setState(() => _isTextMode = true),
              icon: Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  border: Border.all(color: AppTheme.amberGold.withOpacity(0.3)),
                ),
                child: const Icon(Icons.edit_note, color: AppTheme.amberGold, size: 28),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: GestureDetector(
                onTapDown: (_) => _toggleRecording(),
                onTapUp: (_) => _toggleRecording(),
                child: Container(
                  height: 80,
                  decoration: BoxDecoration(
                    color: _isRecording ? Colors.red : AppTheme.darkBrown,
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: [
                      BoxShadow(
                        color: (_isRecording ? Colors.red : AppTheme.darkBrown).withOpacity(0.3),
                        blurRadius: 20,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _isRecording ? Icons.check : Icons.mic,
                        color: Colors.white,
                        size: 32,
                      ),
                      const SizedBox(width: 16),
                      Text(
                        _isRecording
                            ? '讲述完毕'
                            : _isThinking
                                ? '正在处理...'
                                : '按住开始讲述',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.info_outline, size: 12, color: AppTheme.darkBrown.withOpacity(0.4)),
            const SizedBox(width: 4),
            Text(
              _isGuidedMode
                  ? 'AI正在访谈，帮助您挖掘深度细节'
                  : '自主模式下，您可以随意诉说任何往事',
              style: TextStyle(
                fontSize: 10,
                color: AppTheme.darkBrown.withOpacity(0.4),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
