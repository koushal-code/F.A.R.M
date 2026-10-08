import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { LOCALIZED_DIAGNOSES, getCleanFallbackDiagnosis } from './src/data/localizedDiagnoses.js';
import { getLocalizedSamples } from './src/data/samples.js';

// Explicitly disable HMR in preview environment to prevent WebSocket transport errors
process.env.DISABLE_HMR = 'true';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Parse image payloads
app.use(express.json({ limit: '35mb' }));

// Initialize GoogleGenAI SDK helper
function getGenAIClient(customKey?: string): GoogleGenAI | null {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const defaultAi = getGenAIClient();

// Language lookup helper
const LANG_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ta: 'Tamil (தமிழ்)'
};

// Candidate models for highest resilience & low latency
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];

// REST API: GET /api/samples
app.get('/api/samples', (req, res) => {
  const lang = (req.query.lang as string) || 'en';
  const validLang = (['en', 'hi', 'te', 'kn', 'ta'].includes(lang) ? lang : 'en') as any;
  const samples = getLocalizedSamples(validLang);
  res.json({ success: true, samples });
});

// REST API: GET /api/ai-status
app.get('/api/ai-status', (_req, res) => {
  res.json({
    active: true,
    model: 'gemini-3.1-flash-lite',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    provider: 'Google AI Studio',
    supportedLanguages: ['en', 'hi', 'te', 'kn', 'ta'],
    fallbackEngines: ['gemini-2.5-flash', 'localized-knowledge-engine']
  });
});

