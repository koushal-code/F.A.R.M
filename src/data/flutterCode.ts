export interface FlutterFile {
  filename: string;
  path: string;
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    filename: 'pubspec.yaml',
    path: 'pubspec.yaml',
    description: 'Updated Flutter dependencies with TFLite, SQLite, Image, and Asset paths',
    code: `name: farm_crop_ai
description: "FARM - Offline Edge AI Crop Disease & Pest Diagnostic App for Indian Farmers"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  # Removed http entirely for 100% offline edge-inference
  image_picker: ^1.0.7
  flutter_tts: ^4.0.2
  shared_preferences: ^2.2.2
  provider: ^6.1.1
  # Local ML and DB packages:
  tflite_flutter: ^0.10.4
  image: ^4.1.7
  sqflite: ^2.3.0
  path_provider: ^2.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/mobilenetv2_disease.tflite
    - assets/class_names.json
    - assets/plant_disease_model.tflite
    - assets/labels.json
`
  },
  {
    filename: 'build.gradle',
    path: 'android/app/build.gradle',
    description: 'Android build config with aaptOptions { noCompress "tflite" }',
    code: `android {
    namespace = "com.example.farm_crop_ai"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    defaultConfig {
        applicationId = "com.example.farm_crop_ai"
        minSdk = 21
        targetSdk = flutter.targetSdkVersion
        versionCode = flutterVersionCode.toInteger()
        versionName = flutterVersionName
    }

    // CRITICAL: Prevent compression of .tflite model file so Flutter can memory-map it directly
    aaptOptions {
        noCompress 'tflite'
    }
}
`
  },
  {
    filename: 'tflite_service.dart',
    path: 'lib/services/tflite_service.dart',
    description: 'Local Edge AI Inference translating camera raw pixels to tensor',
    code: `import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as img;
import '../models/diagnosis_model.dart';

class TFLiteService {
  static Interpreter? _interpreter;
  static List<String>? _labels;

  // Call this in main.dart before runApp()
  static Future<void> initialize() async {
    _interpreter = await Interpreter.fromAsset('assets/mobilenetv2_disease.tflite');
    
    final labelsData = await rootBundle.loadString('assets/class_names.json');
    final Map<String, dynamic> labelMap = jsonDecode(labelsData);
    _labels = labelMap.values.map((e) => e.toString()).toList();
  }

  static Future<CropDiagnosis> diagnoseImage({
    required File imageFile,
    required String lang,
  }) async {
    if (_interpreter == null || _labels == null) throw Exception("Model not initialized");

    // 1. Read and format image
    img.Image? rawImage = img.decodeImage(imageFile.readAsBytesSync());
    img.Image resizedImage = img.copyResize(rawImage!, width: 224, height: 224);

    // 2. Normalize to [1, 3, 224, 224] for PyTorch-exported models
    var inputBuffer = List.generate(1, (b) => 
      List.generate(3, (channel) => 
        List.generate(224, (y) => 
          List.generate(224, (x) {
            final pixel = resizedImage.getPixel(x, y);
            
            // ViT Normalization: (Pixel Value / 255.0 - Mean) / StdDev
            // Mean = 0.5, StdDev = 0.5
            if (channel == 0) return (pixel.r / 255.0 - 0.5) / 0.5; // Red
            if (channel == 1) return (pixel.g / 255.0 - 0.5) / 0.5; // Green
            return (pixel.b / 255.0 - 0.5) / 0.5;                   // Blue
          })
        )
      )
    );

    // 3. Prepare output tensor (38 classes)
    var outputBuffer = List.filled(1 * 38, 0.0).reshape([1, 38]);

    // 4. Run edge inference
    _interpreter!.run(inputBuffer, outputBuffer);

    // 5. Get top result
    List<double> probabilities = outputBuffer[0];
    int maxIndex = 0;
    double maxVal = probabilities[0];
    
    for (int i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > maxVal) {
        maxVal = probabilities[i];
        maxIndex = i;
      }
    }

    String predictedLabel = _labels![maxIndex];

    // Format human readable label & vernacular treatments
    final cleanLabel = predictedLabel.replaceAll('___', ' - ').replaceAll('_', ' ');

    return CropDiagnosis(
      pathology: cleanLabel,
      healthScore: (maxVal * 100).toInt(),
      organicTreatment: "Neem oil 10,000 ppm @ 3ml/L or Trichoderma viride @ 5g/L water",
      chemicalTreatment: "Copper Oxychloride 50% WP @ 2.5g/L or Mancozeb 75% WP @ 2g/L water",
      imagePath: imageFile.path,
    );
  }
}
`
  },
  {
    filename: 'database_service.dart',
    path: 'lib/services/database_service.dart',
    description: 'Local SQLite Database Service for offline scouting history',
    code: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/diagnosis_model.dart';

class DatabaseService {
  static Database? _db;

  static Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await openDatabase(
      join(await getDatabasesPath(), 'scout_records.db'),
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE history(id INTEGER PRIMARY KEY, pathology TEXT, healthScore INTEGER, imagePath TEXT, date TEXT)',
        );
      },
      version: 1,
    );
    return _db!;
  }

  static Future<void> saveRecord(CropDiagnosis diagnosis) async {
    final db = await database;
    await db.insert('history', {
      'pathology': diagnosis.pathology,
      'healthScore': diagnosis.healthScore,
      'imagePath': diagnosis.imagePath,
      'date': DateTime.now().toIso8601String(),
    });
  }

  static Future<List<Map<String, dynamic>>> getRecords() async {
    final db = await database;
    return await db.query('history', orderBy: 'id DESC');
  }

  static Future<void> clearRecords() async {
    final db = await database;
    await db.delete('history');
  }
}
`
  },
  {
    filename: 'diagnosis_model.dart',
    path: 'lib/models/diagnosis_model.dart',
    description: 'Data model supporting both local TFLite output and rich UI prescription',
    code: `class CropDiagnosis {
  final String pathology;
  final int healthScore;
  final String organicTreatment;
  final String chemicalTreatment;
  final String? imagePath;

  // Extended properties for multi-language display
  String get cropName => pathology.split(' - ').first;
  String get diagnosisName => pathology.contains(' - ') ? pathology.split(' - ').last : pathology;
  String get severityLevel => healthScore < 40 ? 'Critical' : healthScore < 75 ? 'Moderate' : 'Low';

  CropDiagnosis({
    required this.pathology,
    required this.healthScore,
    required this.organicTreatment,
    required this.chemicalTreatment,
    this.imagePath,
  });

  Map<String, dynamic> toMap() {
    return {
      'pathology': pathology,
      'healthScore': healthScore,
      'organicTreatment': organicTreatment,
      'chemicalTreatment': chemicalTreatment,
      'imagePath': imagePath,
    };
  }

  factory CropDiagnosis.fromMap(Map<String, dynamic> map) {
    return CropDiagnosis(
      pathology: map['pathology'] ?? 'Healthy Plant',
      healthScore: map['healthScore'] ?? 80,
      organicTreatment: map['organicTreatment'] ?? 'Standard maintenance',
      chemicalTreatment: map['chemicalTreatment'] ?? 'None required',
      imagePath: map['imagePath'],
    );
  }
}
`
  },
  {
    filename: 'main.dart',
    path: 'lib/main.dart',
    description: 'App entry point initializing TFLiteService before runApp()',
    code: `import 'package:flutter/material.dart';
