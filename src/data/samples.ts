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
      ta: 'தக்காளி'
    },
    issues: {
      en: 'Late Blight (Phytophthora infestans)',
      hi: 'पछेती झुलसा रोग',
      te: 'లేట్ బ్లైట్ (మచ్చల తెగులు)',
      kn: 'ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'லேட் பிளைட் (இலைக்கருகல்)'
    },
    descriptions: {
      en: 'Dark water-soaked necrotic lesions on leaf margins with pale halos, rapid foliage collapse in damp weather.',
      hi: 'पत्तियों के किनारों पर पानी से भीगे गहरे भूरे धब्बे, अधिक नमी में पूरी पत्ती सूख जाती है।',
      te: 'ఆకుల అంచులపై నీటి డాగుల వంటి నల్లటి మచ్చలు, చలి మరియు తేమ వాతావరణంలో వేగంగా వ్యాపిస్తుంది.',
      kn: 'ಎಲೆಗಳ ಅಂಚಿನಲ್ಲಿ ನೀರಿನಂತಹ ಕಂದು ಮಚ್ಚೆಗಳು, ತೇವಾಂಶದಲ್ಲಿ ಇಡೀ ಗಿಡವು ಬಾಡಿ ಒಣಗುತ್ತದೆ.',
      ta: 'இலை ஓரங்களில் நீர் போன்ற கருப்பு புள்ளிகள், அதிக ஈரப்பதத்தில் இலைகள் முற்றிலும் கருகிவிடும்.'
    },
    dosageSummaries: {
      en: 'Metalaxyl-M + Mancozeb @ 2.5g / L water or Copper Oxychloride @ 3g / L water',
      hi: 'मेटालेक्सिल + मैंकोजेब 2.5 ग्राम प्रति लीटर या कॉपर ऑक्सीक्लोराइड 3 ग्राम प्रति लीटर पानी',
      te: 'మెటలాక్సిల్ + మాంకోజెబ్ 2.5 గ్రాములు లీటరు నీటికి లేదా కాపర్ ఆక్సిక్లోరైడ్ 3 గ్రాములు',
      kn: 'ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್ 2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಅಥವಾ ತಾಮ್ರ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ 3 ಗ್ರಾಂ',
      ta: 'மெட்டலாக்சில் + மான்கோசெப் 2.5 கிராம் லிட்டருக்கு அல்லது காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம்'
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
      ta: 'நெல்'
    },
    issues: {
      en: 'Rice Blast (Magnaporthe oryzae)',
      hi: 'ब्लास्ट रोग (झोंका)',
      te: 'అగ్గి తెగులు',
      kn: 'ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
      ta: 'குலை நோய் (பிளாஸ்ட்)'
    },
    descriptions: {
      en: 'Diamond or spindle-shaped lesions with grayish-white centers and dark reddish-brown borders along leaf veins.',
      hi: 'पत्तियों पर कताई के आकार के राख जैसे धब्बे, भूरे किनारे और गंभीर स्थिति में गर्दन टूटना।',
      te: 'ఆకులపై కదురు ఆకారపు బూడిద రంగు మచ్చలు మరియు నల్లని అంచులు, పిలకలు ఎండిపోతాయి.',
      kn: 'ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದಿ ಬಣ್ಣದ ಮಚ್ಚೆಗಳು ಮತ್ತು ಕಂದು ಅಂಚುಗಳು.',
      ta: 'இலைகளில் கதிர் வடிவ சாம்பல் நிற புள்ளிகள் மற்றும் பழுப்பு நிற விளிம்புகள்.'
    },
    dosageSummaries: {
      en: 'Tricyclazole 75% WP @ 0.6g / L water or Azoxystrobin 23% SC @ 1.0ml / L water',
      hi: 'ट्राईसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर या एज़ोक्सीस्ट्रोबिन 1.0 मिली प्रति लीटर',
      te: 'ట్రైసైక్లాజోల్ 75% WP లీటరు నీటికి 0.6 గ్రాములు లేదా అజాక్సిస్ట్రోబిన్ 1.0 మి.లీ',
      kn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP ಲೀಟರ್ ನೀರಿಗೆ 0.6 ಗ್ರಾಂ ಅಥವಾ ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ 1.0 ಮಿಲಿ',
      ta: 'டிரைசைக்ளசோல் 75% WP லிட்டருக்கு 0.6 கிராம் அல்லது அசோக்ஸிஸ்ட்ரோபின் 1.0 மி.லி'
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
    promptContext: 'Cotton plant showing upward leaf curling, vein thickening, stunted nodes, and whitefly presence on leaf underside.',
    names: {
      en: 'Cotton',
      hi: 'कपास (नरमा)',
      te: 'పత్తి',
      kn: 'ಹತ್ತಿ',
      ta: 'பருத்தி'
    },
    issues: {
      en: 'Leaf Curl Virus & Whitefly',
      hi: 'पत्ती मरोड़ रोग (सफेद मक्खी)',
      te: 'ఆకు ముడుత తెగులు & తెల్లదోమ',
      kn: 'ಎಲೆ ಮುಟುರು ರೋಗ & ಬಿಳಿ ನೊಣ',
      ta: 'இலை சுருட்டு நோய் & வெள்ளை ஈ'
    },
    descriptions: {
      en: 'Upward curling of leaf margins, thick swollen veins, cup-shaped leaf enations underneath, stunted growth.',
      hi: 'पत्तियां ऊपर की ओर मुड़ जाती हैं, नसें मोटी हो जाती हैं और पौधों की बढ़वार रुक जाती है।',
      te: 'ఆకులు పైకి దోనెలా ముడుచుకుపోవడం, ఈనెలు లావుగా మారడం మరియు మొక్క ఎదుగుదల ఆగిపోవడం.',
      kn: 'ಎಲೆಗಳು ಮೇಲ್ಮುಖವಾಗಿ ಮುದುರಿಕೊಳ್ಳುವುದು, ಉಬ್ಬಿದ ನಾಳಗಳು ಮತ್ತು ಗಿಡದ ಬೆಳವಣಿಗೆ ಕುಂಠಿತವಾಗುವುದು.',
      ta: 'இலைகள் மேல்நோக்கி படகு போல சுருண்டு தடித்த நரம்புகளுடன் வளர்ச்சி குன்றி காணப்படும்.'
    },
    dosageSummaries: {
      en: 'Diafenthiuron 50% WP @ 1.2g / L or Neem Oil 10,000 ppm @ 3ml / L water',
      hi: 'डायफेन्थियूरोन 1.2 ग्राम प्रति लीटर या नीम का तेल 3 मिली प्रति लीटर पानी',
      te: 'డయాఫెంతియురాన్ లీటరు నీటికి 1.2 గ్రాములు లేదా వేపనూనె 3 మి.లీ',
      kn: 'ಡಯಾಫೆಂಥಿಯುರಾನ್ 1.2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 3 ಮಿಲಿ',
      ta: 'டயாபெந்தியூரான் லிட்டருக்கு 1.2 கிராம் அல்லது வேப்பெண்ணெய் 3 மி.லி'
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
    promptContext: 'Corn crop infested with fall armyworm: ragged leaf holes, saw-dust like frass in whorl, chewed central tissue.',
    names: {
      en: 'Maize (Corn)',
      hi: 'मक्का',
      te: 'మొక్కజొన్న',
      kn: 'ಮುಸುಕಿನ ಜೋಳ',
      ta: 'மக்காச்சோளம்'
    },
    issues: {
      en: 'Fall Armyworm (Spodoptera)',
      hi: 'फॉल आर्मीवर्म (सैनिक कीट)',
      te: 'కత్తెర పురుగు (ఫాల్ ఆర్మీవార్మ్)',
      kn: 'ಸೈನಿಕ ಹುಳು (ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್)',
      ta: 'படைப்புழு (பால் ஆர்மி வார்ம்)'
    },
    descriptions: {
      en: 'Ragged torn leaf whorls with deep feeding holes and sawdust-like frass inside the central leaf whorl.',
      hi: 'पत्तियों में बड़े गोल छेद और गोभ के अंदर लकड़ी के बुरादे जैसा कीट का मल भरा होता है।',
      te: 'ఆకులపై పెద్ద రంధ్రాలు, సుడిలో రంపపు పొట్టు లాంటి పురుగు మలం మరియు మొవ్వు తినివేయబడుతుంది.',
      kn: 'ಎಲೆಗಳಲ್ಲಿ ದೊಡ್ಡ ರಂಧ್ರಗಳು ಮತ್ತು ಸುಳಿಯೊಳಗೆ ಮರದ ಪುಡಿಯಂತಹ ತ್ಯಾಜ್ಯ ತುಂಬಿರುತ್ತದೆ.',
      ta: 'இலைகளில் பெரிய துளைகள் மற்றும் குருத்து பகுதியில் மரத்தூள் போன்ற கழிவுகள் காணப்படும்.'
    },
    dosageSummaries: {
      en: 'Emamectin Benzoate 5% SG @ 0.4g / L or Chlorantraniliprole 18.5% SC @ 0.3ml / L',
      hi: 'इमामेक्टिन बेंजोएट 0.4 ग्राम प्रति लीटर या क्लोरेंट्रानिलीप्रोल 0.3 मिली प्रति लीटर',
      te: 'ఇమామెక్టిన్ బెంజోయేట్ లీటరు నీటికి 0.4 గ్రాములు లేదా కోరాజెన్ 0.3 మి.లీ',
      kn: 'ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೋಯೆಟ್ 0.4 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಕೋರಾಜನ್ 0.3 ಮಿಲಿ',
      ta: 'எமாமெக்டின் பென்சோயேட் லிட்டருக்கு 0.4 கிராம் அல்லது கோராசன் 0.3 மி.லி'
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
    promptContext: 'Chilli crop with boat-shaped leaf curling and die-back twig necrosis.',
    names: {
      en: 'Chilli',
      hi: 'मिर्च',
      te: 'మిరప',
      kn: 'ಮೆಣಸಿನಕಾಯಿ',
      ta: 'மிளகாய்'
    },
    issues: {
      en: 'Anthracnose & Thrips Leaf Curl',
      hi: 'एन्थ्रेक्नोज व मरोड़िया रोग',
      te: 'కొమ్మ ఎండు & తామర పురుగుల ముడుత',
      kn: 'ಕೊಂಬೆ ಒಣಗುವ ರೋಗ & ಎಲೆ ಮುಟುರು',
      ta: 'நுனி கருகல் & இலை சுருட்டு நோய்'
    },
    descriptions: {
      en: 'Upward boat leaf curling caused by thrips with sunken necrotic lesions on foliage and twig dieback from tip downwards.',
      hi: 'थ्रिप्स से नाव जैसी मुड़ी पत्तियां, गहरे धब्बे और ऊपर से टहनियों का सूखना शुरू होता है।',
      te: 'ఆకులు పైకి దోనెలా ముడుచుకోవడం, ఆకులపై నల్లటి మచ్చలు మరియు కొమ్మలు పైనుండి ఎండిపోవడం.',
      kn: 'ದೋಣಿಯಾಕಾರದ ಎಲೆ ಮುದುರುವಿಕೆ ಮತ್ತು ಕೊಂಬೆಗಳು ಮೇಲಿಂದ ಕೆಳಕ್ಕೆ ಒಣಗುತ್ತಾ ಬರುತ್ತವೆ.',
      ta: 'இலைகள் படகு போல மேல்நோக்கி சுருங்குதல், கரும் புள்ளிகள் மற்றும் நுனி கிளைகள் காய்ந்து போகுதல்.'
    },
    dosageSummaries: {
      en: 'Fipronil 5% SC @ 2ml/L + Azoxystrobin 23% SC @ 1ml/L water',
      hi: 'फिप्रोनिल 2 मिली प्रति लीटर + एज़ोक्सीस्ट्रोबिन 1 मिली प्रति लीटर पानी',
      te: 'ఫిప్రోనిల్ లీటరు నీటికి 2 మి.లీ + అజాక్సిస్ట్రోబిన్ 1 మి.లీ',
      kn: 'ಫಿಪ್ರೋನಿಲ್ ಲೀಟರ್ ನೀರಿಗೆ 2 ಮಿಲಿ + ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ 1 ಮಿಲಿ',
      ta: 'பிப்ரோனில் லிட்டருக்கு 2 மி.லி + அசோக்ஸிஸ்ட்ரோபின் 1 மி.லி'
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
    promptContext: 'Potato foliage exhibiting concentric dark brown target-like rings with yellowing of surrounding tissues.',
    names: {
      en: 'Potato',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ta: 'உருளைக்கிழங்கு'
    },
    issues: {
      en: 'Early Blight (Alternaria solani)',
      hi: 'अगेती झुलसा रोग',
      te: 'ఎర్లీ బ్లైట్ (మచ్చల తెగులు)',
      kn: 'ಆರಂಭಿಕ ಅಂಗಮಾರಿ ರೋಗ',
      ta: 'ஆரம்பகால இலைக்கருகல்'
    },
    descriptions: {
      en: 'Concentric target-board rings and dry brown angular spots on lower leaves with yellow halos.',
      hi: 'निचली पत्तियों पर गोल छल्लेदार गहरे भूरे धब्बे और चारों ओर पीलापन दिखाई देता है।',
      te: 'ఆకులపై వలయాకారపు చక్రాల వంటి గోధుమ రంగు మచ్చలు, పసుపు రంగు వలయాలు.',
      kn: 'ಎಲೆಗಳ ಮೇಲೆ ಗುರಿಯ ಫಲಕದಂತಹ ಉಂಗುರಾಕಾರದ ಕಂದು ಮಚ್ಚೆಗಳು ಮತ್ತು ಹಳದಿ ಬಣ್ಣ.',
      ta: 'கீழ் இலைகளில் வளைய வடிவிலான கரும் பழுப்பு புள்ளிகள் மற்றும் மஞ்சள் நிற விளிம்புகள்.'
    },
    dosageSummaries: {
      en: 'Mancozeb 75% WP @ 2.5g / L water or Chlorothalonil 75% WP @ 2.0g / L water',
      hi: 'मैंकोजेब 2.5 ग्राम प्रति लीटर या क्लोरोथैलोनील 2 ग्राम प्रति लीटर पानी',
      te: 'మాంకోజెబ్ లీటరు నీటికి 2.5 గ్రాములు లేదా క్లోరోథలోనిల్ 2.0 గ్రాములు',
      kn: 'ಮ್ಯಾಂಕೋಜೆಬ್ 2.5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಕ್ಲೋರೋಥಾಲೋನಿಲ್ 2.0 ಗ್ರಾಂ',
      ta: 'மான்கோசெப் லிட்டருக்கு 2.5 கிராம் அல்லது குளோரோதலோனில் 2.0 கிராம்'
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
      ta: 'கோதுமை'
    },
    issues: {
      en: 'Healthy Crop (No Disease)',
      hi: 'स्वस्थ फसल (रोगमुक्त)',
      te: 'ఆరోగ్యకరమైన పైరు (తెగుళ్లు లేవు)',
      kn: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ (ರೋಗವಿಲ್ಲ)',
      ta: 'ஆரோக்கியமான பயிர் (நோயற்றது)'
    },
    descriptions: {
      en: 'Vigorous deep green leaves, clean venation, zero fungal spores or pest bites. Excellent photosynthesis.',
      hi: 'गहरी हरी स्वस्थ पत्तियां, साफ शिराएं, कोई फफूंद या कीड़े का प्रकोप नहीं।',
      te: 'ఆరోగ్యకరమైన ముదురు ఆకుపచ్చని ఆకులు, మచ్చలు లేదా పురుగుల నష్టం ఏమీ లేదు.',
      kn: 'ಸದೃಢವಾದ ಹಸಿರು ಎಲೆಗಳು, ಯಾವುದೇ ಶಿಲೀಂಧ್ರ ಅಥವಾ ಕೀಟದ ಹಾನಿ ಇಲ್ಲ.',
      ta: 'அடர் பச்சை நிற ஆரோக்கியமான இலைகள், பூச்சி அல்லது பூஞ்சை பாதிப்புகள் இல்லை.'
    },
    dosageSummaries: {
      en: 'Maintain balanced N-P-K fertilization and preventive bio-stimulants.',
      hi: 'संतुलित खाद और निवारक जैव-उर्वरक का प्रयोग जारी रखें।',
      te: 'సమతుల్య ఎరువులు మరియు రక్షణగా జీవ శిలీంద్రనాశనులను వాడండి.',
      kn: 'ಸಮತೋಲಿತ ಗೊಬ್ಬರ ಮತ್ತು ಮುಂಜಾಗ್ರತಾ ಜೈವಿಕ ಪರಿಹಾರಗಳನ್ನು ಮುಂದುವರಿಸಿ.',
      ta: 'சீரான உர மேலாண்மை மற்றும் இயற்கை நுண்ணுயிர் உரங்களை தொடரவும்.'
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
