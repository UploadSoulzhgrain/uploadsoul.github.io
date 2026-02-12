import 'package:flutter/material.dart';
import 'package:sayit/types.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class Home extends StatelessWidget {
  final Function(AppView) onNavigate;
  final Function(String)? onStartInterview;

  const Home({
    super.key,
    required this.onNavigate,
    this.onStartInterview,
  });

  @override
  Widget build(BuildContext context) {
    const dailyTopic = "那时候的夏天是什么样的？";

    return SingleChildScrollView(
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.amberGold.withOpacity(0.2), width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 12,
                          offset: const Offset(2, 4),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: CachedNetworkImage(
                        imageUrl: 'https://picsum.photos/seed/gentleman/200',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'SayIt 说吧',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.amberGold,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        '下午好，张先生',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                onPressed: () => onNavigate(AppView.settings),
                icon: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.softPaper,
                    border: Border.all(color: AppTheme.amberGold.withOpacity(0.3)),
                  ),
                  child: const Icon(Icons.settings, color: AppTheme.amberGold),
                ),
              ),
            ],
          ),

          const SizedBox(height: 32),

          // Today's Prompt Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.softPaper,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.amberGold.withOpacity(0.3)),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.darkBrown.withOpacity(0.05),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.amberGold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '人生访谈 (Guided Interview)',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.amberGold,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  '"$dailyTopic"',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => onStartInterview?.call(dailyTopic),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.darkBrown,
                    foregroundColor: AppTheme.cream,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    elevation: 4,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.mic, size: 24),
                      SizedBox(width: 8),
                      Text('开启深度记录', style: TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Quick Access List
          Text(
            '记录方式 (Memory Methods)',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: AppTheme.darkBrown.withOpacity(0.5),
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),

          QuickAccessCard(
            icon: Icons.settings_voice,
            title: '时光留声机',
            description: '专业引导，勾勒属于您的人生传奇',
            onTap: () => onNavigate(AppView.memoirRoom),
          ),

          const SizedBox(height: 12),

          QuickAccessCard(
            icon: Icons.park,
            title: '心情树洞',
            description: '倾吐心声，让思绪在静谧中沉淀',
            onTap: () => onNavigate(AppView.moodTreeHollow),
          ),

          const SizedBox(height: 24),

          Text(
            '传记管理 (Management)',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: AppTheme.darkBrown.withOpacity(0.5),
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),

          QuickAccessCard(
            icon: Icons.auto_stories,
            title: '往昔掠影',
            description: '浏览并编辑您的生命故事集',
            onTap: () => onNavigate(AppView.collection),
          ),

          const SizedBox(height: 12),

          QuickAccessCard(
            icon: Icons.inventory_2,
            title: '时光胶囊',
            description: '留给未来的一份珍贵礼物',
            onTap: () => onNavigate(AppView.timeCapsule),
          ),

          const SizedBox(height: 32),

          // Progress Bar
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.amberGold.withOpacity(0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.amberGold.withOpacity(0.2)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      '传记排版进度',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '68%',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.amberGold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: 0.68,
                    backgroundColor: AppTheme.darkBrown.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.amberGold),
                    minHeight: 8,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class QuickAccessCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback onTap;

  const QuickAccessCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppTheme.softPaper,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.amberGold.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: icon == Icons.park
                    ? const Color(0xFF1B4332).withOpacity(0.1)
                    : AppTheme.amberGold.withOpacity(0.1),
              ),
              child: Icon(
                icon,
                size: 32,
                color: icon == Icons.park ? const Color(0xFF1B4332) : AppTheme.amberGold,
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.darkBrown.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: AppTheme.darkBrown.withOpacity(0.2),
            ),
          ],
        ),
      ),
    );
  }
}
