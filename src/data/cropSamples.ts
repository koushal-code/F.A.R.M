import { SupportedLanguage } from '../types/farm';

export interface LocalizedCropSample {
  id: string;
  thumbnail: string;
  healthScore: number;
  affectedArea: number;
  yieldRisk: number;
  cropNames: Record<SupportedLanguage, string>;
  leafIssues: Record<SupportedLanguage, string>;
  categories: Record<SupportedLanguage, string>;
  severities: Record<SupportedLanguage, string>;
  descriptions: Record<SupportedLanguage, string>;
  dosageSummaries: Record<SupportedLanguage, string>;
}

export const LOCALIZED_SAMPLES: LocalizedCropSample[] = [
  {
    id: 'sample-tomato-late-blight',
    thumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    healthScore: 32,
    affectedArea: 42,
    yieldRisk: 65,
    cropNames: {
      en: 'Tomato',
      hi: 'टमाटर',
      te: 'టమాటా',
      kn: 'ಟೊಮೆಟೊ',
      ta: 'தக்காளி',
      gu: 'ટામેટા'
    },
    leafIssues: {
      en: 'Late Blight (Phytophthora)',
      hi: 'पछेती झुलसा रोग',
      te: 'లేట్ బ్లైట్ (మచ్చల తెగులు)',
      kn: 'ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'பின் பருவ கருகல் நோய்',
      gu: 'પાછોતરો સુકારો (લેટ બ્લાઇટ)'
    },
    categories: {
      en: 'Fungal/Water Mold Disease',
      hi: 'फफूंद जनित रोग',
      te: 'శిలీంధ్ర తెగులు',
      kn: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      ta: 'பூஞ்சை நோய்',
      gu: 'ફૂગજન્ય રોગ'
    },
    severities: {
      en: 'Severe',
      hi: 'गंभीर',
      te: 'తీవ్రమైనది',
      kn: 'ತೀವ್ರ',
      ta: 'தீவிரமானது',
      gu: 'ગંભીર'
    },
    descriptions: {
      en: 'Dark water-soaked necrotic lesions on leaf margins with pale chlorotic halos.',
      hi: 'पत्तियों के किनारों पर गहरे पानी से भीगे हुए धब्बे, अत्यधिक नमी में तेजी से फैलाव।',
      te: 'ఆకుల అంచులపై నీటి డాగులు వంటి నల్లని మచ్చలు, అధిక తేమలో వేగంగా ఆకులు ఎండిపోవడం.',
      kn: 'ಎಲೆಗಳ ಅಂಚಿನಲ್ಲಿ ಕಂದು ಬಣ್ಣದ ನೀರಿನ ಮಚ್ಚೆಗಳು, ತೇವಾಂಶದಲ್ಲಿ ಎಲೆಗಳು ಬೇಗನೆ ಒಣಗುವುದು.',
      ta: 'இலை விளிம்புகளில் நீர் ஊறிய கரும் புள்ளிகள், ஈரப்பதத்தில் இலைகள் காய்ந்து மடிதல்.',
      gu: 'પાનની કિનારીઓ પર કાળા-બદામી પાણીપોચા ડાઘા અને વધુ ભેજમાં આખા પાન સુકાઈ જવા.'
    },
    dosageSummaries: {
      en: 'Copper Oxychloride 50 WP @ 3.0g/L or Metalaxyl-M + Mancozeb @ 2.5g/L water',
      hi: 'कॉपर ऑक्सीक्लोराइड 50 WP @ 3.0 ग्राम/लीटर या रिडोमिल गोल्ड @ 2.5 ग्राम/लीटर',
      te: 'కాపర్ ఆక్సిక్లోరైడ్ 50 WP @ 3 గ్రా/లీ లేదా రిడోమిల్ గోల్డ్ @ 2.5 గ్రా/లీ నీటికి',
      kn: 'ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ @ 3 ಗ್ರಾಂ/ಲೀ ಅಥವಾ ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ @ 2.5 ಗ್ರಾಂ/ಲೀ ನೀರಿಗೆ',
      ta: 'காப்பர் ஆக்ஸிகுளோரைடு @ 3 கிராம்/லி அல்லது ரிடோமில் கோல்ட் @ 2.5 கிராம்/லி',
      gu: 'કોપર ઓક્સીક્લોરાઇડ ૫૦ WP @ ૩.૦ ગ્રામ/લિ અથવા મેટાલેક્સિલ-એમ + મેન્કોઝેબ @ ૨.૫ ગ્રામ/લિટર પાણી'
    }
  },
  {
    id: 'sample-rice-blast',
    thumbnail: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
    healthScore: 58,
    affectedArea: 28,
    yieldRisk: 40,
    cropNames: {
      en: 'Paddy / Rice',
      hi: 'धान (चावल)',
      te: 'వరి',
      kn: 'ಭತ್ತ',
      ta: 'நெல்',
      gu: 'ડાંગર / ચોખા'
    },
    leafIssues: {
      en: 'Rice Blast (Magnaporthe)',
      hi: 'धान का झुलसा (ब्लास्ट)',
      te: 'అగ్గి తెగులు (బ్లాస్ట్)',
      kn: 'ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
      ta: 'குலை நோய் (பிளாஸ்ட்)',
      gu: 'ડાંગરનો બ્લાસ્ટ / કરમોડી રોગ'
    },
    categories: {
      en: 'Fungal Disease',
      hi: 'फफूंद जनित रोग',
      te: 'శిలీంధ్ర తెగులు',
      kn: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      ta: 'பூஞ்சை நோய்',
      gu: 'ફૂગજન્ય રોગ'
    },
    severities: {
      en: 'Moderate',
      hi: 'मध्यम',
      te: 'మధ్యస్థం',
      kn: 'ಮಧ್ಯಮ',
      ta: 'மிதமானது',
      gu: 'મધ્યમ'
    },
    descriptions: {
      en: 'Diamond or spindle-shaped lesions with grayish-white centers along leaf veins.',
      hi: 'पत्तियों पर नाव या धुरी के आकार के राख जैसे धब्बे, भूरे किनारे।',
      te: 'ఆకులపై నూలుకండె ఆకారపు బూడిద రంగు మచ్చలు, గోధుమ రంగు అంచులు.',
      kn: 'ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದಿ ಬಣ್ಣದ ಮಚ್ಚೆಗಳು.',
      ta: 'இலைகளில் கதிர் போன்ற சாம்பல் நிறப் புள்ளிகள் மற்றும் பழுப்பு விளிம்புகள்.',
      gu: 'પાન પર ત્રાક આકારના વચ્ચેથી રાખોડી અને કિનારીએ બદામી રંગના ડાઘા.'
    },
    dosageSummaries: {
      en: 'Tricyclazole 75% WP @ 0.6g/L or Azoxystrobin 23% SC @ 1.0ml/L water',
      hi: 'ट्राईसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर या बाण @ 1 ग्राम/लीटर',
      te: 'ట్రైసైక్లాజోల్ 75% WP (బాన్) @ 0.6 గ్రా/లీ నీటికి పిచికారీ',
      kn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP @ 0.6 ಗ್ರಾಂ/ಲೀ ನೀರಿಗೆ',
      ta: 'டிரைசைக்ளசோல் 75% WP @ 0.6 கிராம்/லி தண்ணீர்',
      gu: 'ટ્રાયસાઇક્લાઝોલ ૭૫% WP @ ૦.૬ ગ્રામ/લિ અથવા એઝોક્સીસ્ટ્રોબિન ૨૩% SC @ ૧.૦ મિલી/લિટર પાણી'
    }
  },
  {
    id: 'sample-cotton-leaf-curl',
    thumbnail: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    healthScore: 45,
    affectedArea: 38,
    yieldRisk: 55,
    cropNames: {
      en: 'Cotton',
      hi: 'कपास (नरमा)',
      te: 'పత్తి',
      kn: 'ಹತ್ತಿ',
      ta: 'பருத்தி',
      gu: 'કપાસ'
    },
    leafIssues: {
      en: 'Leaf Curl Virus & Whitefly',
      hi: 'पत्ती मरोड़ रोग व सफेद मक्खी',
      te: 'ఆకు ముడుత తెగులు & తెల్లదోమ',
      kn: 'ಎಲೆ ಮುಟುರು ರೋಗ ಮತ್ತು ಬಿಳಿ ನೊಣ',
      ta: 'இலை சுருள் நோய் & வெள்ளை ஈ',
      gu: 'પર્ણ વળાંક વાયરસ (કુકડવ) અને સફેદ માખી'
    },
    categories: {
      en: 'Viral Vector Disease',
      hi: 'विषाणु जनित रोग',
      te: 'వైరస్ తెగులు',
      kn: 'ವೈರಸ್ ರೋಗ',
      ta: 'வைரஸ் நோய்',
      gu: 'વાયરસ જન્ય રોગ'
    },
    severities: {
      en: 'Severe',
      hi: 'गंभीर',
      te: 'తీవ్రమైనది',
      kn: 'ತೀವ್ರ',
      ta: 'தீவிரமானது',
      gu: 'ગંભીર'
    },
    descriptions: {
      en: 'Upward curling of leaf margins, thick swollen veins, cup-shaped enations underneath.',
      hi: 'पत्तियों का ऊपर की ओर मुड़ना, नसें मोटी होना और पौधे का बौना रह जाना।',
      te: 'ఆకులు పైకి దోనెలా ముడుచుకుపోవడం, ఈనెలు లావు కావడం, ఎదుగుదల లోపించడం.',
      kn: 'ಎಲೆಗಳು ಮೇಲಕ್ಕೆ ಮುದುರಿಕೊಳ್ಳುವುದು, ಎಲೆಯ ನರಗಳು ದಪ್ಪವಾಗುವುದು.',
      ta: 'இலைகள் மேல்நோக்கி சுருங்குதல், இலை நரம்புகள் தடிமனாதல் மற்றும் வளர்ச்சி குன்றுதல்.',
      gu: 'પાનની કિનારીઓ ઉપર તરફ વળી જવી, નસો જાડી થવી અને છોડનો વિકાસ અટકી જવો.'
    },
    dosageSummaries: {
      en: 'Diafenthiuron 50% WP @ 1.2g/L or Neem Oil 10,000 ppm @ 3ml/L water',
      hi: 'डायफेंथियूरॉन 50% WP @ 1.2 ग्राम/लीटर या नीम तेल 10,000 ppm @ 3 मिली/लीटर',
      te: 'డయాఫెంథియురాన్ 50% WP @ 1.2 గ్రా/లీ లేదా వేప నూనె @ 3 మి.లీ/లీ నీటికి',
      kn: 'ಡಯಾಫೆಂಥಿಯುರಾನ್ 50% WP @ 1.2 ಗ್ರಾಂ/ಲೀ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ @ 3 ಮಿ.ಲೀ/ಲೀ',
      ta: 'டயாபெந்தியூரான் 50% WP @ 1.2 கிராம்/லி அல்லது வேப்ப எண்ணெய் @ 3 மி.லி/லி',
      gu: 'ડાયફેન્થિયુરોન ૫૦% WP @ ૧.૨ ગ્રામ/લિ અથવા લીમડાનું તેલ ૧૦,૦૦૦ PPM @ ૩ મિલી/લિટર પાણી'
    }
  },
  {
    id: 'sample-maize-fall-armyworm',
    thumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    healthScore: 24,
    affectedArea: 55,
    yieldRisk: 75,
    cropNames: {
      en: 'Maize / Corn',
      hi: 'मक्का',
      te: 'మొక్కజొన్న',
      kn: 'ಮುಸುಕಿನ ಜೋಳ',
      ta: 'மக்காச்சோளம்',
      gu: 'મકાઈ'
    },
    leafIssues: {
      en: 'Fall Armyworm (Spodoptera)',
      hi: 'फॉल आर्मीवॉर्म (सैनिक कीट)',
      te: 'కత్తెర పురుగు',
      kn: 'ಲದ್ದಿ ಹುಳು (ಆರ್ಮಿವಾರ್ಮ್)',
      ta: 'படைப்புழு',
      gu: 'ફોલ આર્મીવોર્મ (લશ્કરી ઇયળ)'
    },
    categories: {
      en: 'Pest Infestation',
      hi: 'कीट प्रकोप',
      te: 'కీటక నష్టం',
      kn: 'ಕೀಟ ಬಾಧೆ',
      ta: 'பூச்சித் தாக்குதல்',
      gu: 'જીવાતનો ઉપદ્રવ'
    },
    severities: {
      en: 'Critical',
      hi: 'अति गंभीर',
      te: 'ప్రమాదకరమైనది',
      kn: 'ಅತಿ ಗಂಭೀರ',
      ta: 'மிகத் தீவிரமானது',
      gu: 'અતિ ગંભીર'
    },
    descriptions: {
      en: 'Ragged torn leaf whorls with deep feeding holes and granular frass inside central funnel.',
      hi: 'पत्तियों में बड़े छेद, पोंगे के अंदर लकड़ी के बुरादे जैसा मलमूत्र।',
      te: 'సుడులలో ఆకులు కొరికివేయబడటం, రంపపు పొట్టు వంటి పురుగు మలం చేరడం.',
      kn: 'ಸುಳಿಯ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ ಹಾಕುವುದು, ಮರದ ಪುಡಿಯಂತಹ ಕೀಟದ ಮಲ ಶೇಖರಣೆ.',
      ta: 'குருத்து இலைகளில் துளைகள் மற்றும் மரத்தூள் போன்ற புழு கழிவுகள்.',
      gu: 'પાનમાં મોટા અનિયમિત કાણાં અને મકાઈની ભૂંગળીમાં લાકડાના વહેર જેવી વિષ્ટા.'
    },
    dosageSummaries: {
      en: 'Chlorantraniliprole 18.5% SC @ 0.4ml/L or Emamectin Benzoate 5% SG @ 0.5g/L',
      hi: 'कोराजन 18.5% SC @ 0.4 मिली/लीटर या प्रोक्लेम @ 0.5 ग्राम/लीटर',
      te: 'కోరాజెన్ 18.5% SC @ 0.4 మి.లీ/లీ లేదా ఎమామెక్టిన్ బెంజోయేట్ @ 0.5 గ్రా/లీ సుడులలో పడేలా',
      kn: 'ಕೊರಾಜೆನ್ 18.5% SC @ 0.4 ಮಿ.ಲೀ/ಲೀ ಅಥವಾ ಪ್ರೋಕ್ಲೇಮ್ @ 0.5 ಗ್ರಾಂ/ಲೀ ಸುಳಿಗೆ ಸಿಂಪಡಿಸಿ',
      ta: 'கோரஜென் 18.5% SC @ 0.4 மி.லி/லி அல்லது எமாமெக்டின் பென்சோயேட் @ 0.5 கிராம்/லி',
      gu: 'ક્લોરાન્ટ્રાનિલિપ્રોલ ૧૮.૫% SC @ ૦.૪ મિલી/લિ અથવા એમામેક્ટીન બેન્ઝોએટ ૫% SG @ ૦.૫ ગ્રામ/લિટર'
    }
  },
  {
    id: 'sample-chilli-anthracnose',
    thumbnail: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    healthScore: 38,
    affectedArea: 44,
    yieldRisk: 50,
    cropNames: {
      en: 'Chilli',
      hi: 'मिर्च',
      te: 'మిరప',
      kn: 'ಮೆಣಸಿನಕಾಯಿ',
      ta: 'மிளகாய்',
      gu: 'મરચાં'
    },
    leafIssues: {
      en: 'Thrips & Fruit Rot / Dieback',
      hi: 'थ्रिप्स व फल सड़न (डाईबैक)',
      te: 'నల్ల తామర పురుగు & కొమ్మ ఎండు',
      kn: 'ಕಪ್ಪು ಥ್ರಿಪ್ಸ್ ಮತ್ತು ಕಾಯಿ ಕೊಳೆ',
      ta: 'இலை பேன் & காய் அழுகல்',
      gu: 'થ્રીપ્સ અને ફળનો સડો / પાન કોકડવા'
    },
    categories: {
      en: 'Fungal & Thrips Vector',
      hi: 'फफूंद व कीट संकुल',
      te: 'తామర పురుగులు & శిలీంధ్రం',
      kn: 'ಕೀಟ ಮತ್ತು ಶಿಲೀಂಧ್ರ',
      ta: 'பூச்சி மற்றும் பூஞ்சை',
      gu: 'ફૂગ અને જીવાત સંકુલ'
    },
    severities: {
      en: 'Severe',
      hi: 'गंभीर',
      te: 'తీవ్రమైనది',
      kn: 'ತೀವ್ರ',
      ta: 'தீவிரமானது',
      gu: 'ગંભીર'
    },
    descriptions: {
      en: 'Upward boat leaf curling, sunken black spots on pods, twig die-back from tip.',
      hi: 'पत्तियों का नाव की तरह मुड़ना और फलों पर काले धब्बे पड़ना।',
      te: 'ఆకులు పైకి దోనెలా మారడం, కాయలపై నల్లటి గుంట మచ్చలు, కొమ్మలు పైనుండి ఎండిపోవడం.',
      kn: 'ಎಲೆಗಳು ದೋಣಿಯಂತೆ ಮುದುರಿಕೊಳ್ಳುವುದು, ಕಾಯಿಗಳ ಮೇಲೆ ಕಪ್ಪು ಗುಳಿ ಮಚ್ಚೆಗಳು.',
      ta: 'இலைகள் படகு போல வளைதல், காய்களில் கருப்பு புள்ளிகள் ஏற்படுதல்.',
      gu: 'પાન હોડી જેવા ઉપર વળી જવા, મરચાં પર કાળા ડાઘા અને ડાળીઓ ટોચથી સુકાઈ જવી.'
    },
    dosageSummaries: {
      en: 'Fipronil 5% SC @ 2ml/L + Azoxystrobin 23% SC @ 1ml/L water',
      hi: 'फिप्रोनिल 5% SC @ 2 मिली/लीटर + एमस्टार टॉप @ 1 मिली/लीटर',
      te: 'ఫిప్రోనిల్ 5% SC @ 2 మి.లీ/లీ + అజోక్సిస్ట్రోబిన్ @ 1 మి.లీ/లీ నీటికి',
      kn: 'ಫಿಪ್ರೋನಿಲ್ 5% SC @ 2 ಮಿ.ಲೀ/ಲೀ + ಅಮಿಸ್ಟಾರ್ ಟಾಪ್ @ 1 ಮಿ.ಲೀ/ಲೀ',
      ta: 'பிப்ரோனில் 5% SC @ 2 மி.லி/லி + அமிஸ்டார் டாப் @ 1 மி.லி/லி',
      gu: 'ફિપ્રોનિલ ૫% SC @ ૨ મિલી/લિ + એઝોક્સીસ્ટ્રોબિન ૨૩% SC @ ૧ મિલી/લિટર પાણી'
    }
  },
  {
    id: 'sample-potato-early-blight',
    thumbnail: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    healthScore: 61,
    affectedArea: 22,
    yieldRisk: 30,
    cropNames: {
      en: 'Potato',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ta: 'உருளைக்கிழங்கு',
      gu: 'બટાકા'
    },
    leafIssues: {
      en: 'Early Blight (Alternaria solani)',
      hi: 'अगेती झुलसा रोग',
      te: 'అల్ట్రనేరియా ఆకుమచ్చ తెగులు',
      kn: 'ಮುಂಗಾರು ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'முன் பருவ கருகல் நோய்',
      gu: 'અગેતરો સુકારો (અલ્ટરનેરિયા)'
    },
    categories: {
      en: 'Fungal Disease',
      hi: 'फफूंद जनित रोग',
      te: 'శిలీంధ్ర తెగులు',
      kn: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      ta: 'பூஞ்சை நோய்',
      gu: 'ફૂગજન્ય રોગ'
    },
    severities: {
      en: 'Moderate',
      hi: 'मध्यम',
      te: 'మధ్యస్థం',
      kn: 'ಮಧ್ಯಮ',
      ta: 'மிதமானது',
      gu: 'મધ્યમ'
    },
    descriptions: {
      en: 'Concentric target board rings, dry brown angular spots on older lower leaves.',
      hi: 'पुरानी पत्तियों पर गोल छल्लेदार (टारगेट बोर्ड) भूरे सूखे धब्बे।',
      te: 'కింది ముదిరిన ఆకులపై వలయాకారపు చక్రాల వంటి గోధుమ రంగు మచ్చలు.',
      kn: 'ಹಳೆಯ ಎಲೆಗಳ ಮೇಲೆ ಗುರಿ ಹಲಗೆಯಂತಹ ದುಂಡನೆಯ ಕಂದು ಮಚ್ಚೆಗಳು.',
      ta: 'பழைய இலைகளில் வட்ட வளைய வடிவிலான கரும்பழுப்பு நிறப் புள்ளிகள்.',
      gu: 'નીચેના જૂના પાન પર ગોળ ચક્રાકાર (ટાર્ગેટ બોર્ડ) જેવા બદામી સુકા ડાઘા.'
    },
    dosageSummaries: {
      en: 'Mancozeb 75% WP @ 2.5g/L or Chlorothalonil 75% WP @ 2.0g/L water',
      hi: 'मैनकोजेब 75% WP @ 2.5 ग्राम/लीटर या कवच @ 2 ग्राम/लीटर',
      te: 'మాంకోజెబ్ 75% WP (డైథేన్ M-45) @ 2.5 గ్రా/లీ నీటికి',
      kn: 'ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP @ 2.5 ಗ್ರಾಂ/ಲೀ ನೀರಿಗೆ',
      ta: 'மேன்கோசெப் 75% WP @ 2.5 கிராம்/லி தண்ணீர்',
      gu: 'મેન્કોઝેબ ૭૫% WP @ ૨.૫ ગ્રામ/લિ અથવા ક્લોરોથેલોનિલ ૭૫% WP @ ૨.૦ ગ્રામ/લિટર પાણી'
    }
  },
  {
    id: 'sample-wheat-healthy',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    healthScore: 94,
    affectedArea: 2,
    yieldRisk: 0,
    cropNames: {
      en: 'Wheat',
      hi: 'गेहूं',
      te: 'గోధుమ',
      kn: 'ಗೋಧಿ',
      ta: 'கோதுமை',
      gu: 'ઘઉં'
    },
    leafIssues: {
      en: 'Healthy Crop (No Disease)',
      hi: 'स्वस्थ फसल (रोगमुक्त)',
      te: 'ఆరోగ్యకరమైన పంట (తెగుళ్లు లేవు)',
      kn: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ (ರೋಗ ಮುಕ್ತ)',
      ta: 'ஆரோக்கியமான பயிர் (நோயற்றது)',
      gu: 'તંદુરસ્ત પાક (રોગમુક્ત)'
    },
    categories: {
      en: 'Healthy Crop',
      hi: 'स्वस्थ फसल',
      te: 'ఆరోగ్యకరమైన పంట',
      kn: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ',
      ta: 'ஆரோக்கியமான பயிர்',
      gu: 'તંદુરસ્ત પાક'
    },
    severities: {
      en: 'Low',
      hi: 'निम्न',
      te: 'తక్కువ',
      kn: 'ಕಡಿಮೆ',
      ta: 'குறைவானது',
      gu: 'ઓછી'
    },
    descriptions: {
      en: 'Vigorous deep green leaves, clean venation, zero fungal spores or rust pustules.',
      hi: 'पत्तियों में गहरा हरापन, रतुआ या कीट के कोई लक्षण नहीं।',
      te: 'ఆకులు దృఢంగా, పచ్చగా ఉన్నాయి, ఎలాంటి తెగులు మచ్చలు లేవు.',
      kn: 'ಎಲೆಗಳು ಹಚ್ಚಹಸುರಾಗಿವೆ, ಯಾವುದೇ ತುಕ್ಕು ಅಥವಾ ರೋಗದ ಲಕ್ಷಣಗಳಿಲ್ಲ.',
      ta: 'இலைகள் பசுமையாகவும் எவ்வித பூச்சி தாக்குதல் இன்றியும் உள்ளன.',
      gu: 'ઘેરા લીલા સ્વસ્થ પાન, સાફ નસો, કોઈ પણ ફૂગ કે જીવાતના ઉપદ્રવ વગર.'
    },
    dosageSummaries: {
      en: 'Maintain balanced N-P-K nutrition and routine weed scouting',
      hi: 'संतुलित खाद और नियमित सिंचाई प्रबंधन बनाए रखें',
      te: 'సమతుల్య ఎరువుల యాజమాన్యం మరియు క్రమబద్ధమైన నీటిపారుదల కొనసాగించండి',
      kn: 'ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ಮತ್ತು ನಿಯಮಿತ ನೀರಾವರಿ ನಿರ್ವಹಣೆ ಮುಂದುವರಿಸಿ',
      ta: 'சமச்சீர் உர மேலாண்மை மற்றும் வழக்கமான பாசனம் தொடரவும்',
      gu: 'સંતુલિત N-P-K ખાતર અને સમયસર પિયત વ્યવસ્થાપન જાળવો'
    }
  }
];

export function getCleanSample(sample: LocalizedCropSample, lang: SupportedLanguage) {
  return {
    id: sample.id,
    cropName: sample.cropNames[lang] || sample.cropNames.en,
    leafIssue: sample.leafIssues[lang] || sample.leafIssues.en,
    category: sample.categories[lang] || sample.categories.en,
    severity: sample.severities[lang] || sample.severities.en,
    description: sample.descriptions[lang] || sample.descriptions.en,
    dosageSummary: sample.dosageSummaries[lang] || sample.dosageSummaries.en,
    thumbnail: sample.thumbnail,
    healthScore: sample.healthScore,
    affectedArea: sample.affectedArea,
    yieldRisk: sample.yieldRisk,
    promptContext: `${sample.cropNames.en} showing ${sample.leafIssues.en}`
  };
}
