import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/tflite_service.dart';
import '../services/database_service.dart';
import '../models/diagnosis_model.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  CropDiagnosis? _diagnosis;
  bool _isAnalyzing = false;
  String _selectedLang = 'en';

  Future<void> _pickImage(ImageSource source) async {
    final XFile? pickedFile = await _picker.pickImage(
      source: source,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (pickedFile == null) return;

    final imageFile = File(pickedFile.path);
    setState(() {
      _selectedImage = imageFile;
      _isAnalyzing = true;
      _diagnosis = null;
    });

    try {
      // Offline local TFLite neural inference:
      final diag = await TFLiteService.diagnoseImage(
        imageFile: imageFile,
        lang: _selectedLang,
      );

      // Save to local offline SQLite database:
      await DatabaseService.saveRecord(diag);

      if (mounted) {
        setState(() {
          _diagnosis = diag;
          _isAnalyzing = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isAnalyzing = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Diagnosis Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FARM - Crop Health AI', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF003629),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Preview Viewport
            Container(
              height: 260,
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: _selectedImage != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.file(_selectedImage!, fit: BoxFit.cover),
                    )
                  : const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt, size: 48, color: Color(0xFF003629)),
                          SizedBox(height: 8),
                          Text('Capture or select infected crop leaf', style: TextStyle(color: Colors.black54)),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isAnalyzing ? null : () => _pickImage(ImageSource.camera),
                    icon: const Icon(Icons.camera),
                    label: const Text('Take Photo'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF003629),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _isAnalyzing ? null : () => _pickImage(ImageSource.gallery),
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Gallery'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Progress indicator
            if (_isAnalyzing) ...[
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      CircularProgressIndicator(color: Color(0xFF003629)),
                      SizedBox(height: 12),
                      Text('Running offline on-device neural inference...'),
                    ],
                  ),
                ),
              ),
            ],

            // Diagnosis Result Card
            if (_diagnosis != null) ...[
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Expanded(
                            child: Text(
                              _diagnosis!.pathology,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF003629)),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE8F0E9),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Health: ${_diagnosis!.healthScore}%',
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1B6D24)),
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      const Text('Organic Solution:', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(_diagnosis!.organicTreatment),
                      const SizedBox(height: 12),
                      const Text('Chemical Solution:', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(_diagnosis!.chemicalTreatment),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
