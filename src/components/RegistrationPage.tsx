import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Globe, 
  User, 
  Crosshair, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { SupportedLanguage, FarmerProfile } from '../types/farm';
import { 
  INDIAN_STATES_CONFIG, 
  CROP_OPTIONS, 
  SOIL_OPTIONS, 
  IRRIGATION_OPTIONS, 
  DEFAULT_FARMER_PROFILE,
  AUTH_TRANSLATIONS 
} from '../data/registrationData';
import { reverseGeocodeCoords, inferAgroClimaticZone } from '../services/gpsService';
import { FARM_LOGO_SRC } from '../constants/assets';

interface RegistrationPageProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onCompleteAuth: (profile: FarmerProfile) => void;
  initialMode?: 'register' | 'login';
}

const REGIONAL_PRESETS = [
  { label: 'Rajkot (Gujarat)', state: 'Gujarat', district: 'Rajkot', village: 'Virpur', lat: 21.8440, lon: 70.7620 },
  { label: 'Warangal (Telangana)', state: 'Telangana', district: 'Warangal', village: 'Narsampet', lat: 17.9784, lon: 79.5941 },
  { label: 'Guntur (Andhra Pradesh)', state: 'Andhra Pradesh', district: 'Guntur', village: 'Tenali', lat: 16.3067, lon: 80.4365 },
  { label: 'Nashik (Maharashtra)', state: 'Maharashtra', district: 'Nashik', village: 'Dindori', lat: 19.9975, lon: 73.7898 },
  { label: 'Davanagere (Karnataka)', state: 'Karnataka', district: 'Davanagere', village: 'Harihar', lat: 14.4644, lon: 75.9218 },
  { label: 'Thanjavur (Tamil Nadu)', state: 'Tamil Nadu', district: 'Thanjavur', village: 'Kumbakonam', lat: 10.7870, lon: 79.1378 }
];

