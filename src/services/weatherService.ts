import { SupportedLanguage } from '../types/farm';

export interface RealtimeWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  soilMoisture: number; // percentage
  apparentTemperature: number;
  weatherCode: number;
  conditionText: string;
  sprayCondition: 'optimal' | 'wind_alert' | 'rain_alert' | 'humidity_alert';
  sprayConditionText: string;
  locationName: string;
  lastUpdated: string;
  source: 'OpenWeatherMap' | 'Open-Meteo' | 'Fallback';
}

export interface RegionPreset {
  id: string;
  name: Record<SupportedLanguage, string>;
  lat: number;
  lon: number;
}

export const REGION_PRESETS: RegionPreset[] = [
  {
    id: 'hyderabad',
    name: {
      en: 'Hyderabad (Telangana)',
      hi: 'हैदराबाद (तेलंगाना)',
      te: 'హైదరాబాద్ (తెలంగాణ)',
      kn: 'ಹೈದರಾಬಾದ್ (ತೆಲಂಗಾಣ)',
      ta: 'ஹைதராபாத் (தெலுங்கானா)',
      gu: 'હૈદરાબાદ (તેલંગાણા)'
    },
    lat: 17.3850,
    lon: 78.4867
  },
  {
    id: 'vijayawada',
    name: {
      en: 'Vijayawada (Andhra Pradesh)',
      hi: 'विजयवाड़ा (आंध्र प्रदेश)',
      te: 'విజయవాడ (ఆంధ్ర ప్రదేశ్)',
      kn: 'ವಿಜಯವಾಡ (ಆಂಧ್ರಪ್ರದೇಶ)',
      ta: 'விஜயவாடா (ஆந்திரா)',
      gu: 'વિજયવાડા (આંધ્રપ્રદેશ)'
    },
    lat: 16.5062,
    lon: 80.6480
  },
  {
    id: 'bengaluru',
    name: {
      en: 'Bengaluru (Karnataka)',
      hi: 'बेंगलुरु (कर्नाटक)',
      te: 'బెంగళూరు (కర్ణాటక)',
      kn: 'ಬೆಂಗಳೂರು (ಕರ್ನಾಟಕ)',
      ta: 'பெங்களூரு (கர்நாடகா)',
      gu: 'બેંગલુરુ (કર્ણાટક)'
    },
    lat: 12.9716,
    lon: 77.5946
  },
  {
    id: 'chennai',
    name: {
      en: 'Chennai (Tamil Nadu)',
      hi: 'चेन्नई (तमिलनाडु)',
      te: 'చెన్నై (తమిళనాడు)',
      kn: 'ಚೆನ್ನೈ (ತಮಿಳುನಾಡು)',
      ta: 'சென்னை (தமிழ்நாடு)',
      gu: 'ચેન્નાઈ (તમિલનાડુ)'
    },
    lat: 13.0827,
    lon: 80.2707
  },
  {
    id: 'delhi',
    name: {
      en: 'New Delhi (NCR)',
      hi: 'नई दिल्ली',
      te: 'న్యూ ఢిల్లీ',
      kn: 'ನವದೆಹಲಿ',
      ta: 'புது தில்லி',
      gu: 'નવી દિલ્હી (NCR)'
    },
    lat: 28.6139,
    lon: 77.2090
  },
  {
    id: 'pune',
    name: {
      en: 'Pune (Maharashtra)',
      hi: 'पुणे (महाराष्ट्र)',
      te: 'పుణె (మహారాష్ట్ర)',
      kn: 'ಪುಣೆ (ಮಹಾರಾಷ್ಟ್ರ)',
      ta: 'புனே (மகாராஷ்டிரா)',
      gu: 'પુણે (મહારાષ્ટ્ર)'
    },
    lat: 18.5204,
    lon: 73.8567
  },
  {
    id: 'ahmedabad',
    name: {
      en: 'Ahmedabad (Gujarat)',
      hi: 'अहमदाबाद (गुजरात)',
      te: 'అహ్మదాబాద్ (గుజరాత్)',
      kn: 'ಅಹಮದಾಬಾದ್ (ಗುಜರಾತ್)',
      ta: 'அகமதாபாத் (குஜராத்)',
      gu: 'અમદાવાદ (ગુજરાત)'
    },
    lat: 23.0225,
    lon: 72.5714
  }
];

