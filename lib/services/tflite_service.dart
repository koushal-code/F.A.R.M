import 'dart:convert';
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
    try {
      _interpreter = await Interpreter.fromAsset('assets/mobilenetv2_disease.tflite');
    } catch (_) {
      _interpreter = await Interpreter.fromAsset('assets/plant_disease_model.tflite');
    }
    
    String labelsData;
    try {
      labelsData = await rootBundle.loadString('assets/class_names.json');
    } catch (_) {
      labelsData = await rootBundle.loadString('assets/labels.json');
    }
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

    // 3. Prepare output tensor (assuming 38 classes)
    var outputBuffer = List.filled(1 * 38, 0.0).reshape([1, 38]);

    // 4. Run inference
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
