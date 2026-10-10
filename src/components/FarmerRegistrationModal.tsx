import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  Sprout, 
  Layers, 
  Droplets, 
  Crosshair, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Navigation, 
  ArrowRight, 
  RotateCcw,
  BadgeCheck,
  AlertCircle,
  Wheat
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

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerProfile: FarmerProfile | null;
  onSaveProfile: (profile: FarmerProfile) => void;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isInitialOnboarding?: boolean;
}

export const FarmerRegistrationModal: React.FC<FarmerRegistrationModalProps> = ({
  isOpen,
  onClose,
  farmerProfile,
  onSaveProfile,
  currentLang,
  onLanguageChange,
  isInitialOnboarding = false
}) => {
  const t = AUTH_TRANSLATIONS[currentLang] || AUTH_TRANSLATIONS.en;

  const [authMode, setAuthMode] = useState<'register' | 'login' | 'edit'>(
    isInitialOnboarding ? 'register' : (farmerProfile?.isRegistered ? 'edit' : 'register')
  );

  // Form Fields
  const [name, setName] = useState<string>(farmerProfile?.name || '');
  const [phone, setPhone] = useState<string>(farmerProfile?.phone || '');
  const [selectedState, setSelectedState] = useState<string>(farmerProfile?.state || 'Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmerProfile?.district || 'Rajkot');
  const [village, setVillage] = useState<string>(farmerProfile?.village || 'Virpur');
  const [latitude, setLatitude] = useState<number>(farmerProfile?.latitude || 22.3039);
  const [longitude, setLongitude] = useState<number>(farmerProfile?.longitude || 70.8022);
  const [agroZone, setAgroZone] = useState<string>(
    farmerProfile?.agroClimaticZone || 'Gujarat Plains & Hills Zone (Saurashtra)'
  );
  const [soilType, setSoilType] = useState<string>(farmerProfile?.soilType || SOIL_OPTIONS[0]);
  const [irrigation, setIrrigation] = useState<string>(farmerProfile?.irrigationType || IRRIGATION_OPTIONS[0]);
  const [landAcres, setLandAcres] = useState<number>(farmerProfile?.landSizeAcres || 3.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    farmerProfile?.primaryCrops || ['Cotton (કપાસ / పత్తి)', 'Groundnut / Peanut (મગફળી / వేరుశనગ)']
  );

  // GPS detection state
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState<string | null>(null);
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);

  // Login phone lookup
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Update district options when state changes
  const currentStateConfig = INDIAN_STATES_CONFIG.find(s => s.state === selectedState) || INDIAN_STATES_CONFIG[0];

  useEffect(() => {
    if (farmerProfile) {
      setName(farmerProfile.name);
      setPhone(farmerProfile.phone);
      setSelectedState(farmerProfile.state);
      setSelectedDistrict(farmerProfile.district);
      setVillage(farmerProfile.village);
      setLatitude(farmerProfile.latitude);
      setLongitude(farmerProfile.longitude);
      setAgroZone(farmerProfile.agroClimaticZone);
      setSoilType(farmerProfile.soilType);
      setIrrigation(farmerProfile.irrigationType);
      setLandAcres(farmerProfile.landSizeAcres);
      setSelectedCrops(farmerProfile.primaryCrops);
    }
  }, [farmerProfile, isOpen]);

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

  // Live GPS one-click detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsSuccessMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        setLatitude(lat);
        setLongitude(lon);
        setGpsAccuracyMeters(accuracy);

        try {
          const addr = await reverseGeocodeCoords(lat, lon);
          if (addr.state) {
            // Find matched state in configs
            const matchedState = INDIAN_STATES_CONFIG.find(
              s => s.state.toLowerCase() === (addr.state || '').toLowerCase()
            );
            if (matchedState) {
              setSelectedState(matchedState.state);
            }
          }

          if (addr.district) {
            setSelectedDistrict(addr.district);
          }
          if (addr.village || addr.subdistrict) {
            setVillage(addr.village || addr.subdistrict || 'Field Location');
          }

          const { zone, soil } = inferAgroClimaticZone(lat, lon, addr.state);
          setAgroZone(zone);
          if (soil) setSoilType(soil);

          setGpsSuccessMsg(`GPS Fixed: ±${accuracy}m precision (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`);
        } catch (_e) {
          setGpsSuccessMsg(`GPS Coordinates set: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsSuccessMsg(`Could not acquire GPS: ${err.message}. Please select your State & District manually.`);
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

  const handleSaveRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const farmerName = name.trim() || 'Kisan Farmer';
    const farmerPhone = phone.trim() || '9876543210';
    const farmerVillage = village.trim() || selectedDistrict;

    const displayName = `${farmerVillage}, ${selectedDistrict}, ${selectedState}`;

    const newProfile: FarmerProfile = {
      id: farmerProfile?.id || `kisan-${Date.now()}`,
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
      landSizeAcres: Number(landAcres) || 1,
      primaryCrops: selectedCrops.length > 0 ? selectedCrops : ['Cotton (કપાસ / పత్తి)'],
      preferredLanguage: currentLang,
      registeredAt: farmerProfile?.registeredAt || new Date().toISOString(),
      isRegistered: true
    };

    onSaveProfile(newProfile);
    onClose();
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
      'Groundnut / Peanut (મગફળી / వేరుశనગ)',
      'Chilli (મરચી / మిరప)'
    ]);
    setGpsSuccessMsg('Sample Saurashtra cotton farm profile pre-loaded');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || loginPhone.trim().length < 10) {
      setLoginError('Please enter a valid 10-digit mobile number');
      return;
    }

    // Check if matches existing or create instant session
    if (farmerProfile && farmerProfile.phone === loginPhone.trim()) {
      onSaveProfile({ ...farmerProfile, isRegistered: true });
      onClose();
    } else {
      // Create registered profile for this phone
      const matchedName = 'Kisan ' + loginPhone.slice(-4);
      const newProfile: FarmerProfile = {
        ...DEFAULT_FARMER_PROFILE,
        id: `kisan-${Date.now()}`,
        name: matchedName,
        phone: loginPhone.trim(),
        preferredLanguage: currentLang,
        isRegistered: true
      };
      onSaveProfile(newProfile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#f4fbf4] rounded-3xl shadow-2xl border border-[#c0c9c3] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Banner */}
        <div className="bg-[#003629] text-white p-5 sm:p-6 border-b border-[#1b4d3e] relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
            title="Close / Explore as Guest"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#a0f399] text-[#003629] flex items-center justify-center font-black shadow-sm">
              <Sprout className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a0f399]">
                F.A.R.M. • KISAN PORTAL
              </span>
              <h2 className="font-display text-lg sm:text-2xl font-black text-white leading-tight">
                {authMode === 'edit' ? t.editProfileTitle : authMode === 'login' ? t.loginTab : t.registrationTitle}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#baeed9] leading-relaxed max-w-xl">
            {authMode === 'login' ? t.enterMobileToLogin : t.registrationSubtitle}
          </p>

          {/* Quick Language Switcher Bar inside Modal */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#baeed9] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#a0f399]" />
              {t.languageSelectLabel}:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { code: 'gu', label: 'ગુજરાતી' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'en', label: 'English' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code as SupportedLanguage)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentLang === lang.code
                      ? 'bg-[#a0f399] text-[#003629] shadow-xs scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Toggle for Register vs Login (Always visible for easy switching) */}
        <div className="bg-white border-b border-[#dde4de] px-4 sm:px-6 py-2 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-colors ${
                authMode === 'register' || authMode === 'edit'
                  ? 'bg-[#1b6d24] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#eef5ef]'
              }`}
            >
              {farmerProfile?.isRegistered ? t.myProfile : t.registerTab}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-colors ${
                authMode === 'login'
                  ? 'bg-[#1b6d24] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#eef5ef]'
              }`}
            >
              {t.loginTab}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-bold text-[#707974] hover:text-[#003629] px-2 py-1 rounded-lg hover:bg-[#eef5ef]"
          >
            {isInitialOnboarding ? 'Skip for now →' : 'Cancel'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {authMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5 py-4">
              <div className="bg-white p-5 rounded-2xl border border-[#c0c9c3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#003629]">
                  <Phone className="w-5 h-5 text-[#1b6d24]" />
                  <h3 className="font-display font-bold text-base text-[#161d19]">
                    {t.loginTab}
                  </h3>
                </div>
                <p className="text-xs text-[#707974]">
                  {t.enterMobileToLogin}
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#404945] mb-1.5">
                    {t.mobileLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-[#eef5ef] text-[#003629] font-bold text-sm border border-[#c0c9c3]">
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
                      placeholder="9876543210"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#c0c9c3] text-[#161d19] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {loginError}
                    </p>
                  )}
                </div>

                {farmerProfile && (
                  <div className="p-3.5 rounded-xl bg-[#eef5ef] border border-[#a0f399] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-[#003629]">
                        Last Active: {farmerProfile.name}
                      </p>
                      <p className="text-[11px] text-[#404945]">
                        {farmerProfile.displayName} • {farmerProfile.landSizeAcres} Acres
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSaveProfile({ ...farmerProfile, isRegistered: true });
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#003629] text-white text-xs font-bold hover:bg-[#1b4d3e]"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#1b6d24] hover:bg-[#eef5ef]"
                >
                  Create New Farmer Registration
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b6d24] hover:bg-[#14531b] text-white text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <span>{t.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Registration & Field Setup Form */
            <form onSubmit={handleSaveRegistration} className="space-y-6">

              {/* Demo Helper Button */}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs text-emerald-900 font-semibold">
                    Quick setup with preset Gujarat / Saurashtra farm data:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoAutofill}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex-shrink-0"
                >
                  {t.demoAutofill}
                </button>
              </div>

              {/* 1. Farmer Identity Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#c0c9c3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#003629] border-b border-[#dde4de] pb-2.5">
                  <User className="w-4 h-4 text-[#1b6d24]" />
                  <h3 className="font-display font-bold text-sm text-[#161d19]">
                    1. {t.fullNameLabel} & Contact
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.fullNameLabel} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.mobileLabel} *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-2.5 rounded-xl bg-[#eef5ef] text-[#003629] font-bold text-xs border border-[#c0c9c3]">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.mobilePlaceholder}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Farm Region & Field Location (Applied Globally) */}
              <div className="bg-white p-5 rounded-2xl border border-[#c0c9c3] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#dde4de] pb-2.5">
                  <div className="flex items-center gap-2 text-[#003629]">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-[#161d19]">
                      2. {t.locationSectionTitle}
                    </h3>
                  </div>

                  {/* Auto GPS Trigger Button */}
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingGps}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-[#a0f399] text-xs font-extrabold shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{isDetectingGps ? t.gpsDetecting : t.autoGpsBtn}</span>
                  </button>
                </div>

                {gpsSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{gpsSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* State Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.stateLabel} *
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                    >
                      {INDIAN_STATES_CONFIG.map((st) => (
                        <option key={st.state} value={st.state}>
                          {st.vernacular[currentLang] || st.state} ({st.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.districtLabel} *
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                    >
                      {currentStateConfig.districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Village / Farm Land Name */}
                <div>
                  <label className="block text-xs font-bold text-[#404945] mb-1">
                    {t.villageLabel} *
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={t.villagePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                    required
                  />
                </div>

                {/* Inferred Agro-Climatic Zone & Geo Tag Box */}
                <div className="p-3 rounded-xl bg-[#eef5ef] border border-[#a0f399]/70 text-[#003629] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#1b6d24]" />
                      Agro-Climatic Zone:
                    </span>
                    <span className="text-[11px] font-mono font-extrabold text-[#1b6d24]">
                      {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E
                    </span>
                  </div>
                  <p className="font-semibold text-[11px] text-[#404945]">
                    {agroZone}
                  </p>
                  <p className="text-[10px] text-[#707974] italic">
                    {t.appliedEverywhereBadge}
                  </p>
                </div>
              </div>

              {/* 3. Farm Land & Crop Profile */}
              <div className="bg-white p-5 rounded-2xl border border-[#c0c9c3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#003629] border-b border-[#dde4de] pb-2.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-display font-bold text-sm text-[#161d19]">
                    3. {t.landSizeLabel} & {t.primaryCropsLabel}
                  </h3>
                </div>

                {/* Land Size in Acres with Presets */}
                <div>
                  <label className="block text-xs font-bold text-[#404945] mb-1.5">
                    {t.landSizeLabel} ({t.acresUnit}):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0.2"
                      max="1000"
                      value={landAcres}
                      onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                      className="w-28 px-3.5 py-2.5 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] font-black text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6d24]"
                      required
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[1, 2, 3.5, 5, 10].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setLandAcres(size)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold border transition-colors ${
                            landAcres === size
                              ? 'bg-[#003629] text-white border-[#003629]'
                              : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#eef5ef]'
                          }`}
                        >
                          {size} {t.acresUnit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Crops Multi-select Chips */}
                <div>
                  <label className="block text-xs font-bold text-[#404945] mb-2">
                    {t.primaryCropsLabel}:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CROP_OPTIONS.map((crop) => {
                      const isSelected = selectedCrops.includes(crop.name);
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => handleToggleCrop(crop.name)}
                          className={`p-2 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#1b6d24] text-white border-[#1b6d24] shadow-xs'
                              : 'bg-white text-[#161d19] border-[#c0c9c3] hover:bg-[#f4fbf4]'
                          }`}
                        >
                          <span className="truncate pr-1">
                            {crop.icon} {crop.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Soil & Irrigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.soilTypeLabel}:
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] text-xs font-semibold focus:outline-none"
                    >
                      {SOIL_OPTIONS.map((soil) => (
                        <option key={soil} value={soil}>{soil}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404945] mb-1">
                      {t.irrigationLabel}:
                    </label>
                    <select
                      value={irrigation}
                      onChange={(e) => setIrrigation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] text-[#161d19] text-xs font-semibold focus:outline-none"
                    >
                      {IRRIGATION_OPTIONS.map((irr) => (
                        <option key={irr} value={irr}>{irr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Live Kisan ID Pass Preview */}
              <div className="bg-gradient-to-br from-[#003629] to-[#1b4d3e] text-white p-4 sm:p-5 rounded-2xl border border-[#a0f399]/40 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#a0f399]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#a0f399]">
                      {t.kisanCardTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white font-bold">
                    FAR-IND-{phone.slice(-4) || '2026'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-base sm:text-lg font-black text-white">
                      {name || 'Ramesh Patel'}
                    </h4>
                    <p className="text-xs text-[#baeed9] font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {village || selectedDistrict}, {selectedDistrict}, {selectedState}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#a0f399] text-[#003629] text-[10px] font-extrabold">
                        {landAcres} {t.acresUnit}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/15 text-white text-[10px] font-semibold">
                        {selectedCrops.slice(0, 2).join(', ')}
                        {selectedCrops.length > 2 ? ` +${selectedCrops.length - 2}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#a0f399]/30 flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                    <Sprout className="w-5 h-5 text-[#a0f399]" />
                    <span className="text-[8px] font-extrabold text-[#a0f399] uppercase leading-tight mt-0.5">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit / Action Bar */}
              <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                {isInitialOnboarding ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Save default profile as guest
                      onSaveProfile({
                        ...DEFAULT_FARMER_PROFILE,
                        preferredLanguage: currentLang,
                        isRegistered: false
                      });
                      onClose();
                    }}
                    className="text-xs font-bold text-[#707974] hover:text-[#161d19] px-2 py-2"
                  >
                    {t.skipGuestBtn}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-[#c0c9c3] text-xs font-bold text-[#404945] hover:bg-[#eef5ef]"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="ml-auto px-6 py-3 rounded-2xl bg-[#1b6d24] hover:bg-[#14531b] text-white text-sm font-extrabold shadow-lg shadow-[#1b6d24]/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <BadgeCheck className="w-4 h-4 text-[#a0f399]" />
                  <span>
                    {authMode === 'edit' ? t.saveChangesBtn : t.completeRegistrationBtn}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