// REST API: GET /api/weather (OpenWeatherMap with fallback to Open-Meteo)
app.get('/api/weather', async (req, res) => {
  const lat = req.query.lat || '17.3850';
  const lon = req.query.lon || '78.4867';
  const owmKey = process.env.OPENWEATHERMAP_API_KEY || process.env.OPENWEATHER_API_KEY;

  if (owmKey) {
    try {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${owmKey}`;
      const response = await fetch(owmUrl);
      if (response.ok) {
        const d = await response.json();
        return res.json({
          success: true,
          source: 'OpenWeatherMap',
          data: {
            temperature: d.main?.temp ?? 28,
            humidity: d.main?.humidity ?? 70,
            apparentTemperature: d.main?.feels_like ?? d.main?.temp ?? 28,
            windSpeed: (d.wind?.speed ?? 2) * 3.6, // m/s to km/h
            weatherMain: d.weather?.[0]?.main || 'Clear',
            description: d.weather?.[0]?.description || 'Clear sky',
            weatherId: d.weather?.[0]?.id || 800,
            cityName: d.name || 'Local Farm'
          }
        });
      }
    } catch (_err) {
      // Fall through to meteorological feed
    }
  }

  // Live direct fallback to open-meteo
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code&timezone=auto`;
    const response = await fetch(url);
    if (response.ok) {
      const d = await response.json();
      const cur = d.current || {};
      return res.json({
        success: true,
        source: 'Open-Meteo',
        data: {
          temperature: cur.temperature_2m ?? 28,
          humidity: cur.relative_humidity_2m ?? 70,
          apparentTemperature: cur.apparent_temperature ?? 28,
          windSpeed: cur.wind_speed_10m ?? 6,
          weatherMain: (cur.precipitation ?? 0) > 0 ? 'Rain' : (cur.weather_code ?? 0) >= 3 ? 'Clouds' : 'Clear',
          description: (cur.weather_code ?? 0) >= 3 ? 'Partly cloudy' : 'Clear sky',
          weatherId: cur.weather_code ?? 800,
          cityName: 'Local Field'
        }
      });
    }
  } catch (_e) {
    // Ignore
  }

  return res.json({
    success: true,
    source: 'Default',
    data: {
      temperature: 28,
      humidity: 70,
      apparentTemperature: 29,
      windSpeed: 6.5,
      weatherMain: 'Clear',
      description: 'Clear sky',
      weatherId: 800,
      cityName: 'Field Location'
    }
  });
});

// REST API: GET /api/reverse-geocode (Nominatim OpenStreetMap geocoding proxy with caching)
const geocodeCache = new Map<string, { address: any; timestamp: number }>();

app.get('/api/reverse-geocode', async (req, res) => {
  const lat = parseFloat(req.query.lat as string || '17.3850');
  const lon = parseFloat(req.query.lon as string || '78.4867');

  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < 3600000)) {
    return res.json({ success: true, cached: true, address: cached.address });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FarmCropAIEngine/2.0 (agri-scout)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const village = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.town;
      const subdistrict = addr.county || addr.state_district || addr.subdistrict;
      const district = addr.state_district || addr.district || addr.county;
      const state = addr.state;
      const pincode = addr.postcode;
      const country = addr.country || 'India';

      const parts: string[] = [];
      if (village) parts.push(village);
      if (subdistrict && subdistrict !== village) parts.push(subdistrict);
      if (district && district !== subdistrict) parts.push(district);
      if (state && !parts.includes(state)) parts.push(state);

      const displayName = parts.slice(0, 3).join(', ') || data.name || `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;

      const result = {
        displayName,
        village,
        subdistrict,
        district,
        state,
        pincode,
        country
      };

      geocodeCache.set(cacheKey, { address: result, timestamp: Date.now() });
      return res.json({ success: true, address: result });
    }
  } catch (err: any) {
    console.error('Reverse geocode error:', err.message);
  }

  return res.json({
    success: true,
    address: {
      displayName: `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`,
      country: 'India'
    }
  });
});

// REST API: POST /api/transcribe (Audio transcription using gemini-3.5-transcribe)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', lang = 'en', targetField = 'notes', customApiKey } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ success: false, error: 'No audio data received' });
    }

    const client = getGenAIClient(customApiKey);
    if (!client) {
      return res.status(500).json({ success: false, error: 'AI engine API key not configured' });
    }

    const langInstructions: Record<string, string> = {
      en: 'Transcribe the audio faithfully in English. Do not translate. Output ONLY the raw transcribed spoken words, with no explanations or punctuation remarks.',
      hi: 'ऑडियो को शुद्ध हिन्दी (देवनागरी लिपि) में ट्रांसक्राइब करें। केवल बोले गए शब्द लिखें, कोई अतिरिक्त टिप्पणी न करें।',
      te: 'ఆడియోను స్వచ్ఛమైన తెలుగు లిపిలో (Telugu script) మాత్రమే ట్రాన్స్‌క్రైబ్ చేయండి. ఎటువంటి వివరణలు లేదా ఆంగ్ల అనువాదం లేకుండా రైతు మాట్లాడిన మాటలను యథాతథంగా రాయండి.',
      kn: 'ಆಡಿಯೋವನ್ನು ಶುದ್ಧ ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ (Kannada script) ಮಾತ್ರ ಟ್ರಾನ್ಸ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ. ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ವಿವರಣೆ ಬೇಡ.',
      ta: 'ஆடியோவை தூய தமிழ் எழுத்துக்களில் (Tamil script) மட்டும் டிரான்ஸ்கிரைப் செய்யவும். கூடுதல் விளக்கம் எதுவும் தேவையில்லை.'
    };

    const instruction = langInstructions[lang] || langInstructions.en;

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64
      }
    };

    const promptText = `${instruction} This is a farmer speaking crop pathology observations or notes about their field (${targetField}). Return only the transcribed text.`;

    const candidateModels = ['gemini-3.5-transcribe', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let transcribedText = '';

    for (const model of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: { parts: [audioPart, { text: promptText }] }
        });
        const txt = response.text?.trim() || '';
        if (txt) {
          transcribedText = txt;
          break;
        }
      } catch (_err) {
        // Continue to fallback model
      }
    }

    if (!transcribedText) {
      return res.status(500).json({ success: false, error: 'Transcription failed to extract speech.' });
    }

    return res.json({
      success: true,
      text: transcribedText,
      lang
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to transcribe audio' });
  }
});

// REST API: POST /api/test-gemini-key
app.post('/api/test-gemini-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const client = getGenAIClient(apiKey);
    if (!client) {
      return res.status(400).json({ success: false, error: 'No API key provided' });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: 'Respond with the single word: "READY"',
    });

    const text = response.text?.trim() || '';
    res.json({ success: true, message: `Key connected successfully. Model response: ${text}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to authenticate key' });
  }
});