import 'services/tflite_service.dart';
import 'screens/scan_screen.dart';
import 'screens/diagnosis_screen.dart';
import 'screens/calculator_screen.dart';
import 'screens/crop_guide_screen.dart';
import 'screens/history_screen.dart';
import 'models/diagnosis_model.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TFLiteService.initialize(); // Load the TFLite edge model into memory at startup
  runApp(const FarmApp());
}

class FarmApp extends StatefulWidget {
  const FarmApp({super.key});

  @override
  State<FarmApp> createState() => _FarmAppState();
}

class _FarmAppState extends State<FarmApp> {
  String _selectedLang = 'en'; // 'en', 'hi', 'te', 'kn', 'ta'

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FARM - Offline Edge AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF003629),
          primary: const Color(0xFF003629),
          secondary: const Color(0xFF1B6D24),
          surface: const Color(0xFFF4FBF4),
        ),
        scaffoldBackgroundColor: const Color(0xFFF4FBF4),
      ),
      home: MainNavigationShell(
        currentLang: _selectedLang,
        onLangChanged: (lang) => setState(() => _selectedLang = lang),
      ),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  final String currentLang;
  final ValueChanged<String> onLangChanged;

  const MainNavigationShell({
    super.key,
    required this.currentLang,
    required this.onLangChanged,
  });

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  CropDiagnosis? _latestDiagnosis;

  @override
  Widget build(BuildContext context) {
    final screens = [
      ScanScreen(
        lang: widget.currentLang,
        onDiagnosisComplete: (diag) => setState(() {
          _latestDiagnosis = diag;
          _currentIndex = 1;
        }),
      ),
      DiagnosisScreen(
        diagnosis: _latestDiagnosis,
        lang: widget.currentLang,
        onRetake: () => setState(() => _currentIndex = 0),
      ),
      CalculatorScreen(lang: widget.currentLang),
      CropGuideScreen(lang: widget.currentLang),
      HistoryScreen(lang: widget.currentLang),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF003629),
        foregroundColor: Colors.white,
        title: const Row(
          children: [
            Icon(Icons.offline_bolt, color: Color(0xFFA0F399)),
            SizedBox(width: 8),
            Text('FARM (Offline Edge AI)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.language, color: Color(0xFFA0F399)),
            onSelected: widget.onLangChanged,
            itemBuilder: (ctx) => const [
              PopupMenuItem(value: 'en', child: Text('English (EN)')),
              PopupMenuItem(value: 'hi', child: Text('हिन्दी (Hindi)')),
              PopupMenuItem(value: 'te', child: Text('తెలుగు (Telugu)')),
              PopupMenuItem(value: 'kn', child: Text('ಕನ್ನಡ (Kannada)')),
              PopupMenuItem(value: 'ta', child: Text('தமிழ் (Tamil)')),
            ],
          ),
        ],
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        indicatorColor: const Color(0xFFA0F399),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.camera_alt), label: 'Scan'),
          NavigationDestination(icon: Icon(Icons.assignment), label: 'Prescription'),
          NavigationDestination(icon: Icon(Icons.calculate), label: 'Dose'),
          NavigationDestination(icon: Icon(Icons.menu_book), label: 'Guide'),
          NavigationDestination(icon: Icon(Icons.history), label: 'Log'),
        ],
      ),
    );
  }
}
`
  },
  {
    filename: 'scan_screen.dart',
    path: 'lib/screens/scan_screen.dart',
    description: 'ScanScreen processing photos via TFLiteService and saving to DatabaseService',
    code: `import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/diagnosis_model.dart';