// OpenWeatherMap API call with seamless fallback
export async function fetchLiveWeather(
  lat: number,
  lon: number,
  locationLabel: string,
  lang: SupportedLanguage
): Promise<RealtimeWeather> {
  const conditionTexts: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      clear: 'Clear Sky',
      cloudy: 'Partly Cloudy',
      rain: 'Rainy',
      optimal: 'Optimal Window (Low Drift)',
      wind_alert: 'High Wind Alert (Drift Risk)',
      rain_alert: 'Rain Alert (Washoff Risk)',
      humidity_alert: 'High Humidity (Fungal Alert)'
    },
    hi: {
      clear: 'साफ मौसम',
      cloudy: 'हल्के बादल',
      rain: 'वर्षा',
      optimal: 'अनुकूल समय (शांत हवा)',
      wind_alert: 'तेज हवा चेतावनी (छिड़काव न करें)',
      rain_alert: 'बारिश चेतावनी (दवा बहने का खतरा)',
      humidity_alert: 'अत्यधिक नमी (फफूंद खतरा)'
    },
    te: {
      clear: 'స్వచ్ఛమైన ఎండ',
      cloudy: 'పాక్షిక మేఘావృతం',
      rain: 'వర్షం',
      optimal: 'మందు పిచికారీకి అనుకూల సమయం',
      wind_alert: 'ఎక్కువ గాలి (మందు పిచికారీ చేయవద్దు)',
      rain_alert: 'వర్షం హెచ్చరిక (మందు కొట్టుకోవద్దు)',
      humidity_alert: 'అధిక తేమ (తెగుళ్ల వ్యాప్తి ఎక్కువ)'
    },
    kn: {
      clear: 'ಸ್ಪಷ್ಟ ಬಿಸಿಲು',
      cloudy: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣ',
      rain: 'ಮಳೆ',
      optimal: 'ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಸಮಯ (ಶಾಂತ ಗಾಳಿ)',
      wind_alert: 'ಹೆಚ್ಚು ಗಾಳಿ (ಔಷಧಿ ಸಿಂಪಡಿಸಬೇಡಿ)',
      rain_alert: 'ಮಳೆ ಎಚ್ಚರಿಕೆ (ಔಷಧಿ ತೊಳೆದುಹೋಗುವ ಅಪಾಯ)',
      humidity_alert: 'ಹೆಚ್ಚು ತೇವಾಂಶ (ಶಿಲೀಂಧ್ರ ಹರಡುವಿಕೆ)'
    },
    ta: {
      clear: 'தெளிவான வானம்',
      cloudy: 'மேகமூட்டம்',
      rain: 'மழை',
      optimal: 'மருந்து தெளிக்க உகந்த நேரம்',
      wind_alert: 'அதிக காற்று எச்சரிக்கை (தெளிக்க வேண்டாம்)',
      rain_alert: 'மழை எச்சரிக்கை (மருந்து வீணாகும் அபாயம்)',
      humidity_alert: 'அதிக ஈரப்பதம் (பூஞ்சை அபாயம்)'
    },
    gu: {
      clear: 'ચોખ્ખું આકાશ',
      cloudy: 'અંશતઃ વાદળછાયું',
      rain: 'વરસાદ',
      optimal: 'છંટકાવ માટે ઉત્તમ સમય (ઓછો પવન)',
      wind_alert: 'ઝડપી પવન ચેતવણી (છંટકાવ ટાળો)',
      rain_alert: 'વરસાદ ચેતવણી (દવા ધોવાઈ જવાનો ભય)',
      humidity_alert: 'વધુ ભેજ (ફૂગ ફેલાવવાનો ભય)'
    }
  };

  const dict = conditionTexts[lang] || conditionTexts.en;

  // 1. Try server-side or OpenWeatherMap API proxy
  try {
    const owmRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (owmRes.ok) {
      const owmData = await owmRes.json();
      if (owmData && owmData.success && owmData.data) {
        const d = owmData.data;
        const temp = Math.round(d.temperature);
        const humidity = Math.round(d.humidity);
        const wind = Math.round(d.windSpeed * 10) / 10;
        const isRain = d.weatherMain?.toLowerCase().includes('rain') || d.weatherMain?.toLowerCase().includes('drizzle');

        let sprayCondition: RealtimeWeather['sprayCondition'] = 'optimal';
        if (isRain) {
          sprayCondition = 'rain_alert';
        } else if (wind > 14) {
          sprayCondition = 'wind_alert';
        } else if (humidity > 85) {
          sprayCondition = 'humidity_alert';
        }

        const condKey = isRain ? 'rain' : d.weatherMain?.toLowerCase().includes('cloud') ? 'cloudy' : 'clear';

        return {
          temperature: temp,
          humidity,
          windSpeed: wind,
          soilMoisture: Math.round(humidity * 0.52),
          apparentTemperature: Math.round(d.apparentTemperature ?? temp),
          weatherCode: d.weatherId || 800,
          conditionText: dict[condKey] || d.description || dict.clear,
          sprayCondition,
          sprayConditionText: dict[sprayCondition] || dict.optimal,
          locationName: d.cityName || locationLabel,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'OpenWeatherMap'
        };
      }
    }
  } catch (_e) {
    // Continue to standard meteorological fallback
  }

  // 2. High-precision meteorological satellite feed (Open-Meteo)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code&hourly=soil_moisture_0_to_1cm&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    const current = data.current || {};
    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 70);
    const wind = Math.round((current.wind_speed_10m ?? 6) * 10) / 10;
    const rain = (current.precipitation ?? 0) + (current.rain ?? 0);
    const weatherCode = current.weather_code ?? 0;

    let soilMoisture = 35;
    if (data.hourly?.soil_moisture_0_to_1cm && Array.isArray(data.hourly.soil_moisture_0_to_1cm)) {
      const val = data.hourly.soil_moisture_0_to_1cm[0];
      if (typeof val === 'number') {
        soilMoisture = Math.round(Math.min(100, Math.max(10, val * 180)));
      }
    } else {
      soilMoisture = Math.round(humidity * 0.5 + (rain > 0 ? 30 : 0));
    }

    let sprayCondition: RealtimeWeather['sprayCondition'] = 'optimal';
    if (rain > 0.2 || weatherCode >= 51) {
      sprayCondition = 'rain_alert';
    } else if (wind > 14) {
      sprayCondition = 'wind_alert';
    } else if (humidity > 85) {
      sprayCondition = 'humidity_alert';
    }

    const condKey = rain > 0 ? 'rain' : weatherCode >= 3 ? 'cloudy' : 'clear';

    return {
      temperature: temp,
      humidity,
      windSpeed: wind,
      soilMoisture,
      apparentTemperature: Math.round(current.apparent_temperature ?? temp),
      weatherCode,
      conditionText: dict[condKey] || dict.clear,
      sprayCondition,
      sprayConditionText: dict[sprayCondition] || dict.optimal,
      locationName: locationLabel,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Open-Meteo'
    };
  } catch (_e) {
    // 3. Graceful fallback for offline fields
    return {
      temperature: 28,
      humidity: 68,
      windSpeed: 6.5,
      soilMoisture: 38,
      apparentTemperature: 29,
      weatherCode: 1,
      conditionText: dict.clear,
      sprayCondition: 'optimal',
      sprayConditionText: dict.optimal,
      locationName: locationLabel,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Fallback'
    };
  }
}
