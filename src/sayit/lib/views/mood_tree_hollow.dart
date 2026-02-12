import 'package:flutter/material.dart';
import 'package:sayit/types.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:sayit/services/api_service.dart';

class MoodTreeHollow extends StatefulWidget {
  final VoidCallback onBack;

  const MoodTreeHollow({
    super.key,
    required this.onBack,
  });

  @override
  State<MoodTreeHollow> createState() => _MoodTreeHollowState();
}

class _MoodTreeHollowState extends State<MoodTreeHollow> {
  bool _isRecording = false;
  bool _isTextMode = false;
  String _inputText = '';
  bool _isChatActive = false;
  bool _isThinking = false;
  String _currentPrompt = '在这个静谧的树洞里，说出你的秘密吧...';
  List<MemorySnippet> _vents = [];

  final List<Map<String, dynamic>> _moods = const [
    {'icon': Icons.wb_sunny, 'label': '开心', 'color': Color(0xFFFCD34D)},
    {'icon': Icons.cloud, 'label': '平静', 'color': Color(0xFF60A5FA)},
    {'icon': Icons.water_drop, 'label': '忧郁', 'color': Color(0xFF818CF8)},
    {'icon': Icons.bedtime, 'label': '倦怠', 'color': Color(0xFFA78BFA)},
    {'icon': Icons.bolt, 'label': '生气', 'color': Color(0xFFEF4444)},
    {'icon': Icons.grain, 'label': '焦灼', 'color': Color(0xFFF87171)},
  ];

  Map<String, dynamic> _selectedMood = const {'icon': Icons.cloud, 'label': '平静', 'color': Color(0xFF60A5FA)};

  @override
  void initState() {
    super.initState();
    _selectedMood = _moods[1];
    _vents = [
      MemorySnippet(
        id: 'v1',
        timestamp: '深夜',
        category: 'Soul',
        text: '"看了一场很长的电影，突然觉得世界很大，我很渺小。"',
        mood: '平静',
      ),
    ];
  }

  void _toggleRecording() {
    if (_isThinking) return;
    setState(() {
      _isRecording = !_isRecording;
      if (_isRecording) {
        Future.delayed(const Duration(seconds: 2), () {
          _handleNewVent("我刚才一直在想，人的一生到底在追寻什么。");
        });
      }
    });
  }

  void _handleSendText() {
    if (_inputText.trim().isEmpty || _isThinking) return;
    _handleNewVent(_inputText);
    setState(() {
      _inputText = '';
      _isTextMode = false;
    });
  }

