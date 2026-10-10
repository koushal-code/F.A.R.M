import React, { useState } from 'react';
import { 
  Thermometer, Droplets, TrendingUp, Sparkles, Clock, 
  AlertTriangle, ShieldCheck, Sun, CloudRain
} from 'lucide-react';
import { HourlyWeatherPoint } from '../services/weatherService';
import { SupportedLanguage } from '../types/farm';

interface WeatherTrendChartProps {
  hourlyData: HourlyWeatherPoint[];
  currentLang: SupportedLanguage;
  highContrast: boolean;
}

const LOCALIZED_CHART_TEXT: Record<SupportedLanguage, {
  trendTitle: string;
  trendSubtitle: string;
  tempTab: string;
  humidityTab: string;
  sprayAdvisoryTitle: string;
  bestWindow: string;
  highHumidityWindow: string;
  noSprayWindow: string;
  sporeThresholdLabel: string;
  optimalSprayPill: string;
  cautionSprayPill: string;
  sporeRiskPill: string;
  washoutPill: string;
  minLabel: string;
  maxLabel: string;
  hours24: string;
}> = {
  en: {
    trendTitle: '24-Hour Meteorological Trend & Treatment Planner',
    trendSubtitle: 'Forecasted temperature and humidity fluctuations to schedule disease sprays',
    tempTab: 'Temperature (°C)',
    humidityTab: 'Relative Humidity (%)',
    sprayAdvisoryTitle: 'Treatment Timing Intelligence (Next 24 Hours)',
    bestWindow: 'Recommended Spray Window: Early Morning (06:00 - 09:00)',
    highHumidityWindow: 'High Fungal Spore Risk Window: Night/Dawn (23:00 - 06:00, >80% Humidity)',
    noSprayWindow: 'Rain Washout Warning: Do not spray before or during rain',
    sporeThresholdLabel: '80% Fungal Spore Germination Threshold',
    optimalSprayPill: 'Optimal Spray Window',
    cautionSprayPill: 'Moderate Window',
    sporeRiskPill: 'High Spore Incubation (>80%)',
    washoutPill: 'Rain Washout Hazard',
    minLabel: 'Min',
    maxLabel: 'Max',
    hours24: '24 Hours'
  },
  hi: {
    trendTitle: '24-घंटे का मौसम रुझान और छिड़काव योजनाकार',
    trendSubtitle: 'रोग नियंत्रण छिड़काव के लिए तापमान और नमी का पूर्वानुमान',
    tempTab: 'तापमान (°C)',
    humidityTab: 'हवा में नमी (%)',
    sprayAdvisoryTitle: 'छिड़काव समय सलाह (अगले 24 घंटे)',
    bestWindow: 'सर्वोत्तम छिड़काव समय: सुबह (06:00 - 09:00)',
    highHumidityWindow: 'फफूंद बीजाणु संक्रमण खतरा: रात/सुबह (23:00 - 06:00, >80% नमी)',
    noSprayWindow: 'दवा धुलने की चेतावनी: बारिश के पहले या दौरान छिड़काव न करें',
    sporeThresholdLabel: '80% फफूंद बीजाणु सक्रियता सीमा',
    optimalSprayPill: 'छिड़काव के लिए उत्तम',
    cautionSprayPill: 'मध्यम समय',
    sporeRiskPill: 'अत्यधिक नमी फफूंद खतरा (>80%)',
    washoutPill: 'दवा बहने का खतरा',
    minLabel: 'न्यूनतम',
    maxLabel: 'अधिकतम',
    hours24: '24 घंटे'
  },
  te: {
    trendTitle: '24 గంటల వాతావరణ మార్పులు & మందు పిచికారీ ప్రణాళిక',
    trendSubtitle: 'తెగుళ్ల మందులు పిచికారీ చేయడానికి ఉష్ణోగ్రత మరియు తేమ మార్పుల అంచనా',
    tempTab: 'ఉష్ణోగ్రత (°C)',
    humidityTab: 'గాలిలో తేమ (%)',
    sprayAdvisoryTitle: 'పిచికారీ సమయ సూచనలు (రాబోయే 24 గంటలు)',
    bestWindow: 'మందు పిచికారీకి సరైన సమయం: ఉదయం (06:00 - 09:00)',
    highHumidityWindow: 'తెగుళ్ల వ్యాప్తి ఎక్కువ సమయం: రాత్రి/తెల్లవారుజామున (23:00 - 06:00, >80% తేమ)',
    noSprayWindow: 'వర్షం హెచ్చరిక: వర్షానికి ముందు మందు కొట్టవద్దు',
    sporeThresholdLabel: '80% శిలీంధ్రాల అంకురోత్పత్తి ముప్పు రేఖ',
    optimalSprayPill: 'పిచికారీకి అనుకూలం',
    cautionSprayPill: 'మితమైన సమయం',
    sporeRiskPill: 'అధిక తేమ తెగుళ్ల ముప్పు (>80%)',
    washoutPill: 'మందు కొట్టుకుపోయే ప్రమాదం',
    minLabel: 'కనిష్టం',
    maxLabel: 'గరిష్టం',
    hours24: '24 గంటలు'
  },
  kn: {
    trendTitle: '24-ಗಂಟೆಗಳ ಹವಾಮಾನ ಬದಲಾವಣೆ ಮತ್ತು ಔಷಧಿ ಸಿಂಪರಣೆ ಯೋಜನೆ',
    trendSubtitle: 'ಬೆಳೆ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ತಾಪಮಾನ ಮತ್ತು ತೇವಾಂಶದ ಮುನ್ಸೂಚನೆ',
    tempTab: 'ತಾಪಮಾನ (°C)',
    humidityTab: 'ತೇವಾಂಶ (%)',
    sprayAdvisoryTitle: 'ಸಿಂಪರಣೆ ಸಮಯದ ಸಲಹೆ (ಮುಂದಿನ 24 ಗಂಟೆಗಳು)',
    bestWindow: 'ಸಿಂಪರಣೆಗೆ ಸೂಕ್ತ ಸಮಯ: ಮುಂಜಾನೆ (06:00 - 09:00)',
    highHumidityWindow: 'ಶಿಲೀಂಧ್ರ ರೋಗ ಹರಡುವ ಅಪಾಯ: ರಾತ್ರಿ/ಮುಂಜಾನೆ (23:00 - 06:00, >80% ತೇವಾಂಶ)',
    noSprayWindow: 'ಮಳೆ ಎಚ್ಚರಿಕೆ: ಮಳೆ ಬರುವಾಗ ಔಷಧಿ ಸಿಂಪಡಿಸಬೇಡಿ',
    sporeThresholdLabel: '80% ಶಿಲೀಂಧ್ರ ಬೀಜಕ ಮೊಳಕೆಯೊಡೆಯುವ ಮಿತಿ',
    optimalSprayPill: 'ಸಿಂಪಡಣೆಗೆ ಸಕಾಲ',
    cautionSprayPill: 'ಮಧ್ಯಮ ಸಮಯ',
    sporeRiskPill: 'ಹೆಚ್ಚು ತೇವಾಂಶ ಅಪಾಯ (>80%)',
    washoutPill: 'ಔಷಧಿ ಕೊಚ್ಚಿಹೋಗುವ ಅಪಾಯ',
    minLabel: 'ಕನಿಷ್ಠ',
    maxLabel: 'ಗರಿಷ್ಠ',
    hours24: '24 ಗಂಟೆಗಳು'
  },
  ta: {
    trendTitle: '24 மணி நேர வானிலை போக்கு & மருந்து தெளிப்பு திட்டமிடல்',
    trendSubtitle: 'பயிர் நோயைக் கட்டுப்படுத்த வெப்பநிலை மற்றும் ஈரப்பத மாற்றங்கள்',
    tempTab: 'வெப்பநிலை (°C)',
    humidityTab: 'ஈரப்பதம் (%)',
    sprayAdvisoryTitle: 'மருந்து தெளிக்கும் நேர வழிகாட்டி (அடுத்த 24 மணி நேரம்)',
    bestWindow: 'மருந்து தெளிக்க சிறந்த நேரம்: அதிகாலை (06:00 - 09:00)',
    highHumidityWindow: 'பூஞ்சை நோய் பரவும் அபாய நேரம்: இரவு/விடியற்காலை (23:00 - 06:00, >80% ஈரப்பதம்)',
    noSprayWindow: 'மழை எச்சரிக்கை: மழைக்கு முன் மருந்து தெளிக்காதீர்கள்',
    sporeThresholdLabel: '80% பூஞ்சை வித்து பரவல் எல்லை',
    optimalSprayPill: 'தெளிக்க உகந்த நேரம்',
    cautionSprayPill: 'மிதமான நேரம்',
    sporeRiskPill: 'அதிக ஈரப்பத அபாயம் (>80%)',
    washoutPill: 'மருந்து வீணாகும் அபாயம்',
    minLabel: 'குறைந்தபட்சம்',
    maxLabel: 'அதிகபட்சம்',
    hours24: '24 மணி நேரம்'
  },
  gu: {
    trendTitle: '24-કલાકનું હવામાન વલણ અને છંટકાવ આયોજન',
    trendSubtitle: 'રોગ નિયંત્રણ છંટકાવ માટે તાપમાન અને ભેજની વધઘટની આગાહી',
    tempTab: 'તાપમાન (°C)',
    humidityTab: 'હવામાં ભેજ (%)',
    sprayAdvisoryTitle: 'છંટકાવ સમય બુદ્ધિ (આગામી 24 કલાક)',
    bestWindow: 'છંટકાવ માટે શ્રેષ્ઠ સમય: વહેલી સવારે (06:00 - 09:00)',
    highHumidityWindow: 'ફૂગ ફેલાવવાનો ભય: રાત્રે/સવારે (23:00 - 06:00, >80% ભેજ)',
    noSprayWindow: 'વરસાદ ચેતવણી: વરસાદ પહેલાં કે દરમિયાન દવા ન છાંટવી',
    sporeThresholdLabel: '80% ફૂગના બીજાણુ ફેલાવાની ભયજનક સીમા',
    optimalSprayPill: 'છંટકાવ માટે ઉત્તમ',
    cautionSprayPill: 'મધ્યમ સમય',
    sporeRiskPill: 'વધુ ભેજ ફૂગ ભય (>80%)',
    washoutPill: 'દવા ધોવાઈ જવાનો ભય',
    minLabel: 'ન્યૂનતમ',
    maxLabel: 'મહત્તમ',
    hours24: '24 કલાક'
  }
};

