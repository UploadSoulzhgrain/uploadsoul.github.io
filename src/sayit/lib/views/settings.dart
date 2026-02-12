import 'package:flutter/material.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class Settings extends StatefulWidget {
  final VoidCallback onBack;

  const Settings({
    super.key,
    required this.onBack,
  });

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  String _selectedStyle = 'literary';
  String _selectedLayout = 'classic';
  String _userName = '张明田';
  String _userBio = '退休教师，热爱生活，希望用文字记录下这一生的平凡与不平凡。';
  String _avatarUrl = 'https://picsum.photos/seed/gentleman/300';

  final List<Map<String, dynamic>> _writingStyles = const [
    {
      'id': 'warm',
      'title': '温馨记录',
      'desc': '以感性的笔触，还原生活最本真的色彩。',
      'img': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=400&auto=format&fit=crop',
    },
    {
      'id': 'literary',
      'title': '文学传记',
      'desc': '如诗歌般优雅，赋予人生经历深刻的艺术底蕴。',
      'img': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop',
    },
    {
      'id': 'simple',
      'title': '纪实叙事',
      'desc': '客观严谨，如同一部缓缓铺开的生命纪录片。',
      'img': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop',
    },
  ];

  final List<Map<String, dynamic>> _layoutStyles = const [
    {'id': 'classic', 'title': '典雅宣纸', 'desc': '古朴的纹理与留白，致敬传统文化的厚重感。', 'icon': Icons.auto_stories},
    {'id': 'modern', 'title': '现代简约', 'desc': '清爽的构图，让照片与文字在呼吸间交融。', 'icon': Icons.grid_view},
    {'id': 'artistic', 'title': '艺术画册', 'desc': '大胆的配色与排版，展现生命独特的张力。', 'icon': Icons.palette},
  ];

  void _handleAvatarChange() {
    final randomId = DateTime.now().millisecondsSinceEpoch;
    setState(() {
      _avatarUrl = 'https://picsum.photos/seed/$randomId/300';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Navbar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: AppTheme.cream.withOpacity(0.9),
              border: Border(
                bottom: BorderSide(color: AppTheme.amberGold.withOpacity(0.1)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new),
                  onPressed: widget.onBack,
                  color: AppTheme.darkBrown.withOpacity(0.7),
                ),
                const Text(
                  '账户与传记设定',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 40),
              ],
            ),
          ),

          // Main Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User Profile Section
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.softPaper.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppTheme.amberGold.withOpacity(0.1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              '个人资料',
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            Icon(Icons.badge, color: AppTheme.amberGold.withOpacity(0.5)),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Center(
                          child: GestureDetector(
                            onTap: _handleAvatarChange,
                            child: Stack(
                              children: [
                                Container(
                                  width: 112,
                                  height: 112,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 4),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 12,
                                      ),
                                    ],
                                  ),
                                  child: ClipOval(
                                    child: CachedNetworkImage(
                                      imageUrl: _avatarUrl,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: -4,
                                  right: -4,
                                  child: Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: AppTheme.amberGold,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 2),
                                    ),
                                    child: const Icon(Icons.edit, size: 16, color: Colors.white),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        TextField(
                          decoration: InputDecoration(
                            labelText: '昵称 / 姓名',
                            labelStyle: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.amberGold,
                              letterSpacing: 1.5,
                            ),
                            hintText: '请输入您的姓名',
                            suffixIcon: Icon(Icons.person, color: AppTheme.amberGold.withOpacity(0.3)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: AppTheme.amberGold.withOpacity(0.2)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppTheme.amberGold, width: 2),
                            ),
                          ),
                          controller: TextEditingController(text: _userName)
                            ..selection = TextSelection.collapsed(offset: _userName.length),
                          onChanged: (value) => setState(() => _userName = value),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          maxLines: 4,
                          decoration: InputDecoration(
                            labelText: '个人简介',
                            labelStyle: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.amberGold,
                              letterSpacing: 1.5,
                            ),
                            hintText: '简单介绍一下您自己...',
                            suffixIcon: Icon(Icons.description, color: AppTheme.amberGold.withOpacity(0.3)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: AppTheme.amberGold.withOpacity(0.2)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppTheme.amberGold, width: 2),
                            ),
                          ),
                          controller: TextEditingController(text: _userBio)
                            ..selection = TextSelection.collapsed(offset: _userBio.length),
                          onChanged: (value) => setState(() => _userBio = value),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Work Information Section
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            '作品信息',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          Expanded(child: Divider(color: AppTheme.amberGold.withOpacity(0.1))),
                          Icon(Icons.book_2, color: AppTheme.amberGold.withOpacity(0.5)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        decoration: InputDecoration(
                          labelText: '传记题名',
                          hintText: '例如：我的人生足迹',
                          suffixIcon: Icon(Icons.edit_note, color: AppTheme.amberGold.withOpacity(0.3)),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(color: AppTheme.amberGold.withOpacity(0.2)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: AppTheme.amberGold, width: 2),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Writing Style Section
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            '文字笔触',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          Expanded(child: Divider(color: AppTheme.amberGold.withOpacity(0.1))),
                          Icon(Icons.brush, color: AppTheme.amberGold.withOpacity(0.5)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ..._writingStyles.map((style) => _buildStyleCard(style)),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Layout Style Section
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            '排版意境',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          Expanded(child: Divider(color: AppTheme.amberGold.withOpacity(0.1))),
                          Icon(Icons.auto_awesome_motion, color: AppTheme.amberGold.withOpacity(0.5)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ..._layoutStyles.map((layout) => _buildLayoutCard(layout)),
                    ],
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),

          // Floating Action Button
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
            child: SafeArea(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 64,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.darkBrown,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 8,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            '保存并同步资料',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 1),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.cloud_sync),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '您的更改将同步至个人云端博物馆',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppTheme.darkBrown.withOpacity(0.3),
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStyleCard(Map<String, dynamic> style) {
    final isSelected = _selectedStyle == style['id'];
    return GestureDetector(
      onTap: () => setState(() => _selectedStyle = style['id'] as String),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? AppTheme.amberGold : Colors.transparent,
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: isSelected ? AppTheme.amberGold.withOpacity(0.1) : Colors.black.withOpacity(0.05),
              blurRadius: 20,
            ),
          ],
        ),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
              child: Container(
                height: 112,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(style['img'] as String),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  color: isSelected ? Colors.transparent : Colors.black.withOpacity(0.4),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          style['title'] as String,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          style['desc'] as String,
                          style: TextStyle(fontSize: 12, color: AppTheme.darkBrown.withOpacity(0.6)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSelected ? AppTheme.amberGold : Colors.transparent,
                      border: Border.all(
                        color: isSelected ? AppTheme.amberGold : AppTheme.darkBrown.withOpacity(0.1),
                        width: 2,
                      ),
                    ),
                    child: isSelected
                        ? const Icon(Icons.check, size: 14, color: Colors.white)
                        : null,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLayoutCard(Map<String, dynamic> layout) {
    final isSelected = _selectedLayout == layout['id'];
    return GestureDetector(
      onTap: () => setState(() => _selectedLayout = layout['id'] as String),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.amberGold.withOpacity(0.05) : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? AppTheme.amberGold : Colors.transparent,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.amberGold : AppTheme.softSepia,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                layout['icon'] as IconData,
                color: isSelected ? Colors.white : AppTheme.amberGold.withOpacity(0.5),
                size: 28,
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    layout['title'] as String,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    layout['desc'] as String,
                    style: TextStyle(fontSize: 12, color: AppTheme.darkBrown.withOpacity(0.5)),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.verified, color: AppTheme.amberGold),
          ],
        ),
      ),
    );
  }
}
