import 'package:flutter/material.dart';
import 'package:sayit/theme/app_theme.dart';

class LetterToFuture extends StatefulWidget {
  final VoidCallback onBack;

  const LetterToFuture({
    super.key,
    required this.onBack,
  });

  @override
  State<LetterToFuture> createState() => _LetterToFutureState();
}

class _LetterToFutureState extends State<LetterToFuture> {
  String _text = '';
  int _selectedYear = 2024;

  final List<Map<String, dynamic>> _years = const [
    {'year': 2024, 'date': '10月24日'},
    {'year': 2026, 'date': '10月24日'},
    {'year': 2028, 'date': '10月24日'},
    {'year': 2030, 'date': '10月24日'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Navbar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: AppTheme.cream.withOpacity(0.95),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left, size: 32, color: AppTheme.darkBrown),
                  onPressed: widget.onBack,
                ),
                const Text(
                  '给未来的信',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.help, size: 32, color: AppTheme.darkBrown),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          // Main Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Envelope Background Graphic
                  Container(
                    height: 144,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEADCC8),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
                    ),
                    child: Stack(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.white.withOpacity(0.2),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                        Center(
                          child: Transform.translate(
                            offset: const Offset(0, 24),
                            child: Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                color: const Color(0xFFA67C52),
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 4),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 12,
                                  ),
                                ],
                              ),
                              child: const Icon(Icons.mail, color: Colors.white, size: 32),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Title and Intro
                  Column(
                    children: [
                      const Text(
                        '写给未来的思念',
                        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '珍藏此时此刻的心情，让时间来见证',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.darkBrown.withOpacity(0.4),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Writing Paper Area
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFDF9),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppTheme.amberGold.withOpacity(0.1)),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '2023年10月24日',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.darkBrown.withOpacity(0.3),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Row(
                              children: [
                                Icon(Icons.check_circle, size: 14, color: const Color(0xFFA67C52)),
                                const SizedBox(width: 4),
                                Text(
                                  '已自动保存',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: const Color(0xFFA67C52),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          height: 380,
                          child: TextField(
                            maxLines: null,
                            expands: true,
                            style: TextStyle(
                              fontSize: 18,
                              height: 2.5,
                              color: AppTheme.darkBrown.withOpacity(0.8),
                              fontStyle: FontStyle.italic,
                            ),
                            decoration: InputDecoration(
                              hintText: '亲爱的自己，见字如面...',
                              hintStyle: TextStyle(
                                color: AppTheme.darkBrown.withOpacity(0.2),
                              ),
                              border: InputBorder.none,
                            ),
                            controller: TextEditingController(text: _text)
                              ..selection = TextSelection.collapsed(offset: _text.length),
                            onChanged: (value) => setState(() => _text = value),
                          ),
                        ),
                        // Voice Input Floating Button
                        Align(
                          alignment: Alignment.bottomRight,
                          child: FloatingActionButton(
                            onPressed: () {},
                            backgroundColor: const Color(0xFFC69B3D).withOpacity(0.9),
                            child: const Icon(Icons.mic, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Save/Seal Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFA67C52),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 8,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.lock_open, size: 24),
                          SizedBox(width: 8),
                          Text('密封保存', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Year Selector
                  SizedBox(
                    height: 120,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _years.length + 1,
                      itemBuilder: (context, index) {
                        if (index == _years.length) {
                          return Container(
                            width: 112,
                            margin: const EdgeInsets.only(right: 16),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.4),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: AppTheme.darkBrown.withOpacity(0.1),
                                style: BorderStyle.solid,
                              ),
                            ),
                            child: const Center(
                              child: Icon(Icons.add, color: AppTheme.darkBrown, size: 32),
                            ),
                          );
                        }
                        final item = _years[index];
                        final isSelected = _selectedYear == item['year'];
                        return GestureDetector(
                          onTap: () => setState(() => _selectedYear = item['year'] as int),
                          child: Container(
                            width: 112,
                            margin: const EdgeInsets.only(right: 16),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFFDF8F3) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? const Color(0xFFA67C52) : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '${item['year']}',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item['date'] as String,
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: AppTheme.darkBrown.withOpacity(0.4),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isSelected ? const Color(0xFFA67C52) : Colors.transparent,
                                    border: Border.all(
                                      color: isSelected
                                          ? const Color(0xFFA67C52)
                                          : AppTheme.darkBrown.withOpacity(0.1),
                                      width: 2,
                                    ),
                                  ),
                                  child: isSelected
                                      ? const Icon(Icons.check, size: 12, color: Colors.white)
                                      : null,
                                ),
                              ],
                            ),
                          ),
                        );
                      },
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
