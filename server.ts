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

// Enable CORS for PWA scanners and PWABuilder
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve Web App Manifest with exact MIME type and open CORS
app.get(['/manifest.json', '/manifest.webmanifest'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const manifestFile = path.resolve(__dirname, 'public', 'manifest.json');
  res.sendFile(manifestFile);
});

// Serve Service Worker with proper header and open CORS
app.get('/sw.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const swFile = path.resolve(__dirname, 'public', 'sw.js');
  res.sendFile(swFile);
});

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
  ta: 'Tamil (தமிழ்)',
  gu: 'Gujarati (ગુજરાતી)'
};

// Candidate models for highest resilience & low latency
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

// Specialized Plant Health API: Plant.id (Kindwise Health Assessment)
async function queryPlantIdHealth(cleanBase64: string, customApiKey?: string) {
  const key = customApiKey || process.env.PLANT_ID_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch('https://api.plant.id/v3/health_assessment', {
      method: 'POST',
      headers: {
        'Api-Key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: [`data:image/jpeg;base64,${cleanBase64}`],
        similar_images: true,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const diseaseSuggestions = data?.result?.disease?.suggestions || [];
    if (diseaseSuggestions.length > 0) {
      const top = diseaseSuggestions[0];
      return {
        diseaseName: top.name,
        scientificPathogen: top.scientific_name || top.disease_details?.pathogen || '',
        probability: Math.round((top.probability || 0.9) * 100),
        rawDetails: top.disease_details,
      };
    }
  } catch (err: any) {
    console.warn('Plant.id health assessment query failed:', err.message);
  }
  return null;
}

// REST API: GET /api/samples
app.get('/api/samples', (req, res) => {
  const lang = (req.query.lang as string) || 'en';
  const validLang = (['en', 'hi', 'te', 'kn', 'ta', 'gu'].includes(lang) ? lang : 'en') as any;
  const samples = getLocalizedSamples(validLang);
  res.json({ success: true, samples });
});

// REST API: GET /api/ai-status
app.get('/api/ai-status', (_req, res) => {
  res.json({
    active: true,
    model: 'gemini-3.8-flash',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    provider: 'Hybrid Agricultural Diagnostic Pipeline',
    hasPlantId: Boolean(process.env.PLANT_ID_API_KEY),
    plantIdModel: 'Kindwise Plant.id v3 Health Assessment',
    supportedLanguages: ['en', 'hi', 'te', 'kn', 'ta', 'gu'],
    fallbackEngines: ['gemini-3.1-flash-lite', 'localized-knowledge-engine']
  });
});

// Helper to generate diurnal hourly forecast curves for 24 hours
function generateDiurnalForecast(
  baseTemp: number,
  baseHumidity: number,
  isRainEvent = false,
  isHumidEvent = false
) {
  const currentHour = new Date().getHours();
  const list = [];
  for (let i = 0; i < 24; i++) {
    const h = (currentHour + i) % 24;
    // Diurnal variation: warmest around 14:00 (2 PM), coolest around 05:00 (5 AM)
    const diurnalFactor = Math.sin(((h - 8) / 12) * Math.PI); // -1 at 2 AM, +1 at 2 PM
    let temp = Math.round((baseTemp + diurnalFactor * 4.5) * 10) / 10;
    let humidity = Math.round(baseHumidity - diurnalFactor * 16);

    if (isHumidEvent) {
      humidity = Math.min(96, Math.max(81, humidity + 12));
    }
    if (isRainEvent && i >= 2 && i <= 10) {
      humidity = Math.min(98, Math.max(88, humidity + 15));
      temp = Math.max(20, temp - 3);
    }
    humidity = Math.min(99, Math.max(30, humidity));

    const rainAmount = isRainEvent && i >= 2 && i <= 10 ? Math.round((2.5 + Math.sin(i) * 1.8) * 10) / 10 : 0;
    const rainProb = isRainEvent && i >= 1 && i <= 12 ? Math.round(75 + Math.random() * 20) : (humidity > 80 ? 35 : 10);
    const timeLabel = `${String(h).padStart(2, '0')}:00`;

    // Feasibility for spraying: best between 6-9 AM or 5-7 PM if humidity < 78% and no rain
    const isOptimalSpray = !isRainEvent && rainAmount === 0 && humidity < 80 && temp >= 18 && temp <= 32 && (h >= 6 && h <= 10 || h >= 16 && h <= 19);

    list.push({
      time: timeLabel,
      hour: h,
      temperature: temp,
      humidity,
      rainProbability: rainProb,
      rainAmount,
      isOptimalSpray,
    });
  }
  return list;
}

// REST API: GET /api/weather (OpenWeatherMap with fallback to Open-Meteo)
app.get('/api/weather', async (req, res) => {
  const lat = req.query.lat || '17.3850';
  const lon = req.query.lon || '78.4867';
  const simulate = req.query.simulate as string | undefined;
  const owmKey = process.env.OPENWEATHERMAP_API_KEY || process.env.OPENWEATHER_API_KEY;

  // Handle simulation modes for testing high risk conditions
  if (simulate === 'humidity') {
    return res.json({
      success: true,
      source: 'Simulation',
      data: {
        temperature: 27,
        humidity: 91,
        apparentTemperature: 31,
        windSpeed: 4.8,
        weatherMain: 'Clouds',
        description: 'Dense humid overcast - High spore germination risk',
        weatherId: 803,
        cityName: 'Field Test (High Humidity Alert)',
        rainAmount: 0,
        hourlyForecast: generateDiurnalForecast(27, 91, false, true),
      }
    });
  }

  if (simulate === 'rain') {
    return res.json({
      success: true,
      source: 'Simulation',
      data: {
        temperature: 23,
        humidity: 94,
        apparentTemperature: 24,
        windSpeed: 16.5,
        weatherMain: 'Rain',
        description: 'Heavy Monsoon Downpour - Chemical wash-off risk',
        weatherId: 502,
        cityName: 'Field Test (Heavy Rain Warning)',
        rainAmount: 18.5,
        hourlyForecast: generateDiurnalForecast(23, 94, true, false),
      }
    });
  }

  if (simulate === 'wind') {
    return res.json({
      success: true,
      source: 'Simulation',
      data: {
        temperature: 29,
        humidity: 55,
        apparentTemperature: 30,
        windSpeed: 24.2,
        weatherMain: 'Wind',
        description: 'Strong Gusts - Spray drift hazard',
        weatherId: 800,
        cityName: 'Field Test (High Wind Drift)',
        rainAmount: 0,
        hourlyForecast: generateDiurnalForecast(29, 55, false, false),
      }
    });
  }

  if (owmKey) {
    try {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${owmKey}`;
      const response = await fetch(owmUrl);
      if (response.ok) {
        const d = await response.json();
        const rainAmount = d.rain?.['1h'] ?? d.rain?.['3h'] ?? (d.weather?.[0]?.main?.toLowerCase().includes('rain') ? 4.5 : 0);
        const temp = d.main?.temp ?? 28;
        const humidity = d.main?.humidity ?? 70;
        const isRain = d.weather?.[0]?.main?.toLowerCase().includes('rain');

        return res.json({
          success: true,
          source: 'OpenWeatherMap',
          data: {
            temperature: temp,
            humidity,
            apparentTemperature: d.main?.feels_like ?? temp,
            windSpeed: (d.wind?.speed ?? 2) * 3.6, // m/s to km/h
            weatherMain: d.weather?.[0]?.main || 'Clear',
            description: d.weather?.[0]?.description || 'Clear sky',
            weatherId: d.weather?.[0]?.id || 800,
            cityName: d.name || 'Local Farm',
            rainAmount,
            country: d.sys?.country || 'IN',
            hourlyForecast: generateDiurnalForecast(temp, humidity, isRain, humidity >= 80),
          }
        });
      }
    } catch (_err) {
      // Fall through to meteorological feed
    }
  }

  // Live direct fallback to open-meteo
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m&forecast_days=2&timezone=auto`;
    const response = await fetch(url);
    if (response.ok) {
      const d = await response.json();
      const cur = d.current || {};
      const rainAmount = (cur.precipitation ?? 0) + (cur.rain ?? 0);
      const isRain = rainAmount > 0 || (cur.weather_code ?? 0) >= 51;
      const curTemp = cur.temperature_2m ?? 28;
      const curHum = cur.relative_humidity_2m ?? 70;

      let hourlyForecast = [];
      if (d.hourly && Array.isArray(d.hourly.time) && Array.isArray(d.hourly.temperature_2m)) {
        const nowIsoPrefix = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
        let startIdx = d.hourly.time.findIndex((t: string) => t.startsWith(nowIsoPrefix));
        if (startIdx === -1) startIdx = 0;

        for (let i = startIdx; i < Math.min(startIdx + 24, d.hourly.time.length); i++) {
          const tIso = d.hourly.time[i];
          const hourPart = parseInt(tIso.split('T')[1]?.split(':')[0] || '0', 10);
          const tVal = Math.round((d.hourly.temperature_2m[i] ?? 28) * 10) / 10;
          const hVal = Math.round(d.hourly.relative_humidity_2m?.[i] ?? 70);
          const pProb = Math.round(d.hourly.precipitation_probability?.[i] ?? 0);
          const pVal = Math.round((d.hourly.precipitation?.[i] ?? 0) * 10) / 10;
          const isOptimal = pVal === 0 && hVal < 80 && tVal >= 18 && tVal <= 32 && (hourPart >= 6 && hourPart <= 10 || hourPart >= 16 && hourPart <= 19);

          hourlyForecast.push({
            time: `${String(hourPart).padStart(2, '0')}:00`,
            hour: hourPart,
            temperature: tVal,
            humidity: hVal,
            rainProbability: pProb,
            rainAmount: pVal,
            isOptimalSpray: isOptimal,
          });
        }
      }

      if (hourlyForecast.length < 12) {
        hourlyForecast = generateDiurnalForecast(curTemp, curHum, isRain, curHum >= 80);
      }

      return res.json({
        success: true,
        source: 'Open-Meteo',
        data: {
          temperature: curTemp,
          humidity: curHum,
          apparentTemperature: cur.apparent_temperature ?? curTemp,
          windSpeed: cur.wind_speed_10m ?? 6,
          weatherMain: isRain ? 'Rain' : (cur.weather_code ?? 0) >= 3 ? 'Clouds' : 'Clear',
          description: isRain ? 'Precipitation / Rain' : (cur.weather_code ?? 0) >= 3 ? 'Partly cloudy' : 'Clear sky',
          weatherId: cur.weather_code ?? 800,
          cityName: 'Local Field',
          rainAmount,
          hourlyForecast,
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
      cityName: 'Field Location',
      rainAmount: 0,
      hourlyForecast: generateDiurnalForecast(28, 70, false, false),
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
      ta: 'ஆடியோவை தூய தமிழ் எழுத்துக்களில் (Tamil script) மட்டும் டிரான்ஸ்கிரைப் செய்யவும். கூடுதல் விளக்கம் எதுவும் தேவையில்லை.',
      gu: 'ઑડિયોને શુદ્ધ ગુજરાતી લિપિમાં (Gujarati script) જ ટ્રાન્સક્રાઇબ કરો. ખેડૂતે બોલેલા શબ્દો જ લખો, કોઈ અંગ્રેજી અનુવાદ કે વધારાની ટિપ્પણી ન કરવી.'
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
      customApiKey,
      farmerProfile
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

    // 2. Multimodal AI Analysis with Plant.id Verification + Gemini Vision
    const clientToUse = getGenAIClient(customApiKey) || defaultAi;
    let aiDiagnosis = null;

    if (clientToUse && (imageBase64 || cropHint)) {
      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';

      // Check specialized plant pathology API (Plant.id Kindwise) if available
      let verifiedPathology: any = null;
      if (cleanBase64) {
        verifiedPathology = await queryPlantIdHealth(cleanBase64);
      }

      const pathologyContext = verifiedPathology
        ? `\nSPECIALIZED PLANT PATHOLOGY (Plant.id Kindwise Assessment):
- Detected Pathology: "${verifiedPathology.diseaseName}"
- Pathogen: "${verifiedPathology.scientificPathogen || 'Foliar Pathogen'}"
- Initial Model Probability: ${verifiedPathology.probability}%
Incorporate this verified diagnosis into your analysis, adapting all treatment protocols, Indian brands, and dosages to Indian agriculture.\n`
        : '';

      const farmerRegionalContext = farmerProfile
        ? `\nFARMER REGION & LOCATION CONTEXT:
- State: "${farmerProfile.state || ''}"
- District: "${farmerProfile.district || ''}"
- Village / Field: "${farmerProfile.village || ''}"
- Agro-Climatic Zone: "${farmerProfile.agroClimaticZone || ''}"
- Soil Type: "${farmerProfile.soilType || ''}"
- Farm Size: "${farmerProfile.landSizeAcres || 1} Acres"
Tailor all treatment protocols, local pesticide recommendations, and spray timing specifically for the climatic and agro-ecological conditions of ${farmerProfile.state || 'this region'}.\n`
        : '';

      const prompt = `You are FARM (Farmer's Advisory & Resource Module), an expert agronomist, crop pathologist, and entomologist for Indian agriculture.
Analyze the provided crop leaf or pest specimen image.
TARGET LANGUAGE: "${targetLangName}" (Language code: "${lang}").
${pathologyContext}
${farmerRegionalContext}
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
                  source: verifiedPathology ? `Plant.id Kindwise + ${modelName}` : modelName,
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
      if (lowerHint.includes('paddy') || lowerHint.includes('rice') || lowerHint.includes('వరి') || lowerHint.includes('धान') || lowerHint.includes('ડાંગર') || lowerHint.includes('ચોખા')) {
        fallbackId = 'sample-rice-blast';
      } else if (lowerHint.includes('cotton') || lowerHint.includes('పత్తి') || lowerHint.includes('कपास') || lowerHint.includes('કપાસ')) {
        fallbackId = 'sample-cotton-leaf-curl';
      } else if (lowerHint.includes('maize') || lowerHint.includes('corn') || lowerHint.includes('మొక్కజొన్న') || lowerHint.includes('मक्का') || lowerHint.includes('મકાઈ')) {
        fallbackId = 'sample-maize-fall-armyworm';
      } else if (lowerHint.includes('chilli') || lowerHint.includes('మిరప') || lowerHint.includes('मिर्च') || lowerHint.includes('મરચી') || lowerHint.includes('મરચું')) {
        fallbackId = 'sample-chilli-anthracnose';
      } else if (lowerHint.includes('potato') || lowerHint.includes('బంగాళాదుంప') || lowerHint.includes('आलू') || lowerHint.includes('બટાકા') || lowerHint.includes('બટાટા')) {
        fallbackId = 'sample-potato-early-blight';
      } else if (lowerHint.includes('wheat') || lowerHint.includes('గోధుమ') || lowerHint.includes('गेहूं') || lowerHint.includes('ઘઉં')) {
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
