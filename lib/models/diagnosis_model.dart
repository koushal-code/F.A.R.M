class CropDiagnosis {
  final String pathology;
  final int healthScore;
  final String organicTreatment;
  final String chemicalTreatment;
  final String imagePath;

  CropDiagnosis({
    required this.pathology,
    required this.healthScore,
    required this.organicTreatment,
    required this.chemicalTreatment,
    required this.imagePath,
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
      pathology: map['pathology'] ?? '',
      healthScore: map['healthScore'] ?? 0,
      organicTreatment: map['organicTreatment'] ?? '',
      chemicalTreatment: map['chemicalTreatment'] ?? '',
      imagePath: map['imagePath'] ?? '',
    );
  }
}
