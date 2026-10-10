import { SupportedLanguage } from '../types/farm';

export interface DiseaseWarningDetails {
  hasWarning: boolean;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  warningType: 'high_humidity' | 'heavy_rain' | 'combined' | 'high_wind' | null;
  badgeLabel: string;
  headline: string;
  summary: string;
  pathogenThreats: string[];
  actionSteps: string[];
  sprayRecommendation: 'optimal' | 'hold_spray' | 'preventive_only' | 'danger_washoff';
  sprayAdviceText: string;
}

export interface HourlyWeatherPoint {
  time: string;
  hour: number;
  temperature: number;
  humidity: number;
  rainProbability?: number;
  rainAmount?: number;
  isOptimalSpray?: boolean;
}

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
  source: 'OpenWeatherMap' | 'Open-Meteo' | 'Simulation' | 'Fallback';
  rainAmount: number;
  diseaseWarning: DiseaseWarningDetails;
  hourlyForecast: HourlyWeatherPoint[];
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

// Helper to construct localized agronomic disease warnings based on meteorological parameters
export function buildDiseaseWarning(
  humidity: number,
  rainAmount: number,
  isRain: boolean,
  windSpeed: number,
  _temp: number,
  lang: SupportedLanguage
): DiseaseWarningDetails {
  const isHighHumidity = humidity >= 80;
  const isHeavyRain = isRain && (rainAmount > 4 || rainAmount === 0);
  const isCombined = isHighHumidity && isRain;
  const isHighWind = windSpeed > 15;

  if (isCombined) {
    const texts: Record<SupportedLanguage, { badge: string; head: string; sum: string; threats: string[]; actions: string[]; spray: string }> = {
      en: {
        badge: 'CRITICAL DISEASE OUTBREAK RISK',
        head: 'Extreme Fungal & Bacterial Pressure (Rain + >80% Humidity)',
        sum: `Relative humidity at ${humidity}% with active precipitation creates maximum pathogen sporulation and splash infection conditions.`,
        threats: ['Late Blight (Phytophthora)', 'Rice Blast / Sheath Blight', 'Bacterial Leaf Streak', 'Anthracnose Rot'],
        actions: [
          'DO NOT spray foliar chemicals right now; rain will immediately wash off the active ingredients into drainage channels.',
          'Clear field drainage trenches immediately to prevent water stagnation around root collars.',
          'Prepare preventive systemic fungicide (e.g., Metalaxyl 35% WS or Azoxystrobin) for immediate application once rains cease.'
        ],
        spray: 'Strictly Hold Chemical Spray: Wash-off & Non-target Runoff Risk'
      },
      hi: {
        badge: 'गंभीर रोग प्रकोप चेतावनी',
        head: 'अत्यधिक फफूंद व जीवाणु संक्रमण खतरा (वर्षा + >80% नमी)',
        sum: `हवा में ${humidity}% नमी और वर्षा के कारण फफूंद बीजाणुओं का अंकुरण और कीचड़ के छींटों से रोग फैलाव चरम पर है।`,
        threats: ['अगेती/पिछेती झुलसा (Late Blight)', 'धान का ब्लास्ट / शीथ ब्लाइट', 'जीवाणु पत्ती धब्बा', 'एन्थ्रेक्नोज सड़न'],
        actions: [
          'अभी कीटनाशक या फफूंदनाशक का छिड़काव बिल्कुल न करें; बारिश से दवा तुरंत धुल जाएगी।',
          'खेत की जल निकासी नालियों को तुरंत साफ करें ताकि जड़ों के पास पानी न रुके।',
          'बारिश रुकते ही प्रणालीगत फफूंदनाशक (मेटालेक्सिल या एजोक्सिस्ट्रोबिन) के छिड़काव की तैयारी रखें।'
        ],
        spray: 'छिड़काव तुरंत रोकें: दवा धुलने व बर्बादी का भारी खतरा'
      },
      te: {
        badge: 'తీవ్రమైన తెగుళ్ల వ్యాప్తి హెచ్చరిక',
        head: 'అత్యధిక శిలీంధ్ర & బ్యాక్టీరియా ముప్పు (వర్షం + >80% తేమ)',
        sum: `${humidity}% అధిక తేమ మరియు వర్షం వల్ల తెగుళ్ల వ్యాప్తి, ఆకులపై నీటి చుక్కల ద్వారా క్రిములు వేగంగా విస్తరిస్తాయి.`,
        threats: ['లేట్ బ్లైట్ తెగులు', 'వరి అగ్గితెగులు / ఎండ్రిక తెగులు', 'బ్యాక్టీరియల్ ఆకు ఎండు తెగులు', 'కాయ కుళ్ళు తెగులు'],
        actions: [
          'ఇప్పుడు మందులు పిచికారీ చేయవద్దు; వర్షపు నీటితో మందు కొట్టుకుపోయి వృథా అవుతుంది.',
          'మడిలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలను వెంటనే శుభ్రం చేయండి.',
          'వర్షం తగ్గిన వెంటనే అంతర్వాహిక శిలీంధ్రనాశిని (మెటలాక్సిల్ లేదా అజోక్సిస్ట్రోబిన్) పిచికారీకి సిద్ధంగా ఉండండి.'
        ],
        spray: 'పిచికారీని నిలిపివేయండి: మందు కొట్టుకుపోయే ప్రమాదం ఉంది'
      },
      kn: {
        badge: 'ತೀವ್ರ ರೋಗ ಹರಡುವಿಕೆ ಎಚ್ಚರಿಕೆ',
        head: 'ಅತಿಯಾದ ಶಿಲೀಂಧ್ರ ಹಾಗೂ ಬ್ಯಾಕ್ಟೀರಿಯಾ ಸೋಂಕು (ಮಳೆ + >80% ತೇವಾಂಶ)',
        sum: `${humidity}% ತೇವಾಂಶ ಮತ್ತು ಮಳೆಯು ರೋಗಕಾರಕಗಳ ಬೀಜಕ ಹರಡುವಿಕೆಗೆ ಗರಿಷ್ಠ ವಾತಾವರಣವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.`,
        threats: ['ಲೇಟ್ ಬ್ಲೈಟ್ (ಅಂಗಮಾರಿ)', 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ', 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ಎಲೆ ಕಪ್ಪು ಚುಕ್ಕೆ', 'ಹಣ್ಣು ಕೊಳೆ ರೋಗ'],
        actions: [
          'ಈಗ ಯಾವುದೇ ಕೀಟನಾಶಕ ಅಥವಾ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ; ಮಳೆಗೆ ಔಷಧಿ ಕೊಚ್ಚಿ ಹೋಗುತ್ತದೆ.',
          'ಬೇರುಗಳ ಸುತ್ತ ನೀರು ನಿಲ್ಲದಂತೆ ತೋಟದ ಚರಂಡಿಗಳನ್ನು ತಕ್ಷಣ ತೆರವುಗೊಳಿಸಿ.',
          'ಮಳೆ ನಿಂತ ತಕ್ಷಣ ವ್ಯವಸ್ಥಿತ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಲು ತಯಾರಿ ಮಾಡಿಕೊಳ್ಳಿ.'
        ],
        spray: 'ಸಿಂಪಡಣೆ ನಿಲ್ಲಿಸಿ: ಔಷಧಿ ಕೊಚ್ಚಿಹೋಗುವ ಅಪಾಯ'
      },
      ta: {
        badge: 'தீவிர நோய் பரவல் எச்சரிக்கை',
        head: 'பூஞ்சை மற்றும் பாக்டீரியா நோய் அபாயம் (மழை + >80% ஈரப்பதம்)',
        sum: `${humidity}% அதிக ஈரப்பதம் மற்றும் தொடர் மழையால் பயிர்களில் பூஞ்சை வித்துக்கள் மிக வேகமாக பரவும்.`,
        threats: ['இலை கருகல் நோய் (Late Blight)', 'நெல் குலை நோய்', 'பாக்டீரியா இலைக்கருகல்', 'காய் அழுகல் நோய்'],
        actions: [
          'தற்போது மருந்து தெளிக்க வேண்டாம்; மழை நீரால் மருந்து அடித்துச் செல்லப்படும்.',
          'வேர் அழுகல் ஏற்படாமல் இருக்க வயல் வடிகால் வாய்க்கால்களை உடனே தூர்வாருங்கள்.',
          'மழை நின்றவுடன் வீரியமுள்ள பூஞ்சைக் கொல்லி தெளிக்க ஏற்பாடு செய்யவும்.'
        ],
        spray: 'மருந்து தெளிப்பதை நிறுத்துங்கள்: மழை கழுவிவிடும் அபாயம்'
      },
      gu: {
        badge: 'ગંભીર રોગ ઉપદ્રવ ચેતવણી',
        head: 'અત્યંત ફૂગ અને જીવાણુ જોખમ (વરસાદ + >80% ભેજ)',
        sum: `${humidity}% વધુ ભેજ અને વરસાદને કારણે પાંદડા પર ફૂગના બીજાણુઓ ઝડપથી ફેલાવવાની શક્યતા છે.`,
        threats: ['પાછોતરો સુકારો (Late Blight)', 'ડાંગરનો બ્લાસ્ટ / સુકારો', 'બેક્ટેરિયલ પાન ટપકાં', 'ફળનો સડો'],
        actions: [
          'અત્યારે દવાનો છંટકાવ બિલકુલ ન કરવો; વરસાદથી દવા ધોવાઈ જશે અને વ્યર્થ જશે.',
          'ખેતરમાં પાણી ભરાઈ ન રહે તે માટે નિકાલ નીકની સફાઈ તાત્કાલિક કરો.',
          'વરસાદ બંધ થતાં જ પ્રણાલીગત ફૂગનાશક (મેટાલેક્સિલ અથવા એઝોક્સિસ્ટ્રોબિન) ના છંટકાવની તૈયારી રાખો.'
        ],
        spray: 'છંટકાવ મુલતવી રાખો: દવા ધોવાઈ જવાનો મોટો ભય'
      }
    };
    const tObj = texts[lang] || texts.en;
    return {
      hasWarning: true,
      severity: 'critical',
      warningType: 'combined',
      badgeLabel: tObj.badge,
      headline: tObj.head,
      summary: tObj.sum,
      pathogenThreats: tObj.threats,
      actionSteps: tObj.actions,
      sprayRecommendation: 'danger_washoff',
      sprayAdviceText: tObj.spray
    };
  }

  if (isRain) {
    const texts: Record<SupportedLanguage, { badge: string; head: string; sum: string; threats: string[]; actions: string[]; spray: string }> = {
      en: {
        badge: 'RAIN & SPRAY WASHOUT ALERT',
        head: 'Rainfall Detected: High Pesticide Washout & Soil Splash Risk',
        sum: `Active rain (${rainAmount > 0 ? rainAmount + ' mm' : 'ongoing'}) creates soil-splash dispersal of fungal/bacterial blights and rapid spray wash-off.`,
        threats: ['Collar Rot / Stem Rot', 'Bacterial Splash Blight', 'Anthracnose Lesions', 'Damping Off in Seedlings'],
        actions: [
          'Do not apply foliar sprays; pesticides require 3-4 hours of dry foliage to bind effectively (rainfastness period).',
          'Inspect field borders for waterlogging; standing water encourages root asphyxiation and Pythium wilt.',
          'Scout lower leaves for soil-splash dirt deposits which carry bacterial inoculums.'
        ],
        spray: 'Hold Chemical Spray: Rain Washout Hazard'
      },
      hi: {
        badge: 'वर्षा व दवा बहने की चेतावनी',
        head: 'बारिश का मौसम: कीटनाशक बहने और मिट्टी छींटे संक्रमण का खतरा',
        sum: `वर्षा के कारण पत्तियों पर दवा टिक नहीं पाएगी और जमीन की मिट्टी के छींटों से रोगों का फैलाव बढ़ जाता है।`,
        threats: ['तना गलन (Collar Rot)', 'जीवाणु छींटा झुलसा', 'एन्थ्रेक्नोज धब्बे', 'जड़ गलन'],
        actions: [
          'छिड़काव कार्य स्थगित करें; दवा को चिपकने के लिए कम से कम 3-4 घंटे धूप या सूखा मौसम चाहिए।',
          'खेत में जलभराव न होने दें; ठहरा हुआ पानी जड़ गलन को बढ़ावा देता है।',
          'निचली पत्तियों पर मिट्टी के छींटों की जांच करें।'
        ],
        spray: 'छिड़काव न करें: बारिश से दवा बहने का खतरा'
      },
      te: {
        badge: 'వర్షం & మందు కొట్టుకుపోయే హెచ్చరిక',
        head: 'వర్షం పడుతోంది: రసాయన మందులు కొట్టుకుపోయే ప్రమాదం',
        sum: `వర్షం వల్ల పిచికారీ చేసిన మందులు ఆకులపై నిలవవు మరియు నేల బురద తుంపర్ల ద్వారా తెగుళ్లు వ్యాపిస్తాయి.`,
        threats: ['మొదలు కుళ్ళు తెగులు', 'బ్యాక్టీరియల్ మచ్చల తెగులు', 'ఆకుమచ్చ తెగులు', 'వేరుకుళ్ళు'],
        actions: [
          'మందుల పిచికారీని వాయిదా వేయండి; మందు ఆకులపై అంటుకోవడానికి 3-4 గంటల పొడి వాతావరణం అవసరం.',
          'మడిలో నీరు నిల్వకుండా చూడండి; నిలిచిన నీరు వేరు కుళ్ళిపోయేలా చేస్తుంది.',
          'క్రింది ఆకులపై బురద తుంపర్ల వల్ల వచ్చే మచ్చలను గమనించండి.'
        ],
        spray: 'పిచికారీ వాయిదా వేయండి: వర్షం ప్రమాదం'
      },
      kn: {
        badge: 'ಮಳೆ ಮತ್ತು ಔಷಧಿ ಕೊಚ್ಚಿಹೋಗುವ ಎಚ್ಚರಿಕೆ',
        head: 'ಮಳೆ ಆರಂಭ: ಕೀಟನಾಶಕ ಕೊಚ್ಚಿಹೋಗುವಿಕೆ ಮತ್ತು ಮಣ್ಣಿನ ಚಿಮ್ಮುವಿಕೆ ಅಪಾಯ',
        sum: `ಮಳೆಯಿಂದಾಗಿ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿದ ಔಷಧಿ ನಿಲ್ಲುವುದಿಲ್ಲ ಮತ್ತು ಮಣ್ಣಿನ ತುಂತುರುಗಳಿಂದ ರೋಗಾಣುಗಳು ಹರಡುತ್ತವೆ.`,
        threats: ['ಕಾಂಡ ಕೊಳೆ ರೋಗ', 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ಎಲೆ ಮಚ್ಚೆ', 'ಚಿಗುರು ಕೊಳೆ', 'ಬೇರು ಕೊಳೆ ರೋಗ'],
        actions: [
          'ಸಿಂಪಡಣೆ ಕಾರ್ಯಾಚರಣೆಯನ್ನು ಮುಂದೂಡಿ; ಔಷಧಿ ಅಂಟಿಕೊಳ್ಳಲು 3-4 ಗಂಟೆ ಒಣ ಹವೆ ಬೇಕು.',
          'ತೋಟದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಎಚ್ಚರವಹಿಸಿ.',
          'ಕೆಳಗಿನ ಎಲೆಗಳಲ್ಲಿ ಮಣ್ಣಿನ ಕಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
        ],
        spray: 'ಸಿಂಪಡಿಸಬೇಡಿ: ಮಳೆಯಲ್ಲಿ ಔಷಧಿ ವ್ಯರ್ಥ'
      },
      ta: {
        badge: 'மழை & மருந்து வீணாகும் எச்சரிக்கை',
        head: 'மழைப்பொழிவு: பூச்சிக்கொல்லி கழுவிச் செல்லப்படும் அபாயம்',
        sum: `மழையால் இலைகளில் மருந்து ஒட்டாது, மண் தெறிப்பதால் பயிர்களில் பாக்டீரியா நோய் பரவும்.`,
        threats: ['தண்டு அழுகல் நோய்', 'பாக்டீரியா புள்ளி நோய்', 'இலைப்புள்ளி நோய்', 'வேர் அழுகல்'],
        actions: [
          'மருந்து தெளிப்பதை தள்ளிப்போடுங்கள்; மருந்து ஒட்ட குறைந்தது 3-4 மணி நேரம் காய்ந்த இலைகள் தேவை.',
          'வயலில் தண்ணீர் தேங்காமல் பார்த்துக் கொள்ளுங்கள்.',
          'கீழ் இலைகளில் மண் தெறித்த புள்ளிகளை கண்காணிக்கவும்.'
        ],
        spray: 'தெளிக்க வேண்டாம்: மழை அபாயம்'
      },
      gu: {
        badge: 'વરસાદ અને દવા ધોવાણ ચેતવણી',
        head: 'વરસાદની સ્થિતિ: કીટનાશક ધોવાઈ જવાનો અને રોગ ફેલાવાનો ભય',
        sum: `વરસાદને લીધે પાંદડા પર દવા ચોંટશે નહીં અને માટીના છાંટાથી બેક્ટેરિયા રોગ ઝડપથી ફેલાશે.`,
        threats: ['થડનો સડો (Collar Rot)', 'બેક્ટેરિયલ છાંટા સુકારો', 'કાળા ટપકાં', 'મૂળનો સડો'],
        actions: [
          'છંટકાવ મોકૂફ રાખો; દવા પાંદડા પર શોષાવવા માટે 3-4 કલાક સૂકું હવામાન જરૂરી છે.',
          'ખેતરમાં પાણી ભરાવા ન દો.',
          'નીચલા પાંદડા પર માટીના છાંટાના ડાઘા તપાસો.'
        ],
        spray: 'છંટકાવ ટાળો: વરસાદથી દવા ધોવાઈ જશે'
      }
    };
    const tObj = texts[lang] || texts.en;
    return {
      hasWarning: true,
      severity: 'high',
      warningType: 'heavy_rain',
      badgeLabel: tObj.badge,
      headline: tObj.head,
      summary: tObj.sum,
      pathogenThreats: tObj.threats,
      actionSteps: tObj.actions,
      sprayRecommendation: 'hold_spray',
      sprayAdviceText: tObj.spray
    };
  }

  if (isHighHumidity) {
    const texts: Record<SupportedLanguage, { badge: string; head: string; sum: string; threats: string[]; actions: string[]; spray: string }> = {
      en: {
        badge: 'HIGH HUMIDITY FUNGAL ALERT',
        head: `Elevated Relative Humidity (${humidity}%): High Foliar Spore Incubation`,
        sum: `Relative humidity exceeding 80% creates the critical moisture microclimate for airborne fungal spores (mildews, blights, rusts) to germinate on leaf surfaces.`,
        threats: ['Powdery Mildew / Downy Mildew', 'Early Blight (Alternaria)', 'Cercospora Leaf Spot', 'Rust Spores (Puccinia)'],
        actions: [
          'Apply preventive contact fungicide (e.g. Mancozeb 75% WP @ 2.5 g/L) or organic bio-fungicide (Trichoderma viride) before spots erupt.',
          'Avoid overhead sprinkler irrigation; switch to drip or furrow watering to reduce leaf wetness hours.',
          'Prune overlapping and senescent lower canopy leaves to improve air circulation.'
        ],
        spray: 'Preventive Spray Window: Apply Contact Fungicide with Sticker/Spreader'
      },
      hi: {
        badge: 'अत्यधिक नमी फफूंद चेतावनी',
        head: `हवा में भारी नमी (${humidity}%): फफूंद बीजाणु अंकुरण का खतरा`,
        sum: `80% से अधिक नमी होने पर पत्तियों पर फफूंद (फंगस) के बीजाणु बहुत तेजी से सक्रिय होकर धब्बे बनाते हैं।`,
        threats: ['छाछिया / पाउडरी मिल्ड्यू', 'अगेती झुलसा (Early Blight)', 'टिक्का / सर्कोस्पोरा पत्ती धब्बा', 'गेरुआ / रतुआ (Rust)'],
        actions: [
          'रोग दिखने से पहले ही सुरक्षात्मक फफूंदनाशक (मैनकोजेब 75% WP @ 2.5 ग्राम/लीटर) या ट्राइकोडर्मा विरिडी का छिड़काव करें।',
          'फव्वारा सिंचाई से बचें; टपक (ड्रिप) सिंचाई का उपयोग करें ताकि पत्तियां गीली न रहें।',
          'हवा के संचार के लिए निचली घनी और सूखी पत्तियों की छंटाई करें।'
        ],
        spray: 'रोकथाम छिड़काव: स्टिकर (चिपकने वाला) मिलाकर संपर्क फफूंदनाशक डालें'
      },
      te: {
        badge: 'అధిక తేమ శిలీంధ్ర హెచ్చరిక',
        head: `గాలిలో అధిక తేమ (${humidity}%): ఆకులపై తెగుళ్ల బీజాల వ్యాప్తి ముప్పు`,
        sum: `తేమ 80% దాటితే బూడిద తెగులు, ఆకుమచ్చ తెగులు వంటి శిలీంధ్రాలు ఆకులపై వేగంగా అంకురిస్తాయి.`,
        threats: ['బూడిద తెగులు (Powdery Mildew)', 'ఆల్టర్నేరియా ఆకుమచ్చ', 'సెర్కోస్పోరా మచ్చల తెగులు', 'కుంకుమ తెగులు (Rust)'],
        actions: [
          'నివారణ చర్యగా మాంకోజెబ్ 75% WP (@ 2.5 గ్రా/లీ) లేదా ట్రైకోడెర్మా విరిడే మందును పిచికారీ చేయండి.',
          'పైనుంచి నీళ్లు చల్లే స్ప్రింక్లర్ పద్ధతి ఆపండి; ఆకులు తడవకుండా డ్రిప్ ద్వారా నీరందించండి.',
          'గాలి ప్రసరణ బాగుండటానికి అడుగు భాగంలో ఉన్న ఎండిన ఆకులను తీసివేయండి.'
        ],
        spray: 'ముందస్తు పిచికారీ సమయం: స్టిక్కర్ కలిపి స్పర్శ శిలీంధ్రనాశిని వాడండి'
      },
      kn: {
        badge: 'ಹೆಚ್ಚು ತೇವಾಂಶ ಶಿಲೀಂಧ್ರ ಎಚ್ಚರಿಕೆ',
        head: `ವಾತಾವರಣದಲ್ಲಿ ಅಧಿಕ ತೇವಾಂಶ (${humidity}%): ಎಲೆ ರೋಗಾಣುಗಳ ಅಪಾಯ`,
        sum: `80% ಕ್ಕಿಂತ ಹೆಚ್ಚು ತೇವಾಂಶವು ಶಿಲೀಂಧ್ರ ಬೀಜಕಗಳು ಮೊಳಕೆಯೊಡೆಯಲು ಮತ್ತು ಎಲೆ ರೋಗ ಹರಡಲು ಅನುಕೂಲಕರವಾಗಿದೆ.`,
        threats: ['ಬೂದಿ ರೋಗ (Powdery Mildew)', 'ಮುಂಗಾರು ಅಂಗಮಾರಿ (Early Blight)', 'ಸರ್ಕೋಸ್ಪೊರಾ ಕಪ್ಪು ಚುಕ್ಕೆ', 'ತುಕ್ಕು ರೋಗ (Rust)'],
        actions: [
          'ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP (@ 2.5 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮಾ ಸಿಂಪಡಿಸಿ.',
          'ಎಲೆಗಳು ಹೆಚ್ಚು ಹೊತ್ತು ತೇವವಾಗಿರದಂತೆ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ.',
          'ಗಾಳಿ ಬೆಳಕು ಆಡಲು ಕೆಳಗಿನ ಒಣಗಿದ ಎಲೆಗಳನ್ನು ತೆಗೆಯಿರಿ.'
        ],
        spray: 'ಮುನ್ನೆಚ್ಚರಿಕೆ ಸಿಂಪಡಣೆ: ಅಂಟು ದ್ರವದೊಂದಿಗೆ ಸ್ಪರ್ಶ ಶಿಲೀಂಧ್ರನಾಶಕ ಬಳಸಿ'
      },
      ta: {
        badge: 'அதிக ஈரப்பதம் பூஞ்சை எச்சரிக்கை',
        head: `காற்றில் அதிக ஈரப்பதம் (${humidity}%): பூஞ்சை வித்துக்கள் பரவும் அபாயம்`,
        sum: `80% க்கும் அதிகமான ஈரப்பதம் சாம்பல் நோய் மற்றும் இலைப்புள்ளி நோய்களை வேகமாக உருவாக்கும்.`,
        threats: ['சாம்பல் நோய் (Powdery Mildew)', 'முன் பருவ இலைக்கருகல்', 'செர்கோஸ்போரா இலைப்புள்ளி', 'துரு நோய் (Rust)'],
        actions: [
          'முன்னெச்சரிக்கையாக மான்கோசெப் 75% WP (@ 2.5 கிராம்/லி) அல்லது டிரைக்கோடெர்மா விரிடி தெளிக்கவும்.',
          'மேல் தெளிப்பு பாசனத்தை தவிர்த்து சொட்டு நீர் பாசனம் பயன்படுத்தவும்.',
          'காற்று சுழற்சிக்காக அடிப்பகுதி காய்ந்த இலைகளை அப்புறப்படுத்தவும்.'
        ],
        spray: 'முன்னெச்சரிக்கை தெளிப்பு: ஒட்டும் திரவத்துடன் பூஞ்சைக் கொல்லி பயன்படுத்தவும்'
      },
      gu: {
        badge: 'વધુ ભેજ ફૂગ ચેતવણી',
        head: `હવામાં વધુ ભેજ (${humidity}%): પાન પર ફૂગના બીજાણુઓ ફૂલવાનો ભય`,
        sum: `80% થી વધુ ભેજ છારી રોગ અને પાન ટપકાં રોગ પેદા કરનાર ફૂગ માટે અનુકૂળ પરિસ્થિતિ બનાવે છે.`,
        threats: ['ભૂકી છારો (Powdery Mildew)', 'અગેતરો સુકારો (Early Blight)', 'સર્કોસ્પોરા ટપકાં', 'ગેરુ રોગ (Rust)'],
        actions: [
          'રોગ ફેલાય તે પહેલાં મેન્કોઝેબ 75% WP (@ 2.5 ગ્રામ/લીટર) અથવા ટ્રાઇકોડર્મા વિરીડીનો છંટકાવ કરવો.',
          'ફુવારા પદ્ધતિ ટાળો અને ટપક પદ્ધતિથી પિયત આપો જેથી પાંદડાં ભીના ન રહે.',
          'હવા-ઉજાસ માટે નીચેના સુકા પાંદડાઓની કાપણી કરો.'
        ],
        spray: 'અગમચેતી છંટકાવ: સ્ટીકર સાથે સંપર્ક ફૂગનાશક વાપરો'
      }
    };
    const tObj = texts[lang] || texts.en;
    return {
      hasWarning: true,
      severity: 'high',
      warningType: 'high_humidity',
      badgeLabel: tObj.badge,
      headline: tObj.head,
      summary: tObj.sum,
      pathogenThreats: tObj.threats,
      actionSteps: tObj.actions,
      sprayRecommendation: 'preventive_only',
      sprayAdviceText: tObj.spray
    };
  }

  if (isHighWind) {
    const texts: Record<SupportedLanguage, { badge: string; head: string; sum: string; threats: string[]; actions: string[]; spray: string }> = {
      en: {
        badge: 'HIGH WIND DRIFT ALERT',
        head: `Strong Winds (${windSpeed} km/h): Pesticide Drift & Evaporation Risk`,
        sum: `Wind speeds above 15 km/h cause chemical droplets to drift away from target leaves, contaminating adjacent crops and wasting dosage.`,
        threats: ['Drift onto sensitive crops', 'Uneven chemical coverage', 'Rapid spray droplet evaporation'],
        actions: [
          'Hold spray applications until wind speeds drop below 10-12 km/h (usually early morning 6-9 AM or late evening).',
          'If urgent, use low-drift air-induction nozzles and lower boom height.'
        ],
        spray: 'Hold Spray: High Drift Risk'
      },
      hi: {
        badge: 'तेज हवा बहाव चेतावनी',
        head: `तेज हवाएं (${windSpeed} किमी/घंटा): दवा उड़ने का खतरा`,
        sum: `15 किमी/घंटे से तेज हवा में छिड़काव करने से दवा पौधों पर नहीं टिकती और दूसरी फसलों में उड़ जाती है।`,
        threats: ['दवा का दूसरी फसलों पर उड़ना', 'पत्तियों पर असमान छिड़काव', 'दवा का तुरंत सूखना'],
        actions: [
          'हवा की गति 10-12 किमी/घंटा से कम होने तक (सुबह 6-9 बजे या शाम को) छिड़काव रोकें।',
          'नोजल को पौधों के करीब रखकर कम दबाव में स्प्रे करें।'
        ],
        spray: 'छिड़काव रोकें: हवा से दवा उड़ने का खतरा'
      },
      te: {
        badge: 'ఎక్కువ గాలి డ్రిఫ్ట్ హెచ్చరిక',
        head: `వేగవంతమైన గాలులు (${windSpeed} కిమీ/గం): మందు గాలికి కొట్టుకుపోయే ప్రమాదం`,
        sum: `గాలి వేగం ఎక్కువగా ఉన్నప్పుడు మందు ఆకులపై పడకుండా పక్క పొలాల్లోకి ఎగిరిపోయి నష్టం జరుగుతుంది.`,
        threats: ['పక్క పంటలకు నష్టం', 'సరిగ్గా మందు పడకపోవడం', 'మందు వ్యర్థం'],
        actions: [
          'గాలి వేగం తగ్గే వరకు (ఉదయం లేదా సాయంత్రం) పిచికారీ ఆపండి.',
          'నాజిల్స్‌ను పైరుకు దగ్గరగా ఉంచి పిచికారీ చేయండి.'
        ],
        spray: 'పిచికారీ వాయిదా: ఎక్కువ గాలి'
      },
      kn: {
        badge: 'ಹೆಚ್ಚು ಗಾಳಿ ಎಚ್ಚರಿಕೆ',
        head: `ವೇಗದ ಗಾಳಿ (${windSpeed} ಕಿಮೀ/ಗಂಟೆ): ಔಷಧಿ ತೂರಿಹೋಗುವ ಅಪಾಯ`,
        sum: `ಗಾಳಿಯ ವೇಗ ಹೆಚ್ಚಿರುವಾಗ ಸಿಂಪಡಿಸಿದರೆ ಔಷಧಿ ಪಕ್ಕದ ಹೊಲಗಳಿಗೆ ಹಾರಿಹೋಗಿ ವ್ಯರ್ಥವಾಗುತ್ತದೆ.`,
        threats: ['ಪಕ್ಕದ ಬೆಳೆಗಳಿಗೆ ಹಾನಿ', 'ಅಸಮರ್ಪಕ ಸಿಂಪರಣೆ'],
        actions: [
          'ಗಾಳಿ ಶಾಂತವಾಗುವವರೆಗೆ (ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ) ಸಿಂಪಡಣೆ ನಿಲ್ಲಿಸಿ.'
        ],
        spray: 'ಸಿಂಪಡಿಸಬೇಡಿ: ಗಾಳಿ ಜಾಸ್ತಿ ಇದೆ'
      },
      ta: {
        badge: 'அதிவேக காற்று எச்சரிக்கை',
        head: `பலத்த காற்று (${windSpeed} கிமீ/மணி): மருந்து காற்றில் அடித்துச் செல்லப்படும்`,
        sum: `அதிக காற்றில் தெளிக்கும் போது மருந்து இலைகளில் படியாமல் வீணாகும்.`,
        threats: ['பக்கத்து பயிர்களுக்கு பாதிப்பு', 'சமமற்ற தெளிப்பு'],
        actions: [
          'காற்று தணியும் வரை (அதிகாலை அல்லது மாலை) மருந்து தெளிப்பதை ஒத்திவைக்கவும்.'
        ],
        spray: 'தெளிக்க வேண்டாம்: காற்று அதிகம்'
      },
      gu: {
        badge: 'ઝડપી પવન ચેતવણી',
        head: `જોરદાર પવન (${windSpeed} કિમી/કલાક): દવા ઉડી જવાનો ભય`,
        sum: `વધુ પવનમાં છંટકાવ કરવાથી દવા બીજા ખેતરમાં ઉડી જાય છે અને પાક પર ટકતી નથી.`,
        threats: ['બીજા પાકને નુકસાન', 'દવાનો વ્યય'],
        actions: [
          'પવન ધીમો પડે ત્યાં સુધી (સવારે અથવા સાંજે) છંટકાવ મુલતવી રાખો.'
        ],
        spray: 'છંટકાવ ટાળો: ઝડપી પવન'
      }
    };
    const tObj = texts[lang] || texts.en;
    return {
      hasWarning: true,
      severity: 'moderate',
      warningType: 'high_wind',
      badgeLabel: tObj.badge,
      headline: tObj.head,
      summary: tObj.sum,
      pathogenThreats: tObj.threats,
      actionSteps: tObj.actions,
      sprayRecommendation: 'hold_spray',
      sprayAdviceText: tObj.spray
    };
  }

  // Low / Normal conditions
  const normalTexts: Record<SupportedLanguage, { badge: string; head: string; sum: string; threats: string[]; actions: string[]; spray: string }> = {
    en: {
      badge: 'OPTIMAL CONDITIONS • LOW DISEASE RISK',
      head: 'Favorable Weather: Normal Microclimate',
      sum: `Current humidity (${humidity}%) and dry foliage present standard disease incubation levels. Ideal window for preventive maintenance or calibrated spraying.`,
      threats: ['Normal seasonal scouting recommended'],
      actions: ['Inspect crop foliage during morning scouting.', 'Ensure scheduled nutrient and irrigation practices.'],
      spray: 'Optimal Window: Good Coverage & Low Drift'
    },
    hi: {
      badge: 'अनुकूल मौसम • सामान्य रोग स्तर',
      head: 'मौसम अनुकूल: फसल स्वास्थ्य सामान्य',
      sum: `वर्तमान में नमी (${humidity}%) और सूखा मौसम होने से फफूंद का खतरा कम है। छिड़काव के लिए उपयुक्त समय।`,
      threats: ['नियमित साप्ताहिक फसल निरीक्षण करें'],
      actions: ['सुबह खेत का भ्रमण कर पत्तियों की जांच करें।', 'योजनानुसार खाद व पानी दें।'],
      spray: 'छिड़काव के लिए उत्तम समय'
    },
    te: {
      badge: 'అనుకూల వాతావరణం • తక్కువ తెగుళ్ల ముప్పు',
      head: 'వాతావరణం అనుకూలంగా ఉంది',
      sum: `తేమ (${humidity}%) సాధారణంగా ఉంది మరియు వర్షం లేదు. మందులు పిచికారీ చేయడానికి మంచి సమయం.`,
      threats: ['సాధారణ పంట పర్యవేక్షణ సరిపోతుంది'],
      actions: ['ఉదయం పూట ఆకులను పరిశీలించండి.', 'సమయానికి నీటి తడులు అందించండి.'],
      spray: 'పిచికారీకి అనుకూల సమయం'
    },
    kn: {
      badge: 'ಉತ್ತಮ ಹವಾಮಾನ • ಕಡಿಮೆ ರೋಗ ಅಪಾಯ',
      head: 'ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ',
      sum: `ತೇವಾಂಶ (${humidity}%) ಸಹಜವಾಗಿದೆ. ಔಷಧಿ ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಸಮಯ.`,
      threats: ['ಸಾಮಾನ್ಯ ಬೆಳೆ ತಪಾಸಣೆ'],
      actions: ['ಬೆಳಿಗ್ಗೆ ಹೊಲಕ್ಕೆ ಹೋಗಿ ಎಲೆಗಳನ್ನು ಗಮನಿಸಿ.'],
      spray: 'ಸಿಂಪಡಣೆಗೆ ಸಕಾಲ'
    },
    ta: {
      badge: 'சாதகமான வானிலை • குறைந்த நோய் அபாயம்',
      head: 'வானிலை சாதகமாக உள்ளது',
      sum: `ஈரப்பதம் (${humidity}%) சீராக உள்ளது. மருந்து தெளிக்க உகந்த நேரம்.`,
      threats: ['வழக்கமான கள ஆய்வு'],
      actions: ['காலையில் பயிர்களை பார்வையிடவும்.'],
      spray: 'மருந்து தெளிக்க சிறந்த நேரம்'
    },
    gu: {
      badge: 'અનુકૂળ હવામાન • ઓછો રોગ ભય',
      head: 'હવામાન ખેતી માટે ઉત્તમ છે',
      sum: `ભેજનું પ્રમાણ (${humidity}%) સામાન્ય છે. છંટકાવ માટે ઉત્તમ સમય.`,
      threats: ['નિયમિત પાક તપાસ'],
      actions: ['સવારના સમયે ખેતરમાં પાંદડા તપાસો.'],
      spray: 'છંટકાવ માટે ઉત્તમ સમય'
    }
  };
  const norm = normalTexts[lang] || normalTexts.en;

  return {
    hasWarning: false,
    severity: 'low',
    warningType: null,
    badgeLabel: norm.badge,
    headline: norm.head,
    summary: norm.sum,
    pathogenThreats: norm.threats,
    actionSteps: norm.actions,
    sprayRecommendation: 'optimal',
    sprayAdviceText: norm.spray
  };
}

// OpenWeatherMap API call with seamless fallback
export async function fetchLiveWeather(
  lat: number,
  lon: number,
  locationLabel: string,
  lang: SupportedLanguage,
  simulateMode?: 'humidity' | 'rain' | 'wind'
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

  // 1. Try server-side OpenWeatherMap API proxy
  try {
    const simParam = simulateMode ? `&simulate=${simulateMode}` : '';
    const owmRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}${simParam}`);
    if (owmRes.ok) {
      const owmData = await owmRes.json();
      if (owmData && owmData.success && owmData.data) {
        const d = owmData.data;
        const temp = Math.round(d.temperature);
        const humidity = Math.round(d.humidity);
        const wind = Math.round(d.windSpeed * 10) / 10;
        const rainAmount = typeof d.rainAmount === 'number' ? Math.round(d.rainAmount * 10) / 10 : 0;
        const weatherMainStr = (d.weatherMain || '').toLowerCase();
        const isRain = weatherMainStr.includes('rain') || weatherMainStr.includes('drizzle') || weatherMainStr.includes('thunder') || rainAmount > 0;

        let sprayCondition: RealtimeWeather['sprayCondition'] = 'optimal';
        if (isRain) {
          sprayCondition = 'rain_alert';
        } else if (wind > 14) {
          sprayCondition = 'wind_alert';
        } else if (humidity >= 80) {
          sprayCondition = 'humidity_alert';
        }

        const condKey = isRain ? 'rain' : weatherMainStr.includes('cloud') ? 'cloudy' : 'clear';
        const diseaseWarning = buildDiseaseWarning(humidity, rainAmount, isRain, wind, temp, lang);

        const hourlyForecast: HourlyWeatherPoint[] = Array.isArray(d.hourlyForecast) && d.hourlyForecast.length > 0
          ? d.hourlyForecast
          : generateFallbackHourly(temp, humidity, isRain);

        return {
          temperature: temp,
          humidity,
          windSpeed: wind,
          soilMoisture: Math.round(Math.min(100, humidity * 0.52 + (rainAmount > 0 ? 25 : 0))),
          apparentTemperature: Math.round(d.apparentTemperature ?? temp),
          weatherCode: d.weatherId || 800,
          conditionText: dict[condKey] || d.description || dict.clear,
          sprayCondition,
          sprayConditionText: dict[sprayCondition] || dict.optimal,
          locationName: d.cityName || locationLabel,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: (owmData.source as any) || 'OpenWeatherMap',
          rainAmount,
          diseaseWarning,
          hourlyForecast
        };
      }
    }
  } catch (_e) {
    // Continue to standard meteorological fallback
  }

  // 2. High-precision meteorological satellite feed (Open-Meteo)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m&forecast_days=2&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    const current = data.current || {};
    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 70);
    const wind = Math.round((current.wind_speed_10m ?? 6) * 10) / 10;
    const rain = Math.round(((current.precipitation ?? 0) + (current.rain ?? 0)) * 10) / 10;
    const weatherCode = current.weather_code ?? 0;
    const isRain = rain > 0.1 || weatherCode >= 51;

    let soilMoisture = 35;
    if (data.hourly?.soil_moisture_0_to_1cm && Array.isArray(data.hourly.soil_moisture_0_to_1cm)) {
      const val = data.hourly.soil_moisture_0_to_1cm[0];
      if (typeof val === 'number') {
        soilMoisture = Math.round(Math.min(100, Math.max(10, val * 180)));
      }
    } else {
      soilMoisture = Math.round(humidity * 0.5 + (isRain ? 30 : 0));
    }

    let sprayCondition: RealtimeWeather['sprayCondition'] = 'optimal';
    if (isRain) {
      sprayCondition = 'rain_alert';
    } else if (wind > 14) {
      sprayCondition = 'wind_alert';
    } else if (humidity >= 80) {
      sprayCondition = 'humidity_alert';
    }

    const condKey = isRain ? 'rain' : weatherCode >= 3 ? 'cloudy' : 'clear';
    const diseaseWarning = buildDiseaseWarning(humidity, rain, isRain, wind, temp, lang);

    const hourlyForecast: HourlyWeatherPoint[] = [];
    if (data.hourly?.temperature_2m && Array.isArray(data.hourly.temperature_2m)) {
      const nowH = new Date().getHours();
      for (let i = 0; i < 24; i++) {
        const h = (nowH + i) % 24;
        const tVal = Math.round((data.hourly.temperature_2m[i] ?? temp) * 10) / 10;
        const hVal = Math.round(data.hourly.relative_humidity_2m?.[i] ?? humidity);
        const pVal = Math.round((data.hourly.precipitation?.[i] ?? 0) * 10) / 10;
        const pProb = Math.round(data.hourly.precipitation_probability?.[i] ?? 0);
        hourlyForecast.push({
          time: `${String(h).padStart(2, '0')}:00`,
          hour: h,
          temperature: tVal,
          humidity: hVal,
          rainProbability: pProb,
          rainAmount: pVal,
          isOptimalSpray: pVal === 0 && hVal < 80 && tVal >= 18 && tVal <= 32 && (h >= 6 && h <= 10 || h >= 16 && h <= 19)
        });
      }
    }

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
      source: 'Open-Meteo',
      rainAmount: rain,
      diseaseWarning,
      hourlyForecast: hourlyForecast.length > 0 ? hourlyForecast : generateFallbackHourly(temp, humidity, isRain)
    };
  } catch (_e) {
    // 3. Graceful fallback for offline fields
    const defaultDiseaseWarning = buildDiseaseWarning(68, 0, false, 6.5, 28, lang);
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
      source: 'Fallback',
      rainAmount: 0,
      diseaseWarning: defaultDiseaseWarning,
      hourlyForecast: generateFallbackHourly(28, 68, false)
    };
  }
}

// Fallback generator for 24h diurnal curve
export function generateFallbackHourly(baseTemp: number, baseHumidity: number, isRain: boolean): HourlyWeatherPoint[] {
  const currentHour = new Date().getHours();
  const list: HourlyWeatherPoint[] = [];
  for (let i = 0; i < 24; i++) {
    const h = (currentHour + i) % 24;
    const diurnalFactor = Math.sin(((h - 8) / 12) * Math.PI);
    const temp = Math.round((baseTemp + diurnalFactor * 4.5) * 10) / 10;
    let humidity = Math.round(baseHumidity - diurnalFactor * 16);
    if (isRain && i >= 2 && i <= 8) {
      humidity = Math.min(98, Math.max(88, humidity + 15));
    }
    humidity = Math.min(99, Math.max(30, humidity));
    const rainAmount = isRain && i >= 2 && i <= 8 ? 2.5 : 0;
    const isOptimalSpray = rainAmount === 0 && humidity < 80 && temp >= 18 && temp <= 32 && (h >= 6 && h <= 10 || h >= 16 && h <= 19);

    list.push({
      time: `${String(h).padStart(2, '0')}:00`,
      hour: h,
      temperature: temp,
      humidity,
      rainProbability: isRain ? 80 : (humidity > 80 ? 30 : 5),
      rainAmount,
      isOptimalSpray
    });
  }
  return list;
}
