import { SupportedLanguage } from '../types/farm';

export interface CropNutrientProfile {
  id: string;
  name: Record<SupportedLanguage, string>;
  category: 'cereal' | 'commercial' | 'vegetable' | 'pulse' | 'oilseed';
  icon: string;
  // Recommended Dose of Fertilizers (RDF) in kg/acre
  rdf: {
    n: number;
    p: number;
    k: number;
  };
  // Split schedule (percentages of N, P, K per stage)
  stages: {
    stageName: Record<SupportedLanguage, string>;
    timing: Record<SupportedLanguage, string>;
    nPercent: number;
    pPercent: number;
    kPercent: number;
    notes?: Record<SupportedLanguage, string>;
  }[];
  micronutrients?: Record<SupportedLanguage, string>;
  organicRequirement?: Record<SupportedLanguage, string>;
}

export const CROP_NUTRIENT_PROFILES: CropNutrientProfile[] = [
  {
    id: 'paddy',
    name: {
      en: 'Paddy / Rice',
      hi: 'धान / चावल',
      te: 'వరి (Paddy)',
      kn: 'ಭತ್ತ (Paddy)',
      ta: 'நெல் (Paddy)',
      gu: 'ડાંગર / ચોખા (Paddy)'
    },
    category: 'cereal',
    icon: '🌾',
    rdf: { n: 48, p: 24, k: 20 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय (बेसल)',
          te: 'నాట్లు వేసేటప్పుడు (బాసల్ డోస్)',
          kn: 'ನಾಟಿ ಮಾಡುವಾಗ (ಬೇಸಲ್)',
          ta: 'அடி உரம் (Basal)',
          gu: 'પાયાનું ખાતર (Basal)'
        },
        timing: {
          en: 'At transplanting / final puddling',
          hi: 'अंतिम जुताई या रोपाई के समय',
          te: 'నాట్లు వేసే సమయములో',
          kn: 'ನಾಟಿ ಮಾಡುವ ಸಮಯದಲ್ಲಿ',
          ta: 'நடவு செய்யும் போது',
          gu: 'રોપણી કે અંતિમ ખેડ વખતે'
        },
        nPercent: 25,
        pPercent: 100,
        kPercent: 50,
        notes: {
          en: 'Apply entire DAP and 50% MOP + 1 bag Urea.',
          hi: 'पूरा डीएपी और 50% एमओपी + यूरिया का पहला भाग डालें।',
          te: 'మొత్తం డీఏపీ మరియు 50% పొటాష్ వేయండి.',
          kn: 'ಪೂರ್ಣ ಡಿಎಪಿ ಮತ್ತು 50% ಪೊಟ್ಯಾಶ್ ಹಾಕಿ.',
          ta: 'முழு டிஏபி மற்றும் 50% பொட்டாஷ் இடவும்.',
          gu: 'સંપૂર્ણ ડીએપી અને 50% એમઓપી આપવું.'
        }
      },
      {
        stageName: {
          en: 'Active Tillering (1st Top Dress)',
          hi: 'कल्ले फूटते समय (पहला छिड़काव)',
          te: 'పిలకలు తొడిగే దశ (మొదటి పైపాటు)',
          kn: 'ಕವಲು ಒಡೆಯುವ ಹಂತ',
          ta: 'தூர்கட்டும் பருவம்',
          gu: 'ફૂટ આવવાના સમયે'
        },
        timing: {
          en: '20-25 days after transplanting (DAT)',
          hi: 'रोपाई के 20-25 दिन बाद',
          te: 'నాటిన 20-25 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 20-25 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 20-25 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 20-25 દિવસે'
        },
        nPercent: 50,
        pPercent: 0,
        kPercent: 0,
        notes: {
          en: 'Apply Urea in thin water sheet. Add Zinc Sulphate if not given basal.',
          hi: 'यूरिया का छिड़काव खेत में कम पानी होने पर करें।',
          te: 'మడిలో నీరు తక్కువగా ఉన్నప్పుడు యూరియా వేయండి.',
          kn: 'ಹೊಲದಲ್ಲಿ ಕಡಿಮೆ ನೀರು ಇರುವಾಗ ಯೂರಿಯಾ ಹಾಕಿ.',
          ta: 'குறைந்த நீர் இருக்கும் போது யூரியா இடவும்.',
          gu: 'પાણીનું સ્તર ઓછું હોય ત્યારે યુરિયા આપવું.'
        }
      },
      {
        stageName: {
          en: 'Panicle Initiation (2nd Top Dress)',
          hi: 'बालियां बनते समय (दूसरा छिड़काव)',
          te: 'చిరుపొట్ట దశ (రెండవ పైపాటు)',
          kn: 'ತೆನೆ ಕಟ್ಟುವ ಹಂತ',
          ta: 'கதிர் உருவாகும் பருவம்',
          gu: 'કણસલા આવવાના સમયે'
        },
        timing: {
          en: '45-50 days after transplanting',
          hi: 'रोपाई के 45-50 दिन बाद',
          te: 'నాటిన 45-50 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 45-50 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 45-50 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 45-50 દિવસે'
        },
        nPercent: 25,
        pPercent: 0,
        kPercent: 50,
        notes: {
          en: 'Final top dressing of Urea + remaining 50% MOP for grain filling.',
          hi: 'अंतिम यूरिया और शेष 50% पोटाश दानों के भराव के लिए डालें।',
          te: 'గింజ బరువు పెరగడానికి మిగిలిన యూరియా మరియు పొటాష్ వేయండి.',
          kn: 'ಕಾಳು ಗಟ್ಟಿಯಾಗಲು ಉಳಿದ ಯೂರಿಯಾ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ಹಾಕಿ.',
          ta: 'மணி பிடிக்க மீதமுள்ள யூரியா மற்றும் பொட்டாஷ் இடவும்.',
          gu: 'દાણા ભરાવા માટે બાકીનું યુરિયા અને પોટાશ આપવું.'
        }
      }
    ],
    micronutrients: {
      en: 'Zinc Sulphate (21% Zn) @ 10 kg/acre at transplanting.',
      hi: 'जिंक सल्फेट (21%) 10 किग्रा/एकड़ रोपाई के समय।',
      te: 'జింక్ సల్ఫేట్ 10 కిలోలు/ఎకరాకు నాట్లు వేసేటప్పుడు.',
      kn: 'ಜಿಂಕ್ ಸಲ್ಫೇಟ್ 10 ಕೆಜಿ/ಎಕರೆಗೆ ನಾಟಿ ಸಮಯದಲ್ಲಿ.',
      ta: 'துத்தநாக சல்பேட் 10 கிலோ/ஏக்கர் நடவு சமயத்தில்.',
      gu: 'ઝીંક સલ્ફેટ (21%) 10 કિલો/એકર રોપણી વખતે.'
    },
    organicRequirement: {
      en: 'Well-decomposed Farmyard Manure (FYM): 3-4 tonnes/acre.',
      hi: 'गोबर की सड़ी खाद: 3-4 टन प्रति एकड़।',
      te: 'బాగా చివికిన పశువుల ఎరువు: 3-4 టన్నులు/ఎకరాకు.',
      kn: 'ಕೊಳೆತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ: 3-4 ಟನ್/ಎಕರೆಗೆ.',
      ta: 'மக்கிய தொழு உரம்: 3-4 டன்/ஏக்கர்.',
      gu: 'સારું કોહવાયેલું દેશી છાણીયું ખાતર: 3-4 ટન પ્રતિ એકર.'
    }
  },
  {
    id: 'cotton',
    name: {
      en: 'Cotton',
      hi: 'कपास (Cotton)',
      te: 'పత్తి (Cotton)',
      kn: 'ಹತ್ತಿ (Cotton)',
      ta: 'பருத்தி (Cotton)',
      gu: 'કપાસ (Cotton)'
    },
    category: 'commercial',
    icon: '🌱',
    rdf: { n: 50, p: 25, k: 25 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయములో',
          kn: 'ಬಿತ್ತನೆ ಮಾಡುವಾಗ',
          ta: 'விதைக்கும் போது',
          gu: 'વાવણી સમયે'
        },
        timing: {
          en: 'At sowing / seed placement',
          hi: 'बीज बोने के समय',
          te: 'విత్తనాలు వేసే సమయంలో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'விதைப்பின் போது',
          gu: 'વાવણીના સમયે'
        },
        nPercent: 20,
        pPercent: 100,
        kPercent: 33,
        notes: {
          en: 'Place 5-7 cm away from seed row to avoid fertilizer burn.',
          hi: 'बीज से 5-7 सेमी की दूरी पर डालें।',
          te: 'విత్తనానికి 5-7 సెం.మీ దూరంలో వేయండి.',
          kn: 'ಬೀಜದಿಂದ 5-7 ಸೆಂ.ಮೀ ದೂರದಲ್ಲಿ ಇಡಿ.',
          ta: 'விதைக்கு 5-7 செ.மீ தள்ளி இடவும்.',
          gu: 'બીજથી 5-7 સેમી દૂર ખાતર મૂકવું.'
        }
      },
      {
        stageName: {
          en: 'Square Formation (1st Top Dress)',
          hi: 'कलियां (स्क्वायर) बनते समय',
          te: 'మొగ్గ తొడిగే దశ',
          kn: 'ಮೊಗ್ಗು ಬಿಡುವ ಹಂತ',
          ta: 'மொட்டு விடும் பருவம்',
          gu: 'ચાપવા આવવાની અવસ્થા'
        },
        timing: {
          en: '30-35 days after sowing (DAS)',
          hi: 'बुवाई के 30-35 दिन बाद',
          te: 'విత్తిన 30-35 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 30-35 ದಿನಗಳ ನಂತರ',
          ta: 'விதைத்த 30-35 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 30-35 દિવસે'
        },
        nPercent: 40,
        pPercent: 0,
        kPercent: 33,
        notes: {
          en: 'Side-dress Urea and MOP, followed by earthing-up.',
          hi: 'यूरिया और पोटाश पौधों की जड़ के पास डालकर मिट्टी चढ़ाएं।',
          te: 'మొక్క మొదలుకు పక్కగా యూరియా, పొటాష్ వేసి మట్టి ఎగదోయండి.',
          kn: 'ಗಿಡದ ಬುಡಕ್ಕೆ ಯೂರಿಯಾ ಹಾಕಿ ಮಣ್ಣು ಏರಿಸಿ.',
          ta: 'செடியின் அருகில் உரமிட்டு மண் அணைக்கவும்.',
          gu: 'છોડની બાજુમાં યુરિયા આપી માટી ચડાવવી.'
        }
      },
      {
        stageName: {
          en: 'Boll Development (2nd Top Dress)',
          hi: 'टिंडे (गूलर) बनते समय',
          te: 'కాయలు ఏర్పడే దశ',
          kn: 'ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ',
          ta: 'காய் பிடிக்கும் பருவம்',
          gu: 'ઝીંડવા ભરાવવાની અવસ્થા'
        },
        timing: {
          en: '60-70 days after sowing',
          hi: 'बुवाई के 60-70 दिन बाद',
          te: 'విత్తిన 60-70 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 60-70 ದಿನಗಳ ನಂತರ',
          ta: 'விதைத்த 60-70 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 60-70 દિવસે'
        },
        nPercent: 40,
        pPercent: 0,
        kPercent: 34,
        notes: {
          en: 'Ensures good boll weight, lint quality, and prevents dropping.',
          hi: 'टिंडे के अच्छे आकार और वजन के लिए।',
          te: 'కాయలు రాలకుండా మరియు మంచి బరువుకు తోడ్పడుతుంది.',
          kn: 'ಉತ್ತಮ ಇಳುವರಿ ಮತ್ತು ಕಾಯಿ ತೂಕಕ್ಕಾಗಿ.',
          ta: 'காய் எடை கூடவும் கொட்டுவதை தடுக்கவும்.',
          gu: 'ઝીંડવાનો વિકાસ અને રૂની ઉત્તમ ગુણવત્તા માટે.'
        }
      }
    ],
    micronutrients: {
      en: 'Magnesium Sulphate (MgSO4): 10 kg/acre + Boron 0.2% spray at flowering.',
      hi: 'मैग्नीशियम सल्फेट: 10 किग्रा/एकड़ + बोरॉन छिड़काव।',
      te: 'మెగ్నీషియం సల్ఫేట్ 10 కిలోలు/ఎకరాకు + బోరాన్ పిచికారీ.',
      kn: 'ಮೆಗ್ನೀಸಿಯಮ್ ಸಲ್ಫೇಟ್ 10 ಕೆಜಿ/ಎಕರೆಗೆ + ಬೋರಾನ್ ಸಿಂಪಡಣೆ.',
      ta: 'மெக்னீசியம் சல்பேட் 10 கிலோ/ஏக்கர் + போரான் தெளிப்பு.',
      gu: 'મેગ્નેશિયમ સલ્ફેટ 10 કિલો/એકર + બોરોનનો છંટકાવ.'
    },
    organicRequirement: {
      en: 'FYM / Compost: 4 tonnes/acre before sowing.',
      hi: 'गोबर की खाद: 4 टन प्रति एकड़।',
      te: 'పశువుల ఎరువు: 4 టన్నులు/ఎకరాకు.',
      kn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ: 4 ಟನ್/ಎಕರೆಗೆ.',
      ta: 'தொழு உரம்: 4 டன்/ஏக்கர்.',
      gu: 'છાણીયું ખાતર: 4 ટન/એકર.'
    }
  },
  {
    id: 'chilli',
    name: {
      en: 'Chilli / Pepper',
      hi: 'मिर्च (Chilli)',
      te: 'మిరప (Chilli)',
      kn: 'ಮೆಣಸಿನಕಾಯಿ (Chilli)',
      ta: 'மிளகாய் (Chilli)',
      gu: 'મરચી (Chilli)'
    },
    category: 'vegetable',
    icon: '🌶️',
    rdf: { n: 60, p: 30, k: 35 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'रोपाई के समय',
          te: 'నాట్లు వేసేటప్పుడు',
          kn: 'ನಾಟಿ ಮಾಡುವಾಗ',
          ta: 'அடி உரம்',
          gu: 'પાયામાં'
        },
        timing: {
          en: 'At bed preparation / transplanting',
          hi: 'रोपाई से पहले खेत की तैयारी में',
          te: 'మడులు తయారుచేసే సమయంలో',
          kn: 'ನಾಟಿ ಸಮಯದಲ್ಲಿ',
          ta: 'நடவு செய்யும் போது',
          gu: 'રોપણી કે ક્યારા બનાવતી વખતે'
        },
        nPercent: 25,
        pPercent: 100,
        kPercent: 33,
        notes: {
          en: 'Apply entire DAP and 1/3rd MOP.',
          hi: 'पूरा डीएपी और एक तिहाई पोटाश।',
          te: 'మొత్తం డీఏపీ మరియు మూడవ వంతు పొటాష్.',
          kn: 'ಪೂರ್ಣ ಡಿಎಪಿ ಮತ್ತು 1/3 ಪೊಟ್ಯಾಶ್.',
          ta: 'முழு டிஏபி மற்றும் 1/3 பொட்டாஷ்.',
          gu: 'સંપૂર્ણ ડીએપી અને ત્રીજા ભાગનું પોટાશ.'
        }
      },
      {
        stageName: {
          en: 'Vegetative Growth (1st Top Dress)',
          hi: 'वानस्पतिक वृद्धि (पहला भाग)',
          te: 'శాకీయ ఎదుగుదల దశ',
          kn: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
          ta: 'வளர்ச்சி பருவம்',
          gu: 'વાનસ્પતિક વૃદ્ધિ સમયે'
        },
        timing: {
          en: '30 days after transplanting',
          hi: 'रोपाई के 30 दिन बाद',
          te: 'నాటిన 30 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 30 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 30 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 30 દિવસે'
        },
        nPercent: 25,
        pPercent: 0,
        kPercent: 33
      },
      {
        stageName: {
          en: 'Flowering & First Picking',
          hi: 'फूल व पहली तुड़ाई',
          te: 'పూత మరియు మొదటి కోత దశ',
          kn: 'ಹೂವು ಮತ್ತು ಮೊದಲ ಕೊಯ್ಲು',
          ta: 'பூக்கும் பருவம்',
          gu: 'ફૂલ અને પ્રથમ વીણી સમયે'
        },
        timing: {
          en: '60 days after transplanting',
          hi: 'रोपाई के 60 दिन बाद',
          te: 'నాటిన 60 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 60 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 60 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 60 દિવસે'
        },
        nPercent: 25,
        pPercent: 0,
        kPercent: 34
      },
      {
        stageName: {
          en: 'Peak Harvest',
          hi: 'मुख्य तुड़ाई के समय',
          te: 'ప్రధాన కోతల దశ',
          kn: 'ಮುಖ್ಯ ಕೊಯ್ಲು ಹಂತ',
          ta: 'அறுவடை பருவம்',
          gu: 'મુખ્ય વીણી સમયે'
        },
        timing: {
          en: '90 days after transplanting',
          hi: 'रोपाई के 90 दिन बाद',
          te: 'నాటిన 90 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 90 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 90 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 90 દિવસે'
        },
        nPercent: 25,
        pPercent: 0,
        kPercent: 0
      }
    ],
    micronutrients: {
      en: 'Foliar Calcium Nitrate + Boron @ 2g/L to prevent fruit blossom-end rot.',
      hi: 'कैल्शियम नाइट्रेट + बोरॉन फल सड़न रोकने के लिए।',
      te: 'కాయ కుళ్ళు నివారణకు క్యాల్షియం నైట్రేట్ + బోరాన్.',
      kn: 'ಹಣ್ಣು ಕೊಳೆ ತಡೆಯಲು ಕ್ಯಾಲ್ಸಿಯಂ ನೈಟ್ರೇಟ್ + ಬೋರಾನ್.',
      ta: 'காய் அழுகல் தடுக்க கால்சியம் நைட்ரேட் + போரான்.',
      gu: 'ફળનો સડો અટકાવવા કેલ્શિયમ નાઈટ્રેટ + બોરોન.'
    },
    organicRequirement: {
      en: 'Vermicompost: 1.5 tonnes or Neem Cake: 150 kg/acre.',
      hi: 'वर्मीकम्पोस्ट: 1.5 टन या नीम खली: 150 किग्रा/एकड़।',
      te: 'వర్మీ కంపోస్ట్ 1.5 టన్నులు లేదా వేప పిండి 150 కిలోలు.',
      kn: 'ಎರೆಹುಳು ಗೊಬ್ಬರ 1.5 ಟನ್ ಅಥವಾ ಬೇವಿನ ಹಿಂಡಿ 150 ಕೆಜಿ.',
      ta: 'மண்புழு உரம் 1.5 டன் அல்லது வேப்பம் புண்ணாக்கு 150 கிலோ.',
      gu: 'અળસિયાનું ખાતર 1.5 ટન અથવા લીંબોળીનો ખોળ 150 કિલો.'
    }
  },
  {
    id: 'maize',
    name: {
      en: 'Maize / Corn',
      hi: 'मक्का (Maize)',
      te: 'మొక్కజొన్న (Maize)',
      kn: 'ಮೆಕ್ಕೆಜೋಳ (Maize)',
      ta: 'மக்காச்சோளம் (Maize)',
      gu: 'મકાઈ (Maize)'
    },
    category: 'cereal',
    icon: '🌽',
    rdf: { n: 48, p: 24, k: 20 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయములో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'அடி உரம்',
          gu: 'પાયામાં'
        },
        timing: {
          en: 'At sowing in furrows',
          hi: 'कूड़ों में बुवाई के समय',
          te: 'సాలులలో విత్తే సమయంలో',
          kn: 'ಬಿತ್ತನೆ ಸಾಲಿನಲ್ಲಿ',
          ta: 'விதைக்கும் போது',
          gu: 'વાવણી વખતે'
        },
        nPercent: 25,
        pPercent: 100,
        kPercent: 50
      },
      {
        stageName: {
          en: 'Knee-High Stage',
          hi: 'घुटने की ऊंचाई पर',
          te: 'మోకాలు ఎత్తు దశ',
          kn: 'ಮೊಣಕಾಲು ಎತ್ತರ ಹಂತ',
          ta: 'முழங்கால் அளவு பருவம்',
          gu: 'ઢીંચણ સમાણી ઊંચાઈએ'
        },
        timing: {
          en: '25-30 days after sowing',
          hi: 'बुवाई के 25-30 दिन बाद',
          te: 'విత్తిన 25-30 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 25-30 ದಿನಗಳ ನಂತರ',
          ta: 'விதைத்த 25-30 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 25-30 દિવસે'
        },
        nPercent: 50,
        pPercent: 0,
        kPercent: 0
      },
      {
        stageName: {
          en: 'Tasseling & Silking',
          hi: 'मंजरी व भुट्टा बनते समय',
          te: 'కంకి పాలు పోసుకునే దశ',
          kn: 'ತೆನೆ ಮೂಡುವ ಹಂತ',
          ta: 'பூக்கும் பருவம்',
          gu: 'ચોગ અને ડોડા ભરાવવાની અવસ્થા'
        },
        timing: {
          en: '45-50 days after sowing',
          hi: 'बुवाई के 45-50 दिन बाद',
          te: 'విత్తిన 45-50 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 45-50 ದಿನಗಳ ನಂತರ',
          ta: 'விதைத்த 45-50 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 45-50 દિવસે'
        },
        nPercent: 25,
        pPercent: 0,
        kPercent: 50
      }
    ],
    micronutrients: {
      en: 'Zinc Sulphate: 10 kg/acre basal application.',
      hi: 'जिंक सल्फेट: 10 किग्रा/एकड़।',
      te: 'జింక్ సల్ఫేట్ 10 కిలోలు/ఎకరాకు.',
      kn: 'ಜಿಂಕ್ ಸಲ್ಫೇಟ್ 10 ಕೆಜಿ/ಎಕರೆಗೆ.',
      ta: 'துத்தநாக சல்பேட் 10 கிலோ/ஏக்கர்.',
      gu: 'ઝીંક સલ્ફેટ 10 કિલો/એકર.'
    }
  },
  {
    id: 'tomato',
    name: {
      en: 'Tomato',
      hi: 'टमाटर (Tomato)',
      te: 'టమాటా (Tomato)',
      kn: 'ಟೊಮೆಟೊ (Tomato)',
      ta: 'தக்காளி (Tomato)',
      gu: 'ટામેટા (Tomato)'
    },
    category: 'vegetable',
    icon: '🍅',
    rdf: { n: 60, p: 35, k: 35 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'रोपाई के समय',
          te: 'నాట్లు వేసేటప్పుడు',
          kn: 'ನಾಟಿ ಮಾಡುವಾಗ',
          ta: 'அடி உரம்',
          gu: 'પાયામાં'
        },
        timing: {
          en: 'At transplanting',
          hi: 'रोपाई के समय',
          te: 'నాట్లు వేసే సమయములో',
          kn: 'ನಾಟಿ ಸಮಯದಲ್ಲಿ',
          ta: 'நடவு செய்யும் போது',
          gu: 'રોપણી વખતે'
        },
        nPercent: 30,
        pPercent: 100,
        kPercent: 40
      },
      {
        stageName: {
          en: 'Early Flowering',
          hi: 'फूल आते समय',
          te: 'పూత దశ',
          kn: 'ಹೂವು ಬಿಡುವ ಹಂತ',
          ta: 'பூக்கும் பருவம்',
          gu: 'ફૂલ આવવાના સમયે'
        },
        timing: {
          en: '30 days after transplanting',
          hi: 'रोपाई के 30 दिन बाद',
          te: 'నాటిన 30 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 30 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 30 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 30 દિવસે'
        },
        nPercent: 40,
        pPercent: 0,
        kPercent: 30
      },
      {
        stageName: {
          en: 'Fruiting & Picking',
          hi: 'फल भराव व तुड़ाई',
          te: 'కాయలు ఎదిగే దశ',
          kn: 'ಕಾಯಿ ಹಂತ',
          ta: 'காய் பிடிக்கும் பருவம்',
          gu: 'ફળ ભરાવા સમયે'
        },
        timing: {
          en: '55-60 days after transplanting',
          hi: 'रोपाई के 55-60 दिन बाद',
          te: 'నాటిన 55-60 రోజుల తర్వాత',
          kn: 'ನಾಟಿ ಮಾಡಿದ 55-60 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 55-60 நாட்களுக்குப் பின்',
          gu: 'રોપણી પછી 55-60 દિવસે'
        },
        nPercent: 30,
        pPercent: 0,
        kPercent: 30
      }
    ],
    micronutrients: {
      en: 'Foliar Boron (20%) @ 1g/L at flowering to prevent flower drop.',
      hi: 'बोरॉन 1 ग्राम/लीटर फूल झड़ना रोकने के लिए।',
      te: 'పూత రాలకుండా బోరాన్ 1 గ్రా/లీటర్ పిచికారీ.',
      kn: 'ಹೂವು ಉದುರುವುದನ್ನು ತಡೆಯಲು ಬೋರಾನ್ ಸಿಂಪಡಣೆ.',
      ta: 'பூ உதிர்வதை தடுக்க போரான் தெளிப்பு.',
      gu: 'ફૂલ ખરતા અટકાવવા બોરોનનો છંટકાવ.'
    }
  },
  {
    id: 'wheat',
    name: {
      en: 'Wheat',
      hi: 'गेहूं (Wheat)',
      te: 'గోధుమ (Wheat)',
      kn: 'ಗೋಧಿ (Wheat)',
      ta: 'கோதுமை (Wheat)',
      gu: 'ઘઉં (Wheat)'
    },
    category: 'cereal',
    icon: '🌾',
    rdf: { n: 48, p: 24, k: 16 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయములో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'அடி உரம்',
          gu: 'વાવણી સમયે'
        },
        timing: {
          en: 'At sowing in furrows',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయంలో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'விதைப்பின் போது',
          gu: 'વાવણી વખતે'
        },
        nPercent: 50,
        pPercent: 100,
        kPercent: 100
      },
      {
        stageName: {
          en: 'Crown Root Initiation (1st Irrigation)',
          hi: 'पहली सिंचाई (CRI चरण)',
          te: 'మొదటి తడి (వేర్లు ఏర్పడే దశ)',
          kn: 'ಮೊದಲ ನೀರಾವರಿ ಹಂತ',
          ta: 'முதல் பாசனம்',
          gu: 'પ્રથમ પિયત (CRI તબક્કો)'
        },
        timing: {
          en: '21-25 days after sowing',
          hi: 'बुवाई के 21-25 दिन बाद',
          te: 'విత్తిన 21-25 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 21-25 ದಿನಗಳ ನಂತರ',
          ta: 'விதைத்த 21-25 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 21-25 દિવસે'
        },
        nPercent: 50,
        pPercent: 0,
        kPercent: 0
      }
    ]
  },
  {
    id: 'potato',
    name: {
      en: 'Potato',
      hi: 'आलू (Potato)',
      te: 'బంగాళాదుంప (Potato)',
      kn: 'ಆಲೂಗಡ್ಡೆ (Potato)',
      ta: 'உருளைக்கிழங்கு (Potato)',
      gu: 'બટાટા (Potato)'
    },
    category: 'vegetable',
    icon: '🥔',
    rdf: { n: 60, p: 40, k: 45 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय',
          te: 'నాటేటప్పుడు',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'அடி உரம்',
          gu: 'વાવણી સમયે'
        },
        timing: {
          en: 'In furrows before tuber placement',
          hi: 'आलू बोने से पहले कूड़ों में',
          te: 'దుంపలు నాటే ముందు',
          kn: 'ಗೆಡ್ಡೆ ಹಾಕುವ ಮುನ್ನ',
          ta: 'விதைக்கும் முன்',
          gu: 'બટાટા વાવતા પહેલાં'
        },
        nPercent: 50,
        pPercent: 100,
        kPercent: 50
      },
      {
        stageName: {
          en: 'Earthing-Up Stage',
          hi: 'मिट्टी चढ़ाते समय',
          te: 'మట్టి ఎగదోసే దశ',
          kn: 'ಮಣ್ಣು ಏರಿಸುವ ಹಂತ',
          ta: 'மண் அணைக்கும் பருவம்',
          gu: 'માટી ચડાવવાના સમયે'
        },
        timing: {
          en: '30-35 days after planting',
          hi: 'बुवाई के 30-35 दिन बाद',
          te: 'నాటిన 30-35 రోజుల తర్వాత',
          kn: 'ಬಿತ್ತಿದ 30-35 ದಿನಗಳ ನಂತರ',
          ta: 'நட்ட 30-35 நாட்களுக்குப் பின்',
          gu: 'વાવણી પછી 30-35 દિવસે'
        },
        nPercent: 50,
        pPercent: 0,
        kPercent: 50
      }
    ]
  },
  {
    id: 'groundnut',
    name: {
      en: 'Groundnut / Peanut',
      hi: 'मूंगफली (Groundnut)',
      te: 'వేరుశనగ (Groundnut)',
      kn: 'ಕಡಲೆಕಾಯಿ (Groundnut)',
      ta: 'நிலக்கடலை (Groundnut)',
      gu: 'મગફળી (Groundnut)'
    },
    category: 'oilseed',
    icon: '🥜',
    rdf: { n: 16, p: 28, k: 20 },
    stages: [
      {
        stageName: {
          en: 'Basal Dose',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయములో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'அடி உரம்',
          gu: 'વાવણી સમયે'
        },
        timing: {
          en: 'At sowing in furrows',
          hi: 'बुवाई के समय',
          te: 'విత్తే సమయంలో',
          kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ',
          ta: 'விதைப்பின் போது',
          gu: 'વાવણી વખતે'
        },
        nPercent: 100,
        pPercent: 100,
        kPercent: 100
      }
    ],
    micronutrients: {
      en: 'Gypsum: 200 kg/acre at 40-45 DAS for pod development (calcium & sulphur).',
      hi: 'जिप्सम: 200 किग्रा/एकड़ 40-45 दिन पर फलियों में दाना भरने हेतु।',
      te: 'జిప్సం 200 కిలోలు/ఎకరాకు 40-45 రోజుల వద్ద కాయ ఊరడానికి.',
      kn: 'ಜಿಪ್ಸಮ್ 200 ಕೆಜಿ/ಎಕರೆಗೆ 40-45 ದಿನಗಳಲ್ಲಿ ಕಾಯಿ ತುಂಬಲು.',
      ta: 'ஜிப்சம் 200 கிலோ/ஏக்கர் 40-45 நாளில் காய் பிடிக்க.',
      gu: 'જીપ્સમ 200 કિલો/એકર 40-45 દિવસે ડોડવા ભરાવા માટે.'
    }
  }
];

