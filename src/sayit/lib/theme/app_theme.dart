import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Colors
  static const Color cream = Color(0xFFF9F3E5);
  static const Color amberGold = Color(0xFFC69B3D);
  static const Color darkBrown = Color(0xFF3E2723);
  static const Color softPaper = Color(0xFFFFFDF9);
  static const Color borderSepia = Color(0xFFD7C4A5);
  static const Color softSepia = Color(0xFFF2E8D5);
  static const Color inkBrown = Color(0xFF2D241E);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: amberGold,
        secondary: darkBrown,
        surface: softPaper,
        background: cream,
        error: Colors.red,
      ),
      scaffoldBackgroundColor: cream,
      textTheme: TextTheme(
        displayLarge: GoogleFonts.notoSerifSc(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: darkBrown,
        ),
        displayMedium: GoogleFonts.notoSerifSc(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: darkBrown,
        ),
        displaySmall: GoogleFonts.notoSerifSc(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: darkBrown,
        ),
        headlineMedium: GoogleFonts.notoSerifSc(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: darkBrown,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 16,
          color: darkBrown,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 14,
          color: darkBrown,
        ),
        bodySmall: GoogleFonts.plusJakartaSans(
          fontSize: 12,
          color: darkBrown.withOpacity(0.7),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: cream,
        elevation: 0,
        iconTheme: const IconThemeData(color: darkBrown),
        titleTextStyle: GoogleFonts.notoSerifSc(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: darkBrown,
        ),
      ),
      cardTheme: CardTheme(
        color: softPaper,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: amberGold.withOpacity(0.3), width: 1),
        ),
      ),
    );
  }
}
