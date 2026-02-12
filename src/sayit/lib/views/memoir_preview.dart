import 'package:flutter/material.dart';
import 'package:sayit/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class MemoirPreview extends StatelessWidget {
  final VoidCallback onBack;

  const MemoirPreview({
    super.key,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFCF8),
      body: Column(
        children: [
          // Top Navigation
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Colors.black.withOpacity(0.05)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton.icon(
                  onPressed: onBack,
                  icon: const Icon(Icons.chevron_left, size: 16),
                  label: const Text(
                    'Chapters',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
                  ),
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.darkBrown.withOpacity(0.6),
                  ),
                ),
                const Text(
                  'Memoir Preview',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.volume_up),
                  color: AppTheme.darkBrown.withOpacity(0.6),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          // Main Content
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Cover Hero Section
                  Container(
                    height: 580,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0xFF7A8B7A), Color(0xFFA8B5A3)],
                      ),
                    ),
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(width: 32, height: 1, color: AppTheme.darkBrown.withOpacity(0.2)),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              child: Text(
                                'Page 1 of 12',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: AppTheme.darkBrown.withOpacity(0.5),
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 3,
                                ),
                              ),
                            ),
                            Container(width: 32, height: 1, color: AppTheme.darkBrown.withOpacity(0.2)),
                          ],
                        ),
                        const SizedBox(height: 40),
                        Column(
                          children: [
                            Text(
                              'Chapter One',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.amberGold,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 4,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'The Riverside Childhood',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.darkBrown,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                        const SizedBox(height: 40),
                        Icon(Icons.auto_stories, size: 48, color: AppTheme.darkBrown.withOpacity(0.2)),
                        const SizedBox(height: 40),
                        Transform.rotate(
                          angle: -0.017,
                          child: Container(
                            width: 260,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 20,
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                AspectRatio(
                                  aspectRatio: 4 / 3,
                                  child: CachedNetworkImage(
                                    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                const SizedBox(height: 8),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Summer of 1954: The gathering at the bend.',
                          style: TextStyle(
                            fontSize: 11,
                            fontStyle: FontStyle.italic,
                            color: AppTheme.darkBrown.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Action Buttons Area
                  Container(
                    padding: const EdgeInsets.all(24),
                    color: const Color(0xFFFDFCF8),
                    child: Column(
                      children: [
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1B4332),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              elevation: 4,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.menu_book),
                                SizedBox(width: 8),
                                Text('Export as PDF / Album', style: TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF3E2723),
                              side: const BorderSide(color: Color(0xFFD7C4A5), width: 2),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.family_history),
                                SizedBox(width: 8),
                                Text('Share with Children', style: TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Body Text Section
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0xFFFDFCF8), Color(0xFFE8F0E8), Color(0xFFD5E2D5)],
                      ),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'The ripples in the late afternoon, turning the river into a ribbon of molten gold. We spent our summers catching minnows and building forts under the weeping willow trees, oblivious to the world beyond the bend.',
                          style: TextStyle(
                            fontSize: 18,
                            height: 1.8,
                            color: AppTheme.darkBrown.withOpacity(0.9),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Mother would call us for dinner from the porch, her voice carrying over the sound of the water. Those were simpler days, filled with the scent of pine needles and the cool touch of the river mud between our toes. Every stone had a story, and every ripple was a promise of a new adventure.',
                          style: TextStyle(
                            fontSize: 18,
                            height: 1.8,
                            color: AppTheme.darkBrown.withOpacity(0.9),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'It was there, among the reeds and the dragonflies, that I first learned to listen—not just with my ears, but with my heart. The river taught me that life is a flow, sometimes quiet and deep, sometimes rushing and wild, but always moving toward something larger than itself.',
                          style: TextStyle(
                            fontSize: 18,
                            height: 1.8,
                            color: AppTheme.darkBrown.withOpacity(0.9),
                          ),
                        ),
                        const SizedBox(height: 48),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(
                            3,
                            (index) => Container(
                              width: 6,
                              height: 6,
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppTheme.darkBrown.withOpacity(0.2),
                              ),
                            ),
                          ),
                        ),
                      ],
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
}
