import 'package:flutter/material.dart';
import 'package:sayit/types.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class Collection extends StatelessWidget {
  final VoidCallback? onSelectChapter;

  const Collection({
    super.key,
    this.onSelectChapter,
  });

  final List<Chapter> _chapters = const [
    Chapter(
      id: 'c1',
      title: '我的童年老屋',
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      isCompleted: true,
    ),
    Chapter(
      id: 'c2',
      title: '青葱校园岁月',
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop',
      isCompleted: true,
    ),
    Chapter(
      id: 'c3',
      title: '第一份工作',
      progress: 75,
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
      isCompleted: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Top Bar
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(Icons.settings, size: 28, color: AppTheme.amberGold),
                const Text(
                  '人生故事集',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Icon(Icons.share, size: 28, color: AppTheme.amberGold),
              ],
            ),
          ),

          // Profile Header
          Column(
            children: [
              Stack(
                children: [
                  Container(
                    width: 128,
                    height: 128,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.amberGold.withOpacity(0.2), width: 4),
                    ),
                    child: ClipOval(
                      child: CachedNetworkImage(
                        imageUrl: 'https://picsum.photos/seed/gentleman/300',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 4,
                    right: 4,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppTheme.amberGold,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: const Icon(Icons.verified, size: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                '张明田 先生',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.auto_stories, size: 16, color: AppTheme.amberGold),
                  const SizedBox(width: 8),
                  Text(
                    '已记录 128 个生命瞬间',
                    style: TextStyle(color: AppTheme.amberGold, fontSize: 16),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'SayIt 记录旅程第 365 天',
                style: TextStyle(color: AppTheme.darkBrown.withOpacity(0.5), fontSize: 14),
              ),
            ],
          ),

          const SizedBox(height: 32),

          // Completed Chapters
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '已完成篇章',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              Text(
                '查看全部',
                style: TextStyle(color: AppTheme.amberGold, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 280,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _chapters.length,
              itemBuilder: (context, index) {
                final chapter = _chapters[index];
                return _buildChapterCard(chapter);
              },
            ),
          ),

          const SizedBox(height: 32),

          // Mood Calendar Section
          const Text(
            '心境月历',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.amberGold.withOpacity(0.1)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          '2023年11月',
                          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '本月关键词：怀旧、安宁',
                          style: TextStyle(color: AppTheme.cream.withOpacity(0.5), fontSize: 12),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chevron_left, color: Colors.white),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: const Icon(Icons.chevron_right, color: Colors.white),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: 15,
                  itemBuilder: (context, index) {
                    final isHighlighted = index == 5 || index == 10;
                    return Container(
                      decoration: BoxDecoration(
                        color: isHighlighted
                            ? AppTheme.amberGold
                            : Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          '${index + 1}',
                          style: TextStyle(
                            fontSize: 10,
                            color: isHighlighted ? Colors.white : Colors.white.withOpacity(0.4),
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppTheme.amberGold.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(Icons.auto_awesome, color: AppTheme.amberGold),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          '"这段时间您记录了许多关于故乡的细节，文字间透着一份豁达与平和。这些记忆正在熠熠生辉。"',
                          style: TextStyle(color: Colors.white, fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChapterCard(Chapter chapter) {
    return GestureDetector(
      onTap: chapter.isCompleted ? onSelectChapter : null,
      child: Container(
        width: 208,
        margin: const EdgeInsets.only(right: 16),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.4),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.amberGold.withOpacity(0.1)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Stack(
                  children: [
                    CachedNetworkImage(
                      imageUrl: chapter.imageUrl,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                    if (chapter.isCompleted)
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.amberGold,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Official',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              chapter.title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: chapter.progress / 100,
                      backgroundColor: AppTheme.darkBrown.withOpacity(0.1),
                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.amberGold),
                      minHeight: 6,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${chapter.progress}%',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.amberGold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
