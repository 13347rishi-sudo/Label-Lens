export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    appTitle: 'LabelLens',
    appSubtitle: 'Food Packaging Scanner & Health Engine',
    exhibitionTag: 'Science Exhibition',
    disclaimer: 'LabelLens is an educational science fair project. Always check packaging directly.',
    trustStrip: 'Runs offline. Photos never leave this laptop.',
    offlineBadge: 'Offline',
    onlineBadge: 'Online Fallback',
    scanPacketBtn: 'Scan a Packet',
    scanOrTap: 'Hold any food packet or barcode up to the camera:',
    topWarningsTitle: 'Key Health Findings',
    healthIndex: 'Health Score',
    nutriScoreTitle: 'Nutri-Score',
    basedOnNutriScore: 'Based on the European Nutri-Score method',
    healthierSwapTitle: 'Healthier Alternatives',
    compareFoodsTab: 'Compare Foods',
    scanAnalysisTab: 'Scan & Analysis',
    exploreAdvanced: 'Show Recipe Sliders & Full Ingredients',
    hideAdvanced: 'Hide Advanced Tools',
    additivesToWatch: 'Additives to Watch',
    additivesDisclaimer: 'Approved additives flagged for sensitive people or children.',
    hiddenSugars: 'Hidden Sugar Aliases',
    palmOil: 'Palm Oil Status',
    allergens: 'Allergens Detected',
    idleNotice: 'Kiosk reset for the next visitor.',
    steps: {
      reading: 'Reading label...',
      ingredients: 'Finding ingredients...',
      additives: 'Checking additives...',
      scoring: 'Calculating score...'
    },
    errors: {
      blurry: 'Label is blurry — try again with more light.',
      notFound: 'Barcode not found. Try scanning the nutrition table.',
      cameraBlocked: 'Camera stream blocked. Try taking a photo or upload an image.',
      generic: 'Could not read label. Please hold steady and try again.'
    },
    grades: {
      A: 'Grade A · Best Choice',
      B: 'Grade B · Good Choice',
      C: 'Grade C · Moderate Choice',
      D: 'Grade D · Have Occasionally',
      E: 'Grade E · High Sugar, Fat or Salt'
    }
  },
  hi: {
    appTitle: 'लेबल-लेंस',
    appSubtitle: 'खाद्य पैकेजिंग स्कैनर एवं स्वास्थ्य विश्लेषक',
    exhibitionTag: 'विज्ञान प्रदर्शनी',
    disclaimer: 'लेबल-लेंस विज्ञान प्रदर्शनी हेतु एक शैक्षिक प्रोजेक्ट है। हमेशा पैकेज पर सीधे जांच करें।',
    trustStrip: 'यह ऑफलाइन चलता है। फोटो कभी इस लैपटॉप से बाहर नहीं जाता।',
    offlineBadge: 'ऑफलाइन',
    onlineBadge: 'ऑनलाइन खोज',
    scanPacketBtn: 'पैकेट स्कैन करें',
    scanOrTap: 'स्कैन करने के लिए पैकेट या बारकोड कैमरे के सामने रखें:',
    topWarningsTitle: 'मुख्य स्वास्थ्य निष्कर्ष',
    healthIndex: 'स्वास्थ्य स्कोर',
    nutriScoreTitle: 'न्यूट्री-स्कोर',
    basedOnNutriScore: 'यूरोपीय न्यूट्री-स्कोर पद्धति पर आधारित',
    healthierSwapTitle: 'स्वास्थ्यप्रद विकल्प',
    compareFoodsTab: 'खाद्य पदार्थों की तुलना',
    scanAnalysisTab: 'स्कैन एवं विश्लेषण',
    exploreAdvanced: 'रेसिपी स्लाइडर एवं पूरी सामग्री देखें',
    hideAdvanced: 'उन्नत विवरण छुपाएं',
    additivesToWatch: 'सावधानी योग्य योजक',
    additivesDisclaimer: 'संवेदनशील लोगों या बच्चों के लिए चिन्हित स्वीकृत योजक।',
    hiddenSugars: 'छिपी हुई चीनी',
    palmOil: 'पाम ऑयल की स्थिति',
    allergens: 'एलर्जी कारक तत्व',
    idleNotice: 'अगले आगंतुक के लिए कियोस्क रीसेट हो गया है।',
    steps: {
      reading: 'लेबल पढ़ रहे हैं...',
      ingredients: 'सामग्री खोज रहे हैं...',
      additives: 'योजकों की जांच कर रहे हैं...',
      scoring: 'स्कोर की गणना कर रहे हैं...'
    },
    errors: {
      blurry: 'लेबल धुंधला है — अच्छी रोशनी में दोबारा प्रयास करें।',
      notFound: 'बारकोड नहीं मिला। पोषण तालिका स्कैन करने का प्रयास करें।',
      cameraBlocked: 'कैमरा उपलब्ध नहीं है। फोटो खींचें या फाइल अपलोड करें।',
      generic: 'लेबल पढ़ने में असमर्थ। कृपया दोबारा प्रयास करें।'
    },
    grades: {
      A: 'ग्रेड A · सर्वोत्तम विकल्प',
      B: 'ग्रेड B · अच्छा विकल्प',
      C: 'ग्रेड C · सामान्य विकल्प',
      D: 'ग्रेड D · कभी-कभार खाएं',
      E: 'ग्रेड E · चीनी, वसा या नमक की अधिक मात्रा'
    }
  }
};
