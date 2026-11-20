export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    appTitle: 'LabelLens',
    appSubtitle: 'Food Packaging Scanner & Health Engine',
    exhibitionTag: 'Science Exhibition Kiosk',
    disclaimer: '⚠️ Informational tool for science exhibition — not medical advice. Always verify allergens & nutrition directly on the packaging.',
    trustStrip: '🔒 Runs 100% offline. Packaging photos and video feeds never leave this laptop.',
    offlineBadge: 'Offline Mode: 115+ Foods Ready',
    onlineBadge: 'Online Fallback Active (Wi-Fi)',
    scanPacketBtn: 'Scan a Food Packet',
    scanOrTap: 'Scan with camera, or tap a sample food below:',
    topWarningsTitle: 'Top 3 Health Findings',
    healthIndex: 'Health Score',
    nutriScoreTitle: 'Nutri-Score Rating',
    basedOnNutriScore: 'Based on European Nutri-Score method (2023 revision)',
    healthierSwapTitle: 'Healthier Alternative & Natural Swap',
    compareFoodsTab: 'Compare Foods',
    scanAnalysisTab: 'Scan & Analysis',
    exploreAdvanced: 'Show Advanced Science & Reformulation Sliders',
    hideAdvanced: 'Hide Advanced Tools',
    additivesToWatch: 'Additives to Watch',
    additivesDisclaimer: 'Approved additives flagged for sensitive individuals or children.',
    hiddenSugars: 'Hidden Sugar Aliases',
    palmOil: 'Palm Oil Status',
    allergens: 'Allergens Detected',
    idleNotice: 'Kiosk reset for the next visitor.',
    steps: {
      reading: 'Step 1: Reading packaging & barcode...',
      ingredients: 'Step 2: Finding ingredients & nutrition...',
      additives: 'Step 3: Checking sugar aliases & additives to watch...',
      scoring: 'Step 4: Computing Nutri-Score points...'
    },
    errors: {
      blurry: 'Label is blurry — please hold it steady with more light.',
      notFound: 'Product not in offline catalog. Pick from sample foods or try another packet.',
      cameraBlocked: 'Camera stream blocked. Try "Snap Photo" or pick from sample foods.',
      generic: 'Could not read label. Please hold steady and try again.'
    },
    grades: {
      A: 'Grade A · Optimal Choice',
      B: 'Grade B · Good Choice',
      C: 'Grade C · Moderate Choice',
      D: 'Grade D · Have Occasionally',
      E: 'Grade E · High in Sugar, Fat or Salt'
    }
  },
  hi: {
    appTitle: 'लेबल-लेंस',
    appSubtitle: 'खाद्य पैकेजिंग स्कैनर एवं स्वास्थ्य विश्लेषक',
    exhibitionTag: 'विज्ञान प्रदर्शनी कियोस्क',
    disclaimer: '⚠️ प्रदर्शनी प्रदर्शन हेतु सूचनात्मक उपकरण — चिकित्सीय सलाह नहीं। पैकेज पर दी गई सामग्री की स्वयं जांच करें।',
    trustStrip: '🔒 यह पूर्णतः ऑफलाइन चलता है। फोटो एवं कैमरा वीडियो कभी इस लैपटॉप से बाहर नहीं जाता।',
    offlineBadge: 'ऑफलाइन मोड: 115+ खाद्य उत्पाद तैयार',
    onlineBadge: 'ऑनलाइन खोज सक्रिय (वाई-फाई)',
    scanPacketBtn: 'खाद्य पैकेट स्कैन करें',
    scanOrTap: 'कैमरे से स्कैन करें, या नीचे से कोई खाद्य पदार्थ चुनें:',
    topWarningsTitle: 'मुख्य 3 स्वास्थ्य निष्कर्ष',
    healthIndex: 'स्वास्थ्य स्कोर',
    nutriScoreTitle: 'न्यूट्री-स्कोर रेटिंग',
    basedOnNutriScore: 'यूरोपीय न्यूट्री-स्कोर पद्धति (2023 संशोधन) पर आधारित',
    healthierSwapTitle: 'स्वास्थ्यप्रद प्राकृतिक विकल्प',
    compareFoodsTab: 'खाद्य पदार्थों की तुलना',
    scanAnalysisTab: 'स्कैन एवं स्वास्थ्य विश्लेषण',
    exploreAdvanced: 'वैज्ञानिक विवरण एवं चीनी/नमक बदलने के स्लाइडर देखें',
    hideAdvanced: 'उन्नत विवरण छुपाएं',
    additivesToWatch: 'सावधानी योग्य योजक (Additives)',
    additivesDisclaimer: 'संवेदनशील व्यक्तियों या बच्चों के लिए चिन्हित स्वीकृत योजक।',
    hiddenSugars: 'छिपी हुई चीनी के नाम',
    palmOil: 'पाम ऑयल की स्थिति',
    allergens: 'एलर्जी कारक तत्व',
    idleNotice: 'अगले आगंतुक के लिए कियोस्क रीसेट हो गया है।',
    steps: {
      reading: 'चरण 1: पैकेट और बारकोड पढ़ रहे हैं...',
      ingredients: 'चरण 2: सामग्री और पोषण तालिका खोज रहे हैं...',
      additives: 'चरण 3: छिपी चीनी और योजकों की जांच कर रहे हैं...',
      scoring: 'चरण 4: न्यूट्री-स्कोर की गणना कर रहे हैं...'
    },
    errors: {
      blurry: 'लेबल धुंधला है — कृपया अच्छी रोशनी में स्थिर रखें।',
      notFound: 'डेटाबेस में नहीं मिला। नमूना खाद्य पदार्थों में से चुनें या दूसरा पैकेट आज़माएं।',
      cameraBlocked: 'कैमरा उपलब्ध नहीं है। फोटो खींचें या नमूना खाद्य पदार्थों में से चुनें।',
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