const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; script: string }[] = [
  { code: 'gu', label: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'hi', label: 'हिन्दी', script: 'Hindi' },
  { code: 'te', label: 'తెలుగు', script: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ta', label: 'தமிழ்', script: 'Tamil' },
  { code: 'en', label: 'English', script: 'English (EN)' }
];

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  currentLang,
  onLanguageChange,
  onCompleteAuth,
  initialMode = 'register'
}) => {
  const t = AUTH_TRANSLATIONS[currentLang] || AUTH_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialMode);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);

  // Registration Form Fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Rajkot');
  const [village, setVillage] = useState<string>('Virpur');
  const [latitude, setLatitude] = useState<number>(21.8440);
  const [longitude, setLongitude] = useState<number>(70.7620);
  const [agroZone, setAgroZone] = useState<string>('Gujarat Plains & Hills Zone (Saurashtra)');
  const [soilType, setSoilType] = useState<string>(SOIL_OPTIONS[0]);
  const [irrigation, setIrrigation] = useState<string>(IRRIGATION_OPTIONS[0]);
  const [landAcres, setLandAcres] = useState<number | string>(3.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([
    'Cotton (કપાસ / పత్తి)', 
    'Groundnut / Peanut (મગફળી / వేరుశనగ)'
  ]);

  // Login Form Fields
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginState, setLoginState] = useState<string>('Gujarat');
  const [loginDistrict, setLoginDistrict] = useState<string>('Rajkot');
  const [loginVillage, setLoginVillage] = useState<string>('Virpur Farm');
  const [loginLat, setLoginLat] = useState<number>(21.8440);
  const [loginLon, setLoginLon] = useState<number>(70.7620);
  const [loginAgroZone, setLoginAgroZone] = useState<string>('Gujarat Plains & Hills Zone (Saurashtra)');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Live GPS states
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState<string | null>(null);

  const currentStateConfig = INDIAN_STATES_CONFIG.find(s => s.state === selectedState) || INDIAN_STATES_CONFIG[0];
  const currentLoginStateConfig = INDIAN_STATES_CONFIG.find(s => s.state === loginState) || INDIAN_STATES_CONFIG[0];

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === currentLang) || LANGUAGE_OPTIONS[0];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const cfg = INDIAN_STATES_CONFIG.find(s => s.state === newState);
    if (cfg) {
      setSelectedDistrict(cfg.districts[0]);
      setLatitude(cfg.defaultLat);
      setLongitude(cfg.defaultLon);
      setAgroZone(cfg.agroZone);
      setSoilType(cfg.soilType);
      setGpsSuccessMsg(null);
    }
  };

  const handleLoginStateChange = (newState: string) => {
    setLoginState(newState);
    const cfg = INDIAN_STATES_CONFIG.find(s => s.state === newState);
    if (cfg) {
      setLoginDistrict(cfg.districts[0]);
      setLoginLat(cfg.defaultLat);
      setLoginLon(cfg.defaultLon);
      setLoginAgroZone(cfg.agroZone);
    }
  };

  const handleApplyPreset = (preset: typeof REGIONAL_PRESETS[0], isLogin = false) => {
    if (isLogin) {
      setLoginState(preset.state);
      setLoginDistrict(preset.district);
      setLoginVillage(preset.village);
      setLoginLat(preset.lat);
      setLoginLon(preset.lon);
      const cfg = INDIAN_STATES_CONFIG.find(s => s.state === preset.state);
      if (cfg) setLoginAgroZone(cfg.agroZone);
    } else {
      setSelectedState(preset.state);
      setSelectedDistrict(preset.district);
      setVillage(preset.village);
      setLatitude(preset.lat);
      setLongitude(preset.lon);
      const cfg = INDIAN_STATES_CONFIG.find(s => s.state === preset.state);
      if (cfg) {
        setAgroZone(cfg.agroZone);
        setSoilType(cfg.soilType);
      }
    }
    setGpsSuccessMsg(`Applied region: ${preset.label}`);
  };

  const handleDetectGPS = (isLogin = false) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        if (isLogin) {
          setLoginLat(lat);
          setLoginLon(lon);
        } else {
          setLatitude(lat);
          setLongitude(lon);
        }

        try {
          const addr = await reverseGeocodeCoords(lat, lon);
          const matchedState = addr.state 
            ? INDIAN_STATES_CONFIG.find(s => s.state.toLowerCase() === (addr.state || '').toLowerCase())
            : null;

          if (isLogin) {
            if (matchedState) setLoginState(matchedState.state);
            if (addr.district) setLoginDistrict(addr.district);
            if (addr.village || addr.subdistrict) setLoginVillage(addr.village || addr.subdistrict || 'Field');
            const { zone } = inferAgroClimaticZone(lat, lon, addr.state);
            setLoginAgroZone(zone);
          } else {
            if (matchedState) setSelectedState(matchedState.state);
            if (addr.district) setSelectedDistrict(addr.district);
            if (addr.village || addr.subdistrict) setVillage(addr.village || addr.subdistrict || 'Field');
            const { zone, soil } = inferAgroClimaticZone(lat, lon, addr.state);
            setAgroZone(zone);
            if (soil) setSoilType(soil);
          }

          setGpsSuccessMsg(`GPS Locked: ±${accuracy}m (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`);
        } catch (_e) {
          setGpsSuccessMsg(`GPS set: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        alert(`Could not acquire GPS: ${err.message}. Please select your State & District manually.`);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleToggleCrop = (cropName: string) => {
    if (selectedCrops.includes(cropName)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter(c => c !== cropName));
      }
    } else {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  const handleDemoAutofill = () => {
    setName('Ramesh Patel');
    setPhone('9876543210');
    setSelectedState('Gujarat');
    setSelectedDistrict('Rajkot');
    setVillage('Virpur');
    setLatitude(21.8440);
    setLongitude(70.7620);
    setAgroZone('Gujarat Plains & Hills Zone (Saurashtra)');
    setSoilType('Medium Black Soil & Sandy Loam (ગોરાડુ / કાળી જમીન)');
    setIrrigation('Drip Irrigation (ટપક પદ્ધતિ / બિందు సేద్యం)');
    setLandAcres(3.5);
    setSelectedCrops([
      'Cotton (કપાસ / పత్తి)', 
      'Groundnut / Peanut (મગફળી / వేరుశనగ)',
      'Chilli (મરચી / మిరప)'
    ]);
    setGpsSuccessMsg('Sample Gujarat farm profile pre-loaded');
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farmerName = name.trim() || 'Registered Farmer';
    const farmerPhone = phone.trim() || '9876543210';
    const farmerVillage = village.trim() || selectedDistrict;
    const displayName = `${farmerVillage}, ${selectedDistrict}, ${selectedState}`;

    const parsedAcres = parseFloat(String(landAcres));
    const effectiveAcres = (!isNaN(parsedAcres) && parsedAcres > 0) ? parsedAcres : 1;

    const profile: FarmerProfile = {
      id: `farmer-${Date.now()}`,
      name: farmerName,
      phone: farmerPhone,
      state: selectedState,
      district: selectedDistrict,
      subdistrict: farmerVillage,
      village: farmerVillage,
      displayName,
      latitude,
      longitude,
      agroClimaticZone: agroZone,
      soilType,
      irrigationType: irrigation,
      landSizeAcres: effectiveAcres,
      primaryCrops: selectedCrops.length > 0 ? selectedCrops : ['Cotton (કપાસ / પત્તિ)'],
      preferredLanguage: currentLang,
      registeredAt: new Date().toISOString(),
      isRegistered: true
    };

    onCompleteAuth(profile);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.trim().length > 0 && loginPhone.trim().length < 10) {
      setLoginError('Please enter a valid 10-digit mobile number');
      return;
    }

    const effectivePhone = loginPhone.trim() || '9876543210';
    const effectiveName = loginPhone.trim() ? `Farmer ${loginPhone.slice(-4)}` : 'Ramesh Patel';
    const displayName = `${loginVillage || loginDistrict}, ${loginDistrict}, ${loginState}`;

    const profile: FarmerProfile = {
      ...DEFAULT_FARMER_PROFILE,
      id: `farmer-${Date.now()}`,
      name: effectiveName,
      phone: effectivePhone,
      state: loginState,
      district: loginDistrict,
      subdistrict: loginVillage,
      village: loginVillage,
      displayName,
      latitude: loginLat,
      longitude: loginLon,
      agroClimaticZone: loginAgroZone,
      preferredLanguage: currentLang,
      isRegistered: true
    };

    onCompleteAuth(profile);
  };

  const handleQuickGuest = () => {
    const profile: FarmerProfile = {
      ...DEFAULT_FARMER_PROFILE,
      preferredLanguage: currentLang,
      isRegistered: true
    };
    onCompleteAuth(profile);
  };

  return (
    <div className="min-h-screen bg-[#f4fbf4] text-[#161d19] flex flex-col justify-between selection:bg-[#a0f399] selection:text-[#003629]">
      
      {/* Top Header Bar */}
      <header className="bg-[#003629] text-white border-b border-[#1b4d3e] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <img 
            src={FARM_LOGO_SRC} 
            alt="FARM Logo" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-white shadow-sm border border-[#a0f399]/40 p-0.5 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white">
                FARM
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#a0f399] text-[#003629] uppercase tracking-wider">
                FARMER PORTAL
              </span>
            </div>
            <p className="text-[10px] text-[#baeed9] font-medium hidden xs:block mt-0.5">
              Crop Disease & Pest Health Diagnostic AI
            </p>
          </div>
        </div>

        {/* Dropdown Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-xs"
            aria-label="Select preferred language"
          >
            <Globe className="w-3.5 h-3.5 text-[#a0f399]" />
            <span>{currentLangObj.label}</span>
            <ChevronDown className="w-3 h-3 text-[#baeed9]" />
          </button>

          {isLangDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsLangDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white text-[#161d19] rounded-2xl shadow-xl border border-[#c0c9c3] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-[#707974] border-b border-[#dde4de]">
                  {t.languageSelectLabel}
                </div>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentLang === lang.code
                        ? 'bg-[#eef5ef] text-[#1b6d24] font-bold'
                        : 'hover:bg-[#f4fbf4] text-[#161d19]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{lang.label}</div>
                      <div className="text-[10px] text-[#707974]">{lang.script}</div>
                    </div>
                    {currentLang === lang.code && (
                      <Check className="w-4 h-4 text-[#1b6d24]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Scoped Content Card */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-3.5 sm:p-6 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-[#c0c9c3] shadow-lg overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-[#003629] text-white p-5 sm:p-6 border-b border-[#1b4d3e]">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={FARM_LOGO_SRC} 
                alt="FARM" 
                className="w-12 h-12 rounded-2xl object-contain bg-white shadow-md border-2 border-[#a0f399]/40 p-1 flex-shrink-0"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a0f399]">
                  Farmer Profile & Registration
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeTab === 'register' ? t.registrationTitle : t.loginTab}
                </h1>
              </div>
            </div>
            <p className="text-xs text-[#baeed9] leading-relaxed max-w-xl">
              {t.registrationSubtitle}
            </p>
          </div>

          {/* Tab Selector: Registration vs Login */}
          <div className="bg-[#eef5ef] p-1.5 flex items-center gap-1.5 border-b border-[#dde4de]">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-white/60'
              }`}
            >
              <User className="w-4 h-4 text-[#a0f399]" />
              <span>{t.registerTab}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-white/60'
              }`}
            >
              <Phone className="w-4 h-4 text-[#a0f399]" />
              <span>{t.loginTab}</span>
            </button>
          </div>

          {/* Quick Regional Presets Bar */}
          <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-[#dde4de]/50 bg-[#fafdfa]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#56605b] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#1b6d24]" />
                <span>Quick Agro Regions:</span>
              </span>
              <span className="text-[10px] text-[#707974] font-medium">1-Tap Location</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {REGIONAL_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset, activeTab === 'login')}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#eef5ef] text-[#003629] text-[11px] font-bold border border-[#c0c9c3] transition-all flex-shrink-0 active:scale-95 shadow-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                
                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-[#404945] mb-1">
                    {t.mobileLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-[#eef5ef] text-[#003629] font-black text-xs border border-[#c0c9c3]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => {
                        setLoginPhone(e.target.value.replace(/\D/g, ''));
                        setLoginError(null);
                      }}
                      placeholder="9876543210 (or leave empty for demo)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                    />
                  </div>
                  {loginError && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{loginError}</span>
                    </p>
                  )}
                </div>

                {/* Region & Location in Login Page */}
                <div className="bg-[#eef5ef] p-4 rounded-2xl border border-[#a0f399] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#dde4de] pb-2">
                    <div className="flex items-center gap-1.5 text-[#003629]">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="font-display font-extrabold text-xs text-[#003629]">
                        Set Active Field Location for Session
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDetectGPS(true)}
                      disabled={isDetectingGps}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-[#a0f399] text-xs font-black shadow-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Crosshair className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? t.gpsDetecting : t.autoGpsBtn}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#404945] mb-1">
                        {t.stateLabel}
                      </label>
                      <select
                        value={loginState}
                        onChange={(e) => handleLoginStateChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none"
                      >
                        {INDIAN_STATES_CONFIG.map((st) => (
                          <option key={st.state} value={st.state}>
                            {st.vernacular[currentLang] || st.state} ({st.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#404945] mb-1">
                        {t.districtLabel}
                      </label>
                      <select
                        value={loginDistrict}
                        onChange={(e) => setLoginDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none"
                      >
                        {currentLoginStateConfig.districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#404945] mb-1">
                      {t.villageLabel}
                    </label>
                    <input
                      type="text"
                      value={loginVillage}
                      onChange={(e) => setLoginVillage(e.target.value)}
                      placeholder="e.g. Virpur Farm / Survey No. 42"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-semibold text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-[#003629] flex items-center justify-between">
                    <span className="font-bold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{loginVillage || loginDistrict}, {loginDistrict}, {loginState}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      {loginLat.toFixed(2)}°N, {loginLon.toFixed(2)}°E
                    </span>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-display text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#a0f399]" />
                  <span>{t.loginBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center justify-between text-xs text-[#707974] pt-1">
                  <button
                    type="button"
                    onClick={handleQuickGuest}
                    className="font-bold text-[#1b6d24] hover:underline"
                  >
                    {t.skipGuestBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#003629] hover:underline"
                  >
                    New farmer? Register here →
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegistrationSubmit} noValidate className="space-y-4">
                
                {/* Demo Helper Banner */}
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs text-emerald-900 font-bold">
                      Quick start with Gujarat Cotton farm preset:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoAutofill}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors flex-shrink-0"
                  >
                    {t.demoAutofill}
                  </button>
                </div>

                {/* 1. Farmer Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.fullNameLabel} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.mobileLabel} *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-2 rounded-xl bg-[#eef5ef] text-[#003629] font-bold text-xs border border-[#c0c9c3]">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.mobilePlaceholder}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Region & Field Coordinates */}
                <div className="bg-[#eef5ef] p-4 rounded-2xl border border-[#a0f399] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#dde4de] pb-2">
                    <div className="flex items-center gap-1.5 text-[#003629]">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="font-display font-extrabold text-xs text-[#003629]">
                        {t.locationSectionTitle} (Applied to All Diagnostics)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDetectGPS(false)}
                      disabled={isDetectingGps}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-[#a0f399] text-xs font-black shadow-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Crosshair className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? t.gpsDetecting : t.autoGpsBtn}</span>
                    </button>
                  </div>

                  {gpsSuccessMsg && (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{gpsSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#404945] mb-1">
                        {t.stateLabel} *
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none"
                      >
                        {INDIAN_STATES_CONFIG.map((st) => (
                          <option key={st.state} value={st.state}>
                            {st.vernacular[currentLang] || st.state} ({st.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#404945] mb-1">
                        {t.districtLabel} *
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-bold text-xs focus:outline-none"
                      >
                        {currentStateConfig.districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#404945] mb-1">
                      {t.villageLabel} *
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder={t.villagePlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-semibold text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-[#003629] flex items-center justify-between">
                    <span className="font-bold text-[11px]">
                      Agro-Zone: {agroZone.split('(')[0].trim()}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
                    </span>
                  </div>
                </div>

                {/* 3. Farm Land & Crops */}
                <div className="space-y-3">
                  <div className="bg-[#f4fbf4] p-3.5 rounded-2xl border border-[#c0c9c3]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#404945]">
                        {t.landSizeLabel} ({t.acresUnit}):
                      </label>
                      <span className="text-xs font-black text-[#003629] bg-[#a0f399] px-2 py-0.5 rounded-md">
                        {landAcres || '0'} {t.acresUnit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(String(landAcres)) || 1;
                          const nextVal = Math.max(0.1, Number((current - 0.5).toFixed(2)));
                          setLandAcres(nextVal);
                        }}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-[#eef5ef] text-[#003629] font-black text-lg border border-[#c0c9c3] flex items-center justify-center active:scale-95 transition-all shadow-xs"
                        title="Decrease by 0.5 Acre"
                      >
                        -
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={landAcres}
                          onChange={(e) => {
                            setLandAcres(e.target.value);
                          }}
                          placeholder="e.g. 4.5, 4.7, 5"
                          className="w-full px-3.5 py-2.5 pr-14 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-black text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#707974] pointer-events-none">
                          Acres
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(String(landAcres)) || 1;
                          const nextVal = Number((current + 0.5).toFixed(2));
                          setLandAcres(nextVal);
                        }}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-[#eef5ef] text-[#003629] font-black text-lg border border-[#c0c9c3] flex items-center justify-center active:scale-95 transition-all shadow-xs"
                        title="Increase by 0.5 Acre"
                      >
                        +
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2.5">
                      <span className="text-[10px] font-bold text-[#707974] uppercase mr-0.5">Presets:</span>
                      {[0.5, 1, 2, 3, 4.5, 5, 10, 15, 25].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setLandAcres(preset)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border transition-all active:scale-95 ${
                            Number(landAcres) === preset
                              ? 'bg-[#003629] text-[#a0f399] border-[#003629] shadow-xs'
                              : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#eef5ef]'
                          }`}
                        >
                          {preset} ac
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1.5">
                      {t.primaryCropsLabel}:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {CROP_OPTIONS.slice(0, 6).map((crop) => {
                        const isSelected = selectedCrops.includes(crop.name);
                        return (
                          <button
                            key={crop.id}
                            type="button"
                            onClick={() => handleToggleCrop(crop.name)}
                            className={`p-2 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#1b6d24] text-white border-[#1b6d24] shadow-xs'
                                : 'bg-[#f4fbf4] text-[#161d19] border-[#c0c9c3] hover:bg-white'
                            }`}
                          >
                            <span className="truncate pr-1">
                              {crop.icon} {crop.name.split('(')[0].trim()}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Farmer Profile Pass Preview */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#003629] to-[#1b4d3e] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={FARM_LOGO_SRC} 
                      alt="Logo" 
                      className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-[#a0f399]/40 flex-shrink-0"
                    />
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-[#a0f399]">
                        Farmer Profile Preview
                      </div>
                      <div className="font-display font-black text-sm text-white">
                        {name || 'Ramesh Patel'}
                      </div>
                      <div className="text-[11px] text-[#baeed9]">
                        {village || selectedDistrict}, {selectedDistrict} • {landAcres} Acres
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#a0f399] text-[#003629] font-black uppercase">
                    ACTIVE
                  </span>
                </div>

                {/* Registration Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1b6d24] hover:bg-[#14531b] text-white font-display text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#a0f399]" />
                  <span>{t.completeRegistrationBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center justify-between text-xs text-[#707974] pt-1">
                  <button
                    type="button"
                    onClick={handleQuickGuest}
                    className="font-bold text-[#1b6d24] hover:underline"
                  >
                    {t.skipGuestBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-[#003629] hover:underline"
                  >
                    Already registered? Go to Login →
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-[11px] text-[#707974]">
        FARM • Precision Agricultural Diagnostic AI Platform
      </footer>

    </div>
  );
};