export interface FertilizerCalculationResult {
  totalPureN: number;
  totalPureP: number;
  totalPureK: number;
  // Regimen 1: DAP + Urea + MOP
  dapKg: number;
  dapBags: number;
  ureaKg: number;
  ureaBags: number;
  mopKg: number;
  mopBags: number;
  // Estimated cost in INR
  estimatedCostINR: number;
  // Split schedule
  splitDoses: {
    stageName: Record<SupportedLanguage, string>;
    timing: Record<SupportedLanguage, string>;
    dapKg: number;
    ureaKg: number;
    mopKg: number;
    notes?: Record<SupportedLanguage, string>;
  }[];
}

// Calculate commercial fertilizer bags based on RDF per acre and plot acreage
export function calculateFertilizerPlan(
  crop: CropNutrientProfile,
  acres: number,
  soilFertilityAdjustment: 'low' | 'normal' | 'high' = 'normal'
): FertilizerCalculationResult {
  let factor = 1.0;
  if (soilFertilityAdjustment === 'low') factor = 1.15; // +15% in depleted soil
  if (soilFertilityAdjustment === 'high') factor = 0.85; // -15% in rich or legume rotated soil

  const totalPureN = Math.round(crop.rdf.n * acres * factor);
  const totalPureP = Math.round(crop.rdf.p * acres * factor);
  const totalPureK = Math.round(crop.rdf.k * acres * factor);

  // DAP has 18% N and 46% P2O5
  // Total DAP needed to satisfy 100% P = totalPureP / 0.46
  const dapKg = Math.round(totalPureP / 0.46);
  const dapBags = Math.round((dapKg / 50) * 10) / 10;

  // N supplied by DAP = dapKg * 0.18
  const nFromDap = dapKg * 0.18;
  const remainingN = Math.max(0, totalPureN - nFromDap);

  // Urea has 46% N
  const ureaKg = Math.round(remainingN / 0.46);
  const ureaBags = Math.round((ureaKg / 45) * 10) / 10; // Standard Neem-coated Urea is 45kg bag in India

  // MOP has 60% K2O
  const mopKg = Math.round(totalPureK / 0.60);
  const mopBags = Math.round((mopKg / 50) * 10) / 10;

  // Approx subsidized MRP in India:
  // Urea 45kg bag: ~₹266
  // DAP 50kg bag: ~₹1350
  // MOP 50kg bag: ~₹1650
  const estimatedCostINR = Math.round((ureaBags * 266) + (dapBags * 1350) + (mopBags * 1650));

  // Build split doses based on crop stages
  const splitDoses = crop.stages.map((st) => {
    // DAP is 100% applied at basal
    const stDap = Math.round(dapKg * (st.pPercent / 100));
    const stUrea = Math.round(ureaKg * (st.nPercent / 100));
    const stMop = Math.round(mopKg * (st.kPercent / 100));

    return {
      stageName: st.stageName,
      timing: st.timing,
      dapKg: stDap,
      ureaKg: stUrea,
      mopKg: stMop,
      notes: st.notes
    };
  });

  return {
    totalPureN,
    totalPureP,
    totalPureK,
    dapKg,
    dapBags,
    ureaKg,
    ureaBags,
    mopKg,
    mopBags,
    estimatedCostINR,
    splitDoses
  };
}