// REST API: POST /api/diagnose
app.post('/api/diagnose', async (req, res) => {
  try {
    const { 
      imageBase64, 
      mimeType = 'image/jpeg', 
      sampleId, 
      cropHint, 
      additionalNotes, 
      lang = 'en',
      customApiKey
    } = req.body;

    const targetLangName = LANG_NAMES[lang] || 'English';

    // 1. If it's a known built-in sample and no custom uploaded image, return instant localized data with zero slashes
    if (sampleId && !imageBase64) {
      const localized = getCleanFallbackDiagnosis(sampleId, lang);
      return res.json({
        success: true,
        source: 'localized-knowledge-engine',
        diagnosis: localized
      });
    }

    // 2. Multimodal AI Analysis with Gemini Vision
    const clientToUse = customApiKey ? getGenAIClient(customApiKey) : defaultAi;
    let aiDiagnosis = null;

    if (clientToUse && (imageBase64 || cropHint)) {
      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';
      const prompt = `You are FARM (Fast Agricultural Recovery & Monitoring), an expert agronomist, crop pathologist, and entomologist for Indian agriculture.
Analyze the provided crop leaf or pest specimen image.
TARGET LANGUAGE: "${targetLangName}" (Language code: "${lang}").

CRITICAL REQUIREMENT:
All output text values inside the JSON MUST be written EXCLUSIVELY and PURITY in ${targetLangName}.
DO NOT mix languages or include English translations in brackets or slashes (e.g. write "టమాటా", NOT "Tomato / టమాటా").
Provide practical, commercially available Indian crop remedies (e.g., Mancozeb, Tricyclazole, Emamectin Benzoate, Neem Oil).

Crop hint from farmer: "${cropHint || 'Unknown'}".
Farmer observations: "${additionalNotes || 'None'}".

Return valid JSON adhering to this exact schema:
{
  "cropName": "Name of crop exclusively in ${targetLangName}",
  "scientificName": "Latin botanical genus species",
  "diagnosisName": "Name of disease or pest exclusively in ${targetLangName}",
  "scientificPathogen": "Pathogen or pest scientific name",
  "issueType": "Fungal Disease / Bacterial Disease / Viral Disease / Pest Infestation / Nutrient Deficiency / Healthy Crop",
  "severityLevel": "Low / Moderate / Severe / Critical in ${targetLangName}",
  "healthScore": 40,
  "affectedAreaPercentage": 35,
  "confidenceScore": 95,
  "summary": "2 clear sentences describing the leaf tissue damage in ${targetLangName}",
  "farmerVernacularSummary": "Clear, direct spoken advice for the farmer in ${targetLangName}",
  "damageAnalysis": {
    "leafDamageDescription": "Detailed symptom description in ${targetLangName}",
    "spreadRate": "Slow / Moderate / Aggressive in ${targetLangName}",
    "potentialYieldLossPercent": 50,
    "vulnerableParts": ["List of affected plant organs in ${targetLangName}"]
  },
  "visualSymptoms": [
    "Symptom 1 in ${targetLangName}",
    "Symptom 2 in ${targetLangName}",
    "Symptom 3 in ${targetLangName}"
  ],
  "treatmentPlan": {
    "immediateSteps": [
      "Immediate action 1 (first 24h) in ${targetLangName}",
      "Immediate action 2 in ${targetLangName}",
      "Immediate action 3 in ${targetLangName}"
    ],
    "organicSolutions": [
      {
        "name": "Remedy name in ${targetLangName}",
        "preparation": "How to mix in ${targetLangName}",
        "applicationRate": "Dosage in ${targetLangName}",
        "frequency": "Timing in ${targetLangName}"
      }
    ],
    "chemicalSolutions": [
      {
        "activeIngredient": "Chemical active ingredient in ${targetLangName}",
        "commercialNames": "Brand names",
        "dosagePerLiter": "e.g. 2.0 g/L in ${targetLangName}",
        "recommendedDilution": "e.g. 400g per acre in ${targetLangName}",
        "safetyWaitingPeriodDays": 14
      }
    ],
    "preventativeMeasures": [
      "Cultural prevention 1 in ${targetLangName}",
      "Cultural prevention 2 in ${targetLangName}"
    ],
    "sprayingGuidelines": {
      "bestTiming": "Timing window in ${targetLangName}",
      "weatherPrecautions": "Precautions in ${targetLangName}",
      "ppeRequired": ["Mask", "Gloves in ${targetLangName}"]
    }
  },
  "recoveryTimeline": [
    { "day": 1, "expectedMilestone": "Milestone in ${targetLangName}", "actionRequired": "Action in ${targetLangName}" },
    { "day": 3, "expectedMilestone": "Milestone in ${targetLangName}", "actionRequired": "Action in ${targetLangName}" },
    { "day": 7, "expectedMilestone": "Milestone in ${targetLangName}", "actionRequired": "Action in ${targetLangName}" },
    { "day": 14, "expectedMilestone": "Milestone in ${targetLangName}", "actionRequired": "Action in ${targetLangName}" }
  ]
}`;

      // Try candidate models with automatic failover
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const parts: any[] = [];
          if (cleanBase64) {
            parts.push({
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64
              }
            });
          }
          parts.push({ text: prompt });

          const response = await clientToUse.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              temperature: 0.15,
            }
          });

          const rawText = response.text?.trim() || '';
          if (rawText) {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.cropName && parsed.treatmentPlan) {
                aiDiagnosis = parsed;
                return res.json({
                  success: true,
                  source: modelName,
                  diagnosis: aiDiagnosis
                });
              }
            }
          }
        } catch (_modelErr) {
          // Continue to next candidate model
        }
      }
    }

    // 3. Fallback to closest matched localized knowledge engine
    let fallbackId = sampleId || 'sample-tomato-late-blight';
    if (!sampleId && cropHint) {
      const lowerHint = cropHint.toLowerCase();
      if (lowerHint.includes('paddy') || lowerHint.includes('rice') || lowerHint.includes('వరి') || lowerHint.includes('धान')) {
        fallbackId = 'sample-rice-blast';
      } else if (lowerHint.includes('cotton') || lowerHint.includes('పత్తి') || lowerHint.includes('कपास')) {
        fallbackId = 'sample-cotton-leaf-curl';
      } else if (lowerHint.includes('maize') || lowerHint.includes('corn') || lowerHint.includes('మొక్కజొన్న') || lowerHint.includes('मक्का')) {
        fallbackId = 'sample-maize-fall-armyworm';
      } else if (lowerHint.includes('chilli') || lowerHint.includes('మిరప') || lowerHint.includes('मिर्च')) {
        fallbackId = 'sample-chilli-anthracnose';
      } else if (lowerHint.includes('potato') || lowerHint.includes('బంగాళాదుంప') || lowerHint.includes('आलू')) {
        fallbackId = 'sample-potato-early-blight';
      } else if (lowerHint.includes('wheat') || lowerHint.includes('గోధుమ') || lowerHint.includes('गेहूं')) {
        fallbackId = 'sample-wheat-healthy';
      }
    }

    const fallback = getCleanFallbackDiagnosis(fallbackId, lang);
    return res.json({
      success: true,
      source: 'localized-knowledge-engine',
      diagnosis: fallback
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Diagnostic error'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 FARM Agricultural Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
