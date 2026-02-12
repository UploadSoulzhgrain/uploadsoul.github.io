import 'package:flutter/material.dart';
import 'package:sayit/types.dart';
import 'package:sayit/theme/app_theme.dart';

class BottomNav extends StatelessWidget {
  final AppView activeView;
  final Function(AppView) onNavigate;

  const BottomNav({
    super.key,
    required this.activeView,
    required this.onNavigate,
  });

  final List<Map<String, dynamic>> _navItems = const [
    {'view': AppView.home, 'icon': Icons.home, 'label': '主页'},
    {'view': AppView.collection, 'icon': Icons.auto_stories, 'label': '记录'},
    {'view': AppView.timeCapsule, 'icon': Icons.inventory_2, 'label': '胶囊'},
    {'view': AppView.settings, 'icon': Icons.person, 'label': '我的'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.softPaper.withOpacity(0.95),
        border: Border(
          top: BorderSide(color: AppTheme.borderSepia, width: 1),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: _navItems.map((item) {
              final isActive = activeView == item['view'];
              return GestureDetector(
                onTap: () => onNavigate(item['view'] as AppView),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      item['icon'] as IconData,
                      size: 28,
                      color: isActive ? AppTheme.amberGold : AppTheme.darkBrown.withOpacity(0.4),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item['label'] as String,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isActive ? AppTheme.amberGold : AppTheme.darkBrown.withOpacity(0.4),
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}
