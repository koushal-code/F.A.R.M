export interface CropSample {
  id: string;
  cropName: string;
  leafIssue: string;
  category: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  thumbnail: string;
  description: string;
  promptContext: string;
  healthScore: number;
  affectedArea: number;
  yieldRisk: number;
  dosageSummary: string;
}

export interface OrganicSolution {
  name: string;
  preparation: string;
  applicationRate: string;
  frequency: string;
}

export interface ChemicalSolution {
  activeIngredient: string;
  commercialNames: string;
  dosagePerLiter: string;
  recommendedDilution: string;
  safetyWaitingPeriodDays: number;
}

export interface RecoveryMilestone {
  day: number;
  expectedMilestone: string;
  actionRequired: string;
}

export interface CropDiagnosis {
  cropName: string;
  scientificName: string;
  diagnosisName: string;
  scientificPathogen: string;
  issueType: 'Fungal Disease' | 'Bacterial Disease' | 'Viral Disease' | 'Pest Infestation' | 'Nutrient Deficiency' | 'Healthy Crop';
  severityLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  healthScore: number;
  affectedAreaPercentage: number;
  confidenceScore: number;
  summary: string;
  farmerVernacularSummary: string;
  damageAnalysis: {
    leafDamageDescription: string;
    spreadRate: 'Slow' | 'Moderate' | 'Aggressive (48-72 hrs)';
    potentialYieldLossPercent: number;
    vulnerableParts: string[];
  };
  visualSymptoms: string[];
  treatmentPlan: {
    immediateSteps: string[];
    organicSolutions: OrganicSolution[];
    chemicalSolutions: ChemicalSolution[];
    preventativeMeasures: string[];
    sprayingGuidelines: {
      bestTiming: string;
      weatherPrecautions: string;
      ppeRequired: string[];
    };
  };
  recoveryTimeline: RecoveryMilestone[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  cropName: string;
  diagnosisName: string;
  severityLevel: string;
  healthScore: number;
  imageUrl?: string;
  diagnosis: CropDiagnosis;
}

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'kn' | 'ta';

export type AndroidAppTab = 'scan' | 'diagnosis' | 'calculator' | 'guide' | 'history';

export interface GuideDisease {
  name: Record<SupportedLanguage, string>;
  symptoms: Record<SupportedLanguage, string>;
  management: Record<SupportedLanguage, string>;
  chemical: Record<SupportedLanguage, string>;
}

export interface GuideCrop {
  id: string;
  name: string;
  vernacular: Record<SupportedLanguage, string>;
  botanical: string;
  image: string;
  commonDiseases: GuideDisease[];
  criticalPeriod: Record<SupportedLanguage, string>;
}