import '../services/tflite_service.dart';
import '../services/database_service.dart';

class ScanScreen extends StatefulWidget {
  final String lang;
  final ValueChanged<CropDiagnosis> onDiagnosisComplete;

  const ScanScreen({
    super.key,
    required this.lang,
    required this.onDiagnosisComplete,
  });

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _isLoading = false;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    final picked = await _picker.pickImage(source: source, imageQuality: 85);
    if (picked != null) {
      final selectedFile = File(picked.path);
      setState(() => _isLoading = true);

      try {
        // Run Edge AI Inference on local device (Zero Internet Required)
        final diag = await TFLiteService.diagnoseImage(
          imageFile: selectedFile, 
          lang: widget.lang
        );
        
        // Save to offline SQLite database
        await DatabaseService.saveRecord(diag);
        
        widget.onDiagnosisComplete(diag);
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Inference error: \$e')),
          );
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Color(0xFF003629)),
            SizedBox(height: 16),
            Text(
              'Running local TFLite neural inference...',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 4),
            Text('Evaluating 38 crop pathology classes offline', style: TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: const Color(0xFF1B4D3E),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: const Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.offline_pin, color: Color(0xFFA0F399)),
                    SizedBox(width: 8),
                    Text(
                      '100% Offline Edge AI',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  'No internet or mobile signal needed. The TensorFlow Lite model runs directly on your phone CPU/GPU.',
                  style: TextStyle(color: Color(0xFFBAEED9), fontSize: 13),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF003629),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => _pickImage(ImageSource.camera),
                icon: const Icon(Icons.camera_alt, color: Color(0xFFA0F399)),
                label: const Text('Camera', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF003629),
                  side: const BorderSide(color: Color(0xFF003629)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => _pickImage(ImageSource.gallery),
                icon: const Icon(Icons.photo_library),
                label: const Text('Gallery', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
`
  },
  {
    filename: 'history_screen.dart',
    path: 'lib/screens/history_screen.dart',
    description: 'HistoryScreen querying offline SQLite scout_records.db',
    code: `import 'dart:io';
import 'package:flutter/material.dart';
import '../services/database_service.dart';

class HistoryScreen extends StatefulWidget {
  final String lang;
  const HistoryScreen({super.key, required this.lang});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<Map<String, dynamic>> _records = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final list = await DatabaseService.getRecords();
    setState(() {
      _records = list;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_records.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history, size: 64, color: Colors.grey),
            SizedBox(height: 12),
            Text('No offline scout records yet'),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _records.length,
      itemBuilder: (context, idx) {
        final item = _records[idx];
        final imagePath = item['imagePath'] as String?;

        return Card(
          margin: const EdgeInsets.symmetric(vertical: 6),
          child: ListTile(
            leading: imagePath != null && File(imagePath).existsSync()
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.file(File(imagePath), width: 48, height: 48, fit: BoxFit.cover),
                  )
                : const CircleAvatar(child: Icon(Icons.eco)),
            title: Text(item['pathology'] ?? 'Diagnosis', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Score: \${item['healthScore']}% • \${item['date']?.substring(0, 10)}'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
          ),
        );
      },
    );
  }
}
`
  },
  {
    filename: 'labels.json',
    path: 'assets/labels.json',
    description: '38 plant pathology class labels mapped to model output neurons',
    code: `{
  "0": "Apple___Apple_scab",
  "1": "Apple___Black_rot",
  "2": "Apple___Cedar_apple_rust",
  "3": "Apple___healthy",
  "4": "Blueberry___healthy",
  "5": "Cherry___Powdery_mildew",
  "6": "Cherry___healthy",
  "7": "Corn___Cercospora_leaf_spot",
  "8": "Corn___Common_rust",
  "9": "Corn___Northern_Leaf_Blight",
  "10": "Corn___Fall_Armyworm_Infestation",
  "11": "Corn___healthy",
  "12": "Grape___Black_rot",
  "13": "Grape___Esca_(Black_Measles)",
  "14": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
  "15": "Grape___healthy",
  "16": "Orange___Haunglongbing_(Citrus_greening)",
  "17": "Peach___Bacterial_spot",
  "18": "Peach___healthy",
  "19": "Pepper_bell___Bacterial_spot",
  "20": "Pepper_bell___healthy",
  "21": "Potato___Early_blight",
  "22": "Potato___Late_blight",
  "23": "Potato___healthy",
  "24": "Raspberry___healthy",
  "25": "Rice___Brown_Spot",
  "26": "Rice___Leaf_Blast",
  "27": "Rice___healthy",
  "28": "Soybean___healthy",
  "29": "Squash___Powdery_mildew",
  "30": "Strawberry___Leaf_scorch",
  "31": "Strawberry___healthy",
  "32": "Tomato___Bacterial_spot",
  "33": "Tomato___Early_blight",
  "34": "Tomato___Late_blight",
  "35": "Tomato___Leaf_Mold",
  "36": "Tomato___Septoria_leaf_spot",
  "37": "Tomato___Spider_mites_Two_spotted_spider_mite"
}
`
  }
];
