import { SupportedLanguage, FarmerProfile } from '../types/farm';

export interface StateDistrictConfig {
  state: string;
  stateCode: string;
  vernacular: Record<SupportedLanguage, string>;
  defaultLat: number;
  defaultLon: number;
  agroZone: string;
  soilType: string;
  districts: string[];
}

export const INDIAN_STATES_CONFIG: StateDistrictConfig[] = [
  {
    state: 'Gujarat',
    stateCode: 'GJ',
    vernacular: {
      en: 'Gujarat',
      hi: 'गुजरात',
      te: 'గుజరాత్',
      kn: 'ಗುಜರಾತ್',
      ta: 'குஜராத்',
      gu: 'ગુજરાત'
    },
    defaultLat: 22.3039,
    defaultLon: 70.8022,
    agroZone: 'Gujarat Plains & Hills Zone (Saurashtra / North Gujarat)',
    soilType: 'Medium Black Soil & Sandy Loam (ગોરાડુ / કાળી જમીન)',
    districts: [
      'Rajkot', 'Junagadh', 'Ahmedabad', 'Anand', 'Amreli', 'Bhavnagar', 
      'Mehsana', 'Vadodara', 'Banaskantha', 'Kutch', 'Surat', 'Jamnagar',
      'Surendranagar', 'Patan', 'Sabarkantha', 'Bharuch', 'Kheda', 'Navsari'
    ]
  },
  {
    state: 'Telangana',
    stateCode: 'TG',
    vernacular: {
      en: 'Telangana',
      hi: 'तेलंगाना',
      te: 'తెలంగాణ',
      kn: 'ತೆಲಂಗಾಣ',
      ta: 'தெலுங்கானா',
      gu: 'તેલંગાણા'
    },
    defaultLat: 17.9784,
    defaultLon: 79.5941,
    agroZone: 'Southern Plateau & Hills Zone (Telangana Agro-Zone)',
    soilType: 'Red Sandy Loam (చల్క నేలలు) & Deep Black Cotton Soils',
    districts: [
      'Warangal', 'Karimnagar', 'Nizamabad', 'Nalgonda', 'Khammam', 
      'Sangareddy', 'Mahbubnagar', 'Adilabad', 'Siddipet', 'Rangareddy',
      'Jagtial', 'Kamareddy', 'Suryapet', 'Mancherial', 'Bhadradri Kothagudem'
    ]
  },
  {
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    vernacular: {
      en: 'Andhra Pradesh',
      hi: 'आंध्र प्रदेश',
      te: 'ఆంధ్ర ప్రదేశ్',
      kn: 'ಆಂಧ್ರಪ್ರದೇಶ',
      ta: 'ஆந்திரா',
      gu: 'આંધ્રપ્રદેશ'
    },
    defaultLat: 16.3067,
    defaultLon: 80.4365,
    agroZone: 'East Coast Plains & Hills Zone (Krishna-Godavari Zone)',
    soilType: 'Coastal Alluvium & Deep Black Cotton Soil (నల్లరేగడి)',
    districts: [
      'Guntur', 'Krishna', 'West Godavari', 'East Godavari', 'Kurnool', 
      'Prakasam', 'Anantapur', 'Chittoor', 'Visakhapatnam', 'YSR Kadapa',
      'Nellore', 'Srikakulam', 'Vizianagaram', 'Bapatla', 'Eluru', 'Palnadu'
    ]
  },
  {
    state: 'Karnataka',
    stateCode: 'KA',
    vernacular: {
      en: 'Karnataka',
      hi: 'कर्नाटक',
      te: 'కర్ణాటక',
      kn: 'ಕರ್ನಾಟಕ',
      ta: 'கர்நாடகா',
      gu: 'કર્ણાટક'
    },
    defaultLat: 14.4644,
    defaultLon: 75.9218,
    agroZone: 'Southern Plateau & Hill Zone (Karnataka Central/Northern Plains)',
    soilType: 'Red Sandy Loam & Deep Black Soils (ಕಪ್ಪು ಮಣ್ಣು)',
    districts: [
      'Belagavi', 'Davanagere', 'Mandya', 'Shivamogga', 'Hassan', 
      'Dharwad', 'Ballari', 'Tumakuru', 'Mysuru', 'Haveri', 
      'Vijayapura', 'Kalaburagi', 'Bagalkote', 'Chitradurga', 'Raichur', 'Koppal'
    ]
  },
  {
    state: 'Tamil Nadu',
    stateCode: 'TN',
    vernacular: {
      en: 'Tamil Nadu',
      hi: 'तमिलनाडु',
      te: 'తమిళనాడు',
      kn: 'ತಮಿಳುನಾಡು',
      ta: 'தமிழ்நாடு',
      gu: 'તમિલનાડુ'
    },
    defaultLat: 10.7870,
    defaultLon: 79.1378,
    agroZone: 'Southern Coastal Plains Zone (Cauvery Delta & Western Zone)',
    soilType: 'Red Loamy Soils (செம்மண்) & Coastal Deltaic Alluvium',
    districts: [
      'Thanjavur', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 
      'Erode', 'Tirunelveli', 'Dindigul', 'Villupuram', 'Cuddalore', 
      'Thiruvarur', 'Nagapattinam', 'Theni', 'Karur', 'Namakkal', 'Virudhunagar'
    ]
  },
  {
    state: 'Maharashtra',
    stateCode: 'MH',
    vernacular: {
      en: 'Maharashtra',
      hi: 'महाराष्ट्र',
      te: 'మహారాష్ట్ర',
      kn: 'ಮಹಾರಾಷ್ಟ್ರ',
      ta: 'மகாராஷ்டிரா',
      gu: 'મહારાષ્ટ્ર'
    },
    defaultLat: 19.9975,
    defaultLon: 73.7898,
    agroZone: 'Western Plateau & Hills Zone (Marathwada / Vidarbha / Khandesh)',
    soilType: 'Deep Black Cotton Soil (काळी माती / Regur) & Red Laterite',
    districts: [
      'Nashik', 'Pune', 'Jalgaon', 'Ahmednagar', 'Kolhapur', 'Solapur', 
      'Nagpur', 'Amravati', 'Yavatmal', 'Chhatrapati Sambhajinagar', 
      'Nanded', 'Satara', 'Sangli', 'Latur', 'Buldhana', 'Akola'
    ]
  },
  {
    state: 'Punjab',
    stateCode: 'PB',
    vernacular: {
      en: 'Punjab',
      hi: 'पंजाब',
      te: 'పంజాబ్',
      kn: 'ಪಂಜಾಬ್',
      ta: 'பஞ்சாப்',
      gu: 'પંજાબ'
    },
    defaultLat: 30.9010,
    defaultLon: 75.8573,
    agroZone: 'Trans-Gangetic Plains Zone (Punjab Agro-Climatic Zone)',
    soilType: 'Fertile Indo-Gangetic Alluvial Silt Loam',
    districts: [
      'Ludhiana', 'Bathinda', 'Amritsar', 'Jalandhar', 'Patiala', 
      'Sangrur', 'Firozpur', 'Mansa', 'Moga', 'Fazilka', 'Hoshiarpur', 'Gurdaspur'
    ]
  },
  {
    state: 'Haryana',
    stateCode: 'HR',
    vernacular: {
      en: 'Haryana',
      hi: 'हरियाणा',
      te: 'హర్యానా',
      kn: 'ಹರಿಯಾಣ',
      ta: 'ஹரியானா',
      gu: 'હરિયાણા'
    },
    defaultLat: 29.6857,
    defaultLon: 76.9905,
    agroZone: 'Trans-Gangetic Plains Zone (Eastern & Western Haryana)',
    soilType: 'Alluvial Loam & Sandy Loam Soils',
    districts: [
      'Karnal', 'Hisar', 'Sirsa', 'Kurukshetra', 'Ambala', 
      'Jind', 'Rohtak', 'Fatehabad', 'Yamunanagar', 'Kaithal', 'Bhiwani'
    ]
  },
  {
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    vernacular: {
      en: 'Madhya Pradesh',
      hi: 'मध्य प्रदेश',
      te: 'మధ్యప్రదేశ్',
      kn: 'ಮಧ್ಯಪ್ರದೇಶ',
      ta: 'மத்திய பிரதேசம்',
      gu: 'મધ્યપ્રદેશ'
    },
    defaultLat: 23.1765,
    defaultLon: 75.7885,
    agroZone: 'Central Plateau & Hills Zone (Malwa & Nimar Plains)',
    soilType: 'Medium & Deep Black Clayey Soil (काली मिट्टी)',
    districts: [
      'Ujjain', 'Indore', 'Narmadapuram (Hoshangabad)', 'Sehore', 'Dewas', 
      'Dhar', 'Khargone', 'Sagar', 'Jabalpur', 'Khandwa', 'Ratlam', 'Mandsaur', 'Chhindwara'
    ]
  },
  {
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    vernacular: {
      en: 'Uttar Pradesh',
      hi: 'उत्तर प्रदेश',
      te: 'ఉత్తరప్రదేశ్',
      kn: 'ಉತ್ತರಪ್ರದೇಶ',
      ta: 'உத்தரபிரதேசம்',
      gu: 'ઉત્તર પ્રદેશ'
    },
    defaultLat: 25.3176,
    defaultLon: 82.9739,
    agroZone: 'Upper & Middle Gangetic Plains Zone (Purvanchal & Doab)',
    soilType: 'Deep Alluvial Silt Loam (दोमट मिट्टी)',
    districts: [
      'Varanasi', 'Meerut', 'Bareilly', 'Aligarh', 'Gorakhpur', 
      'Agra', 'Prayagraj', 'Muzaffarnagar', 'Basti', 'Ayodhya', 'Moradabad', 'Bulandshahr'
    ]
  },
  {
    state: 'Rajasthan',
    stateCode: 'RJ',
    vernacular: {
      en: 'Rajasthan',
      hi: 'राजस्थान',
      te: 'రాజస్థాన్',
      kn: 'ರಾಜಸ್ಥಾನ',
      ta: 'ராஜஸ்தான்',
      gu: 'રાજસ્થાન'
    },
    defaultLat: 25.1825,
    defaultLon: 75.8398,
    agroZone: 'Western Dry & Semi-Arid Plains Zone (Hadoti & Marwar)',
    soilType: 'Sandy Loam & Desert Soil to Black Clay Loam in South-East',
    districts: [
      'Kota', 'Sri Ganganagar', 'Jodhpur', 'Alwar', 'Jaipur', 
      'Baran', 'Bundi', 'Bikaner', 'Nagaur', 'Hanumangarh', 'Jhalawar', 'Chittorgarh'
    ]
  }
];