  Future<void> _handleNewVent(String text) async {
    final newVent = MemorySnippet(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      timestamp: 'Just now',
      category: 'Venting',
      text: '"$text"',
      mood: _selectedMood['label'] as String,
    );

    setState(() {
      _vents = [..._vents, newVent];
    });

    if (_isChatActive) {
      setState(() => _isThinking = true);
      try {
        final nextResponse = await ApiService.generateEmpathicResponse(text);
        setState(() => _currentPrompt = nextResponse);
      } catch (err) {
        print("Gemini failed: $err");
        setState(() => _currentPrompt = "抱歉，我似乎离线了，但我依然在听。");
      } finally {
        setState(() => _isThinking = false);
      }
    } else {
      setState(() => _currentPrompt = '我已经将你的心情密封。只有树洞知道你的秘密。');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF050505),
      body: Stack(
        children: [
          // Background Ambience
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(-0.5, -0.5),
                  radius: 1.5,
                  colors: [
                    const Color(0xFF1E3A8A).withOpacity(0.1),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.2),
                  border: Border(
                    bottom: BorderSide(color: Colors.white.withOpacity(0.05)),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.05),
                          border: Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: const Icon(Icons.menu, color: Colors.grey, size: 24),
                      ),
                      onPressed: widget.onBack,
                    ),
                    Column(
                      children: [
                        Text(
                          'Mood Hollow',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            foreground: Paint()
                              ..shader = const LinearGradient(
                                colors: [Color(0xFFFFF59D), Color(0xFFFFB300)],
                              ).createShader(const Rect.fromLTWH(0, 0, 200, 70)),
                          ),
                        ),
                        Text(
                          'Private Sanctuary',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade500,
                            letterSpacing: 3,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFFB300), Color(0xFF10B981)],
                        ),
                      ),
                      child: Container(
                        margin: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.black,
                        ),
                        child: const Icon(Icons.person, color: Color(0xFFFFB300), size: 20),
                      ),
                    ),
                  ],
                ),
              ),

              // Main Content
              Expanded(
                child: Column(
                  children: [
                    // Interaction Stage
                    Padding(
                      padding: const EdgeInsets.only(top: 32, bottom: 16),
                      child: Column(
                        children: [
                          // Glowing Orb
                          Container(
                            width: 176,
                            height: 176,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white.withOpacity(0.1)),
                              color: Colors.grey.shade900.withOpacity(0.2),
                            ),
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                ClipOval(
                                  child: Image.network(
                                    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop',
                                    width: double.infinity,
                                    height: double.infinity,
                                    fit: BoxFit.cover,
                                    color: Colors.white.withOpacity(0.4),
                                    colorBlendMode: BlendMode.screen,
                                  ),
                                ),
                                Icon(
                                  _isRecording
                                      ? Icons.graphic_eq
                                      : _isThinking
                                          ? Icons.cached
                                          : Icons.spa,
                                  size: 64,
                                  color: _isRecording
                                      ? Colors.red
                                      : _isThinking
                                          ? const Color(0xFFFFB300)
                                          : const Color(0xFF10B981),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 40),
                          SizedBox(
                            height: 80,
                            child: Center(
                              child: Text(
                                _currentPrompt,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Scrollable Vent History
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                        itemCount: _vents.length,
                        itemBuilder: (context, index) {
                          final vent = _vents[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.03),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: Colors.white.withOpacity(0.05)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          width: 6,
                                          height: 6,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: const Color(0xFF10B981),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          '${vent.mood} · ${vent.timestamp}',
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                            color: const Color(0xFF10B981).withOpacity(0.7),
                                            letterSpacing: 1.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Icon(Icons.push_pin, size: 16, color: Colors.white.withOpacity(0.1)),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  vent.text,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    color: Colors.grey,
                                    height: 1.6,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),

              // Control Surface
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black,
                      Colors.black,
                    ],
                  ),
                  border: Border(
                    top: BorderSide(color: Colors.white.withOpacity(0.05)),
                  ),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Mood Selection Pills
                      if (!_isRecording && !_isTextMode)
                        SizedBox(
                          height: 48,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _moods.length,
                            itemBuilder: (context, index) {
                              final mood = _moods[index];
                              final isSelected = _selectedMood['label'] == mood['label'];
                              return GestureDetector(
                                onTap: () => setState(() => _selectedMood = mood),
                                child: Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? Colors.white.withOpacity(0.1)
                                        : Colors.white.withOpacity(0.02),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isSelected
                                          ? Colors.white.withOpacity(0.2)
                                          : Colors.white.withOpacity(0.05),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        mood['icon'] as IconData,
                                        size: 18,
                                        color: isSelected ? mood['color'] as Color : Colors.grey.shade500,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        mood['label'] as String,
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w900,
                                          color: isSelected ? Colors.white : Colors.grey.shade500,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                      const SizedBox(height: 16),

                      // AI Companion Toggle
                      GestureDetector(
                        onTap: () => setState(() => _isChatActive = !_isChatActive),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                          decoration: BoxDecoration(
                            color: _isChatActive
                                ? const Color(0xFFFFB300).withOpacity(0.1)
                                : Colors.grey.shade900.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: _isChatActive
                                  ? const Color(0xFFFFB300).withOpacity(0.5)
                                  : Colors.white.withOpacity(0.05),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _isChatActive ? Icons.auto_awesome : Icons.link_off,
                                color: _isChatActive ? const Color(0xFFFFB300) : Colors.grey.shade500,
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                _isChatActive ? 'AI 伴侣已接入' : '连接 AI 灵魂伴侣',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: _isChatActive ? const Color(0xFFFFB300) : Colors.grey.shade500,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Input Area
                      _isTextMode ? _buildTextInput() : _buildVoiceInput(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextInput() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF111111),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          TextField(
            autofocus: true,
            maxLines: 4,
            style: const TextStyle(color: Colors.grey.shade200, fontSize: 16),
            decoration: InputDecoration(
              hintText: '此刻的心情，无法宣之于口...',
              hintStyle: TextStyle(color: Colors.grey.shade700),
              border: InputBorder.none,
            ),
            controller: TextEditingController(text: _inputText)
              ..selection = TextSelection.collapsed(offset: _inputText.length),
            onChanged: (value) => setState(() => _inputText = value),
          ),
          const Divider(color: Colors.white12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () => setState(() => _isTextMode = false),
                icon: const Icon(Icons.mic_none, size: 16),
                label: const Text('语音'),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.grey.shade500,
                ),
              ),
              ElevatedButton(
                onPressed: _inputText.trim().isEmpty || _isThinking ? null : _handleSendText,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFFB300),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text('封存', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceInput() {
    return Row(
      children: [
        IconButton(
          onPressed: () => setState(() => _isTextMode = true),
          icon: Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.03),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: const Icon(Icons.edit_square, color: Colors.grey, size: 28),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: GestureDetector(
            onTapDown: (_) => _toggleRecording(),
            onTapUp: (_) => _toggleRecording(),
            child: Container(
              height: 64,
              decoration: BoxDecoration(
                color: _isRecording
                    ? Colors.red.withOpacity(0.2)
                    : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _isRecording
                      ? Colors.red.withOpacity(0.5)
                      : Colors.transparent,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: _isRecording
                          ? Colors.red.withOpacity(0.2)
                          : Colors.black.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      _isRecording ? Icons.mic : Icons.mic_none,
                      color: _isRecording ? Colors.red : Colors.black,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    _isRecording ? '正在记录...' : '按住倾诉',
                    style: TextStyle(
                      color: _isRecording ? Colors.red : Colors.black,
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