export const WeatherTrendChart: React.FC<WeatherTrendChartProps> = ({
  hourlyData,
  currentLang,
  highContrast
}) => {
  const [activeMetric, setActiveMetric] = useState<'temperature' | 'humidity'>('humidity');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const t = LOCALIZED_CHART_TEXT[currentLang] || LOCALIZED_CHART_TEXT.en;

  // Ensure we have at least some data points
  const points = hourlyData && hourlyData.length >= 8 ? hourlyData.slice(0, 24) : [];
  if (points.length === 0) return null;

  // Chart coordinate math
  const width = 540;
  const height = 150;
  const paddingX = 28;
  const paddingTop = 22;
  const paddingBottom = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Values calculation
  const values = points.map((p) =>
    activeMetric === 'temperature' ? p.temperature : p.humidity
  );

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);

  // Pad min and max for aesthetic breathing room
  let yMin = activeMetric === 'temperature' ? Math.floor(rawMin - 2) : Math.max(0, Math.floor(rawMin - 5));
  let yMax = activeMetric === 'temperature' ? Math.ceil(rawMax + 2) : Math.min(100, Math.ceil(rawMax + 5));

  if (activeMetric === 'humidity') {
    // Keep 80% line within view if close
    if (yMax < 85) yMax = 88;
    if (yMin > 60) yMin = 50;
  }

  const yRange = yMax - yMin || 1;

  // Map points to SVG coordinates
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * chartWidth;
    const val = activeMetric === 'temperature' ? p.temperature : p.humidity;
    const y = paddingTop + chartHeight - ((val - yMin) / yRange) * chartHeight;
    return { x, y, val, point: p };
  });

  // Generate SVG path line
  const pathD = coords.reduce((acc, c, idx) => {
    if (idx === 0) return `M ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    // Smooth Catmull-Rom / Bezier curve
    const prev = coords[idx - 1];
    const cpX1 = prev.x + (c.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (c.x - prev.x) / 2;
    const cpY2 = c.y;
    return `${acc} C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  }, '');

  // Fill area under line
  const fillD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} Z`;

  // 80% humidity danger reference line
  const y80 = activeMetric === 'humidity'
    ? paddingTop + chartHeight - ((80 - yMin) / yRange) * chartHeight
    : null;

  // Active hover/touch point
  const activePoint = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : coords[0];

  // Treatment feasibility window analysis
  const hasRainIn24h = points.some((p) => (p.rainAmount ?? 0) > 0);
  const humidSporeCount = points.filter((p) => p.humidity >= 80).length;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
      highContrast
        ? 'bg-[#001710] border-white/30 text-white'
        : 'bg-white border-[#c0c9c3] text-[#161d19] shadow-xs'
    }`}>
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e8f0e9] text-[#1b6d24] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="font-display text-xs sm:text-sm font-bold text-[#003629] dark:text-white flex items-center gap-1.5">
              <span>{t.trendTitle}</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#e8f0e9] text-[#1b4d3e]">
                {t.hours24}
              </span>
            </h4>
          </div>
          <p className="text-[11px] text-[#56605b] mt-0.5 ml-9">
            {t.trendSubtitle}
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f4fbf4] border border-[#c0c9c3] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveMetric('humidity'); setHoveredIndex(null); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeMetric === 'humidity'
                ? 'bg-[#003629] text-[#a0f399] shadow-xs'
                : 'text-[#56605b] hover:text-[#003629]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{t.humidityTab}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMetric('temperature'); setHoveredIndex(null); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeMetric === 'temperature'
                ? 'bg-[#003629] text-[#a0f399] shadow-xs'
                : 'text-[#56605b] hover:text-[#003629]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>{t.tempTab}</span>
          </button>
        </div>
      </div>

      {/* SVG Line Graph Viewport */}
      <div className="relative bg-[#fbfdfb] rounded-xl border border-[#dde4de] p-2.5 overflow-hidden">
        {/* Metric Summary Ticker Overlay */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[11px] font-bold text-[#56605b] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span>
              {t.minLabel}: <strong className="text-[#161d19]">{rawMin}{activeMetric === 'temperature' ? '°C' : '%'}</strong>
            </span>
            <span>
              {t.maxLabel}: <strong className="text-[#161d19]">{rawMax}{activeMetric === 'temperature' ? '°C' : '%'}</strong>
            </span>
          </div>

          {/* Interactive cursor readout */}
          {activePoint && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/5 text-[#003629] text-[11px] font-extrabold border border-black/10">
              <Clock className="w-3 h-3 text-[#1b6d24]" />
              <span>{activePoint.point.time}</span>
              <span>•</span>
              <span className={activeMetric === 'humidity' && activePoint.point.humidity >= 80 ? 'text-amber-800 font-black' : ''}>
                {activeMetric === 'temperature' ? `${activePoint.point.temperature}°C` : `${activePoint.point.humidity}%`}
              </span>
              {activePoint.point.isOptimalSpray && (
                <span className="text-[9px] px-1 rounded bg-[#a0f399] text-[#003629]">
                  ✓ Optimal
                </span>
              )}
              {activePoint.point.humidity >= 80 && activeMetric === 'humidity' && (
                <span className="text-[9px] px-1 rounded bg-amber-200 text-amber-950 font-black">
                  Spore Risk
                </span>
              )}
            </div>
          )}
        </div>

        {/* SVG Graphic Canvas */}
        <div className="w-full h-36 sm:h-44">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Humidity Gradient */}
              <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.0" />
              </linearGradient>

              {/* Temperature Gradient */}
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.0" />
              </linearGradient>

              {/* Spore Alert Danger Area Pattern for >= 80% Humidity */}
              <linearGradient id="dangerZoneGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guideline marks */}
            {[0, 0.5, 1].map((pct, idx) => {
              const yVal = paddingTop + chartHeight * pct;
              const valText = Math.round(yMax - pct * yRange);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={yVal}
                    x2={width - paddingX}
                    y2={yVal}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 4}
                    y={yVal + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#9ca3af"
                    fontWeight="600"
                  >
                    {valText}{activeMetric === 'temperature' ? '°' : '%'}
                  </text>
                </g>
              );
            })}

            {/* Critical 80% Fungal Spore Danger Reference Line (when viewing Humidity) */}
            {activeMetric === 'humidity' && y80 !== null && y80 >= paddingTop && y80 <= paddingTop + chartHeight && (
              <g>
                {/* Danger shading above 80% */}
                <rect
                  x={paddingX}
                  y={paddingTop}
                  width={chartWidth}
                  height={Math.max(0, y80 - paddingTop)}
                  fill="url(#dangerZoneGrad)"
                />
                <line
                  x1={paddingX}
                  y1={y80}
                  x2={width - paddingX}
                  y2={y80}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={width - paddingX - 4}
                  y={y80 - 4}
                  textAnchor="end"
                  fontSize="8.5"
                  fill="#b91c1c"
                  fontWeight="800"
                >
                  {t.sporeThresholdLabel}
                </text>
              </g>
            )}

            {/* Area Fill */}
            <path
              d={fillD}
              fill={activeMetric === 'temperature' ? 'url(#tempGrad)' : 'url(#humidityGrad)'}
            />

            {/* Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke={activeMetric === 'temperature' ? '#d97706' : '#2563eb'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points on Line with Interactive Touch Targets */}
            {coords.map((c, idx) => {
              const isSelected = hoveredIndex === idx;
              const isSporeRisk = activeMetric === 'humidity' && c.point.humidity >= 80;
              const isRain = (c.point.rainAmount ?? 0) > 0;

              return (
                <g key={idx} className="cursor-pointer">
                  {/* Invisible enlarged hit target for easy mobile finger tapping */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="12"
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onClick={() => setHoveredIndex(idx)}
                  />

                  {/* Dot */}
                  {(idx % 3 === 0 || isSelected || isSporeRisk || isRain) && (
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isSelected ? '5.5' : isSporeRisk ? '4' : '3'}
                      fill={
                        isRain
                          ? '#2563eb'
                          : isSporeRisk
                            ? '#dc2626'
                            : activeMetric === 'temperature'
                              ? '#d97706'
                              : '#2563eb'
                      }
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            {/* Cursor vertical indicator if hovering */}
            {hoveredIndex !== null && coords[hoveredIndex] && (
              <line
                x1={coords[hoveredIndex].x}
                y1={paddingTop}
                x2={coords[hoveredIndex].x}
                y2={paddingTop + chartHeight}
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Bottom X-axis Time Labels */}
            {coords.map((c, idx) => {
              if (idx % 4 !== 0 && idx !== coords.length - 1) return null;
              return (
                <text
                  key={`label-${idx}`}
                  x={c.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#6b7280"
                  fontWeight="600"
                >
                  {c.point.time}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Agronomic Treatment Guidance Cards Based on 24h Trend */}
      <div className="space-y-2 pt-1 border-t border-black/5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#707974] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1b6d24]" />
          {t.sprayAdvisoryTitle}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Best Spray Window */}
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1b6d24] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#003629] block">{t.bestWindow}</strong>
              <p className="text-[11px] text-[#404945] mt-0.5">
                Low wind speed, moderate humidity (&lt;75%), and temperatures between 20°C - 28°C allow maximum chemical absorption without droplet evaporation.
              </p>
            </div>
          </div>

          {/* High Humidity Fungal Window */}
          <div className={`p-2.5 rounded-xl border flex items-start gap-2 ${
            humidSporeCount > 0
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              humidSporeCount > 0 ? 'text-amber-700' : 'text-slate-500'
            }`} />
            <div>
              <strong className={humidSporeCount > 0 ? 'text-amber-950 block' : 'text-slate-800 block'}>
                {t.highHumidityWindow}
              </strong>
              <p className="text-[11px] text-[#404945] mt-0.5">
                {humidSporeCount > 0
                  ? `Relative humidity will exceed 80% for ~${humidSporeCount} hours. Plan prophylactic bio-fungicide or systemic treatment prior to nightfall.`
                  : 'Relative humidity remains below 80% throughout the 24h cycle, mitigating immediate foliar mildew explosion.'}
              </p>
            </div>
          </div>
        </div>

        {/* Rain Alert Warning if rain forecasted */}
        {hasRainIn24h && (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center gap-2 text-xs">
            <CloudRain className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-semibold">{t.noSprayWindow}</span>
          </div>
        )}
      </div>
    </div>
  );
};