export const CROP_OPTIONS = [
  { id: 'cotton', name: 'Cotton (કપાસ / పత్తి)', icon: '🌾', category: 'Fiber / Cash' },
  { id: 'paddy', name: 'Paddy / Rice (ડાંગર / వరి)', icon: '🌾', category: 'Cereal' },
  { id: 'tomato', name: 'Tomato (ટમેટા / టమాట)', icon: '🍅', category: 'Vegetable' },
  { id: 'chilli', name: 'Chilli (મરચી / మిరప)', icon: '🌶️', category: 'Spices' },
  { id: 'maize', name: 'Maize / Corn (મકાઈ / మొక్కజొన్న)', icon: '🌽', category: 'Cereal' },
  { id: 'potato', name: 'Potato (બટાકા / బంగాళాదుంప)', icon: '🥔', category: 'Tuber' },
  { id: 'wheat', name: 'Wheat (ઘઉં / గోధుమ)', icon: '🌾', category: 'Cereal' },
  { id: 'groundnut', name: 'Groundnut / Peanut (મગફળી / వేరుశనగ)', icon: '🥜', category: 'Oilseed' },
  { id: 'soybean', name: 'Soybean (સોયાબીન / సోయాబీన్)', icon: '🌱', category: 'Oilseed' },
  { id: 'sugarcane', name: 'Sugarcane (શેરડી / చెరకు)', icon: '🎋', category: 'Sugar' },
  { id: 'onion', name: 'Onion (ડુંગળી / ఉల్లిపాయ)', icon: '🧅', category: 'Vegetable' },
  { id: 'mustard', name: 'Mustard (રાયડો / ఆవాలు)', icon: '🌼', category: 'Oilseed' }
];

