import 'package:sqflite/sqflite.dart';
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
}
