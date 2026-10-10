import { SupportedLanguage, CropSample } from '../types/farm';

export interface LocalizedCropSampleRaw {
  id: string;
  category: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  thumbnail: string;
  healthScore: number;
  affectedArea: number;
  yieldRisk: number;
  promptContext: string;
  names: Record<SupportedLanguage, string>;
  issues: Record<SupportedLanguage, string>;
  descriptions: Record<SupportedLanguage, string>;
  dosageSummaries: Record<SupportedLanguage, string>;
}

export const CROP_SAMPLES_RAW: LocalizedCropSampleRaw[] = [
  {
    id: 'sample-tomato-late-blight',
    category: 'Fungal/Water Mold Disease',
    severity: 'Severe',
    thumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    healthScore: 32,
    affectedArea: 42,
    yieldRisk: 65,
    promptContext: 'Tomato leaf exhibiting late blight symptoms: dark water-soaked lesions spreading across blade with yellow borders.',
    names: {
      en: 'Tomato',
      hi: 'टमाटर',
      te: 'టమాటా',
      kn: 'ಟೊಮೆಟೊ',
      ta: 'தக்காளி',
      gu: 'ટામેટા'
    },
    issues: {
      en: 'Late Blight (Phytophthora infestans)',
      hi: 'पछेती झुलसा रोग',
      te: 'లేట్ బ్లైట్ (మచ్చల తెగులు)',
      kn: 'ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'லேட் பிளைட் (இலைக்கருகல்)',
      gu: 'પાછોતરો સુકારો (લેટ બ્લાઇટ)'
    },
    descriptions: {
      en: 'Dark water-soaked necrotic lesions on leaf margins with pale halos, rapid foliage collapse in damp weather.',
      hi: 'पत्तियों के किनारों पर पानी से भीगे गहरे भूरे धब्बे, अधिक नमी में पूरी पत्ती सूख जाती है।',
      te: 'ఆకుల అంచులపై నీటి డాగుల వంటి నల్లటి మచ్చలు, చలి మరియు తేమ వాతావరణంలో వేగంగా వ్యాపిస్తుంది.',
      kn: 'ಎಲೆಗಳ ಅಂಚಿನಲ್ಲಿ ನೀರಿನಂತಹ ಕಂದು ಮಚ್ಚೆಗಳು, ತೇವಾಂಶದಲ್ಲಿ ಇಡೀ ಗಿಡವು ಬಾಡಿ ಒಣಗುತ್ತದೆ.',
      ta: 'இலை ஓரங்களில் நீர் போன்ற கருப்பு புள்ளிகள், அதிக ஈரப்பதத்தில் இலைகள் முற்றிலும் கருகிவிடும்.',
      gu: 'પાનની કિનારીઓ પર કાળા-બદામી પાણીપોચા ડાઘા, ભેજવાળા વાતાવરણમાં પાંદડા ઝડપથી ખરી પડવા.'
    },
    dosageSummaries: {
      en: 'Metalaxyl-M + Mancozeb @ 2.5g / L water or Copper Oxychloride @ 3g / L water',
      hi: 'मेटालेक्सिल + मैंकोजेब 2.5 ग्राम प्रति लीटर या कॉपर ऑक्सीक्लोराइड 3 ग्राम प्रति लीटर पानी',
      te: 'మెటలాక్సిల్ + మాంకోజెబ్ 2.5 గ్రాములు లీటరు నీటికి లేదా కాపర్ ఆక్సిక్లోరైడ్ 3 గ్రాములు',
      kn: 'ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್ 2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಅಥವಾ ತಾಮ್ರ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ 3 ಗ್ರಾಂ',
      ta: 'மெட்டலாக்சில் + மான்கோசெப் 2.5 கிராம் லிட்டருக்கு அல்லது காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம்',
      gu: 'મેટાલેક્સિલ-એમ + મેન્કોઝેબ @ ૨.૫ ગ્રામ/લિ અથવા કોપર ઓક્સીક્લોરાઇડ @ ૩ ગ્રામ/લિટર પાણી'
    }
  },
  {
    id: 'sample-rice-blast',
    category: 'Fungal Disease',
    severity: 'Moderate',
    thumbnail: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
    healthScore: 58,
    affectedArea: 28,
    yieldRisk: 40,
    promptContext: 'Paddy rice leaves showing spindle-shaped blast lesions with necrotic ash-grey center and brownish-yellow halo.',
    names: {
      en: 'Paddy Rice',
      hi: 'धान (चावल)',
      te: 'వరి (ధాన్యం)',
      kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
      ta: 'நெல்',
      gu: 'ડાંગર (ચોખા)'
    },
    issues: {
      en: 'Rice Blast (Magnaporthe oryzae)',
      hi: 'ब्लास्ट रोग (झोंका)',
      te: 'అగ్గి తెగులు',
      kn: 'ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
      ta: 'குலை நோய் (பிளாஸ்ட்)',
      gu: 'ડાંગરનો બ્લાસ્ટ (કરમોડી રોગ)'
    },
    descriptions: {
      en: 'Diamond or spindle-shaped lesions with grayish-white centers and dark reddish-brown borders along leaf veins.',
      hi: 'पत्तियों पर कताई के आकार के राख जैसे धब्बे, भूरे किनारे और गंभीर स्थिति में गर्दन टूटना।',
      te: 'ఆకులపై కదురు ఆకారపు బూడిద రంగు మచ్చలు మరియు నల్లని అంచులు, పిలకలు ఎండిపోతాయి.',
      kn: 'ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದಿ ಬಣ್ಣದ ಮಚ್ಚೆಗಳು ಮತ್ತು ಕಂದು ಅಂಚುಗಳು.',
      ta: 'இலைகளில் கதிர் வடிவ சாம்பல் நிற புள்ளிகள் மற்றும் பழுப்பு நிற விளிம்புகள்.',
      gu: 'પાન પર ત્રાક આકારના વચ્ચેથી રાખોડી અને કિનારીએ ઘેરા બદામી રંગના ડાઘા.'
    },
    dosageSummaries: {
      en: 'Tricyclazole 75% WP @ 0.6g / L water or Azoxystrobin 23% SC @ 1.0ml / L water',
      hi: 'ट्राईसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर या एज़ोक्सीस्ट्रोबिन 1.0 मिली प्रति लीटर',
      te: 'ట్రైసైక్లాజోల్ 75% WP లీటరు నీటికి 0.6 గ్రాములు లేదా అజాక్సిస్ట్రోబిన్ 1.0 మి.లీ',
      kn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP ಲೀಟರ್ ನೀರಿಗೆ 0.6 ಗ್ರಾಂ ಅಥವಾ ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ 1.0 ಮಿಲಿ',
      ta: 'டிரைசைக்ளசோல் 75% WP லிட்டருக்கு 0.6 கிராம் அல்லது அசோக்ஸிஸ்ட்ரோபின் 1.0 மி.லி',
      gu: 'ટ્રાયસાઇક્લાઝોલ ૭૫% WP @ ૦.૬ ગ્રામ/લિટર અથવા એઝોક્સીસ્ટ્રોબિન ૨૩% SC @ ૧.૦ મિલી/લિટર'
    }
  },
  {
    id: 'sample-cotton-leaf-curl',
    category: 'Viral Vector Disease',
    severity: 'Severe',
    thumbnail: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    healthScore: 45,
    affectedArea: 38,
    yieldRisk: 55,
    promptContext: 'Cotton plant showing upward cupping of leaves, swollen enations and yellow vein clearing caused by whitefly-transmitted CLCuV.',
    names: {
      en: 'Cotton',
      hi: 'कपास (नरमा)',
      te: 'పత్తి',
      kn: 'ಹತ್ತಿ',
      ta: 'பருத்தி',
      gu: 'કપાસ'
    },
    issues: {
      en: 'Cotton Leaf Curl Virus (CLCuV)',
      hi: 'पत्ती मरोड़ रोग (सफेद मक्खी जनित)',
      te: 'ఆకు ముడుత తెగులు & తెల్లదోమ',
      kn: 'ಎಲೆ ಮುಟುರು ರೋಗ',
      ta: 'பருத்தி இலை சுருள் நோய்',
      gu: 'પર્ણ વળાંક વાયરસ (કુકડવ) અને સફેદ માખી'
    },
    descriptions: {
      en: 'Upward curling of leaf margins, thick swollen veins, cup-shaped enations underneath leaf surface.',
      hi: 'पत्तियों का ऊपर की ओर मुड़ना, नसें मोटी होना और पौधे का बौना रह जाना।',
      te: 'ఆకులు పైకి దోనెలా ముడుచుకుపోవడం, ఈనెలు లావు కావడం, ఎదుగుదల లోపించడం.',
      kn: 'ಎಲೆಗಳು ಮೇಲಕ್ಕೆ ಮುದುರಿಕೊಳ್ಳುವುದು, ಎಲೆಯ ನರಗಳು ದಪ್ಪವಾಗುವುದು.',
      ta: 'இலைகள் மேல்நோக்கி சுருங்குதல், இலை நரம்புகள் தடிமனாதல் மற்றும் வளர்ச்சி குன்றுதல்.',
      gu: 'પાનની કિનારીઓ ઉપર તરફ વળવી, નસો જાડી થવી અને છોડનો વિકાસ અટકી જવો.'
    },
    dosageSummaries: {
      en: 'Diafenthiuron 50% WP @ 1.2g / L water or Neem Oil 10,000 ppm @ 3ml / L water',
      hi: 'डायफेंथियूरॉन 50% WP 1.2 ग्राम प्रति लीटर या नीम तेल 10,000 ppm 3 मिली प्रति लीटर',
      te: 'డయాఫెంథియురాన్ 50% WP 1.2 గ్రాములు లీటరు నీటికి లేదా వేప నూనె 3 మి.లీ',
      kn: 'ಡಯಾಫೆಂಥಿಯುರಾನ್ 50% WP 1.2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 3 ಮಿಲಿ',
      ta: 'டயாபெந்தியூரான் 50% WP 1.2 கிராம் லிட்டருக்கு அல்லது வேப்ப எண்ணெய் 3 மி.லி',
      gu: 'ડાયફેન્થિયુરોન ૫૦% WP @ ૧.૨ ગ્રામ/લિટર અથવા લીમડાનું તેલ @ ૩ મિલી/લિટર પાણી'
    }
  },
  {
    id: 'sample-maize-fall-armyworm',
    category: 'Pest Infestation',
    severity: 'Critical',
    thumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    healthScore: 24,
    affectedArea: 55,
    yieldRisk: 75,
    promptContext: 'Maize whorl damaged by Fall Armyworm: large ragged feeding holes and wet sawdust frass inside funnel.',
    names: {
      en: 'Maize / Corn',
      hi: 'मक्का',
      te: 'మొక్కజొన్న',
      kn: 'ಮುಸುಕಿನ ಜೋಳ',
      ta: 'மக்காச்சோளம்',
      gu: 'મકાઈ'
    },
    issues: {
      en: 'Fall Armyworm (Spodoptera frugiperda)',
      hi: 'फॉल आर्मीवॉर्म (सैनिक कीट)',
      te: 'కత్తెర పురుగు',
      kn: 'ಸೈನಿಕ ಹುಳು (ಆರ್ಮಿವರ್ಮ್)',
      ta: 'படைப்புழு',
      gu: 'ફોલ આર્મીવોર્મ (લશ્કરી ઇયળ)'
    },
    descriptions: {
      en: 'Ragged torn leaf whorls with deep feeding holes and granular frass inside central funnel.',
      hi: 'पत्तियों में बड़े छेद, पोंगे के अंदर लकड़ी के बुरादे जैसा मलमूत्र।',
      te: 'సుడులలో ఆకులు కొరికివేయబడటం, రంపపు పొట్టు వంటి పురుగు మలం చేరడం.',
      kn: 'ಸುಳಿಯ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ ಹಾಕುವುದು, ಮರದ ಪುಡಿಯಂತಹ ಕೀಟದ ಮಲ ಶೇಖರಣೆ.',
      ta: 'குருத்து இலைகளில் துளைகள் மற்றும் மரத்தூள் போன்ற புழு கழிவுகள்.',
      gu: 'પાનમાં મોટા કાણાં અને મકાઈની ભૂંગળીમાં લાકડાના વહેર જેવી વિષ્ટા.'
    },
    dosageSummaries: {
      en: 'Chlorantraniliprole 18.5% SC @ 0.4ml / L water or Emamectin Benzoate 5% SG @ 0.5g / L',
      hi: 'कोराजन 18.5% SC 0.4 मिली प्रति लीटर या प्रोक्लेम 0.5 ग्राम प्रति लीटर',
      te: 'కోరాజెన్ 18.5% SC 0.4 మి.లీ లీటరు నీటికి లేదా ఎమామెక్టిన్ బెంజోయేట్ 0.5 గ్రాములు',
      kn: 'ಕೋರಾಜನ್ 18.5% SC 0.4 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಪ್ರೋಕ್ಲೇಮ್ 0.5 ಗ್ರಾಂ',
      ta: 'கோரஜென் 18.5% SC 0.4 மி.லி அல்லது எமாமெக்டின் பென்சோயேட் 0.5 கிராம்',
      gu: 'ક્લોરાન્ટ્રાનિલિપ્રોલ ૧૮.૫% SC @ ૦.૪ મિલી/લિ અથવા એમામેક્ટીન બેન્ઝોએટ @ ૦.૫ ગ્રામ/લિટર'
    }
  },
  {
    id: 'sample-chilli-anthracnose',
    category: 'Fungal & Thrips Vector',
    severity: 'Severe',
    thumbnail: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    healthScore: 38,
    affectedArea: 44,
    yieldRisk: 50,
    promptContext: 'Chilli plant displaying upward boat curling caused by thrips alongside sunken necrotic fruit rot lesions.',
    names: {
      en: 'Chilli',
      hi: 'मिर्च',
      te: 'మిరప',
      kn: 'ಮೆಣಸಿನಕಾಯಿ',
      ta: 'மிளகாய்',
      gu: 'મરચાં'
    },
    issues: {
      en: 'Thrips & Fruit Rot / Dieback',
      hi: 'थ्रिप्स व फल सड़न (डाईबैक)',
      te: 'నల్ల తామర పురుగు & కొమ్మ ఎండు',
      kn: 'ಕಪ್ಪು ಥ್ರಿಪ್ಸ್ ಮತ್ತು ಕಾಯಿ ಕೊಳೆ',
      ta: 'இலை பேன் & காய் அழுகல்',
      gu: 'થ્રીપ્સ અને ફળનો સડો / પાન કોકડવા'
    },
    descriptions: {
      en: 'Upward boat leaf curling, sunken black spots on pods, twig die-back from tip downwards.',
      hi: 'पत्तियों का नाव की तरह मुड़ना और फलों पर काले धब्बे पड़ना।',
      te: 'ఆకులు పైకి దోనెలా మారడం, కాయలపై నల్లటి గుంట మచ్చలు, కొమ్మలు పైనుండి ఎండిపోవడం.',
      kn: 'ಎಲೆಗಳು ದೋಣಿಯಂತೆ ಮುದುರಿಕೊಳ್ಳುವುದು, ಕಾಯಿಗಳ ಮೇಲೆ ಕಪ್ಪು ಗುಳಿ ಮಚ್ಚೆಗಳು.',
      ta: 'இலைகள் படகு போல வளைதல், காய்களில் கருப்பு புள்ளிகள் ஏற்படுதல்.',
      gu: 'પાન હોડી જેવા ઉપર વળી જવા, મરચાં પર કાળા ડાઘા અને ડાળીઓ ટોચથી સુકાઈ જવી.'
    },
    dosageSummaries: {
      en: 'Fipronil 5% SC @ 2ml / L water + Azoxystrobin 23% SC @ 1ml / L water',
      hi: 'फिप्रोनिल 5% SC 2 मिली प्रति लीटर + एमस्टार टॉप 1 मिली प्रति लीटर',
      te: 'ఫిప్రోనిల్ 5% SC 2 మి.లీ + అజోక్సిస్ట్రోబిన్ 1 మి.లీ లీటరు నీటికి',
      kn: 'ಫಿಪ್ರೋನಿಲ್ 5% SC 2 ಮಿಲಿ + ಅಮಿಸ್ಟಾರ್ ಟಾಪ್ 1 ಮಿಲಿ ಪ್ರತಿ ಲೀಟರ್',
      ta: 'பிப்ரோனில் 5% SC 2 மி.லி + அமிஸ்டார் டாப் 1 மி.லி லிட்டருக்கு',
      gu: 'ફિપ્રોનિલ ૫% SC @ ૨ મિલી/લિટર + એઝોક્સીસ્ટ્રોબિન ૨૩% SC @ ૧ મિલી/લિટર'
    }
  },
  {
    id: 'sample-potato-early-blight',
    category: 'Fungal Disease',
    severity: 'Moderate',
    thumbnail: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    healthScore: 61,
    affectedArea: 22,
    yieldRisk: 30,
    promptContext: 'Potato lower leaves with concentric dark brown target rings of Alternaria early blight.',
    names: {
      en: 'Potato',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ta: 'உருளைக்கிழங்கு',
      gu: 'બટાકા'
    },
    issues: {
      en: 'Early Blight (Alternaria solani)',
      hi: 'अगेती झुलसा रोग',
      te: 'అల్ట్రనేరియా ఆకుమచ్చ తెగులు',
      kn: 'ಮುಂಗಾರು ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'முன் பருவ கருகல் நோய்',
      gu: 'અગેતરો સુકારો (અલ્ટરનેરિયા)'
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
      en: 'Mancozeb 75% WP @ 2.5g / L water or Chlorothalonil 75% WP @ 2.0g / L water',
      hi: 'मैंकोजेब 2.5 ग्राम प्रति लीटर या क्लोरोथैलोनील 2 ग्राम प्रति लीटर पानी',
      te: 'మాంకోజెబ్ లీటరు నీటికి 2.5 గ్రాములు లేదా క్లోరోథలోనిల్ 2.0 గ్రాములు',
      kn: 'ಮ್ಯಾಂಕೋಜೆಬ್ 2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಕ್ಲೋರೋಥಾಲೋನಿಲ್ 2.0 ಗ್ರಾಂ',
      ta: 'மான்கோசெப் லிட்டருக்கு 2.5 கிராம் அல்லது குளோரோதலோனில் 2.0 கிராம்',
      gu: 'મેન્કોઝેબ ૭૫% WP @ ૨.૫ ગ્રામ/લિટર અથવા ક્લોરોથેલોનિલ ૭૫% WP @ ૨.૦ ગ્રામ/લિટર'
    }
  },
  {
    id: 'sample-wheat-healthy',
    category: 'Healthy',
    severity: 'Low',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    healthScore: 94,
    affectedArea: 2,
    yieldRisk: 0,
    promptContext: 'Healthy vigorous wheat plant leaf canopy with strong green pigmentation and zero pest or blight lesions.',
    names: {
      en: 'Wheat',
      hi: 'गेहूं',
      te: 'గోధుమ',
      kn: 'ಗೋಧಿ',
      ta: 'கோதுமை',
      gu: 'ઘઉં'
    },
    issues: {
      en: 'Healthy Crop (No Disease)',
      hi: 'स्वस्थ फसल (रोगमुक्त)',
      te: 'ఆరోగ్యకరమైన పైరు (తెగుళ్లు లేవు)',
      kn: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ (ರೋಗವಿಲ್ಲ)',
      ta: 'ஆரோக்கியமான பயிர் (நோயற்றது)',
      gu: 'તંદુરસ્ત પાક (રોગમુક્ત)'
    },
    descriptions: {
      en: 'Vigorous deep green leaves, clean venation, zero fungal spores or pest bites. Excellent photosynthesis.',
      hi: 'गहरी हरी स्वस्थ पत्तियां, साफ शिराएं, कोई फफूंद या कीड़े का प्रकोप नहीं।',
      te: 'ఆరోగ్యకరమైన ముదురు ఆకుపచ్చని ఆకులు, మచ్చలు లేదా పురుగుల నష్టం ఏమీ లేదు.',
      kn: 'ಸದೃಢವಾದ ಹಸಿರು ಎಲೆಗಳು, ಯಾವುದೇ ಶಿಲೀಂಧ್ರ ಅಥವಾ ಕೀಟದ ಹಾನಿ ಇಲ್ಲ.',
      ta: 'அடர் பச்சை நிற ஆரோக்கியமான இலைகள், பூச்சி அல்லது பூஞ்சை பாதிப்புகள் இல்லை.',
      gu: 'ઘેરા લીલા સ્વસ્થ પાન, સાફ નસો, કોઈ પણ ફૂગ કે જીવાતના ઉપદ્રવ વગર.'
    },
    dosageSummaries: {
      en: 'Maintain balanced N-P-K fertilization and preventive bio-stimulants.',
      hi: 'संतुलित खाद और निवारक जैव-उर्वरक का प्रयोग जारी रखें।',
      te: 'సమతుల్య ఎరువులు మరియు రక్షణగా జీవ శిలీంద్రనాశనులను వాడండి.',
      kn: 'ಸಮತೋಲಿತ ಗೊಬ್ಬರ ಮತ್ತು ಮುಂಜಾಗ್ರತಾ ಜೈವಿಕ ಪರಿಹಾರಗಳನ್ನು ಮುಂದುವರಿಸಿ.',
      ta: 'சீரான உர மேலாண்மை மற்றும் இயற்கை நுண்ணுயிர் உரங்களை தொடரவும்.',
      gu: 'સંતુલિત N-P-K ખાતર અને સમયસર પિયત વ્યવસ્થાપન જાળવો.'
    }
  }
];

export function getLocalizedSamples(lang: SupportedLanguage): CropSample[] {
  return CROP_SAMPLES_RAW.map((raw) => ({
    id: raw.id,
    cropName: raw.names[lang] || raw.names.en,
    leafIssue: raw.issues[lang] || raw.issues.en,
    category: raw.category,
    severity: raw.severity,
    thumbnail: raw.thumbnail,
    description: raw.descriptions[lang] || raw.descriptions.en,
    promptContext: raw.promptContext,
    healthScore: raw.healthScore,
    affectedArea: raw.affectedArea,
    yieldRisk: raw.yieldRisk,
    dosageSummary: raw.dosageSummaries[lang] || raw.dosageSummaries.en,
  }));
}