export const SOIL_OPTIONS = [
  'Medium Black Cotton Soil (કાળી જમીન / నల్లరేగడి)',
  'Red Sandy Loam Soil (રાતી જમીન / చల్క నేలలు)',
  'Clay Loam / Deltaic Soil (ચીકણી જમીન / బంకమట్టి)',
  'Alluvial Silt Loam (કાંપવાળી જમીન / ఒండ్రు నేల)',
  'Coastal Sandy Alluvium (રેતાળ જમીન / ఇసుక నేల)',
  'Laterite Soil (કાંકરાવાળી જમીન)'
];

export const IRRIGATION_OPTIONS = [
  'Drip Irrigation (ટપક પદ્ધતિ / బిందు సేద్యం)',
  'Borewell / Tube-well Flood (બોરવેલ પિયત / బోరుబావి)',
  'Canal Water (નહેરનું પાણી / కాలువ నీరు)',
  'Sprinkler System (ફુવારા પદ્ધતિ / స్ప్రింక్లర్)',
  'Rainfed / Dryland Farming (વરસાદ આધારિત / వర్షాధార పంట)'
];

export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  id: 'kisan-profile-default',
  name: 'Ramesh Patel',
  phone: '9876543210',
  state: 'Gujarat',
  district: 'Rajkot',
  subdistrict: 'Gondal',
  village: 'Virpur',
  displayName: 'Virpur, Rajkot, Gujarat',
  latitude: 21.8440,
  longitude: 70.7620,
  agroClimaticZone: 'Gujarat Plains & Hills Zone (Saurashtra)',
  soilType: 'Medium Black Soil & Sandy Loam (ગોરાડુ / કાળી જમીન)',
  irrigationType: 'Drip Irrigation (ટપક પદ્ધતિ / బిందు సేద్యం)',
  landSizeAcres: 3.5,
  primaryCrops: ['Cotton (કપાસ / పత్తి)', 'Groundnut / Peanut (મગફળી / వేరుశనగ)', 'Chilli (મરચી / మిరప)'],
  preferredLanguage: 'gu',
  registeredAt: new Date().toISOString(),
  isRegistered: false
};

