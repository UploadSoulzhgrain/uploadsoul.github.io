enum AppView {
  home,
  memoirRoom,
  collection,
  timeCapsule,
  settings,
  memoirPreview,
  moodTreeHollow,
  letterToFuture,
}

class MemorySnippet {
  final String id;
  final String timestamp;
  final String category;
  final String text;
  final String? imageUrl;
  final String? mood;

  MemorySnippet({
    required this.id,
    required this.timestamp,
    required this.category,
    required this.text,
    this.imageUrl,
    this.mood,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'timestamp': timestamp,
        'category': category,
        'text': text,
        'imageUrl': imageUrl,
        'mood': mood,
      };

  factory MemorySnippet.fromJson(Map<String, dynamic> json) => MemorySnippet(
        id: json['id'] as String,
        timestamp: json['timestamp'] as String,
        category: json['category'] as String,
        text: json['text'] as String,
        imageUrl: json['imageUrl'] as String?,
        mood: json['mood'] as String?,
      );
}

class UserProfile {
  final String name;
  final int daysJoined;
  final int memoryCount;
  final String avatarUrl;

  UserProfile({
    required this.name,
    required this.daysJoined,
    required this.memoryCount,
    required this.avatarUrl,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'daysJoined': daysJoined,
        'memoryCount': memoryCount,
        'avatarUrl': avatarUrl,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        name: json['name'] as String,
        daysJoined: json['daysJoined'] as int,
        memoryCount: json['memoryCount'] as int,
        avatarUrl: json['avatarUrl'] as String,
      );
}

class Chapter {
  final String id;
  final String title;
  final int progress;
  final String imageUrl;
  final bool isCompleted;

  Chapter({
    required this.id,
    required this.title,
    required this.progress,
    required this.imageUrl,
    required this.isCompleted,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'progress': progress,
        'imageUrl': imageUrl,
        'isCompleted': isCompleted,
      };

  factory Chapter.fromJson(Map<String, dynamic> json) => Chapter(
        id: json['id'] as String,
        title: json['title'] as String,
        progress: json['progress'] as int,
        imageUrl: json['imageUrl'] as String,
        isCompleted: json['isCompleted'] as bool,
      );
}
