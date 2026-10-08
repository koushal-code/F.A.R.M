// Comprehensive Localized Agricultural Knowledge Base for all 7 crop samples
// Zero mixed languages or slashes - 100% pure target language

export const LOCALIZED_DIAGNOSES: Record<string, Record<string, any>> = {
  'sample-tomato-late-blight': {
    en: {
      cropName: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      diagnosisName: 'Late Blight',
      scientificPathogen: 'Phytophthora infestans',
      issueType: 'Fungal/Water Mold Disease',
      severityLevel: 'Severe',
      healthScore: 32,
      affectedAreaPercentage: 42,
      confidenceScore: 96,
      summary: 'Aggressive water-soaked brown lesions with pale chlorotic halos expanding across leaf margins. Spreads rapidly under humid morning dew conditions.',
      farmerVernacularSummary: 'Your tomato crop has Late Blight disease caused by high moisture. Without immediate fungicide treatment, it can destroy the entire canopy and ruin fruits within 3 to 5 days.',
      damageAnalysis: {
        leafDamageDescription: 'Large irregular brown necrotic lesions spreading rapidly across the leaf surface, causing foliage to dry, curl, and turn brittle like burnt paper.',
        spreadRate: 'Aggressive (48-72 hrs)',
        potentialYieldLossPercent: 65,
        vulnerableParts: ['Foliage canopy', 'Green stems & petioles', 'Fruit shoulders']
      },
      visualSymptoms: [
        'Water-soaked dark brown or purplish lesions on leaf tips',
        'Pale yellow chlorotic halos framing expanding necrotic spots',
        'Delicate white fungal down on lower leaf surface under morning humidity'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Prune and destroy severely infected lower leaves; bury them deep away from the farm',
          'Halt overhead sprinkler irrigation immediately; switch to drip lines to keep foliage dry',
          'Apply an emergency curative systemic fungicide within 24 hours across the entire field block'
        ],
        organicSolutions: [
          {
            name: 'Bordeaux Mixture (1% copper sulfate + lime)',
            preparation: 'Dissolve 1kg copper sulfate and 1kg slaked lime in separate buckets, combine into 100L water',
            applicationRate: 'Spray evenly until foliage is coated with light blue mist',
            frequency: 'Every 7-10 days during rainy weather'
          },
          {
            name: 'Trichoderma harzianum bio-fungicide',
            preparation: '10g bio-fungicide powder mixed in 1 liter clean water',
            applicationRate: '2 kg per hectare in 200L water',
            frequency: 'Apply after rain clears'
          }
        ],
        chemicalSolutions: [
          {
            activeIngredient: 'Metalaxyl-M 4% + Mancozeb 64% WP',
            commercialNames: 'Ridomil Gold, Master',
            dosagePerLiter: '2.5 g / liter of water (40g per 16L tank)',
            recommendedDilution: '500g in 200 liters water per acre',
            safetyWaitingPeriodDays: 7
          },
          {
            activeIngredient: 'Cymoxanil 8% + Mancozeb 64% WP',
            commercialNames: 'Curzate M8, Equation Pro',
            dosagePerLiter: '2.0 g / liter of water (30g per 15L tank)',
            recommendedDilution: '400g in 200 liters water per acre',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: [
          'Widen planting spacing (minimum 60cm between plants) to ensure sun penetration',
          'Stake or trellis tomato vines to keep leaves off damp soil',
          'Practice 3-year crop rotation without solanaceous relatives'
        ],
        sprayingGuidelines: {
          bestTiming: 'Early morning (06:30 - 09:00) once night dew has dried off the leaf surface',
          weatherPrecautions: 'Do not spray if rain is forecast within 3 hours. Add a silicone spreader.',
          ppeRequired: ['Rubber gloves', 'N95 dust mask', 'Eye goggles', 'Rubber boots']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Systemic Fungicide Absorption', actionRequired: 'Spray curative systemic compound; stops active fungal cell division' },
        { day: 3, expectedMilestone: 'Lesion Margin Arrest', actionRequired: 'Inspect lesion edges; active watery margins should turn dry and crispy' },
        { day: 7, expectedMilestone: 'Protective Barrier Application', actionRequired: 'Follow up with contact protective fungicide to guard new shoots' },
        { day: 14, expectedMilestone: 'New Canopy Re-establishment', actionRequired: 'Apply seaweed extract or balanced 19:19:19 foliar fertilizer' }
      ]
    },
    hi: {
      cropName: 'टमाटर',
      scientificName: 'Solanum lycopersicum',
      diagnosisName: 'पछेती झुलसा रोग',
      scientificPathogen: 'Phytophthora infestans',
      issueType: 'फफूंद जनित रोग',
      severityLevel: 'गंभीर',
      healthScore: 32,
      affectedAreaPercentage: 42,
      confidenceScore: 96,
      summary: 'पत्तियों पर गहरे भूरे पानी जैसे धब्बे तेजी से फैल रहे हैं। अधिक आर्द्रता और कम तापमान में यह रोग पूरी फसल को नष्ट कर सकता है।',
      farmerVernacularSummary: 'टमाटर में पछेती झुलसा रोग लगा है। तुरंत फफूंदनाशक का छिड़काव करें अन्यथा 3 से 5 दिनों में फसल बर्बाद हो सकती है।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियों के किनारों से धब्बे फैलकर पूरी पत्ती को सुखा देते हैं।',
        spreadRate: 'अत्यधिक तीव्र (48 घंटे में)',
        potentialYieldLossPercent: 65,
        vulnerableParts: ['पत्तियां', 'तना', 'फल']
      },
      visualSymptoms: [
        'पत्तियों के सिरों पर पानी से भीगे भूरे धब्बे',
        'धब्बों के चारों ओर हल्का पीला घेरा',
        'सुबह के समय पत्तियों की निचली सतह पर सफेद फफूंद'
      ],
      treatmentPlan: {
        immediateSteps: [
          'संक्रमित निचली पत्तियों को तोड़कर गड्ढे में दबा दें',
          'फव्वारा सिंचाई बंद करें और ड्रिप से सिंचाई करें',
          '24 घंटे के अंदर पूरे खेत में फफूंदनाशक का छिड़काव करें'
        ],
        organicSolutions: [
          {
            name: 'बोर्डो मिश्रण (1%)',
            preparation: '1 किग्रा नीला थोथा और 1 किग्रा चूना 100 लीटर पानी में मिलाएं',
            applicationRate: 'पत्तियों पर समान छिड़काव करें',
            frequency: 'बरसात के मौसम में 7-10 दिनों में'
          }
        ],
        chemicalSolutions: [
          {
            activeIngredient: 'मेटालेक्सिल-एम 4% + मैंकोजेब 64% WP',
            commercialNames: 'रिडोमिल गोल्ड',
            dosagePerLiter: '2.5 ग्राम प्रति लीटर पानी (16L टंकी में 40 ग्राम)',
            recommendedDilution: '500 ग्राम प्रति एकड़ 200 लीटर पानी में',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: [
          'पौधों के बीच 60 सेमी की दूरी रखें',
          'टमाटर के पौधों को सहारा देकर जमीन से ऊपर रखें'
        ],
        sprayingGuidelines: {
          bestTiming: 'सुबह 7 से 9:30 बजे ओस सूखने के बाद',
          weatherPrecautions: 'बारिश से पहले छिड़काव न करें',
          ppeRequired: ['दस्ताने', 'मास्क', 'चश्मा']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'दवा का असर', actionRequired: 'रिडोमिल गोल्ड का छिड़काव करें' },
        { day: 3, expectedMilestone: 'धब्बे सूखना', actionRequired: 'जांचें कि धब्बे सूख रहे हैं' },
        { day: 7, expectedMilestone: 'नई पत्तियां', actionRequired: 'मैंकोजेब का सुरक्षा छिड़काव करें' },
        { day: 14, expectedMilestone: 'फसल सुधार', actionRequired: '19:19:19 का छिड़काव करें' }
      ]
    },
    te: {
      cropName: 'టమాటా',
      scientificName: 'Solanum lycopersicum',
      diagnosisName: 'లేట్ బ్లైట్ తెగులు',
      scientificPathogen: 'Phytophthora infestans',
      issueType: 'శిలీంధ్ర తెగులు',
      severityLevel: 'తీవ్రమైనది',
      healthScore: 32,
      affectedAreaPercentage: 42,
      confidenceScore: 96,
      summary: 'ఆకులపై నల్లటి నీటి డాగుల వంటి మచ్చలు వేగంగా వ్యాపిస్తున్నాయి. అధిక తేమ మరియు చలి వాతావరణంలో పంటకు తీవ్ర నష్టం కలిగిస్తుంది.',
      farmerVernacularSummary: 'మీ టమాటా పంటకు అధిక తేమ వల్ల లేట్ బ్లైట్ తెగులు ఆశించింది. వెంటనే మందు పిచికారీ చేయకపోతే 3 నుండి 5 రోజుల్లో పంట మొత్తం పాడవుతుంది.',
      damageAnalysis: {
        leafDamageDescription: 'ఆకుల అంచుల నుండి నల్లని మచ్చలు లోపలికి వ్యాపించి ఆకులు ఎండిపోయి రాలిపోతాయి.',
        spreadRate: 'తీవ్రమైన వ్యాప్తి (48 గంటల్లో)',
        potentialYieldLossPercent: 65,
        vulnerableParts: ['ఆకుల భాగాలు', 'కొమ్మలు', 'కాయల తొడిమలు']
      },
      visualSymptoms: [
        'ఆకుల కొనలపై నీటి డాగుల వంటి గోధుమ రంగు మచ్చలు',
        'మచ్చల చుట్టూ పసుపు రంగు వలయాలు',
        'ఉదయం వేళ ఆకుల అడుగున బూజు లాంటి పొర'
      ],
      treatmentPlan: {
        immediateSteps: [
          'తెగులు సోకిన కింది ఆకులను వెంటనే తుంచి దూరంగా పూడ్చిపెట్టండి',
          'స్ప్రింక్లర్లతో పైనుంచి నీరు చల్లడం ఆపివేసి డ్రిప్ ద్వారా మాత్రమే నీరు అందించండి',
          '24 గంటల్లోపు సిలిండ్రనాశని మందును పొలం అంతటా పిచికారీ చేయండి'
        ],
        organicSolutions: [
          {
            name: 'బోర్డో మిశ్రమం (1%)',
            preparation: '1 కిలో మైలుతుత్తం, 1 కిలో సున్నం 100 లీటర్ల నీటిలో కలపాలి',
            applicationRate: 'ఆకులు తడిసేలా పిచికారీ చేయాలి',
            frequency: 'వర్షాల సమయంలో ప్రతి 7-10 రోజులకు'
          }
        ],
        chemicalSolutions: [
          {
            activeIngredient: 'మెటలాక్సిల్-ఎం 4% + మాంకోజెబ్ 64% WP',
            commercialNames: 'రిడోమిల్ గోల్డ్, మాస్టర్',
            dosagePerLiter: 'లీటరు నీటికి 2.5 గ్రాములు (16 లీటర్ల ట్యాంకుకు 40 గ్రాములు)',
            recommendedDilution: 'ఎకరానికి 500 గ్రాములు 200 లీటర్ల నీటిలో',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: [
          'మొక్కల మధ్య కనీసం 60 సెం.మీ దూరం ఉండేలా చూడండి',
          'తీగలను పైకి కట్టి ఆకులు నేలకు తగలకుండా చూసుకోండి'
        ],
        sprayingGuidelines: {
          bestTiming: 'ఉదయం 07:00 నుండి 09:30 వరకు మంచు ఆరిన తర్వాత పిచికారీ చేయాలి',
          weatherPrecautions: 'వర్షం పడే సూచన ఉన్నప్పుడు కొట్టవద్దు. జిగురు మందు కలపండి.',
          ppeRequired: ['చేతి తొడుగులు', 'మాస్క్', 'రక్షణ కళ్లద్దాలు']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'మందు ప్రభావం', actionRequired: 'సిస్టమిక్ శిలీంద్రనాశని పిచికారీ చేయండి' },
        { day: 3, expectedMilestone: 'తెగులు ఆగడం', actionRequired: 'మచ్చల అంచులు ఎండిపోతున్నాయో లేదో గమనించండి' },
        { day: 7, expectedMilestone: 'కొత్త చిగుళ్లు', actionRequired: 'రక్షణ మందుగా మాంకోజెబ్ పిచికారీ చేయండి' },
        { day: 14, expectedMilestone: 'పంట కోలుకోవడం', actionRequired: '19:19:19 ఎరువు పిచికారీ చేసి బలం చేకూర్చండి' }
      ]
    },
    kn: {
      cropName: 'ಟೊಮೆಟೊ',
      scientificName: 'Solanum lycopersicum',
      diagnosisName: 'ಅಂಗಮಾರಿ ರೋಗ',
      scientificPathogen: 'Phytophthora infestans',
      issueType: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severityLevel: 'ತೀವ್ರ',
      healthScore: 32,
      affectedAreaPercentage: 42,
      confidenceScore: 96,
      summary: 'ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ನೀರಿನ ಮಚ್ಚೆಗಳು ಕಂಡುಬರುತ್ತಿದ್ದು, ತೇವಾಂಶದ ವಾತಾವರಣದಲ್ಲಿ ವೇಗವಾಗಿ ಹರಡುತ್ತಿದೆ.',
      farmerVernacularSummary: 'ಟೊಮೆಟೊ ಬೆಳೆಯಲ್ಲಿ ಅಂಗಮಾರಿ ರೋಗ ಬಂದಿದೆ. ತಕ್ಷಣವೇ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸದಿದ್ದರೆ 3-5 ದಿನಗಳಲ್ಲಿ ಬೆಳೆ ನಾಶವಾಗುತ್ತದೆ.',
      damageAnalysis: {
        leafDamageDescription: 'ಎಲೆಗಳು ಒಣಗಿ ಕಪ್ಪಾಗಿ ಸುಟ್ಟಂತೆ ಆಗುತ್ತವೆ.',
        spreadRate: 'ತೀವ್ರ (48 ಗಂಟೆಗಳಲ್ಲಿ)',
        potentialYieldLossPercent: 65,
        vulnerableParts: ['ಎಲೆಗಳು', 'ಕಾಂಡ', 'ಕಾಯಿ']
      },
      visualSymptoms: [
        'ಎಲೆಗಳ ಅಂಚಿನಲ್ಲಿ ನೀರಿನ ಮಚ್ಚೆಗಳು',
        'ಮಚ್ಚೆಯ ಸುತ್ತ ಹಳದಿ ವಲಯ'
      ],
      treatmentPlan: {
        immediateSteps: [
          'ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ಮಣ್ಣಿನಲ್ಲಿ ಹೂತುಹಾಕಿ',
          'ತಕ್ಷಣವೇ ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ ಸಿಂಪಡಿಸಿ'
        ],
        organicSolutions: [
          {
            name: 'ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ',
            preparation: 'ಲೀಟರ್ ನೀರಿಗೆ 5 ಗ್ರಾಂ',
            applicationRate: 'ಎಕರೆಗೆ 2 ಕೆಜಿ',
            frequency: '15 ದಿನಗಳಿಗೊಮ್ಮೆ'
          }
        ],
        chemicalSolutions: [
          {
            activeIngredient: 'ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್',
            commercialNames: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್',
            dosagePerLiter: '2.5 ಗ್ರಾಂ/ಲೀಟರ್ (16L ಟ್ಯಾಂಕ್‌ಗೆ 40 ಗ್ರಾಂ)',
            recommendedDilution: '500 ಗ್ರಾಂ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['ಗಿಡಗಳಿಗೆ ಆಸರೆ ಕೊಡಿ'],
        sprayingGuidelines: { bestTiming: 'ಬೆಳಗ್ಗೆ 7 ರಿಂದ 9:30', weatherPrecautions: 'ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದ್ದಾಗ ಸಿಂಪಡಿಸಬೇಡಿ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ಔಷಧ ಸಿಂಪಡಣೆ', actionRequired: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'தக்காளி',
      scientificName: 'Solanum lycopersicum',
      diagnosisName: 'லேட் பிளைட் இலைக்கருகல்',
      scientificPathogen: 'Phytophthora infestans',
      issueType: 'பூஞ்சை நோய்',
      severityLevel: 'தீவிரம்',
      healthScore: 32,
      affectedAreaPercentage: 42,
      confidenceScore: 96,
      summary: 'இலைகளில் கரும் பழுப்பு நிற நீர் போன்ற புள்ளிகள் வேகமாக பரவுகின்றன.',
      farmerVernacularSummary: 'தக்காளியில் லேட் பிளைட் கருகல் நோய் தாக்கியுள்ளது. உடனே மருந்து தெளிக்கவில்லை என்றால் பயிர் நாசமாகிவிடும்.',
      damageAnalysis: {
        leafDamageDescription: 'இலைகள் கருகி உதிர்ந்து காய்களும் அழுகும்.',
        spreadRate: 'தீவிரமானது (48 மணி நேரத்தில்)',
        potentialYieldLossPercent: 65,
        vulnerableParts: ['இலைகள்', 'தண்டு', 'காய்']
      },
      visualSymptoms: ['இலை ஓரங்களில் கரும் புள்ளிகள்'],
      treatmentPlan: {
        immediateSteps: ['பாதிக்கப்பட்ட இலைகளை அகற்றவும்', 'ரிடோமில் கோல்ட் தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'மெட்டலாக்சில் + மான்கோசெப்',
            commercialNames: 'ரிடோமில் கோல்ட்',
            dosagePerLiter: '2.5 கிராம்/லிட்டர் (16L டேங்குக்கு 40 கிராம்)',
            recommendedDilution: '500 கிராம் ஏக்கருக்கு',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['செடிகளுக்கு முட்டு கொடுக்கவும்'],
        sprayingGuidelines: { bestTiming: 'காலை வேளையில்', weatherPrecautions: 'மழை இல்லாத போது', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'மருந்து தெளிப்பு', actionRequired: 'ரிடோமில் கோல்ட் தெளிக்கவும்' }]
    }
  },
  'sample-rice-blast': {
    en: {
      cropName: 'Paddy Rice',
      scientificName: 'Oryza sativa',
      diagnosisName: 'Rice Blast',
      scientificPathogen: 'Magnaporthe oryzae',
      issueType: 'Fungal Disease',
      severityLevel: 'Moderate',
      healthScore: 58,
      affectedAreaPercentage: 28,
      confidenceScore: 96,
      summary: 'Spindle-shaped lesions with grayish-white centers and dark reddish-brown borders along leaf blades. Spreads under high humidity.',
      farmerVernacularSummary: 'Your paddy crop has Rice Blast disease. Stop applying urea fertilizer immediately and apply Tricyclazole to prevent neck rot.',
      damageAnalysis: {
        leafDamageDescription: 'Expanding spindle lesions join together causing leaf blade drying and reduced grain filling.',
        spreadRate: 'Moderate',
        potentialYieldLossPercent: 40,
        vulnerableParts: ['Leaf blade', 'Leaf collar', 'Panicle neck']
      },
      visualSymptoms: [
        'Spindle or diamond-shaped lesions with grey center',
        'Brown to reddish-brown margins along lesions'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Stop top-dressing with nitrogen/urea immediately',
          'Drain stagnant standing water from the field for 2 days',
          'Spray Tricyclazole fungicide in cool hours'
        ],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'Tricyclazole 75% WP',
            commercialNames: 'Beam, Baan',
            dosagePerLiter: '0.6 g / liter of water (10g per 16L tank)',
            recommendedDilution: '120g in 200 liters water per acre',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['Use certified blast-resistant varieties', 'Treat seeds before sowing'],
        sprayingGuidelines: {
          bestTiming: 'Morning 07:00 - 09:30 or late afternoon',
          weatherPrecautions: 'Do not spray during high winds',
          ppeRequired: ['Mask', 'Gloves']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Fungicide Action', actionRequired: 'Spray Tricyclazole thoroughly on crop canopy' }
      ]
    },
    hi: {
      cropName: 'धान (चावल)',
      scientificName: 'Oryza sativa',
      diagnosisName: 'ब्लास्ट रोग (झोंका)',
      scientificPathogen: 'Magnaporthe oryzae',
      issueType: 'फफूंद जनित रोग',
      severityLevel: 'मध्यम',
      healthScore: 58,
      affectedAreaPercentage: 28,
      confidenceScore: 96,
      summary: 'पत्तियों पर कताई के आकार के राख जैसे धब्बे दिखाई दे रहे हैं।',
      farmerVernacularSummary: 'धान में ब्लास्ट रोग लगा है। यूरिया खाद तुरंत बंद करें और ट्राईसाइक्लाजोल का छिड़काव करें।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियां सूखती हैं और बालियों की गर्दन टूट जाती है।',
        spreadRate: 'मध्यम',
        potentialYieldLossPercent: 40,
        vulnerableParts: ['पत्ती', 'बाली की गर्दन']
      },
      visualSymptoms: ['कताई के आकार के राख जैसे धब्बे'],
      treatmentPlan: {
        immediateSteps: ['यूरिया खाद बंद करें', 'ट्राईसाइक्लाजोल का छिड़काव करें'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ट्राईसाइक्लाजोल 75% WP',
            commercialNames: 'बीम, बाण',
            dosagePerLiter: '0.6 ग्राम प्रति लीटर पानी (16L टंकी में 10 ग्राम)',
            recommendedDilution: '120 ग्राम प्रति एकड़',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['बीज उपचार करें'],
        sprayingGuidelines: { bestTiming: 'सुबह 7 से 9:30 बजे', weatherPrecautions: 'शांत हवा में छिड़कें', ppeRequired: ['मास्क', 'दस्ताने'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'दवा का छिड़काव', actionRequired: 'ट्राईसाइक्लाजोल का छिड़काव करें' }]
    },
    te: {
      cropName: 'వరి',
      scientificName: 'Oryza sativa',
      diagnosisName: 'అగ్గి తెగులు',
      scientificPathogen: 'Magnaporthe oryzae',
      issueType: 'శిలీంధ్ర తెగులు',
      severityLevel: 'మధ్యస్థం',
      healthScore: 58,
      affectedAreaPercentage: 28,
      confidenceScore: 96,
      summary: 'వరి ఆకులపై కదురు ఆకారపు బూడిద రంగు మచ్చలు ఏర్పడ్డాయి. అధిక నత్రజని వాడకం మరియు మంచు వల్ల వ్యాప్తి చెందుతుంది.',
      farmerVernacularSummary: 'మీ వరి పంటకు అగ్గి తెగులు సోకింది. వెంటనే యూరియా వేయడం ఆపివేసి ట్రైసైక్లాజోల్ పిచికారీ చేయండి.',
      damageAnalysis: {
        leafDamageDescription: 'మచ్చలు కలిసిపోయి ఆకులు ఎండిపోతాయి, మెడవిరుపు దశలో గింజ పాలు పోసుకోదు.',
        spreadRate: 'మధ్యస్థం',
        potentialYieldLossPercent: 40,
        vulnerableParts: ['ఆకులు', 'కంకి మెడ భాగం']
      },
      visualSymptoms: ['కదురు ఆకారపు బూడిద రంగు మచ్చలు'],
      treatmentPlan: {
        immediateSteps: ['యూరియా వాడకం నిలిపివేయండి', 'ట్రైసైక్లాజోల్ పిచికారీ చేయండి'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ట్రైసైక్లాజోల్ 75% WP',
            commercialNames: 'బీమ్, బాణ్',
            dosagePerLiter: 'లీటరు నీటికి 0.6 గ్రాములు (16 లీటర్ల ట్యాంకుకు 10 గ్రాములు)',
            recommendedDilution: 'ఎకరానికి 120 గ్రాములు 200 లీటర్ల నీటిలో',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['విత్తన శుద్ధి చేయండి'],
        sprayingGuidelines: { bestTiming: 'ఉదయం లేదా సాయంత్రం', weatherPrecautions: 'గాలి లేనప్పుడు పిచికారీ చేయాలి', ppeRequired: ['మాస్క్'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'మందు ప్రభావం', actionRequired: 'ట్రైసైక్లాజోల్ పిచికారీ చేయండి' }]
    },
    kn: {
      cropName: 'ಭತ್ತ',
      scientificName: 'Oryza sativa',
      diagnosisName: 'ಬೆಂಕಿ ರೋಗ',
      scientificPathogen: 'Magnaporthe oryzae',
      issueType: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severityLevel: 'ಮಧ್ಯಮ',
      healthScore: 58,
      affectedAreaPercentage: 28,
      confidenceScore: 96,
      summary: 'ಭತ್ತದ ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದಿ ಬಣ್ಣದ ಮಚ್ಚೆಗಳು.',
      farmerVernacularSummary: 'ಭತ್ತದಲ್ಲಿ ಬೆಂಕಿ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಕದಿರು ಮುರಿಯುವುದನ್ನು ತಪ್ಪಿಸಲು ತಕ್ಷಣವೇ ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ.',
      damageAnalysis: {
        leafDamageDescription: 'ಎಲೆಗಳು ಒಣಗಿ ಇಳುವರಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
        spreadRate: 'ಮಧ್ಯಮ',
        potentialYieldLossPercent: 40,
        vulnerableParts: ['ಎಲೆ', 'ಕದಿರು']
      },
      visualSymptoms: ['ಕದಿರಿನ ಆಕಾರದ ಮಚ್ಚೆಗಳು'],
      treatmentPlan: {
        immediateSteps: ['ಯೂರಿಯಾ ನಿಲ್ಲಿಸಿ', 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP',
            commercialNames: 'ಬೀಮ್',
            dosagePerLiter: '0.6 ಗ್ರಾಂ/ಲೀಟರ್ (16L ಟ್ಯಾಂಕ್‌ಗೆ 10 ಗ್ರಾಂ)',
            recommendedDilution: '120 ಗ್ರಾಂ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['ಬೀಜೋಪಚಾರ ಮಾಡಿ'],
        sprayingGuidelines: { bestTiming: 'ಬೆಳಗ್ಗೆ', weatherPrecautions: 'ಮಳೆ ಇಲ್ಲದಿದ್ದಾಗ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ಔಷಧ ಸಿಂಪಡಣೆ', actionRequired: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'நெல்',
      scientificName: 'Oryza sativa',
      diagnosisName: 'குலை நோய்',
      scientificPathogen: 'Magnaporthe oryzae',
      issueType: 'பூஞ்சை நோய்',
      severityLevel: 'மிதமானது',
      healthScore: 58,
      affectedAreaPercentage: 28,
      confidenceScore: 96,
      summary: 'நெல் இலைகளில் கதிர் வடிவ சாம்பல் நிற புள்ளிகள்.',
      farmerVernacularSummary: 'நெல்லில் குலை நோய் தாக்கியுள்ளது. கதிர் அழுகலைத் தடுக்க டிரைசைக்ளசோல் தெளிக்கவும்.',
      damageAnalysis: {
        leafDamageDescription: 'இலைகள் காய்ந்து மகசூல் குறையும்.',
        spreadRate: 'மிதமானது',
        potentialYieldLossPercent: 40,
        vulnerableParts: ['இலை', 'கதிர்']
      },
      visualSymptoms: ['கதிர் வடிவ புள்ளிகள்'],
      treatmentPlan: {
        immediateSteps: ['யூரியாவை நிறுத்துங்கள்', 'டிரைசைக்ளசோல் தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'டிரைசைக்ளசோல் 75% WP',
            commercialNames: 'பீம்',
            dosagePerLiter: '0.6 கிராம்/லிட்டர் (16L டேங்குக்கு 10 கிராம்)',
            recommendedDilution: '120 கிராம் ஏக்கருக்கு',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['விதை நேர்த்தி செய்யவும்'],
        sprayingGuidelines: { bestTiming: 'காலை வேளையில்', weatherPrecautions: 'மழையற்ற போது', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'மருந்து தெளிப்பு', actionRequired: 'டிரைசைக்ளசோல் தெளிக்கவும்' }]
    }
  },
  'sample-cotton-leaf-curl': {
    en: {
      cropName: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      diagnosisName: 'Cotton Leaf Curl Virus (CLCuV)',
      scientificPathogen: 'Begomovirus transmitted by Bemisia tabaci (Whitefly)',
      issueType: 'Viral Vector Disease',
      severityLevel: 'Severe',
      healthScore: 45,
      affectedAreaPercentage: 38,
      confidenceScore: 94,
      summary: 'Upward curling of leaf margins, thick swollen veins, and small leaf enations underneath transmitted by whiteflies.',
      farmerVernacularSummary: 'Your cotton crop has Leaf Curl Virus transmitted by whiteflies. Control the whitefly insect vector immediately to prevent stunting.',
      damageAnalysis: {
        leafDamageDescription: 'Thick leathery curled leaves with reduced photosynthetic area, leading to stunted plants and boll dropping.',
        spreadRate: 'Moderate',
        potentialYieldLossPercent: 55,
        vulnerableParts: ['Young apical leaves', 'Flower squares', 'Young bolls']
      },
      visualSymptoms: [
        'Upward boat-shaped curling of leaves',
        'Thickened and swollen leaf veins',
        'Tiny leaf-like outgrowths underneath leaf blades'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Install yellow sticky traps @ 10 per acre to monitor and capture whiteflies',
          'Spray systemic insecticide to suppress whitefly vector population',
          'Rogue out and bury severely stunted early-stage plants'
        ],
        organicSolutions: [
          {
            name: 'Neem Oil 10,000 ppm',
            preparation: '3ml neem oil + 1ml liquid detergent in 1L water',
            applicationRate: '600ml in 200L water per acre',
            frequency: 'Every 7 days'
          }
        ],
        chemicalSolutions: [
          {
            activeIngredient: 'Diafenthiuron 50% WP',
            commercialNames: 'Pegasus, Polo',
            dosagePerLiter: '1.2 g / liter of water (20g per 16L tank)',
            recommendedDilution: '250g in 200 liters water per acre',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['Eradicate weed hosts around field borders', 'Avoid late planting'],
        sprayingGuidelines: {
          bestTiming: 'Late afternoon when whiteflies rest on lower leaf surfaces',
          weatherPrecautions: 'Ensure thorough coverage of under-leaf canopy',
          ppeRequired: ['Mask', 'Gloves']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Vector Suppression', actionRequired: 'Spray Diafenthiuron to kill active whitefly nymphs and adults' },
        { day: 7, expectedMilestone: 'New Shoot Growth', actionRequired: 'Monitor new top leaves; new shoots should emerge flat and healthy' }
      ]
    },
    hi: {
      cropName: 'कपास',
      scientificName: 'Gossypium hirsutum',
      diagnosisName: 'पत्ती मरोड़ रोग (सफेद मक्खी जनित)',
      scientificPathogen: 'सफेद मक्खी द्वारा फैलने वाला वायरस',
      issueType: 'विषाणु जनित रोग',
      severityLevel: 'गंभीर',
      healthScore: 45,
      affectedAreaPercentage: 38,
      confidenceScore: 94,
      summary: 'पत्तियों का ऊपर की ओर मुड़ना और नसों का मोटा होना।',
      farmerVernacularSummary: 'कपास में सफेद मक्खी के कारण पत्ती मरोड़ रोग लगा है। सफेद मक्खी को तुरंत रोकें।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियां मुड़कर कड़ी हो जाती हैं और पौधों की बढ़वार रुक जाती है।',
        spreadRate: 'मध्यम',
        potentialYieldLossPercent: 55,
        vulnerableParts: ['नई पत्तियां', 'टिंडे']
      },
      visualSymptoms: ['पत्तियों का ऊपर मुड़ना', 'मोटी उभरी नसें'],
      treatmentPlan: {
        immediateSteps: ['पीले ट्रैप लगाएं', 'डायफेन्थियूरोन का छिड़काव करें'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'डायफेन्थियूरोन 50% WP',
            commercialNames: 'पोलो, पेगासस',
            dosagePerLiter: '1.2 ग्राम प्रति लीटर पानी',
            recommendedDilution: '250 ग्राम प्रति एकड़',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['मेड़ों से खरपतवार हटाएं'],
        sprayingGuidelines: { bestTiming: 'शाम के समय', weatherPrecautions: 'पत्तियों के नीचे अच्छी तरह छिड़कें', ppeRequired: ['मास्क'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'कीट नियंत्रण', actionRequired: 'डायफेन्थियूरोन का छिड़काव करें' }]
    },
    te: {
      cropName: 'పత్తి',
      scientificName: 'Gossypium hirsutum',
      diagnosisName: 'ఆకు ముడుత తెగులు',
      scientificPathogen: 'తెల్లదోమ ద్వారా వ్యాపించే వైరస్',
      issueType: 'వైరస్ తెగులు',
      severityLevel: 'తీవ్రమైనది',
      healthScore: 45,
      affectedAreaPercentage: 38,
      confidenceScore: 94,
      summary: 'ఆకులు పైకి దోనెలా ముడుచుకుపోవడం, ఈనెలు లావుగా మారడం మరియు మొక్క ఎదగకపోవడం.',
      farmerVernacularSummary: 'మీ పత్తి పంటకు తెల్లదోమ వల్ల ఆకు ముడుత తెగులు వచ్చింది. వెంటనే డయాఫెంతియురాన్ పిచికారీ చేసి తెల్లదోమను అరికట్టండి.',
      damageAnalysis: {
        leafDamageDescription: 'ఆకులు ముడుచుకుపోయి గట్టిపడతాయి, పూత మరియు కాయలు రాలిపోతాయి.',
        spreadRate: 'మధ్యస్థం',
        potentialYieldLossPercent: 55,
        vulnerableParts: ['పై చిగురు ఆకులు', 'పూత మొగ్గలు']
      },
      visualSymptoms: ['ఆకులు పైకి ముడుచుకోవడం', 'ఈనెలు లావుగా మారడం'],
      treatmentPlan: {
        immediateSteps: ['పసుపు రంగు జిగురు అట్టలు పెట్టండి', 'డయాఫెంతియురాన్ పిచికారీ చేయండి'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'డయాఫెంతియురాన్ 50% WP',
            commercialNames: 'పోలో, పెగాసస్',
            dosagePerLiter: 'లీటరు నీటికి 1.2 గ్రాములు',
            recommendedDilution: 'ఎకరానికి 250 గ్రాములు',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['పొలం గట్లపై కలుపు మొక్కలను తొలగించండి'],
        sprayingGuidelines: { bestTiming: 'సాయంత్రం వేళ ఆకుల అడుగున తడిసేలా పిచికారీ చేయాలి', weatherPrecautions: 'శాంతమైన గాలిలో కొట్టండి', ppeRequired: ['మాస్క్'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'పురుగు నివారణ', actionRequired: 'డయాఫెంతియురాన్ పిచికారీ చేయండి' }]
    },
    kn: {
      cropName: 'ಹತ್ತಿ',
      scientificName: 'Gossypium hirsutum',
      diagnosisName: 'ಎಲೆ ಮುಟುರು ರೋಗ',
      scientificPathogen: 'ಬಿಳಿ ನೊಣ ಹರಡುವ ವೈರಸ್',
      issueType: 'ವೈರಸ್ ರೋಗ',
      severityLevel: 'ತೀವ್ರ',
      healthScore: 45,
      affectedAreaPercentage: 38,
      confidenceScore: 94,
      summary: 'ಎಲೆಗಳು ಮೇಲ್ಮುಖವಾಗಿ ಮುದುರಿಕೊಳ್ಳುವುದು ಮತ್ತು ಉಬ್ಬಿದ ನಾಳಗಳು.',
      farmerVernacularSummary: 'ಹತ್ತಿ ಬೆಳೆಯಲ್ಲಿ ಬಿಳಿ ನೊಣದಿಂದ ಎಲೆ ಮುಟುರು ರೋಗ ಬಂದಿದೆ. ತಕ್ಷಣವೇ ಡಯಾಫೆಂಥಿಯುರಾನ್ ಸಿಂಪಡಿಸಿ.',
      damageAnalysis: {
        leafDamageDescription: 'ಎಲೆಗಳು ಗಟ್ಟಿಯಾಗಿ ಗಿಡದ ಬೆಳವಣಿಗೆ ನಿಲ್ಲುತ್ತದೆ.',
        spreadRate: 'ಮಧ್ಯಮ',
        potentialYieldLossPercent: 55,
        vulnerableParts: ['ಮೇಲಿನ ಚಿಗುರು', 'ಮೊಗ್ಗುಗಳು']
      },
      visualSymptoms: ['ಎಲೆ ಮುದುರುವಿಕೆ'],
      treatmentPlan: {
        immediateSteps: ['ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಇರಿಸಿ', 'ಡಯಾಫೆಂಥಿಯುರಾನ್ ಸಿಂಪಡಿಸಿ'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ಡಯಾಫೆಂಥಿಯುರಾನ್ 50% WP',
            commercialNames: 'ಪೋಲೊ',
            dosagePerLiter: '1.2 ಗ್ರಾಂ/ಲೀಟರ್',
            recommendedDilution: '250 ಗ್ರಾಂ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['ಕಳೆ ನಿಯಂತ್ರಿಸಿ'],
        sprayingGuidelines: { bestTiming: 'ಸಂಜೆ', weatherPrecautions: 'ಎಲೆಗಳ ಕೆಳಗೆ ಸಿಂಪಡಿಸಿ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ಕೀಟ ನಿಯಂತ್ರಣ', actionRequired: 'ಡಯಾಫೆಂಥಿಯುರಾನ್ ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'பருத்தி',
      scientificName: 'Gossypium hirsutum',
      diagnosisName: 'இலை சுருட்டு நோய்',
      scientificPathogen: 'வெள்ளை ஈயால் பரவும் வைரஸ்',
      issueType: 'வைரஸ் நோய்',
      severityLevel: 'தீவிரம்',
      healthScore: 45,
      affectedAreaPercentage: 38,
      confidenceScore: 94,
      summary: 'இலைகள் மேல்நோக்கி படகு போல சுருண்டு தடித்த நரம்புகளுடன் வளர்ச்சி குன்றுதல்.',
      farmerVernacularSummary: 'பருத்தியில் வெள்ளை ஈ மூலம் இலை சுருட்டு நோய் வந்துள்ளது. டயாபெந்தியூரான் தெளிக்கவும்.',
      damageAnalysis: {
        leafDamageDescription: 'இலைகள் சுருங்கி வளர்ச்சி நின்றுவிடும்.',
        spreadRate: 'மிதமானது',
        potentialYieldLossPercent: 55,
        vulnerableParts: ['இலைகள்', 'பூ மொட்டுகள்']
      },
      visualSymptoms: ['இலை சுருங்குதல்'],
      treatmentPlan: {
        immediateSteps: ['மஞ்சள் பொறிகள் வைக்கவும்', 'டயாபெந்தியூரான் தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'டயாபெந்தியூரான் 50% WP',
            commercialNames: 'போலோ',
            dosagePerLiter: '1.2 கிராம்/லிட்டர்',
            recommendedDilution: '250 கிராம் ஏக்கருக்கு',
            safetyWaitingPeriodDays: 21
          }
        ],
        preventativeMeasures: ['களைகளை அகற்றவும்'],
        sprayingGuidelines: { bestTiming: 'மாலை வேளையில்', weatherPrecautions: 'இலைகளின் அடியில் படுமாறு தெளிக்கவும்', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'பூச்சி கட்டுப்பாடு', actionRequired: 'டயாபெந்தியூரான் தெளிக்கவும்' }]
    }
  },
  'sample-maize-fall-armyworm': {
    en: {
      cropName: 'Maize (Corn)',
      scientificName: 'Zea mays',
      diagnosisName: 'Fall Armyworm (FAW)',
      scientificPathogen: 'Spodoptera frugiperda',
      issueType: 'Pest Infestation',
      severityLevel: 'Critical',
      healthScore: 24,
      affectedAreaPercentage: 55,
      confidenceScore: 98,
      summary: 'Ragged torn leaf whorls with deep feeding holes and sawdust-like frass inside the central leaf funnel.',
      farmerVernacularSummary: 'Your maize crop is critically infested with Fall Armyworm. Larvae are destroying the central whorl. Spray Coragen or Emamectin Benzoate directly into the whorl.',
      damageAnalysis: {
        leafDamageDescription: 'Severe chewing of central whorl leaves, destruction of growing tip, resulting in stunted headless plants.',
        spreadRate: 'Aggressive (48-72 hrs)',
        potentialYieldLossPercent: 75,
        vulnerableParts: ['Central leaf whorl', 'Emerging tassel', 'Young cobs']
      },
      visualSymptoms: [
        'Large ragged feeding holes on leaves',
        'Coarse sawdust-like larval excreta in central whorl',
        'Caterpillar with inverted Y-mark on head'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Direct insecticide nozzle right into the central whorl of each plant',
          'Apply sand mixed with lime/ash (9:1) into whorls if spraying is delayed',
          'Spray in early evening when caterpillars emerge to feed'
        ],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'Chlorantraniliprole 18.5% SC',
            commercialNames: 'Coragen',
            dosagePerLiter: '0.4 ml / liter of water (6ml per 15L tank)',
            recommendedDilution: '80ml in 200 liters water per acre',
            safetyWaitingPeriodDays: 14
          },
          {
            activeIngredient: 'Emamectin Benzoate 5% SG',
            commercialNames: 'Proclaim, Missile',
            dosagePerLiter: '0.4 g / liter of water (8g per 20L tank)',
            recommendedDilution: '80g in 200 liters water per acre',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['Deep summer ploughing', 'Intercrop with cowpea or pulses'],
        sprayingGuidelines: {
          bestTiming: 'Late evening (17:00 - 18:30) directed strictly inside the funnel',
          weatherPrecautions: 'Do not spray when rain is imminent',
          ppeRequired: ['Mask', 'Gloves']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Larval Kill', actionRequired: 'Spray Coragen directly into whorl to eliminate feeding larvae' },
        { day: 5, expectedMilestone: 'Whorl Regrowth', actionRequired: 'Check whorl for clean green unfurling leaves with no fresh frass' }
      ]
    },
    hi: {
      cropName: 'मक्का',
      scientificName: 'Zea mays',
      diagnosisName: 'फॉल आर्मीवर्म (सैनिक कीट)',
      scientificPathogen: 'स्पोडोप्टेरा फ्रूगीपर्डा',
      issueType: 'कीट प्रकोप',
      severityLevel: 'गंभीर',
      healthScore: 24,
      affectedAreaPercentage: 55,
      confidenceScore: 98,
      summary: 'पत्तियों में बड़े गोल छेद और गोभ के अंदर लकड़ी के बुरादे जैसा कीट का मल भरा होता है।',
      farmerVernacularSummary: 'मक्का में खतरनाक फॉल आर्मीवर्म सुंडी लगी है। तुरंत कोराजन या इमामेक्टिन का छिड़काव गोभ के अंदर करें।',
      damageAnalysis: {
        leafDamageDescription: 'सुंडी गोभ की नई पत्तियों को खाकर बर्बाद कर देती है।',
        spreadRate: 'अत्यधिक तीव्र (48 घंटे में)',
        potentialYieldLossPercent: 75,
        vulnerableParts: ['गोभ', 'पत्तियां', 'भुट्टे']
      },
      visualSymptoms: ['पत्तियों में बड़े छेद', 'गोभ में बुरादे जैसा मल'],
      treatmentPlan: {
        immediateSteps: ['दवा सीधे गोभ के अंदर छिड़कें', 'कोराजन का छिड़काव करें'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'क्लोरेंट्रानिलीप्रोल 18.5% SC',
            commercialNames: 'कोराजन',
            dosagePerLiter: '0.4 मिली प्रति लीटर पानी',
            recommendedDilution: '80 मिली प्रति एकड़',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['गहरी जुताई करें'],
        sprayingGuidelines: { bestTiming: 'शाम 5 बजे के बाद', weatherPrecautions: 'सीधे गोभ में नोजल रखकर छिड़कें', ppeRequired: ['मास्क'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'सुंडी खात्मा', actionRequired: 'कोराजन का छिड़काव करें' }]
    },
    te: {
      cropName: 'మొక్కజొన్న',
      scientificName: 'Zea mays',
      diagnosisName: 'కత్తెర పురుగు (ఫాల్ ఆర్మీవార్మ్)',
      scientificPathogen: 'స్పోడోప్టెరా ఫ్రూగిపెర్డా',
      issueType: 'పురుగుల బెడద',
      severityLevel: 'ప్రమాదకరమైనది',
      healthScore: 24,
      affectedAreaPercentage: 55,
      confidenceScore: 98,
      summary: 'ఆకులపై పెద్ద రంధ్రాలు, సుడిలో రంపపు పొట్టు లాంటి పురుగు మలం మరియు మొవ్వు తినివేయబడుతుంది.',
      farmerVernacularSummary: 'మీ మొక్కజొన్న పంటకు కత్తెర పురుగు సోకింది. పురుగులు సుడిలోని లేత మొవ్వును తినేస్తున్నాయి. వెంటనే కోరాజెన్ మందును సుడిలో పడేలా పిచికారీ చేయండి.',
      damageAnalysis: {
        leafDamageDescription: 'సుడిలోని ఆకులను కొరికివేయడం వల్ల మొక్క ఎదుగుదల ఆగిపోయి కంకి వేయదు.',
        spreadRate: 'తీవ్రమైన వ్యాప్తి (48 గంటల్లో)',
        potentialYieldLossPercent: 75,
        vulnerableParts: ['మొక్కజొన్న సుడి', 'మొవ్వు', 'లేత కంకులు']
      },
      visualSymptoms: ['ఆకులపై పెద్ద రంధ్రాలు', 'సుడిలో రంపపు పొట్టు లాంటి మలం'],
      treatmentPlan: {
        immediateSteps: ['మందును నేరుగా సుడిలో పడేలా కొట్టండి', 'కోరాజెన్ లేదా ఇమామెక్టిన్ పిచికారీ చేయండి'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'క్లోరాంట్రానిలిప్రోల్ 18.5% SC',
            commercialNames: 'కోరాజెన్',
            dosagePerLiter: 'లీటరు నీటికి 0.4 మి.లీ (15 లీటర్ల ట్యాంకుకు 6 మి.లీ)',
            recommendedDilution: 'ఎకరానికి 80 మి.లీ 200 లీటర్ల నీటిలో',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['వేసవిలో లోతు దుక్కులు చేయండి'],
        sprayingGuidelines: { bestTiming: 'సాయంత్రం వేళ సుడిలో పడేలా పిచికారీ చేయాలి', weatherPrecautions: 'శాంతమైన వాతావరణంలో కొట్టండి', ppeRequired: ['మాస్క్'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'పురుగుల మరణం', actionRequired: 'కోరాజెన్ పిచికారీ చేయండి' }]
    },
    kn: {
      cropName: 'ಮುಸುಕಿನ ಜೋಳ',
      scientificName: 'Zea mays',
      diagnosisName: 'ಸೈನಿಕ ಹುಳು (ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್)',
      scientificPathogen: 'ಸ್ಪೊಡೊಪ್ಟೆರಾ ಫ್ರೂಗಿಪರ್ಡಾ',
      issueType: 'ಕೀಟ ಬಾಧೆ',
      severityLevel: 'ತೀವ್ರ',
      healthScore: 24,
      affectedAreaPercentage: 55,
      confidenceScore: 98,
      summary: 'ಎಲೆಗಳಲ್ಲಿ ರಂಧ್ರಗಳು ಮತ್ತು ಸುಳಿಯೊಳಗೆ ಮರದ ಪುಡಿಯಂತಹ ತ್ಯಾಜ್ಯ.',
      farmerVernacularSummary: 'ಜೋಳದ ಬೆಳೆಗೆ ಸೈನಿಕ ಹುಳು ಬಾಧಿಸಿದೆ. ಸುಳಿಯೊಳಗೆ ಕೋರಾಜನ್ ಔಷಧಿ ಸಿಂಪಡಿಸಿ.',
      damageAnalysis: {
        leafDamageDescription: 'ಸುಳಿಯ ಎಲೆಗಳನ್ನು ತಿಂದು ಬೆಳವಣಿಗೆಯನ್ನು ನಾಶಮಾಡುತ್ತದೆ.',
        spreadRate: 'ತೀವ್ರ',
        potentialYieldLossPercent: 75,
        vulnerableParts: ['ಸುಳಿ', 'ತೆನೆ']
      },
      visualSymptoms: ['ಎಲೆಗಳಲ್ಲಿ ರಂಧ್ರಗಳು'],
      treatmentPlan: {
        immediateSteps: ['ಸುಳಿಗೆ ನೇರವಾಗಿ ಔಷಧಿ ಸಿಂಪಡಿಸಿ'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್',
            commercialNames: 'ಕೋರಾಜನ್',
            dosagePerLiter: '0.4 ಮಿಲಿ/ಲೀಟರ್',
            recommendedDilution: '80 ಮಿಲಿ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['ಬೇಸಿಗೆಯಲ್ಲಿ ಆಳವಾದ ಉಳುಮೆ ಮಾಡಿ'],
        sprayingGuidelines: { bestTiming: 'ಸಂಜೆ', weatherPrecautions: 'ಸುಳಿಗೆ ಹಾಕಿ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ಹುಳು ನಾಶ', actionRequired: 'ಕೋರಾಜನ್ ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'மக்காச்சோளம்',
      scientificName: 'Zea mays',
      diagnosisName: 'படைப்புழு (பால் ஆர்மி வார்ம்)',
      scientificPathogen: 'ஸ்போடோப்டெரா புருகிபெர்டா',
      issueType: 'பூச்சி தாக்குதல்',
      severityLevel: 'தீவிரம்',
      healthScore: 24,
      affectedAreaPercentage: 55,
      confidenceScore: 98,
      summary: 'இலைகளில் பெரிய துளைகள் மற்றும் குருத்து பகுதியில் மரத்தூள் போன்ற கழிவுகள்.',
      farmerVernacularSummary: 'மக்காச்சோளத்தில் படைப்புழு தாக்குதல் தீவிரமாக உள்ளது. கோராசன் மருந்தை குருத்தில் படுமாறு தெளிக்கவும்.',
      damageAnalysis: {
        leafDamageDescription: 'குருத்து இலைகள் சேதமடைந்து பயிர் வளர்ச்சி முற்றிலும் நிற்கும்.',
        spreadRate: 'தீவிரமானது',
        potentialYieldLossPercent: 75,
        vulnerableParts: ['குருத்து', 'கதிர்']
      },
      visualSymptoms: ['குருத்தில் துளைகள் மற்றும் கழிவு'],
      treatmentPlan: {
        immediateSteps: ['குருத்தில் படுமாறு மருந்து தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'குளோரான்ட்ரானிலிப்ரோல்',
            commercialNames: 'கோராசன்',
            dosagePerLiter: '0.4 மி.லி/லிட்டர்',
            recommendedDilution: '80 மி.லி ஏக்கருக்கு',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['கோடை உழவு செய்யவும்'],
        sprayingGuidelines: { bestTiming: 'மாலை வேளையில்', weatherPrecautions: 'குருத்தில் தெளிக்கவும்', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'புழு அழிவு', actionRequired: 'கோராசன் தெளிக்கவும்' }]
    }
  },
  'sample-chilli-anthracnose': {
    en: {
      cropName: 'Chilli',
      scientificName: 'Capsicum annuum',
      diagnosisName: 'Anthracnose & Thrips Leaf Curl',
      scientificPathogen: 'Colletotrichum capsici & Scirtothrips dorsalis',
      issueType: 'Fungal & Pest Complex',
      severityLevel: 'Severe',
      healthScore: 38,
      affectedAreaPercentage: 44,
      confidenceScore: 95,
      summary: 'Upward boat-shaped leaf curling caused by thrips with sunken circular necrotic spots and twig die-back.',
      farmerVernacularSummary: 'Your chilli crop has Thrips Leaf Curl and Anthracnose Dieback. Apply Fipronil for thrips and Azoxystrobin to stop dieback.',
      damageAnalysis: {
        leafDamageDescription: 'Curled wrinkled foliage with brittle texture and black twig necrosis starting from top growing tips.',
        spreadRate: 'Moderate',
        potentialYieldLossPercent: 50,
        vulnerableParts: ['Top growing twigs', 'Green flower buds', 'Ripening fruits']
      },
      visualSymptoms: [
        'Upward boat-shaped cupping of leaves',
        'Sunken lesions with concentric rings',
        'Twig tips turning dry black and dying back'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Clip off and burn black dead twigs with sharp shears',
          'Hang blue sticky traps for thrips monitoring',
          'Spray combined insecticide and curative fungicide'
        ],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'Fipronil 5% SC + Azoxystrobin 23% SC',
            commercialNames: 'Regent + Amistar',
            dosagePerLiter: '2.0 ml Fipronil + 1.0 ml Azoxystrobin / L water',
            recommendedDilution: '400ml Fipronil + 200ml Azoxystrobin in 200L water per acre',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['Avoid continuous night overhead sprinkling'],
        sprayingGuidelines: {
          bestTiming: 'Morning 07:00 - 09:30',
          weatherPrecautions: 'Ensure full twig and canopy coverage',
          ppeRequired: ['Mask', 'Gloves']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Thrips and Fungal Knockdown', actionRequired: 'Spray combined tank mix' }
      ]
    },
    hi: {
      cropName: 'मिर्च',
      scientificName: 'Capsicum annuum',
      diagnosisName: 'मरोड़िया रोग व एन्थ्रेक्नोज',
      scientificPathogen: 'थ्रिप्स व कोलेटोट्राइकम',
      issueType: 'कीट व फफूंद रोग',
      severityLevel: 'गंभीर',
      healthScore: 38,
      affectedAreaPercentage: 44,
      confidenceScore: 95,
      summary: 'थ्रिप्स से पत्तियां नाव जैसी मुड़ जाती हैं और टहनियां ऊपर से सूखने लगती हैं।',
      farmerVernacularSummary: 'मिर्च में थ्रिप्स कीट और फल सड़न/टहनी सूखने का रोग लगा है। फिप्रोनिल और एज़ोक्सीस्ट्रोबिन का छिड़काव करें।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियां मुड़कर नाव बन जाती हैं और टहनियां ऊपर से काली होकर सूखती हैं।',
        spreadRate: 'मध्यम',
        potentialYieldLossPercent: 50,
        vulnerableParts: ['टहनियां', 'पत्तियां', 'मिर्च']
      },
      visualSymptoms: ['नाव जैसी मुड़ी पत्तियां', 'टहनियों का ऊपर से सूखना'],
      treatmentPlan: {
        immediateSteps: ['सूखी टहनियां काटें', 'फिप्रोनिल का छिड़काव करें'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'फिप्रोनिल 5% SC + एज़ोक्सीस्ट्रोबिन',
            commercialNames: 'रीजेंट + एमिस्टार',
            dosagePerLiter: '2 मिली फिप्रोनिल + 1 मिली एज़ोक्सीस्ट्रोबिन प्रति लीटर',
            recommendedDilution: '400 मिली + 200 मिली प्रति एकड़',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['नीले चिपचिपे ट्रैप लगाएं'],
        sprayingGuidelines: { bestTiming: 'सुबह के समय', weatherPrecautions: 'पौधे को अच्छी तरह भिगोएं', ppeRequired: ['मास्क'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'दवा का असर', actionRequired: 'छिड़काव करें' }]
    },
    te: {
      cropName: 'మిరప',
      scientificName: 'Capsicum annuum',
      diagnosisName: 'కొమ్మ ఎండు & తామర పురుగుల ముడత',
      scientificPathogen: 'కొలెటోట్రైకమ్ & స్కిర్టోథ్రిప్స్',
      issueType: 'శిలీంధ్ర & పురుగుల సంక్లిష్టం',
      severityLevel: 'తీవ్రమైనది',
      healthScore: 38,
      affectedAreaPercentage: 44,
      confidenceScore: 95,
      summary: 'ఆకులు పైకి దోనెలా ముడుచుకోవడం, ఆకులపై నల్లటి మచ్చలు మరియు కొమ్మలు పైనుండి ఎండిపోవడం.',
      farmerVernacularSummary: 'మీ మిరప తోటలో నల్ల తామర పురుగుల వల్ల ఆకు ముడుత మరియు కొమ్మ ఎండు తెగులు వచ్చింది. వెంటనే ఫిప్రోనిల్ మరియు అజాక్సిస్ట్రోబిన్ పిచికారీ చేయండి.',
      damageAnalysis: {
        leafDamageDescription: 'ఆకులు ముడుచుకుపోయి గట్టిపడతాయి, కొమ్మలు పైనుండి నల్లగా మారి ఎండిపోతాయి.',
        spreadRate: 'మధ్యస్థం',
        potentialYieldLossPercent: 50,
        vulnerableParts: ['పై కొమ్మలు', 'పూత', 'కాయలు']
      },
      visualSymptoms: ['ఆకులు దోనెలా మారడం', 'కొమ్మలు ఎండడం'],
      treatmentPlan: {
        immediateSteps: ['ఎండిన కొమ్మలను కత్తిరించి కాల్చివేయండి', 'ఫిప్రోనిల్ మరియు అజాక్సిస్ట్రోబిన్ పిచికారీ చేయండి'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ఫిప్రోనిల్ 5% SC + అజాక్సిస్ట్రోబిన్ 23% SC',
            commercialNames: 'రీజెంట్ + ఎమిస్టార్',
            dosagePerLiter: 'లీటరు నీటికి 2 మి.లీ ఫిప్రోనిల్ + 1 మి.లీ అజాక్సిస్ట్రోబిన్',
            recommendedDilution: 'ఎకరానికి 400 మి.లీ + 200 మి.లీ 200 లీటర్ల నీటిలో',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['నీలి రంగు జిగురు అట్టలు పెట్టండి'],
        sprayingGuidelines: { bestTiming: 'ఉదయం వేళ కొట్టాలి', weatherPrecautions: 'మొక్క పూర్తిగా తడిసేలా పిచికారీ చేయండి', ppeRequired: ['మాస్క్'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'పురుగు మరియు తెగులు నివారణ', actionRequired: 'పిచికారీ చేయండి' }]
    },
    kn: {
      cropName: 'ಮೆಣಸಿನಕಾಯಿ',
      scientificName: 'Capsicum annuum',
      diagnosisName: 'ಕೊಂಬೆ ಒಣಗುವ ರೋಗ & ಎಲೆ ಮುಟುರು',
      scientificPathogen: 'ಶಿಲೀಂಧ್ರ ಮತ್ತು ಥ್ರಿಪ್ಸ್',
      issueType: 'ಕೀಟ ಮತ್ತು ಶಿಲೀಂಧ್ರ',
      severityLevel: 'ತೀವ್ರ',
      healthScore: 38,
      affectedAreaPercentage: 44,
      confidenceScore: 95,
      summary: 'ದೋಣಿಯಾಕಾರದ ಎಲೆ ಮುದುರುವಿಕೆ ಮತ್ತು ಕೊಂಬೆಗಳು ಮೇಲಿಂದ ಒಣಗುವುದು.',
      farmerVernacularSummary: 'ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಥ್ರಿಪ್ಸ್ ಮತ್ತು ಕೊಂಬೆ ಒಣಗುವ ರೋಗ ಬಂದಿದೆ. ಫಿಪ್ರೋನಿಲ್ ಮತ್ತು ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ ಸಿಂಪಡಿಸಿ.',
      damageAnalysis: {
        leafDamageDescription: 'ಎಲೆಗಳು ಮುದುಡಿ ಹೂವು ಉದುರುತ್ತವೆ.',
        spreadRate: 'ಮಧ್ಯಮ',
        potentialYieldLossPercent: 50,
        vulnerableParts: ['ಕೊಂಬೆ', 'ಕಾಯಿ']
      },
      visualSymptoms: ['ಎಲೆ ಮುದುರುವಿಕೆ'],
      treatmentPlan: {
        immediateSteps: ['ಒಣಗಿದ ಕೊಂಬೆ ಕತ್ತರಿಸಿ', 'ಔಷಧ ಸಿಂಪಡಿಸಿ'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ಫಿಪ್ರೋನಿಲ್ + ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್',
            commercialNames: 'ರೀಜೆಂಟ್',
            dosagePerLiter: '2 ಮಿಲಿ + 1 ಮಿಲಿ/ಲೀಟರ್',
            recommendedDilution: '400 ಮಿಲಿ + 200 ಮಿಲಿ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['ನೀಲಿ ಬಲೆಗಳನ್ನು ಬಳಸಿ'],
        sprayingGuidelines: { bestTiming: 'ಬೆಳಗ್ಗೆ', weatherPrecautions: 'ಸಂಪೂರ್ಣ ಸಿಂಪಡಿಸಿ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ರೋಗ ನಿಯಂತ್ರಣ', actionRequired: 'ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'மிளகாய்',
      scientificName: 'Capsicum annuum',
      diagnosisName: 'நுனி கருகல் & இலை சுருட்டு நோய்',
      scientificPathogen: 'இலைப்பேன் மற்றும் பூஞ்சை',
      issueType: 'பூச்சி & பூஞ்சை',
      severityLevel: 'தீவிரம்',
      healthScore: 38,
      affectedAreaPercentage: 44,
      confidenceScore: 95,
      summary: 'இலைகள் படகு வடிவில் சுருங்குதல் மற்றும் நுனிகள் காய்ந்து போகுதல்.',
      farmerVernacularSummary: 'மிளகாயில் இலைப்பேன் மற்றும் நுனி கருகல் நோய் தாக்கியுள்ளது. பிப்ரோனில் மற்றும் அசோக்ஸிஸ்ட்ரோபின் தெளிக்கவும்.',
      damageAnalysis: {
        leafDamageDescription: 'இலைகள் சுருங்கி கிளைகள் காய்ந்துவிடும்.',
        spreadRate: 'மிதமானது',
        potentialYieldLossPercent: 50,
        vulnerableParts: ['நுனி கிளைகள்', 'பூக்கள்']
      },
      visualSymptoms: ['படகு வடிவ இலைகள்'],
      treatmentPlan: {
        immediateSteps: ['காய்ந்த கிளைகளை வெட்டவும்', 'மருந்து தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'பிப்ரோனில் + அசோக்ஸிஸ்ட்ரோபின்',
            commercialNames: 'ரீஜென்ட்',
            dosagePerLiter: '2 மி.லி + 1 மி.லி/லிட்டர்',
            recommendedDilution: '400 மி.லி + 200 மி.லி ஏக்கருக்கு',
            safetyWaitingPeriodDays: 14
          }
        ],
        preventativeMeasures: ['நீல பொறிகள் வைக்கவும்'],
        sprayingGuidelines: { bestTiming: 'காலை வேளையில்', weatherPrecautions: 'முழுமையாக தெளிக்கவும்', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'நோய் கட்டுப்பாடு', actionRequired: 'தெளிக்க வேண்டும்' }]
    }
  },
  'sample-potato-early-blight': {
    en: {
      cropName: 'Potato',
      scientificName: 'Solanum tuberosum',
      diagnosisName: 'Early Blight',
      scientificPathogen: 'Alternaria solani',
      issueType: 'Fungal Disease',
      severityLevel: 'Moderate',
      healthScore: 61,
      affectedAreaPercentage: 22,
      confidenceScore: 95,
      summary: 'Concentric target-board rings and dry brown angular spots on lower older foliage with yellow halos.',
      farmerVernacularSummary: 'Your potato crop has Early Blight. The circular target spots will cause premature defoliation. Spray Mancozeb or Chlorothalonil to protect tubers.',
      damageAnalysis: {
        leafDamageDescription: 'Target-like concentric brown spots slowly expand, turning lower leaves yellow and dry.',
        spreadRate: 'Moderate',
        potentialYieldLossPercent: 30,
        vulnerableParts: ['Lower canopy leaves', 'Tuber size filling']
      },
      visualSymptoms: [
        'Dark brown circular spots with concentric target rings',
        'Yellow chlorotic halos surrounding leaf lesions'
      ],
      treatmentPlan: {
        immediateSteps: [
          'Apply contact protective fungicide across lower canopy',
          'Avoid plant stress by maintaining regular soil moisture'
        ],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'Mancozeb 75% WP',
            commercialNames: 'Dithane M-45, Indofil M-45',
            dosagePerLiter: '2.5 g / liter of water (40g per 16L tank)',
            recommendedDilution: '500g in 200 liters water per acre',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['Practice 2-year crop rotation', 'Ensure balanced potassium nutrition'],
        sprayingGuidelines: {
          bestTiming: 'Morning before heat builds up',
          weatherPrecautions: 'Spray bottom leaves thoroughly',
          ppeRequired: ['Mask', 'Gloves']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Spore Germination Inhibition', actionRequired: 'Spray protective Mancozeb' }
      ]
    },
    hi: {
      cropName: 'आलू',
      scientificName: 'Solanum tuberosum',
      diagnosisName: 'अगेती झुलसा रोग',
      scientificPathogen: 'अल्टरनेरिया सोलानी',
      issueType: 'फफूंद जनित रोग',
      severityLevel: 'मध्यम',
      healthScore: 61,
      affectedAreaPercentage: 22,
      confidenceScore: 95,
      summary: 'निचली पत्तियों पर गोल छल्लेदार गहरे भूरे धब्बे और पीलापन।',
      farmerVernacularSummary: 'आलू में अगेती झुलसा रोग लगा है। कंदों के अच्छे विकास के लिए तुरंत मैंकोजेब का छिड़काव करें।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियां पीली पड़कर सूखने लगती हैं जिससे आलू का आकार छोटा रह जाता है।',
        spreadRate: 'मध्यम',
        potentialYieldLossPercent: 30,
        vulnerableParts: ['निचली पत्तियां', 'आलू का कंद']
      },
      visualSymptoms: ['गोल छल्लेदार धब्बे'],
      treatmentPlan: {
        immediateSteps: ['मैंकोजेब का छिड़काव करें'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'मैंकोजेब 75% WP',
            commercialNames: 'डाइथेन एम-45',
            dosagePerLiter: '2.5 ग्राम प्रति लीटर पानी',
            recommendedDilution: '500 ग्राम प्रति एकड़',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['फसल चक्र अपनाएं'],
        sprayingGuidelines: { bestTiming: 'सुबह के समय', weatherPrecautions: 'निचली पत्तियों पर अच्छी तरह छिड़कें', ppeRequired: ['मास्क'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'रोग रोकथाम', actionRequired: 'मैंकोजेब का छिड़काव करें' }]
    },
    te: {
      cropName: 'బంగాళాదుంప',
      scientificName: 'Solanum tuberosum',
      diagnosisName: 'ఎర్లీ బ్లైట్ (మచ్చల తెగులు)',
      scientificPathogen: 'ఆల్టర్నేరియా సొలాని',
      issueType: 'శిలీంధ్ర తెగులు',
      severityLevel: 'మధ్యస్థం',
      healthScore: 61,
      affectedAreaPercentage: 22,
      confidenceScore: 95,
      summary: 'ఆకులపై వలయాకారపు చక్రాల వంటి గోధుమ రంగు మచ్చలు, పసుపు రంగు వలయాలు.',
      farmerVernacularSummary: 'మీ బంగాళాదుంప పంటకు ఎర్లీ బ్లైట్ తెగులు సోకింది. దుంపలు బాగా ఊరడానికి మాంకోజెబ్ మందు పిచికారీ చేయండి.',
      damageAnalysis: {
        leafDamageDescription: 'కింది ఆకులు పసుపు రంగులోకి మారి ఎండిపోతాయి, దుంపల ఎదుగుదల తగ్గుతుంది.',
        spreadRate: 'మధ్యస్థం',
        potentialYieldLossPercent: 30,
        vulnerableParts: ['కింది ఆకులు', 'దుంపల పరిమాణం']
      },
      visualSymptoms: ['వలయాకారపు చక్రాల మచ్చలు'],
      treatmentPlan: {
        immediateSteps: ['మాంకోజెబ్ పిచికారీ చేయండి'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'మాంకోజెబ్ 75% WP',
            commercialNames: 'డైథేన్ ఎమ్-45, ఇండోఫిల్',
            dosagePerLiter: 'లీటరు నీటికి 2.5 గ్రాములు',
            recommendedDilution: 'ఎకరానికి 500 గ్రాములు',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['పంట మార్పిడి చేయండి'],
        sprayingGuidelines: { bestTiming: 'ఉదయం పూట', weatherPrecautions: 'కింది ఆకులు తడిసేలా కొట్టండి', ppeRequired: ['మాస్క్'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'తెగులు నివారణ', actionRequired: 'మాంకోజెబ్ పిచికారీ చేయండి' }]
    },
    kn: {
      cropName: 'ಆಲೂಗಡ್ಡೆ',
      scientificName: 'Solanum tuberosum',
      diagnosisName: 'ಆರಂಭಿಕ ಅಂಗಮಾರಿ ರೋಗ',
      scientificPathogen: 'ಆಲ್ಟರ್ನೇರಿಯಾ',
      issueType: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severityLevel: 'ಮಧ್ಯಮ',
      healthScore: 61,
      affectedAreaPercentage: 22,
      confidenceScore: 95,
      summary: 'ಎಲೆಗಳ ಮೇಲೆ ಗುರಿಯ ಫಲಕದಂತಹ ಉಂಗುರಾಕಾರದ ಕಂದು ಮಚ್ಚೆಗಳು.',
      farmerVernacularSummary: 'ಆಲೂಗಡ್ಡೆಯಲ್ಲಿ ಆರಂಭಿಕ ಅಂಗಮಾರಿ ರೋಗ ಬಂದಿದೆ. ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ.',
      damageAnalysis: {
        leafDamageDescription: 'ಎಲೆಗಳು ಒಣಗಿ ಗಡ್ಡೆಯ ಗಾತ್ರ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
        spreadRate: 'ಮಧ್ಯಮ',
        potentialYieldLossPercent: 30,
        vulnerableParts: ['ಕೆಳಗಿನ ಎಲೆ', 'ಗಡ್ಡೆ']
      },
      visualSymptoms: ['ಉಂಗುರಾಕಾರದ ಮಚ್ಚೆಗಳು'],
      treatmentPlan: {
        immediateSteps: ['ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP',
            commercialNames: 'ಡೈಥೇನ್',
            dosagePerLiter: '2.5 ಗ್ರಾಂ/ಲೀಟರ್',
            recommendedDilution: '500 ಗ್ರಾಂ ಎಕರೆಗೆ',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ'],
        sprayingGuidelines: { bestTiming: 'ಬೆಳಗ್ಗೆ', weatherPrecautions: 'ಕೆಳಗಿನ ಎಲೆಗಳಿಗೆ ಸಿಂಪಡಿಸಿ', ppeRequired: ['ಮಾಸ್ಕ್'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ', actionRequired: 'ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ' }]
    },
    ta: {
      cropName: 'உருளைக்கிழங்கு',
      scientificName: 'Solanum tuberosum',
      diagnosisName: 'ஆரம்பகால இலைக்கருகல்',
      scientificPathogen: 'ஆல்டர்னேரியா',
      issueType: 'பூஞ்சை நோய்',
      severityLevel: 'மிதமானது',
      healthScore: 61,
      affectedAreaPercentage: 22,
      confidenceScore: 95,
      summary: 'கீழ் இலைகளில் வளைய வடிவிலான கரும் பழுப்பு புள்ளிகள்.',
      farmerVernacularSummary: 'உருளைக்கிழங்கில் ஆரம்பகால இலைக்கருகல் நோய் வந்துள்ளது. மான்கோசெப் தெளிக்கவும்.',
      damageAnalysis: {
        leafDamageDescription: 'இலைகள் காய்ந்து கிழங்கு எடை குறையும்.',
        spreadRate: 'மிதமானது',
        potentialYieldLossPercent: 30,
        vulnerableParts: ['கீழ் இலைகள்', 'கிழங்கு']
      },
      visualSymptoms: ['வட்ட வளைய புள்ளிகள்'],
      treatmentPlan: {
        immediateSteps: ['மான்கோசெப் தெளிக்கவும்'],
        organicSolutions: [],
        chemicalSolutions: [
          {
            activeIngredient: 'மான்கோசெப் 75% WP',
            commercialNames: 'டைத்தேன் எம்-45',
            dosagePerLiter: '2.5 கிராம்/லிட்டர்',
            recommendedDilution: '500 கிராம் ஏக்கருக்கு',
            safetyWaitingPeriodDays: 7
          }
        ],
        preventativeMeasures: ['பயிர் சுழற்சி செய்யவும்'],
        sprayingGuidelines: { bestTiming: 'காலை வேளையில்', weatherPrecautions: 'அடி இலைகளில் படுமாறு தெளிக்கவும்', ppeRequired: ['முகக்கவசம்'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'நோய் தடுப்பு', actionRequired: 'மான்கோசெப் தெளிக்கவும்' }]
    }
  },
  'sample-wheat-healthy': {
    en: {
      cropName: 'Wheat',
      scientificName: 'Triticum aestivum',
      diagnosisName: 'Healthy Crop (No Disease Detected)',
      scientificPathogen: 'None (Specimen is healthy)',
      issueType: 'Healthy Crop',
      severityLevel: 'Low',
      healthScore: 94,
      affectedAreaPercentage: 2,
      confidenceScore: 99,
      summary: 'Vigorous deep green leaves with clean venation, active photosynthesis, and zero fungal lesions or insect pest marks.',
      farmerVernacularSummary: 'Congratulations! Your wheat crop is completely healthy with vigorous green canopy. Continue balanced irrigation and nutrition.',
      damageAnalysis: {
        leafDamageDescription: 'No tissue necrosis, leaf rust, powdery mildew, or insect feeding observed. Foliage chlorophyll is strong and intact.',
        spreadRate: 'Slow',
        potentialYieldLossPercent: 0,
        vulnerableParts: ['Maintain preventive vigilance']
      },
      visualSymptoms: [
        'Clean uniform emerald green pigmentation',
        'Intact leaf cuticles with zero rust pustules',
        'Erect leaf turgidity and healthy tillering'
      ],
      treatmentPlan: {
        immediateSteps: [
          'No chemical pesticide or fungicide needed at this stage',
          'Maintain scheduled light irrigation at crown root initiation and tillering',
          'Apply balanced top-dressing urea as per local agronomic schedule'
        ],
        organicSolutions: [
          {
            name: 'Bio-stimulant Seaweed Extract / Panchagavya',
            preparation: '3ml liquid extract in 1L clean water',
            applicationRate: 'Spray to promote tiller growth',
            frequency: 'Every 20 days'
          }
        ],
        chemicalSolutions: [],
        preventativeMeasures: [
          'Monitor weekly for yellow rust or brown rust after misty mornings',
          'Avoid water stagnation in heavy clay soils'
        ],
        sprayingGuidelines: {
          bestTiming: 'Normal field scouting hours',
          weatherPrecautions: 'No pesticide spray required',
          ppeRequired: ['None']
        }
      },
      recoveryTimeline: [
        { day: 1, expectedMilestone: 'Healthy Canopy Maintenance', actionRequired: 'Continue balanced farm irrigation' },
        { day: 14, expectedMilestone: 'Active Tillering & Heading', actionRequired: 'Monitor flag leaf health' }
      ]
    },
    hi: {
      cropName: 'गेहूं',
      scientificName: 'Triticum aestivum',
      diagnosisName: 'स्वस्थ फसल (रोगमुक्त)',
      scientificPathogen: 'कोई नहीं (फसल पूरी तरह स्वस्थ है)',
      issueType: 'स्वस्थ फसल',
      severityLevel: 'कम',
      healthScore: 94,
      affectedAreaPercentage: 2,
      confidenceScore: 99,
      summary: 'गहरी हरी स्वस्थ पत्तियां, कोई फफूंद या कीड़े का प्रकोप नहीं है।',
      farmerVernacularSummary: 'बधाई हो! आपकी गेहूं की फसल पूरी तरह स्वस्थ है। किसी भी कीटनाशक या फफूंदनाशक की आवश्यकता नहीं है।',
      damageAnalysis: {
        leafDamageDescription: 'पत्तियां पूर्णतः स्वस्थ और हरी हैं।',
        spreadRate: 'धीमा',
        potentialYieldLossPercent: 0,
        vulnerableParts: ['नियमित निगरानी रखें']
      },
      visualSymptoms: ['साफ हरी पत्तियां', 'मजबूत कल्ले'],
      treatmentPlan: {
        immediateSteps: ['किसी दवा की जरूरत नहीं है', 'उचित समय पर सिंचाई करें'],
        organicSolutions: [],
        chemicalSolutions: [],
        preventativeMeasures: ['गेरूई (रस्ट) रोग के लिए नियमित निगरानी रखें'],
        sprayingGuidelines: { bestTiming: 'सामान्य समय', weatherPrecautions: 'दवा की आवश्यकता नहीं', ppeRequired: ['कोई नहीं'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'स्वस्थ विकास', actionRequired: 'समय पर सिंचाई करें' }]
    },
    te: {
      cropName: 'గోధుమ',
      scientificName: 'Triticum aestivum',
      diagnosisName: 'ఆరోగ్యకరమైన పైరు (తెగుళ్లు లేవు)',
      scientificPathogen: 'ఏమీ లేదు (మొక్క ఆరోగ్యంగా ఉంది)',
      issueType: 'ఆరోగ్యకరమైన పంట',
      severityLevel: 'తక్కువ',
      healthScore: 94,
      affectedAreaPercentage: 2,
      confidenceScore: 99,
      summary: 'ఆరోగ్యకరమైన ముదురు ఆకుపచ్చని ఆకులు, మచ్చలు లేదా పురుగుల నష్టం ఏమీ లేదు.',
      farmerVernacularSummary: 'అభినందనలు! మీ గోధుమ పంట ఎంతో ఆరోగ్యంగా, పచ్చగా ఉంది. ప్రస్తుతం ఎలాంటి మందులు పిచికారీ చేయవలసిన అవసరం లేదు.',
      damageAnalysis: {
        leafDamageDescription: 'ఎలాంటి తెగుళ్ల లక్షణాలు లేదా పురుగుల నష్టం కనిపించలేదు.',
        spreadRate: 'నెమ్మది',
        potentialYieldLossPercent: 0,
        vulnerableParts: ['సాధారణ రక్షణ చాలు']
      },
      visualSymptoms: ['స్వచ్ఛమైన పచ్చటి ఆకులు', 'బలమైన పిలకలు'],
      treatmentPlan: {
        immediateSteps: ['ఎలాంటి మందులు అవసరం లేదు', 'సమయానికి నీరు పెట్టండి'],
        organicSolutions: [],
        chemicalSolutions: [],
        preventativeMeasures: ['పొలాన్ని పరిశీలిస్తూ ఉండండి'],
        sprayingGuidelines: { bestTiming: 'సాధారణ సమయం', weatherPrecautions: 'మందులు అవసరం లేదు', ppeRequired: ['ఏమీ లేదు'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ఆరోగ్యకరమైన ఎదుగుదల', actionRequired: 'నీటి యాజమాన్యం కొనసాగించండి' }]
    },
    kn: {
      cropName: 'ಗೋಧಿ',
      scientificName: 'Triticum aestivum',
      diagnosisName: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ (ರೋಗವಿಲ್ಲ)',
      scientificPathogen: 'ಯಾವುದೂ ಇಲ್ಲ',
      issueType: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ',
      severityLevel: 'ಕಡಿಮೆ',
      healthScore: 94,
      affectedAreaPercentage: 2,
      confidenceScore: 99,
      summary: 'ಸದೃಢವಾದ ಹಸಿರು ಎಲೆಗಳು, ಯಾವುದೇ ಶಿಲೀಂಧ್ರ ಅಥವಾ ಕೀಟದ ಹಾನಿ ಇಲ್ಲ.',
      farmerVernacularSummary: 'ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಗೋಧಿ ಬೆಳೆ ಸಂಪೂರ್ಣ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ಯಾವುದೇ ಔಷಧಿ ಸಿಂಪಡಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.',
      damageAnalysis: {
        leafDamageDescription: 'ಯಾವುದೇ ರೋಗ ಲಕ್ಷಣಗಳಿಲ್ಲ.',
        spreadRate: 'ನಿಧಾನ',
        potentialYieldLossPercent: 0,
        vulnerableParts: ['ಸಾಮಾನ್ಯ ನಿಗಾ ವಹಿಸಿ']
      },
      visualSymptoms: ['ಸ್ವಚ್ಛ ಹಸಿರು ಎಲೆಗಳು'],
      treatmentPlan: {
        immediateSteps: ['ಯಾವುದೇ ಔಷಧ ಬೇಡ', 'ಸಕಾಲಕ್ಕೆ ನೀರಾವರಿ ಮಾಡಿ'],
        organicSolutions: [],
        chemicalSolutions: [],
        preventativeMeasures: ['ಸಾಮಾನ್ಯ ನಿಗಾ ವಹಿಸಿ'],
        sprayingGuidelines: { bestTiming: 'ಸಾಮಾನ್ಯ', weatherPrecautions: 'ಔಷಧ ಬೇಡ', ppeRequired: ['ಯಾವುದೂ ಇಲ್ಲ'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'ಉತ್ತಮ ಬೆಳವಣಿಗೆ', actionRequired: 'ನೀರಾವರಿ ಮುಂದುವರಿಸಿ' }]
    },
    ta: {
      cropName: 'கோதுமை',
      scientificName: 'Triticum aestivum',
      diagnosisName: 'ஆரோக்கியமான பயிர் (நோயற்றது)',
      scientificPathogen: 'எதுவுமில்லை',
      issueType: 'ஆரோக்கியமான பயிர்',
      severityLevel: 'குறைவு',
      healthScore: 94,
      affectedAreaPercentage: 2,
      confidenceScore: 99,
      summary: 'அடர் பச்சை நிற ஆரோக்கியமான இலைகள், பூச்சி அல்லது பூஞ்சை பாதிப்புகள் இல்லை.',
      farmerVernacularSummary: 'வாழ்த்துகள்! உங்கள் கோதுமை பயிர் மிக ஆரோக்கியமாக உள்ளது. எந்த மருந்தும் தெளிக்க வேண்டியதில்லை.',
      damageAnalysis: {
        leafDamageDescription: 'எந்தவித நோய் பாதிப்பும் இல்லை.',
        spreadRate: 'மெதுவானது',
        potentialYieldLossPercent: 0,
        vulnerableParts: ['வழக்கமான பராமரிப்பு போதும்']
      },
      visualSymptoms: ['தூய்மையான பச்சை இலைகள்'],
      treatmentPlan: {
        immediateSteps: ['மருந்து எதுவும் தேவையில்லை', 'சரியான நேரத்தில் நீர்பாய்ச்சவும்'],
        organicSolutions: [],
        chemicalSolutions: [],
        preventativeMeasures: ['வழக்கமான கண்காணிப்பு போதும்'],
        sprayingGuidelines: { bestTiming: 'இயல்பு', weatherPrecautions: 'மருந்து தேவையில்லை', ppeRequired: ['எதுவுமில்லை'] }
      },
      recoveryTimeline: [{ day: 1, expectedMilestone: 'நல்ல வளர்ச்சி', actionRequired: 'நீர்பாசனத்தை தொடரவும்' }]
    }
  }
};

export function getCleanFallbackDiagnosis(sampleId: string = 'sample-tomato-late-blight', lang: string = 'en') {
  const dataset = LOCALIZED_DIAGNOSES[sampleId] || LOCALIZED_DIAGNOSES['sample-tomato-late-blight'];
  return dataset[lang] || dataset['en'];
}