export const AUTH_TRANSLATIONS: Record<SupportedLanguage, {
  registrationTitle: string;
  registrationSubtitle: string;
  loginTab: string;
  registerTab: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  languageSelectLabel: string;
  locationSectionTitle: string;
  autoGpsBtn: string;
  gpsDetecting: string;
  stateLabel: string;
  districtLabel: string;
  villageLabel: string;
  villagePlaceholder: string;
  landSizeLabel: string;
  acresUnit: string;
  primaryCropsLabel: string;
  soilTypeLabel: string;
  irrigationLabel: string;
  completeRegistrationBtn: string;
  loginBtn: string;
  skipGuestBtn: string;
  kisanCardTitle: string;
  verifiedFarmer: string;
  appliedEverywhereBadge: string;
  editProfileTitle: string;
  updateLocationBtn: string;
  saveChangesBtn: string;
  profileUpdatedSuccess: string;
  welcomeBack: string;
  farmAcreage: string;
  registeredLocation: string;
  switchFarmer: string;
  myProfile: string;
  enterMobileToLogin: string;
  demoAutofill: string;
}> = {
  en: {
    registrationTitle: 'Farmer One-Time Registration & Field Setup',
    registrationSubtitle: 'Set your farm location and crops once to calibrate AI diagnostics, live agro-weather, spray dosages, and crop advisories.',
    loginTab: 'Existing Farmer Login',
    registerTab: 'New Farmer Registration',
    fullNameLabel: 'Farmer Full Name',
    fullNamePlaceholder: 'e.g. Ramesh Patel / Koushal Kumar',
    mobileLabel: 'Mobile Phone Number',
    mobilePlaceholder: '10-digit mobile number',
    languageSelectLabel: 'Preferred App Language',
    locationSectionTitle: 'Farm Region & Field Coordinates',
    autoGpsBtn: 'Auto-Detect via Live GPS',
    gpsDetecting: 'Acquiring Field Geolocation...',
    stateLabel: 'State / Province',
    districtLabel: 'District / Taluk',
    villageLabel: 'Village / Farm Plot Name',
    villagePlaceholder: 'e.g. Rampur Farm / Survey No. 42',
    landSizeLabel: 'Farm Land Size',
    acresUnit: 'Acres',
    primaryCropsLabel: 'Primary Crops Cultivated',
    soilTypeLabel: 'Field Soil Characteristics',
    irrigationLabel: 'Primary Irrigation Facility',
    completeRegistrationBtn: 'Register & Launch Farm Dashboard',
    loginBtn: 'Login to My Farm',
    skipGuestBtn: 'Skip for now (Guest Mode)',
    kisanCardTitle: 'Kisan Digital ID Card',
    verifiedFarmer: 'Registered Farmer',
    appliedEverywhereBadge: 'Active & Applied to All Weather, Scans & Dosages',
    editProfileTitle: 'My Farm Profile & Regional Settings',
    updateLocationBtn: 'Update Farm Coordinates',
    saveChangesBtn: 'Save & Apply Updates',
    profileUpdatedSuccess: 'Farm Profile and Regional Settings updated successfully!',
    welcomeBack: 'Welcome back, Kisan',
    farmAcreage: 'Land Area',
    registeredLocation: 'Field Hub',
    switchFarmer: 'Switch Account / Re-register',
    myProfile: 'Kisan Profile',
    enterMobileToLogin: 'Enter your 10-digit mobile number to access your saved farm data',
    demoAutofill: 'Auto-fill Demo Farmer Profile'
  },
  gu: {
    registrationTitle: 'ખેડૂત એક વખતની નોંધણી અને ખેતર સ્થાન',
    registrationSubtitle: 'તમારું ખેતર અને પાક એકવાર સેટ કરો જેથી હવામાન, રોગ નિદાન, દવાનો ડોઝ અને માર્ગદર્શન આપમેળે અનુકૂળ થાય.',
    loginTab: 'હાલના ખેડૂત લોગિન',
    registerTab: 'નવી ખેડૂત નોંધણી',
    fullNameLabel: 'ખેડૂતનું પૂરું નામ',
    fullNamePlaceholder: 'દા.ત. રમેશભાઈ પટેલ',
    mobileLabel: 'મોબાઇલ નંબર',
    mobilePlaceholder: '૧૦ આંકડાનો મોબાઇલ નંબર',
    languageSelectLabel: 'પસંદગીની ભાષા',
    locationSectionTitle: 'ખેતરનો પ્રદેશ અને જીપીએસ લોકેશન',
    autoGpsBtn: 'જીપીએસ દ્વારા આપોઆપ શોધો',
    gpsDetecting: 'ખેતરનું સ્થાન શોધી રહ્યા છીએ...',
    stateLabel: 'રાજ્ય',
    districtLabel: 'જિલ્લો',
    villageLabel: 'ગામ / ખેતરનું નામ',
    villagePlaceholder: 'દા.ત. વીરપુર ગામ / સર્વે નં. ૪૨',
    landSizeLabel: 'જમીનનું માપ',
    acresUnit: 'વીઘા / એકર',
    primaryCropsLabel: 'વાવેતર કરેલા મુખ્ય પાક',
    soilTypeLabel: 'જમીનનો પ્રકાર',
    irrigationLabel: 'પિયત વ્યવસ્થા',
    completeRegistrationBtn: 'નોંધણી પૂર્ણ કરો અને ડેશબોર્ડ ખોલો',
    loginBtn: 'મારા ખેતરમાં પ્રવેશ કરો',
    skipGuestBtn: 'હમણાં માટે રહેવા દો (ગેસ્ટ)',
    kisanCardTitle: 'કિસાન ડિજિટલ ઓળખ કાર્ડ',
    verifiedFarmer: 'પ્રમાણિત ખેડૂત',
    appliedEverywhereBadge: 'સમગ્ર એપ્લિકેશનમાં આ સ્થાન લાગુ થયેલ છે',
    editProfileTitle: 'મારી ખેડૂત પ્રોફાઇલ અને સ્થાન સેટિંગ્સ',
    updateLocationBtn: 'સ્થાન બદલો',
    saveChangesBtn: 'સુધારા સાચવો',
    profileUpdatedSuccess: 'ખેડૂત પ્રોફાઇલ અને સ્થાન સફળતાપૂર્વક સાચવવામાં આવ્યું!',
    welcomeBack: 'સ્વાગત છે, ખેડૂત મિત્ર',
    farmAcreage: 'જમીન વિસ્તાર',
    registeredLocation: 'મુખ્ય ખેતર',
    switchFarmer: 'ખાતું બદલો / નવી નોંધણી',
    myProfile: 'ખેડૂત પ્રોફાઇલ',
    enterMobileToLogin: 'તમારા ખેતરની માહિતી જોવા માટે મોબાઇલ નંબર દાખલ કરો',
    demoAutofill: 'ડેમો પ્રોફાઇલ ભરો'
  },
  hi: {
    registrationTitle: 'किसान एकमुश्त पंजीकरण और स्थान निर्धारण',
    registrationSubtitle: 'अपने खेत का स्थान और फसलें एक बार सेट करें ताकि मौसम, रोग पहचान, दवा की मात्रा और सलाह तुरंत अनुकूलित हो जाएं।',
    loginTab: 'मौजूदा किसान लॉगिन',
    registerTab: 'नया किसान पंजीकरण',
    fullNameLabel: 'किसान का पूरा नाम',
    fullNamePlaceholder: 'उदा. रमेश पटेल / कौशल कुमार',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
    languageSelectLabel: 'पसंदीदा भाषा',
    locationSectionTitle: 'खेत का क्षेत्र और जीपीएस स्थान',
    autoGpsBtn: 'लाइव जीपीएस से स्वतः खोजें',
    gpsDetecting: 'खेत की लोकेशन खोजी जा रही है...',
    stateLabel: 'राज्य',
    districtLabel: 'ज़िला / तहसील',
    villageLabel: 'गाँव / खेत का नाम',
    villagePlaceholder: 'उदा. रामपुर खेत / खसरा नं. 42',
    landSizeLabel: 'जमीन का रकबा',
    acresUnit: 'एकड़',
    primaryCropsLabel: 'मुख्य फसलें',
    soilTypeLabel: 'मिट्टी की बनावट',
    irrigationLabel: 'सिंचाई का साधन',
    completeRegistrationBtn: 'पंजीकरण पूरा करें और शुरू करें',
    loginBtn: 'अपने खेत में प्रवेश करें',
    skipGuestBtn: 'अभी छोड़ें (गेस्ट मोड)',
    kisanCardTitle: 'किसान डिजिटल पहचान पत्र',
    verifiedFarmer: 'प्रमाणित किसान',
    appliedEverywhereBadge: 'मौसम, स्कैन और दवा गणना में यह स्थान सक्रिय है',
    editProfileTitle: 'मेरी किसान प्रोफाइल और स्थान सेटिंग्स',
    updateLocationBtn: 'खेत का स्थान बदलें',
    saveChangesBtn: 'परिवर्तन सहेजें',
    profileUpdatedSuccess: 'किसान प्रोफाइल सफलतापूर्वक अपडेट की गई!',
    welcomeBack: 'स्वागत है, किसान बंधु',
    farmAcreage: 'रकबा',
    registeredLocation: 'मुख्य खेत',
    switchFarmer: 'खाता बदलें / पुनः पंजीकृत करें',
    myProfile: 'किसान प्रोफाइल',
    enterMobileToLogin: 'खेत का डेटा देखने के लिए अपना मोबाइल नंबर दर्ज करें',
    demoAutofill: 'डेमो प्रोफाइल भरें'
  },
  te: {
    registrationTitle: 'రైతు ఒకేసారి నమోదు & స్థానం అమరిక',
    registrationSubtitle: 'మీ వ్యవసాయ ప్రాంతం మరియు పంటలను ఒకసారి నమోదు చేసుకోండి. ఇది వాతావరణం, తెగుళ్ల నిర్ధారణ, మందుల మోతాదు మరియు సలహాలకు వర్తిస్తుంది.',
    loginTab: 'రైతు లాగిన్',
    registerTab: 'కొత్త రైతు నమోదు',
    fullNameLabel: 'రైతు పూర్తి పేరు',
    fullNamePlaceholder: 'ఉదా. రమేష్ పటేల్ / రావు గారు',
    mobileLabel: 'మొబైల్ నంబర్',
    mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్',
    languageSelectLabel: 'ప్రాధాన్య భాష',
    locationSectionTitle: 'వ్యవసాయ ప్రాంతం & జీపీఎస్ లొకేషన్',
    autoGpsBtn: 'లైవ్ జీపీఎస్ ద్వారా స్వయంచాలకంగా గుర్తించండి',
    gpsDetecting: 'పొలం స్థానాన్ని కనుగొంటోంది...',
    stateLabel: 'రాష్ట్రం',
    districtLabel: 'జిల్లా / మండలం',
    villageLabel: 'గ్రామం / పొలం పేరు',
    villagePlaceholder: 'ఉదా. రాంపురం / సర్వే నెం. 42',
    landSizeLabel: 'భూమి విస్తీర్ణం',
    acresUnit: 'ఎకరాలు',
    primaryCropsLabel: 'ప్రధాన పంటలు',
    soilTypeLabel: 'నేల స్వభావం',
    irrigationLabel: 'నీటి పారుదల సౌకర్యం',
    completeRegistrationBtn: 'నమోదు పూర్తి చేసి డాష్‌బోర్డ్ తెరవండి',
    loginBtn: 'నా పొలంలోకి ప్రవేశించండి',
    skipGuestBtn: 'ఇప్పుడే వద్దు (అతిథి మోడ్)',
    kisanCardTitle: 'కిసాన్ డిజిటల్ గుర్తింపు కార్డు',
    verifiedFarmer: 'నమోదిత రైతు',
    appliedEverywhereBadge: 'వాతావరణం, స్కానింగ్ మరియు మోతాదులకు ఈ ప్రదేశం వర్తిస్తుంది',
    editProfileTitle: 'నా రైతు ప్రొఫైల్ & ప్రాంతీయ సెట్టింగ్‌లు',
    updateLocationBtn: 'లొకేషన్ మార్చండి',
    saveChangesBtn: 'మార్పులను సేవ్ చేయండి',
    profileUpdatedSuccess: 'రైతు ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!',
    welcomeBack: 'స్వాగతం, రైతు సోదరులారా',
    farmAcreage: 'భూమి విస్తీర్ణం',
    registeredLocation: 'వ్యవసాయ కేంద్రం',
    switchFarmer: 'ఖాతా మార్చండి / తిరిగి నమోదు చేయండి',
    myProfile: 'రైతు ప్రొఫైల్',
    enterMobileToLogin: 'డేటా చూడటానికి మీ మొబైల్ నంబర్‌ను నమోదు చేయండి',
    demoAutofill: 'డెమో ప్రొఫైల్ పూరించండి'
  },
  kn: {
    registrationTitle: 'ರೈತರ ನೋಂದಣಿ ಮತ್ತು ಸ್ಥಳ ನಿಗದಿ',
    registrationSubtitle: 'ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳ ಮತ್ತು ಬೆಳೆಗಳನ್ನು ಒಮ್ಮೆ ಹೊಂದಿಸಿ, ಇದು ಹವಾಮಾನ, ರೋಗ ಪತ್ತೆ ಮತ್ತು ಔಷಧ ಪ್ರಮಾಣಕ್ಕೆ ಅನ್ವಯಿಸುತ್ತದೆ.',
    loginTab: 'ರೈತ ಲಾಗಿನ್',
    registerTab: 'ಹೊಸ ರೈತ ನೋಂದಣಿ',
    fullNameLabel: 'ರೈತರ ಪೂರ್ಣ ಹೆಸರು',
    fullNamePlaceholder: 'ಉದಾ. ರಮೇಶ್ ಗೌಡ',
    mobileLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    mobilePlaceholder: '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    languageSelectLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    locationSectionTitle: 'ಕೃಷಿ ಪ್ರದೇಶ ಮತ್ತು ಜಿಪಿಎಸ್ ಸ್ಥಳ',
    autoGpsBtn: 'ಲೈವ್ ಜಿಪಿಎಸ್ ಮೂಲಕ ಗುರುತಿಸಿ',
    gpsDetecting: 'ಹೊಲದ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    stateLabel: 'ರಾಜ್ಯ',
    districtLabel: 'ಜಿಲ್ಲೆ / ತಾಲೂಕು',
    villageLabel: 'ಗ್ರಾಮ / ಹೊಲದ ಹೆಸರು',
    villagePlaceholder: 'ಉದಾ. ರಾಮಪುರ / ಸರ್ವೆ ನಂ. 42',
    landSizeLabel: 'ಭೂಮಿ ವಿಸ್ತೀರ್ಣ',
    acresUnit: 'ಎಕರೆ',
    primaryCropsLabel: 'ಪ್ರಮುಖ ಬೆಳೆಗಳು',
    soilTypeLabel: 'ಮಣ್ಣಿನ ಮಾದರಿ',
    irrigationLabel: 'ನೀರಾವರಿ ಸೌಲಭ್ಯ',
    completeRegistrationBtn: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ',
    loginBtn: 'ಲಾಗಿನ್ ಆಗಿ',
    skipGuestBtn: 'ಈಗ ಬೇಡ',
    kisanCardTitle: 'ಕಿಸಾನ್ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಚೀಟಿ',
    verifiedFarmer: 'ನೋಂದಾಯಿತ ರೈತ',
    appliedEverywhereBadge: 'ಇಡೀ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಈ ಸ್ಥಳವನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ',
    editProfileTitle: 'ರೈತ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸ್ಥಳ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    updateLocationBtn: 'ಸ್ಥಳ ನವೀಕರಿಸಿ',
    saveChangesBtn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    profileUpdatedSuccess: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
    welcomeBack: 'ಸ್ವಾಗತ, ರೈತ ಮಿತ್ರ',
    farmAcreage: 'ಭೂಮಿ ವಿಸ್ತೀರ್ಣ',
    registeredLocation: 'ಕೃಷಿ ಕೇಂದ್ರ',
    switchFarmer: 'ಖಾತೆ ಬದಲಾಯಿಸಿ',
    myProfile: 'ರೈತ ಪ್ರೊಫೈಲ್',
    enterMobileToLogin: 'ಮಾಹಿತಿ ನೋಡಲು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    demoAutofill: 'ಡೆಮೊ ಮಾಹಿತಿ ತುಂಬಿ'
  },
  ta: {
    registrationTitle: 'விவசாயி பதிவு மற்றும் பண்ணை இருப்பிடம்',
    registrationSubtitle: 'வானிலை, நோய் கண்டறிதல் மற்றும் மருந்து அளவுகளை துல்லியமாக பெற உங்கள் பண்ணை இருப்பிடத்தை பதிவு செய்யவும்.',
    loginTab: 'விவசாயி உள்நுழைவு',
    registerTab: 'புதிய விவசாயி பதிவு',
    fullNameLabel: 'விவசாயியின் முழு பெயர்',
    fullNamePlaceholder: 'எ.கா. ரமேஷ் குமார்',
    mobileLabel: 'மொபைல் எண்',
    mobilePlaceholder: '10 இலக்க மொபைல் எண்',
    languageSelectLabel: 'விருப்பமான மொழி',
    locationSectionTitle: 'பண்ணை பகுதி மற்றும் ஜிபிஎஸ் இடம்',
    autoGpsBtn: 'நேரலை ஜிபிஎஸ் மூலம் கண்டறி',
    gpsDetecting: 'பண்ணை இடம் கண்டறியப்படுகிறது...',
    stateLabel: 'மாநிலம்',
    districtLabel: 'மாவட்டம் / தாலுகா',
    villageLabel: 'கிராமம் / பண்ணை பெயர்',
    villagePlaceholder: 'எ.கா. ராம்புரம் / சர்வே எண். 42',
    landSizeLabel: 'நில பரப்பளவு',
    acresUnit: 'ஏக்கர்',
    primaryCropsLabel: 'பயிரிடப்படும் பயிர்கள்',
    soilTypeLabel: 'மண் வகை',
    irrigationLabel: 'பாசன முறை',
    completeRegistrationBtn: 'பதிவை முடித்து துவங்கவும்',
    loginBtn: 'உள்நுழைக',
    skipGuestBtn: 'இப்போது வேண்டாம்',
    kisanCardTitle: 'கிசான் டிஜிட்டல் அடையாள அட்டை',
    verifiedFarmer: 'பதிவு செய்யப்பட்ட விவசாயி',
    appliedEverywhereBadge: 'அனைத்து வானிலை மற்றும் மருந்து கணிப்புகளுக்கும் இது பொருந்தும்',
    editProfileTitle: 'என் விவசாயி சுயவிவரம்',
    updateLocationBtn: 'இடத்தை மாற்றவும்',
    saveChangesBtn: 'சேமிக்கவும்',
    profileUpdatedSuccess: 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!',
    welcomeBack: 'நல்வரவு, விவசாய தோழரே',
    farmAcreage: 'நில பரப்பளவு',
    registeredLocation: 'பண்ணை இருப்பிடம்',
    switchFarmer: 'கணக்கை மாற்றவும்',
    myProfile: 'விவசாயி சுயவிவரம்',
    enterMobileToLogin: 'தகவல்களை பார்க்க மொபைல் எண்ணை உள்ளிடவும்',
    demoAutofill: 'மாதிரி சுயவிவரம் நிரப்பவும்'
  }
};
