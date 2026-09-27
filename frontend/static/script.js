/**
 * MedHub Clinical Intelligence System
 * Split-Pane Clinical Cockpit (Option 1) & 6 Core Features
 * Fully polished: Robust Sign In/Up, Generation Stop, Audio Stop, and DDI/Triage Cockpit.
 */

// DOM Elements
const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const stopGenBtn = document.getElementById("stopGenBtn");
const chatArea = document.getElementById("chatArea");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const newChatBtn = document.getElementById("newChatBtn");
const toggleCockpitBtn = document.getElementById("toggleCockpitBtn");
const cockpitContainer = document.getElementById("cockpitContainer");
const dashboardPane = document.getElementById("dashboardPane");

// Feature 6: Privacy Vault Modal
const privacyVaultPill = document.getElementById("privacyVaultPill");
const vaultModal = document.getElementById("vaultModal");
const closeVaultModalBtn = document.getElementById("closeVaultModalBtn");

// Feature 1: DDI Radar Elements
const ddiBadge = document.getElementById("ddiBadge");
const activeDrugsList = document.getElementById("activeDrugsList");
const ddiConflictBox = document.getElementById("ddiConflictBox");
const ddiStatusIcon = document.getElementById("ddiStatusIcon");
const ddiConflictTitle = document.getElementById("ddiConflictTitle");
const ddiConflictDesc = document.getElementById("ddiConflictDesc");
const ddiActionBox = document.getElementById("ddiActionBox");

// Feature 2: Triage Meter Elements
const triageBadge = document.getElementById("triageBadge");
const triageMeterMarker = document.getElementById("triageMeterMarker");
const triageHeadline = document.getElementById("triageHeadline");
const triageRec = document.getElementById("triageRec");
const triageTriggers = document.getElementById("triageTriggers");

// Feature 3: SOAP Note Elements
const downloadSoapBtn = document.getElementById("downloadSoapBtn");
const downloadSoapBtnText = document.getElementById("downloadSoapBtnText");
const soapLangSelect = document.getElementById("soapLangSelect");
const soapSubjectivePreview = document.getElementById("soapSubjectivePreview");
const soapObjectivePreview = document.getElementById("soapObjectivePreview");
const soapAssessmentPreview = document.getElementById("soapAssessmentPreview");
const soapPlanPreview = document.getElementById("soapPlanPreview");

// Feature 4: Audio Prescription Elements
const cockpitAudioPlayBtn = document.getElementById("cockpitAudioPlayBtn");
const cockpitAudioStopBtn = document.getElementById("cockpitAudioStopBtn");
const soundwaveDisplay = document.getElementById("soundwaveDisplay");
const audioStateBadge = document.getElementById("audioStateBadge");
const speedChips = document.querySelectorAll(".speed-chip");

// Feature 5: OpenFDA Citation Drawer Elements
const fdaHeaderToggle = document.getElementById("fdaHeaderToggle");
const fdaChevron = document.getElementById("fdaChevron");
const fdaDrawerContent = document.getElementById("fdaDrawerContent");
const fdaDrugTitle = document.getElementById("fdaDrugTitle");
const fdaDosageSnippet = document.getElementById("fdaDosageSnippet");
const fdaWarningsSnippet = document.getElementById("fdaWarningsSnippet");

// Auth State & Elements
let currentUser = localStorage.getItem("medhub_user") || "guest";
let authMode = "signin";

const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const guestLoginBtn = document.getElementById("guestLoginBtn");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const tabSignIn = document.getElementById("tabSignIn");
const tabSignUp = document.getElementById("tabSignUp");
const authForm = document.getElementById("authForm");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authAlert = document.getElementById("authAlert");
const authSwitchText = document.getElementById("authSwitchText");
const authSwitchBtn = document.getElementById("authSwitchBtn");

const authLangSelect = document.getElementById("authLangSelect");
const authLangLabelText = document.getElementById("authLangLabelText");
const authUsernameLabel = document.getElementById("authUsernameLabel");
const authPasswordLabel = document.getElementById("authPasswordLabel");
const guestDividerText = document.getElementById("guestDividerText");
const guestLoginBtnText = document.getElementById("guestLoginBtnText");

const userProfile = document.getElementById("userProfile");
const userNameDisplay = document.getElementById("userNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const authButtonsGroup = document.getElementById("authButtonsGroup");
const loginPromptBtn = document.getElementById("loginPromptBtn");
const signupPromptBtn = document.getElementById("signupPromptBtn");

// Page-wide Multilingual DOM Elements
const logoBadgeText = document.getElementById("logoBadgeText");
const newChatBtnText = document.getElementById("newChatBtnText");
const toggleCockpitBtnText = document.getElementById("toggleCockpitBtnText");
const logoutBtnText = document.getElementById("logoutBtnText");
const guestIndicatorText = document.getElementById("guestIndicatorText");
const loginPromptBtnText = document.getElementById("loginPromptBtnText");
const signupPromptBtnText = document.getElementById("signupPromptBtnText");
const heroTitleText = document.getElementById("heroTitleText");
const stopGenBtnText = document.getElementById("stopGenBtnText");
const disclaimerNoticeText = document.getElementById("disclaimerNoticeText");

// Dashboard headers & cards
const dashboardTitleText = document.getElementById("dashboardTitleText");
const dashboardSubText = document.getElementById("dashboardSubText");
const triageCardTitle = document.getElementById("triageCardTitle");
const meterLabelRoutine = document.getElementById("meterLabelRoutine");
const meterLabelUrgent = document.getElementById("meterLabelUrgent");
const meterLabelER = document.getElementById("meterLabelER");
const ddiCardTitle = document.getElementById("ddiCardTitle");
const activeDrugsLabel = document.getElementById("activeDrugsLabel");
const emptyTrayPill = document.getElementById("emptyTrayPill");
const actionCardTitle = document.getElementById("actionCardTitle");
const auditReadyBadge = document.getElementById("auditReadyBadge");
const soapLangLabelText = document.getElementById("soapLangLabelText");
const playAdviceBtnText = document.getElementById("playAdviceBtnText");
const stopAdviceBtnText = document.getElementById("stopAdviceBtnText");

// Session Clinical State
let pendingFile = null;
let isFirstMessageInSession = true;
let latestUserQuery = "";
let latestBotAdvice = "";
let latestSoapData = null;
let currentSpeechSpeed = 1.0;
let currentAbortController = null;
let activeSpeakingBtn = null;
let isVoicePlaying = false;

// ---------------------------------------------------------------------------
// 1. AI MODE TOGGLE (Triple-click on MedHub logo at top-left)
// - Normal Mode: All 4 main SVG icons are Blue (#cddff0, #62b4e7, #357dc5)
// - AI Mode: All 4 main SVG icons are Green (#ffffff, #bdf942, #22c55e)
// - MedHub text: CONSTANT white, never changes color in either mode!
// ---------------------------------------------------------------------------
const logoEl = document.querySelector(".logo");
let isAiMode = localStorage.getItem("medhub_ai_mode") === "true";
let isEnhancedMode = isAiMode;

function updateAiMode() {
  document.body.classList.toggle("ai-mode", isAiMode);
  isEnhancedMode = isAiMode;
  if (fileInput) {
    fileInput.setAttribute("accept", isAiMode ? "*/*" : "image/*,.pdf");
  }
}
updateAiMode();

if (logoEl) {
  let clickCount = 0;
  let clickTimer = null;
  logoEl.addEventListener("click", () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    if (clickCount >= 3) {
      isAiMode = !isAiMode;
      localStorage.setItem("medhub_ai_mode", isAiMode ? "true" : "false");
      updateAiMode();
      clickCount = 0;
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
    }
  });
}

// ---------------------------------------------------------------------------
// 1.1 APP-WIDE MULTILINGUAL LOCALIZATION (6 LANGUAGES)
// English (en), Tamil (ta), Malayalam (ml), Telugu (te), Kannada (kn), Hindi (hi)
// ---------------------------------------------------------------------------
const APP_I18N = {
  en: {
    logoBadge: "CLINICAL COCKPIT",
    newChat: "New Session",
    cockpitToggle: "Cockpit",
    cockpitShow: "Show Cockpit",
    logout: "Logout",
    guestBadge: "Guest Clinician",
    signInBtn: "Sign In",
    signUpBtn: "Sign Up",
    heroTitle: "MedHub Clinical AI",
    inputPlaceholder: "Describe symptoms, enter medications for DDI screening, or ask medical questions...",
    stopBtn: "Stop",
    disclaimer: "🛡️ MedHub Clinical AI provides algorithmic decision support. Clinical judgment and physician verification required.",
    dashTitle: "Clinical Telemetry & Safety",
    dashSub: "Real-Time Algorithmic Decision Support",
    triageTitle: "Emergency Triage (ESI)",
    triageRoutineBadge: "ROUTINE CARE",
    triageUrgentBadge: "URGENT CARE",
    triageEmergencyBadge: "EMERGENCY ER",
    meterRoutine: "Routine",
    meterUrgent: "Urgent (24-48h)",
    meterER: "Emergency ER",
    triageDefaultHeadline: "Standard Supportive Home Care & Monitoring",
    triageDefaultRec: "Maintain adequate rest, hydration, and monitor symptoms. Consult primary doctor if symptoms persist beyond 5-7 days.",
    ddiTitle: "DDI Safety Radar",
    ddiSafeBadge: "RADAR CLEAR",
    ddiWarningBadge: "WARNING",
    ddiDangerBadge: "CRITICAL CONFLICT",
    activeDrugsLabel: "Active Pharmacotherapy Identified:",
    emptyTray: "No active medications detected",
    ddiSafeTitle: "No Critical Contraindications Detected",
    ddiSafeDesc: "Active medications evaluated against the hospital interaction knowledge base with no high-risk pharmaceutical conflicts.",
    actionTitle: "Clinical Actions & Export",
    auditBadge: "AUDIT READY",
    soapLangLabel: "Report Language",
    downloadSoapBtn: "Download S.O.A.P. Summary (PDF)",
    downloadSoapLoading: "Synthesizing Audit PDF...",
    downloadSoapSuccess: "Downloaded SOAP Note!",
    soapS: "Subjective",
    soapO: "Objective",
    soapA: "Assessment",
    soapP: "Plan",
    soapDefaultS: "Awaiting patient complaint...",
    soapDefaultO: "Triage classification & drug screening",
    soapDefaultA: "Clinical impression & interaction risk",
    soapDefaultP: "Action protocol & physician follow-up",
    playAdvice: "Play Advice",
    stopAdvice: "Stop",
    audioReadyBadge: "READY",
    audioPlayingBadge: "PLAYING",
    fdaHeader: "OpenFDA Regulatory Grounding",
    fdaDrugTitle: "Clinical Matrix Grounding",
    fdaPrescribingTitle: "FDA Prescribing & Administration:",
    fdaDosageSnippet: "Verified against local clinical pharmacological database and openFDA regulatory label guidelines.",
    fdaWarningsTitle: "Safety Warnings & Precautions:",
    fdaWarningsSnippet: "Standard clinical precautions apply. Monitor patient tolerance and renal clearance parameters.",
    authLangLabel: "Preferred Language / மொழி / भाषा",
    authUsernameLabel: "Clinician / Patient ID",
    authUsernamePlaceholder: "e.g. siva",
    authPasswordLabel: "Vault Password",
    authPasswordPlaceholder: "Enter password",
    authSignInTitle: "Clinical Sign In",
    authSignInSub: "Enter your credentials to access your private consultation vault",
    authSignInBtn: "Sign In to Cockpit",
    authSignUpTitle: "Create Medical Vault",
    authSignUpSub: "Register a secure username and password to store consultation records",
    authSignUpBtn: "Create Account & Sign In",
    authTabSignIn: "Sign In",
    authTabSignUp: "Sign Up",
    authNoAccount: "Don't have an account?",
    authHasAccount: "Already have an account?",
    authSigningIn: "Signing in...",
    authCreatingVault: "Creating vault...",
    guestDivider: "OR",
    guestLoginBtn: "Continue as Guest Clinician"
  },
  ta: {
    logoBadge: "மருத்துவ கட்டுப்பாட்டகம்",
    newChat: "புதிய அமர்வு",
    cockpitToggle: "கட்டுப்பாட்டகம்",
    cockpitShow: "கட்டுப்பாட்டகத்தைக் காட்டு",
    logout: "வெளியேறு",
    guestBadge: "விருந்தினர் மருத்துவர்",
    signInBtn: "உள்நுழைக",
    signUpBtn: "பதிவு செய்க",
    heroTitle: "MedHub மருத்துவ AI",
    inputPlaceholder: "அறிகுறிகளை விவரிக்கவும், மருந்து இடைவினையைச் சரிபார்க்கவும் அல்லது மருத்துவக் கேள்விகளைக் கேட்கவும்...",
    stopBtn: "நிறுத்து",
    disclaimer: "🛡️ MedHub மருத்துவ AI முடிவெடுக்கும் ஆதரவை வழங்குகிறது. மருத்துவரின் சரிபார்ப்பு கட்டாயமாகும்.",
    dashTitle: "மருத்துவ தொலைநிலைக் கண்காணிப்பு & பாதுகாப்பு",
    dashSub: "நிகழ்நேர நெறிமுறை முடிவெடுக்கும் ஆதரவு",
    triageTitle: "அவசர சிகிச்சை முன்னுரிமை (ESI)",
    triageRoutineBadge: "வழக்கமான பராமரிப்பு",
    triageUrgentBadge: "அவசரப் பராமரிப்பு",
    triageEmergencyBadge: "அவசர சிகிச்சை ER",
    meterRoutine: "வழக்கமான",
    meterUrgent: "அவசரம் (24-48 மணி)",
    meterER: "அவசரப் பிரிவு (ER)",
    triageDefaultHeadline: "நிலையான வீட்டு பராமரிப்பு & கண்காணிப்பு",
    triageDefaultRec: "போதுமான ஓய்வு, நீரேற்றம் எடுத்துக்கொள்ளுங்கள். 5-7 நாட்களுக்கு மேல் அறிகுறிகள் நீடித்தால் மருத்துவரை அணுகவும்.",
    ddiTitle: "மருந்து இடைவினை பாதுகாப்பு ரேடார்",
    ddiSafeBadge: "ரேடார் தெளிவு",
    ddiWarningBadge: "எச்சரிக்கை",
    ddiDangerBadge: "முரண்பாடு கண்டறியப்பட்டது",
    activeDrugsLabel: "கண்டறியப்பட்ட மருந்துகள்:",
    emptyTray: "மருந்துகள் எதுவும் கண்டறியப்படவில்லை",
    ddiSafeTitle: "முரண்பாடுகள் எதுவும் கண்டறியப்படவில்லை",
    ddiSafeDesc: "மருத்துவமனை தரவுத்தளத்தில் மருந்துகள் சரிபார்க்கப்பட்டு ஆபத்தான முரண்பாடுகள் இல்லை என உறுதிசெய்யப்பட்டது.",
    actionTitle: "மருத்துவ நடவடிக்கைகள் & ஏற்றுமதி",
    auditBadge: "ஆய்வுக்குத் தயார்",
    soapLangLabel: "அறிக்கை மொழி",
    downloadSoapBtn: "S.O.A.P. பதிவிறக்கு (தமிழ் PDF)",
    downloadSoapLoading: "தமிழ் அறிக்கை தயாராகிறது...",
    downloadSoapSuccess: "பதிவிறக்கம் முடிந்தது!",
    soapS: "அகநிலை",
    soapO: "புறநிலை",
    soapA: "மதிப்பீடு",
    soapP: "திட்டம்",
    soapDefaultS: "நோயாளி விவரம் காத்திருக்கிறது...",
    soapDefaultO: "முன்னுரிமை வகைப்பாடு மற்றும் மருந்து சோதனை",
    soapDefaultA: "மருத்துவ மதிப்பீடு & தொடர்பு ஆபத்து",
    soapDefaultP: "சிகிச்சை நெறிமுறை மற்றும் மருத்துவர் பின்தொடர்தல்",
    playAdvice: "ஆலோசனையைக் கேள்",
    stopAdvice: "நிறுத்து",
    audioReadyBadge: "தயார்",
    audioPlayingBadge: "ஒலிக்கிறது",
    fdaHeader: "OpenFDA ஒழுங்குமுறை ஆதாரம்",
    fdaDrugTitle: "மருத்துவ தரவுத்தள ஆதாரம்",
    fdaPrescribingTitle: "FDA மருந்து பரிந்துரை & பயன்பாடு:",
    fdaDosageSnippet: "உள்ளூர் மருத்துவ மருந்தியல் தரவுத்தளம் மற்றும் openFDA வழிகாட்டுதல்களின்படி சரிபார்க்கப்பட்டது.",
    fdaWarningsTitle: "பாதுகாப்பு எச்சரிக்கைகள் & முன்னெச்சரிக்கைகள்:",
    fdaWarningsSnippet: "நிலையான மருத்துவ முன்னெச்சரிக்கைகள் பொருந்தும். நோயாளியின் சகிப்புத்தன்மை மற்றும் சிறுநீரக செயல்பாட்டைக் கண்காணிக்கவும்.",
    authLangLabel: "விருப்ப மொழி / Preferred Language",
    authUsernameLabel: "மருத்துவர் / நோயாளி அடையாள எண்",
    authUsernamePlaceholder: "எ.கா. siva",
    authPasswordLabel: "கடவுச்சொல்",
    authPasswordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
    authSignInTitle: "மருத்துவ உள்நுழைவு",
    authSignInSub: "உங்கள் ஆலோசனைக் காப்பகத்தை அணுக உங்கள் விவரங்களை உள்ளிடவும்",
    authSignInBtn: "கட்டுப்பாட்டகத்தில் உள்நுழைக",
    authSignUpTitle: "மருத்துவக் காப்பகத்தை உருவாக்கவும்",
    authSignUpSub: "பதிவுகளைச் சேமிக்க பாதுகாப்பான பயனர் பெயர் மற்றும் கடவுச்சொல்லைப் பதிவு செய்க",
    authSignUpBtn: "கணக்கை உருவாக்கி உள்நுழைக",
    authTabSignIn: "உள்நுழைக",
    authTabSignUp: "பதிவு செய்க",
    authNoAccount: "கணக்கு இல்லையா?",
    authHasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    authSigningIn: "உள்நுழைகிறது...",
    authCreatingVault: "காப்பகம் உருவாக்கப்படுகிறது...",
    guestDivider: "அல்லது",
    guestLoginBtn: "விருந்தினர் மருத்துவராகத் தொடரவும்"
  },
  ml: {
    logoBadge: "ക്ലിനിക്കൽ കോക്ക്പിറ്റ്",
    newChat: "പുതിയ സെഷൻ",
    cockpitToggle: "കോക്ക്പിറ്റ്",
    cockpitShow: "കോക്ക്പിറ്റ് കാണിക്കുക",
    logout: "ലോഗ്ഔട്ട്",
    guestBadge: "അതിഥി ക്ലിനീഷ്യൻ",
    signInBtn: "സൈൻ ഇൻ",
    signUpBtn: "സൈൻ അപ്പ്",
    heroTitle: "MedHub ക്ലിനിക്കൽ AI",
    inputPlaceholder: "ലക്ഷണങ്ങൾ വിവരിക്കുക, മരുന്നുകളുടെ പ്രതിപ്രവർത്തനം പരിശോധിക്കുക, അല്ലെങ്കിൽ ചോദ്യങ്ങൾ ചോദിക്കുക...",
    stopBtn: "നിർത്തുക",
    disclaimer: "🛡️ MedHub ക്ലിനിക്കൽ AI തീരുമാന പിന്തുണ നൽകുന്നു. ഡോക്ടറുടെ പരിശോധന അത്യന്താപേക്ഷിതമാണ്.",
    dashTitle: "ക്ലിനിക്കൽ ടെലിമെട്രി & സുരക്ഷ",
    dashSub: "തത്സമയ അൽഗോരിതമിക് തീരുമാന പിന്തുണ",
    triageTitle: "അടിയന്തര ട്രയേജ് (ESI)",
    triageRoutineBadge: "സാധാരണ പരിചരണം",
    triageUrgentBadge: "അടിയന്തിര പരിചരണം",
    triageEmergencyBadge: "എമർജൻസി ER",
    meterRoutine: "സാധാരണ",
    meterUrgent: "അടിയന്തിരം (24-48 മ)",
    meterER: "എമർജൻസി ER",
    triageDefaultHeadline: "സാധാരണ ഭവന പരിചരണവും നിരീക്ഷണവും",
    triageDefaultRec: "ആവശ്യത്തിന് വിശ്രമം, വെള്ളം കുടിക്കൽ ഉറപ്പാക്കുക. 5-7 ദിവസത്തിൽ കൂടുതൽ ലക്ഷണങ്ങൾ തുടർന്നാൽ ഡോക്ടറെ കാണുക.",
    ddiTitle: "മരുന്ന് പ്രതിപ്രവർത്തന സുരക്ഷാ റഡാർ",
    ddiSafeBadge: "റഡാർ ക്ലിയർ",
    ddiWarningBadge: "മുന്നറിയിപ്പ്",
    ddiDangerBadge: "ഗുരുതര പ്രതിസന്ധി",
    activeDrugsLabel: "കണ്ടെത്തിയ സജീവ മരുന്നുകൾ:",
    emptyTray: "സജീവ മരുന്നുകളൊന്നും കണ്ടെത്തിയില്ല",
    ddiSafeTitle: "ഗുരുതരമായ പ്രതിപ്രവർത്തനങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    ddiSafeDesc: "ആശുപത്രി ഡാറ്റാബേസ് പരിശോധിച്ചതിൽ ഉയർന്ന അപകടസാധ്യതയുള്ള പ്രതിപ്രവർത്തനങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",
    actionTitle: "ക്ലിനിക്കൽ നടപടികളും കയറ്റുമതിയും",
    auditBadge: "ഓഡിറ്റ് തയ്യാർ",
    soapLangLabel: "റിപ്പോർട്ട് ഭാഷ",
    downloadSoapBtn: "S.O.A.P. ഡൗൺലോഡ് (മലയാളം PDF)",
    downloadSoapLoading: "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു...",
    downloadSoapSuccess: "ഡൗൺലോഡ് ചെയ്തു!",
    soapS: "സബ്ജക്റ്റീവ്",
    soapO: "ഒബ്ജക്റ്റീവ്",
    soapA: "അസസ്സ്മെന്റ്",
    soapP: "ചികിത്സാ പദ്ധതി",
    soapDefaultS: "രോഗിയുടെ വിവരങ്ങൾക്കായി കാത്തിരിക്കുന്നു...",
    soapDefaultO: "ട്രയേജ് തരംതിരിക്കലും മരുന്ന് പരിശോധനയും",
    soapDefaultA: "ക്ലിനിക്കൽ നിഗമനവും പ്രതിപ്രവർത്തന സാധ്യതയും",
    soapDefaultP: "ചികിത്സാ പ്രോട്ടോക്കോളും ഡോക്ടറുടെ ഫോളോ-അപ്പും",
    playAdvice: "ഉപദേശം കേൾക്കുക",
    stopAdvice: "നിർത്തുക",
    audioReadyBadge: "തയ്യാർ",
    audioPlayingBadge: "പ്ലേ ചെയ്യുന്നു",
    fdaHeader: "OpenFDA റെഗുലേറ്ററി ആധാരം",
    fdaDrugTitle: "ക്ലിനിക്കൽ മാട്രിക്സ് ആധാരം",
    fdaPrescribingTitle: "FDA നിർദ്ദേശവും ഉപയോഗവും:",
    fdaDosageSnippet: "പ്രാദേശിക ക്ലിനിക്കൽ ഫാർമക്കോളജിക്കൽ ഡാറ്റാബേസും openFDA മാർഗ്ഗനിർദ്ദേശങ്ങളും അനുസരിച്ച് പരിശോധിച്ചു.",
    fdaWarningsTitle: "സുരക്ഷാ മുന്നറിയിപ്പുകളും മുൻകരുതലുകളും:",
    fdaWarningsSnippet: "സാധാരണ ക്ലിനിക്കൽ മുൻകരുതലുകൾ ബാധകമാണ്. രോഗിയുടെ സഹിഷ്ണുതയും വൃക്കകളുടെ പ്രവർത്തനവും നിരീക്ഷിക്കുക.",
    authLangLabel: "തിരഞ്ഞെടുത്ത ഭാഷ / Preferred Language",
    authUsernameLabel: "ക്ലിനീഷ്യൻ / രോഗി ഐഡി",
    authUsernamePlaceholder: "ഉദാ. siva",
    authPasswordLabel: "രഹസ്യവാക്ക്",
    authPasswordPlaceholder: "രഹസ്യവാക്ക് നൽകുക",
    authSignInTitle: "ക്ലിനിക്കൽ സൈൻ ഇൻ",
    authSignInSub: "നിങ്ങളുടെ സ്വകാര്യ കൺസൾട്ടേഷൻ നിലവറയിലേക്ക് പ്രവേശിക്കാൻ ക്രെഡൻഷ്യലുകൾ നൽകുക",
    authSignInBtn: "കോക്ക്പിറ്റിലേക്ക് സൈൻ ഇൻ ചെയ്യുക",
    authSignUpTitle: "മെഡിക്കൽ വോൾട്ട് ഉണ്ടാക്കുക",
    authSignUpSub: "കൺസൾട്ടേഷൻ രേഖകൾ സൂക്ഷിക്കാൻ സുരക്ഷിത ഉപയോക്തൃനാമവും പാസ്‌വേഡും രജിസ്റ്റർ ചെയ്യുക",
    authSignUpBtn: "അക്കൗണ്ട് ഉണ്ടാക്കി സൈൻ ഇൻ ചെയ്യുക",
    authTabSignIn: "സൈൻ ഇൻ",
    authTabSignUp: "സൈൻ അപ്പ്",
    authNoAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    authHasAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    authSigningIn: "സൈൻ ഇൻ ചെയ്യുന്നു...",
    authCreatingVault: "നിലവറ ഉണ്ടാക്കുന്നു...",
    guestDivider: "അല്ലെങ്കിൽ",
    guestLoginBtn: "അതിഥി ക്ലിനീഷ്യനായി തുടരുക"
  },
  te: {
    logoBadge: "క్లినికల్ కాక్‌పిట్",
    newChat: "కొత్త సెషన్",
    cockpitToggle: "కాక్‌పిట్",
    cockpitShow: "కాక్‌పిట్‌ను చూపు",
    logout: "లాగౌట్",
    guestBadge: "అతిథి వైద్యుడు",
    signInBtn: "సైన్ ఇన్",
    signUpBtn: "సైన్ అప్",
    heroTitle: "MedHub క్లినికల్ AI",
    inputPlaceholder: "లక్షణాలను వివరించండి, ఔషధ పరస్పర చర్యలను తనిఖీ చేయండి లేదా వైద్య ప్రశ్నలను అడగండి...",
    stopBtn: "ఆపు",
    disclaimer: "🛡️ MedHub క్లినికల్ AI నిర్ణయ మద్దతును అందిస్తుంది. వైద్యుల ధృవీకరణ తప్పనిసరి.",
    dashTitle: "క్లినికల్ టెలిమెట్రీ & భద్రత",
    dashSub: "నిజ-సమయ అల్గారిథమిక్ నిర్ణయ మద్దతు",
    triageTitle: "అత్యవసర ట్రయేజ్ (ESI)",
    triageRoutineBadge: "సాధారణ సంరక్షణ",
    triageUrgentBadge: "అత్యవసర సంరక్షణ",
    triageEmergencyBadge: "అత్యవసర ER",
    meterRoutine: "సాధారణ",
    meterUrgent: "అత్యవసరం (24-48 గం)",
    meterER: "అత్యవసర విభాగం (ER)",
    triageDefaultHeadline: "ప్రామాణిక గృహ సంరక్షణ & పర్యవేక్షణ",
    triageDefaultRec: "తగినంత విశ్రాంతి, నీరు తీసుకోండి. 5-7 రోజుల కంటే ఎక్కువ లక్షణాలు కొనసాగితే వైద్యుడిని సంప్రదించండి.",
    ddiTitle: "ఔషధ పరస్పర చర్య భద్రతా రాడార్",
    ddiSafeBadge: "రాడార్ స్పష్టం",
    ddiWarningBadge: "హెచ్చరిక",
    ddiDangerBadge: "తీవ్ర విభేదం",
    activeDrugsLabel: "గుర్తించిన ఔషధాలు:",
    emptyTray: "ఔషధాలేవీ గుర్తించబడలేదు",
    ddiSafeTitle: "ఎటువంటి తీవ్రమైన విరుద్ధతలు గుర్తించబడలేదు",
    ddiSafeDesc: "ఆసుపత్రి డేటాబేస్‌తో పరిశీలించగా ఎటువంటి అధిక-ప్రమాదకర ఔషధ పరస్పర చర్యలు లేవని తేలింది.",
    actionTitle: "క్లినికల్ చర్యలు & ఎగుమతి",
    auditBadge: "ఆడిట్ సిద్ధం",
    soapLangLabel: "నివేదిక భాష",
    downloadSoapBtn: "S.O.A.P. డౌన్‌లోడ్ (తెలుగు PDF)",
    downloadSoapLoading: "నివేదిక సిద్ధమవుతోంది...",
    downloadSoapSuccess: "డౌన్‌లోడ్ పూర్తయింది!",
    soapS: "సబ్జెక్టివ్",
    soapO: "ఆబ్జెక్టివ్",
    soapA: "అసెస్మెంట్",
    soapP: "ప్రణాళిక",
    soapDefaultS: "రోగి లక్షణాల కోసం వేచి చూస్తోంది...",
    soapDefaultO: "ట్రయేజ్ వర్గీకరణ & ఔషధ స్క్రీనింగ్",
    soapDefaultA: "క్లినికల్ అంచనా & పరస్పర చర్య ప్రమాదం",
    soapDefaultP: "చర్య ప్రోటోకాల్ & వైద్యుల సంప్రదింపు",
    playAdvice: "సలహా వినండి",
    stopAdvice: "ఆపు",
    audioReadyBadge: "సిద్ధం",
    audioPlayingBadge: "ప్లే అవుతోంది",
    fdaHeader: "OpenFDA నియంత్రణ ప్రమాణాలు",
    fdaDrugTitle: "క్లినికల్ మ్యాట్రిక్స్ ప్రమాణం",
    fdaPrescribingTitle: "FDA సూచనలు & నిర్వహణ:",
    fdaDosageSnippet: "స్థానిక క్లినికల్ ఫార్మకాలజికల్ డేటాబేస్ మరియు openFDA మార్గదర్శకాల ప్రకారం ధృవీకరించబడింది.",
    fdaWarningsTitle: "భద్రతా హెచ్చరికలు & జాగ్రత్తలు:",
    fdaWarningsSnippet: "ప్రామాణిక క్లినికల్ జాగ్రత్తలు వర్తిస్తాయి. రోగి తట్టుకునే సామర్థ్యం మరియు మూత్రపిండాల పనితీరును పర్యవేక్షించండి.",
    authLangLabel: "ప్రాధాన్య భాష / Preferred Language",
    authUsernameLabel: "వైద్యుడు / రోగి ఐడి",
    authUsernamePlaceholder: "ఉదా. siva",
    authPasswordLabel: "పాస్‌వర్డ్",
    authPasswordPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
    authSignInTitle: "క్లినికల్ సైన్ ఇన్",
    authSignInSub: "మీ ప్రైవేట్ సంప్రదింపుల సమాచారాన్ని యాక్సెస్ చేయడానికి వివరాలను నమోదు చేయండి",
    authSignInBtn: "కాక్‌పిట్‌కు సైన్ ఇన్ చేయండి",
    authSignUpTitle: "మెడికల్ వాల్ట్‌ను సృష్టించండి",
    authSignUpSub: "సంప్రదింపుల రికార్డులను నిల్వ చేయడానికి యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌ను నమోదు చేయండి",
    authSignUpBtn: "ఖాతాను సృష్టించి సైన్ ఇన్ చేయండి",
    authTabSignIn: "సైన్ ఇన్",
    authTabSignUp: "సైన్ అప్",
    authNoAccount: "ఖాతా లేదా?",
    authHasAccount: "ఇప్పటికే ఖాతా ఉందా?",
    authSigningIn: "సైన్ ఇన్ అవుతోంది...",
    authCreatingVault: "వాల్ట్ సృష్టించబడుతోంది...",
    guestDivider: "లేదా",
    guestLoginBtn: "అతిథి వైద్యుడిగా కొనసాగండి"
  },
  kn: {
    logoBadge: "ಕ್ಲಿನಿಕಲ್ ಕಾಕ್‌ಪಿಟ್",
    newChat: "ಹೊಸ ಸೆಷನ್",
    cockpitToggle: "ಕಾಕ್‌ಪಿಟ್",
    cockpitShow: "ಕಾಕ್‌ಪಿಟ್ ತೋರಿಸಿ",
    logout: "ಲಾಗ್‌ಔಟ್",
    guestBadge: "ಅತಿಥಿ ವೈದ್ಯರು",
    signInBtn: "ಸೈನ್ ಇನ್",
    signUpBtn: "ಸೈನ್ ಅಪ್",
    heroTitle: "MedHub ಕ್ಲಿನಿಕಲ್ AI",
    inputPlaceholder: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ, ಔಷಧಿ ಸಂವಹನ ಪರೀಕ್ಷಿಸಿ ಅಥವಾ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ...",
    stopBtn: "ನಿಲ್ಲಿಸು",
    disclaimer: "🛡️ MedHub ಕ್ಲಿನಿಕಲ್ AI ನಿರ್ಧಾರ ಬೆಂಬಲವನ್ನು ನೀಡುತ್ತದೆ. ವೈದ್ಯರ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.",
    dashTitle: "ಕ್ಲಿನಿಕಲ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಸುರಕ್ಷತೆ",
    dashSub: "ನೈಜ-ಸಮಯದ ಕ್ರಮಾವಳಿ ನಿರ್ಧಾರ ಬೆಂಬಲ",
    triageTitle: "ತುರ್ತು ಚಿಕಿತ್ಸಾ ಆದ್ಯತೆ (ESI)",
    triageRoutineBadge: "ಸಾಮಾನ್ಯ ಆರೈಕೆ",
    triageUrgentBadge: "ತುರ್ತು ಆರೈಕೆ",
    triageEmergencyBadge: "ತುರ್ತು ER",
    meterRoutine: "ಸಾಮಾನ್ಯ",
    meterUrgent: "ತುರ್ತು (24-48 ಗಂ)",
    meterER: "ತುರ್ತು ಕೊಠಡಿ (ER)",
    triageDefaultHeadline: "ಪ್ರಮಾಣಿತ ಮನೆ ಆರೈಕೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ",
    triageDefaultRec: "ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ, ನೀರು ಸೇವಿಸಿ. 5-7 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ರೋಗಲಕ್ಷಣಗಳು ಮುಂದುವರಿದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
    ddiTitle: "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆ ಸುರಕ್ಷತಾ ರಾಡಾರ್",
    ddiSafeBadge: "ರಾಡಾರ್ ಸ್ಪಷ್ಟ",
    ddiWarningBadge: "ಎಚ್ಚರಿಕೆ",
    ddiDangerBadge: "ಗಂಭೀರ ಸಂಘರ್ಷ",
    activeDrugsLabel: "ಗುರುತಿಸಲಾದ ಸಕ್ರಿಯ ಔಷಧಿಗಳು:",
    emptyTray: "ಯಾವುದೇ ಔಷಧಿಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ",
    ddiSafeTitle: "ಯಾವುದೇ ಗಂಭೀರ ಪ್ರತಿಕೂಲತೆ ಕಂಡುಬಂದಿಲ್ಲ",
    ddiSafeDesc: "ಆಸ್ಪತ್ರೆ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿದಾಗ ಯಾವುದೇ ಹೆಚ್ಚಿನ ಅಪಾಯದ ಔಷಧೀಯ ಸಂಘರ್ಷಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    actionTitle: "ಕ್ಲಿನಿಕಲ್ ಕ್ರಮಗಳು ಮತ್ತು ರಫ್ತು",
    auditBadge: "ಆಡಿಟ್‌ಗೆ ಸಿದ್ಧ",
    soapLangLabel: "ವರದಿ ಭಾಷೆ",
    downloadSoapBtn: "S.O.A.P. ಡೌನ್‌ಲೋಡ್ (ಕನ್ನಡ PDF)",
    downloadSoapLoading: "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    downloadSoapSuccess: "ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
    soapS: "ಸಬ್ಜೆಕ್ಟಿವ್",
    soapO: "ಆಬ್ಜೆಕ್ಟಿವ್",
    soapA: "ಮೌಲ್ಯಮಾಪನ",
    soapP: "ಯೋಜನೆ",
    soapDefaultS: "ರೋಗಿಯ ದೂರಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    soapDefaultO: "ಟ್ರಯಾಜ್ ವರ್ಗೀಕರಣ ಮತ್ತು ಔಷಧ ತಪಾಸಣೆ",
    soapDefaultA: "ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಅಪಾಯದ ಸಾಧ್ಯತೆ",
    soapDefaultP: "ಕ್ರಿಯಾ ಪ್ರೋಟೋಕಾಲ್ ಮತ್ತು ವೈದ್ಯರ ಫಾಲೋ-ಅಪ್",
    playAdvice: "ಸಲಹೆ ಆಲಿಸಿ",
    stopAdvice: "ನಿಲ್ಲಿಸು",
    audioReadyBadge: "ಸಿದ್ಧ",
    audioPlayingBadge: "ಪ್ಲೇ ಆಗುತ್ತಿದೆ",
    fdaHeader: "OpenFDA ನಿಯಂತ್ರಕ ಆಧಾರ",
    fdaDrugTitle: "ಕ್ಲಿನಿಕಲ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಆಧಾರ",
    fdaPrescribingTitle: "FDA ಶಿಫಾರಸು ಮತ್ತು ಬಳಕೆ:",
    fdaDosageSnippet: "ಸ್ಥಳೀಯ ಕ್ಲಿನಿಕಲ್ ಫಾರ್ಮಾಕಾಲಾಜಿಕಲ್ ಡೇಟಾಬೇಸ್ ಮತ್ತು openFDA ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    fdaWarningsTitle: "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು:",
    fdaWarningsSnippet: "ಪ್ರಮಾಣಿತ ವೈದ್ಯಕೀಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಅನ್ವಯಿಸುತ್ತವೆ. ರೋಗಿಯ ಸಹಿಷ್ಣುತೆ ಮತ್ತು ಮೂತ್ರಪಿಂಡದ ಕ್ರಿಯೆಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    authLangLabel: "ಆದ್ಯತೆಯ ಭಾಷೆ / Preferred Language",
    authUsernameLabel: "ವೈದ್ಯರು / ರೋಗಿ ಐಡಿ",
    authUsernamePlaceholder: "ಉದಾ. siva",
    authPasswordLabel: "ಗುಪ್ತಪದ (ಪಾಸ್‌ವರ್ಡ್)",
    authPasswordPlaceholder: "ಗುಪ್ತಪದ ನಮೂದಿಸಿ",
    authSignInTitle: "ಕ್ಲಿನಿಕಲ್ ಸೈನ್ ಇನ್",
    authSignInSub: "ನಿಮ್ಮ ಖಾಸಗಿ ಸಮಾಲೋಚನಾ ವಾಲ್ಟ್‌ಗೆ ಪ್ರವೇಶಿಸಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    authSignInBtn: "ಕಾಕ್‌ಪಿಟ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
    authSignUpTitle: "ವೈದ್ಯಕೀಯ ವಾಲ್ಟ್ ರಚಿಸಿ",
    authSignUpSub: "ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಲು ಬಳಕೆದಾರಹೆಸರು ಮತ್ತು ಗುಪ್ತಪದ ನೋಂದಾಯಿಸಿ",
    authSignUpBtn: "ಖಾತೆ ರಚಿಸಿ ಸೈನ್ ಇನ್ ಮಾಡಿ",
    authTabSignIn: "ಸೈನ್ ಇನ್",
    authTabSignUp: "ಸೈನ್ ಅಪ್",
    authNoAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    authHasAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    authSigningIn: "ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...",
    authCreatingVault: "ವಾಲ್ಟ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    guestDivider: "ಅಥವಾ",
    guestLoginBtn: "ಅತಿಥಿ ವೈದ್ಯರಾಗಿ ಮುಂದುವರಿಯಿರಿ"
  },
  hi: {
    logoBadge: "क्लिनिकल कॉकपिट",
    newChat: "नया सत्र",
    cockpitToggle: "कॉकपिट",
    cockpitShow: "कॉकपिट दिखाएं",
    logout: "लॉगआउट",
    guestBadge: "अतिथि चिकित्सक",
    signInBtn: "साइन इन",
    signUpBtn: "साइन अप",
    heroTitle: "MedHub क्लिनिकल AI",
    inputPlaceholder: "लक्षण बताएं, दवा के परस्पर प्रभाव की जांच करें या चिकित्सीय प्रश्न पूछें...",
    stopBtn: "रोकें",
    disclaimer: "🛡️ MedHub क्लिनिकल AI निर्णय समर्थन प्रदान करता है। चिकित्सक का सत्यापन अनिवार्य है।",
    dashTitle: "क्लिनिकल टेलीमेट्री और सुरक्षा",
    dashSub: "रीयल-टाइम एल्गोरिथम निर्णय समर्थन",
    triageTitle: "आपातकालीन ट्राइएज (ESI)",
    triageRoutineBadge: "सामान्य देखभाल",
    triageUrgentBadge: "अति आवश्यक देखभाल",
    triageEmergencyBadge: "आपातकालीन ER",
    meterRoutine: "सामान्य",
    meterUrgent: "अति आवश्यक (24-48 घंटे)",
    meterER: "आपातकालीन कक्ष (ER)",
    triageDefaultHeadline: "मानक गृह देखभाल और निगरानी",
    triageDefaultRec: "पर्याप्त आराम और जलयोजन बनाए रखें। यदि लक्षण 5-7 दिनों से अधिक बने रहें तो चिकित्सक से परामर्श लें।",
    ddiTitle: "दवा पारस्परिक क्रिया सुरक्षा रडार",
    ddiSafeBadge: "रडार सुरक्षित",
    ddiWarningBadge: "चेतावनी",
    ddiDangerBadge: "गंभीर टकराव",
    activeDrugsLabel: "पहचानी गई सक्रिय औषधियां:",
    emptyTray: "कोई सक्रिय दवा नहीं मिली",
    ddiSafeTitle: "कोई गंभीर विरोधाभास नहीं मिला",
    ddiSafeDesc: "सक्रिय दवाओं का अस्पताल ज्ञानकोष से मिलान किया गया, कोई उच्च-जोखिम पारस्परिक टकराव नहीं मिला।",
    actionTitle: "क्लिनिकल क्रियाएं और निर्यात",
    auditBadge: "ऑडिट तैयार",
    soapLangLabel: "रिपोर्ट भाषा",
    downloadSoapBtn: "S.O.A.P. सारांश डाउनलोड (हिन्दी PDF)",
    downloadSoapLoading: "हिन्दी रिपोर्ट तैयार हो रही है...",
    downloadSoapSuccess: "डाउनलोड पूरा हुआ!",
    soapS: "व्यक्तिपरक",
    soapO: "वस्तुपरक",
    soapA: "मूल्यांकन",
    soapP: "उपचार योजना",
    soapDefaultS: "रोगी की शिकायत की प्रतीक्षा है...",
    soapDefaultO: "ट्राइएज वर्गीकरण और दवा जांच",
    soapDefaultA: "क्लिनिकल मूल्यांकन और परस्पर प्रभाव जोखिम",
    soapDefaultP: "कार्रवाई प्रोटोकॉल और डॉक्टर परामर्श",
    playAdvice: "सलाह सुनें",
    stopAdvice: "रोकें",
    audioReadyBadge: "तैयार",
    audioPlayingBadge: "चल रहा है",
    fdaHeader: "OpenFDA विनियामक आधार",
    fdaDrugTitle: "क्लिनिकल मैट्रिक्स आधार",
    fdaPrescribingTitle: "FDA नुस्खा और व्यवस्थापन:",
    fdaDosageSnippet: "स्थानीय क्लिनिकल औषधीय डेटाबेस और openFDA लेबल दिशानिर्देशों के तहत सत्यापित।",
    fdaWarningsTitle: "सुरक्षा चेतावनियां और सावधानियां:",
    fdaWarningsSnippet: "मानक चिकित्सीय सावधानियां लागू होती हैं। रोगी की सहनशीलता और गुर्दे की कार्यप्रणाली की निगरानी करें।",
    authLangLabel: "पसंदीदा भाषा / Preferred Language",
    authUsernameLabel: "चिकित्सक / रोगी आईडी",
    authUsernamePlaceholder: "उदा. siva",
    authPasswordLabel: "पासवर्ड",
    authPasswordPlaceholder: "पासवर्ड दर्ज करें",
    authSignInTitle: "क्लिनिकल साइन इन",
    authSignInSub: "अपने निजी परामर्श वॉल्ट तक पहुँचने के लिए क्रेडेंशियल दर्ज करें",
    authSignInBtn: "कॉकपिट में साइन इन करें",
    authSignUpTitle: "मेडिकल वॉल्ट बनाएं",
    authSignUpSub: "परामर्श रिकॉर्ड सहेजने के लिए सुरक्षित उपयोगकर्ता नाम और पासवर्ड पंजीकृत करें",
    authSignUpBtn: "खाता बनाएं और साइन इन करें",
    authTabSignIn: "साइन इन",
    authTabSignUp: "साइन अप",
    authNoAccount: "खाता नहीं है?",
    authHasAccount: "पहले से खाता है?",
    authSigningIn: "साइन इन हो रहा है...",
    authCreatingVault: "वॉल्ट बनाया जा रहा है...",
    guestDivider: "या",
    guestLoginBtn: "अतिथि चिकित्सक के रूप में जारी रखें"
  }
};

let currentAppLang = localStorage.getItem("medhub_app_lang") || "en";

function applyAppLanguage(lang) {
  if (!lang) lang = "en";
  currentAppLang = lang.toLowerCase();
  if (!APP_I18N[currentAppLang]) currentAppLang = "en";
  localStorage.setItem("medhub_app_lang", currentAppLang);

  if (currentUser && currentUser !== "guest") {
    localStorage.setItem("medhub_user_lang_" + currentUser, currentAppLang);
  }

  const t = APP_I18N[currentAppLang];

  // Synchronize both language dropdowns
  if (authLangSelect && authLangSelect.value !== currentAppLang) {
    authLangSelect.value = currentAppLang;
  }
  if (soapLangSelect && soapLangSelect.value !== currentAppLang) {
    soapLangSelect.value = currentAppLang;
  }

  // 1. Topbar
  if (logoBadgeText) logoBadgeText.textContent = t.logoBadge;
  if (newChatBtnText) newChatBtnText.textContent = t.newChat;
  if (toggleCockpitBtnText) {
    const isCollapsed = cockpitContainer && cockpitContainer.classList.contains("collapsed");
    toggleCockpitBtnText.textContent = isCollapsed ? t.cockpitShow : t.cockpitToggle;
  }
  if (logoutBtnText) logoutBtnText.textContent = t.logout;
  if (guestIndicatorText) guestIndicatorText.textContent = t.guestBadge;
  if (loginPromptBtnText) loginPromptBtnText.textContent = t.signInBtn;
  if (signupPromptBtnText) signupPromptBtnText.textContent = t.signUpBtn;

  // 2. Consultation Stream
  if (heroTitleText) heroTitleText.textContent = t.heroTitle;
  if (inputEl) inputEl.setAttribute("placeholder", t.inputPlaceholder);
  if (stopGenBtnText) stopGenBtnText.textContent = t.stopBtn;
  if (disclaimerNoticeText) disclaimerNoticeText.textContent = t.disclaimer;

  // 3. Dashboard Header
  if (dashboardTitleText) dashboardTitleText.textContent = t.dashTitle;
  if (dashboardSubText) dashboardSubText.textContent = t.dashSub;

  // 4. Emergency Triage (Card 1)
  if (triageCardTitle) triageCardTitle.textContent = t.triageTitle;
  if (meterLabelRoutine) meterLabelRoutine.textContent = t.meterRoutine;
  if (meterLabelUrgent) meterLabelUrgent.textContent = t.meterUrgent;
  if (meterLabelER) meterLabelER.textContent = t.meterER;
  if (!latestBotAdvice && triageHeadline && triageRec) {
    triageHeadline.textContent = t.triageDefaultHeadline;
    triageRec.textContent = t.triageDefaultRec;
    if (triageBadge) triageBadge.textContent = t.triageRoutineBadge;
  }

  // 5. DDI Radar (Card 2)
  if (ddiCardTitle) ddiCardTitle.textContent = t.ddiTitle;
  if (activeDrugsLabel) activeDrugsLabel.textContent = t.activeDrugsLabel;
  if (!latestBotAdvice) {
    if (ddiBadge) ddiBadge.textContent = t.ddiSafeBadge;
    if (emptyTrayPill) emptyTrayPill.textContent = t.emptyTray;
    if (ddiConflictTitle) ddiConflictTitle.textContent = t.ddiSafeTitle;
    if (ddiConflictDesc) ddiConflictDesc.textContent = t.ddiSafeDesc;
  }

  // 6. Clinical Actions & SOAP (Card 3)
  if (actionCardTitle) actionCardTitle.textContent = t.actionTitle;
  if (auditReadyBadge) auditReadyBadge.textContent = t.auditBadge;
  if (soapLangLabelText) soapLangLabelText.textContent = t.soapLangLabel;
  if (downloadSoapBtnText && !downloadSoapBtn.disabled) {
    downloadSoapBtnText.textContent = t.downloadSoapBtn;
  }
  if (!latestSoapData) {
    if (soapSubjectivePreview) soapSubjectivePreview.textContent = t.soapDefaultS;
    if (soapObjectivePreview) soapObjectivePreview.textContent = t.soapDefaultO;
    if (soapAssessmentPreview) soapAssessmentPreview.textContent = t.soapDefaultA;
    if (soapPlanPreview) soapPlanPreview.textContent = t.soapDefaultP;
  }
  if (playAdviceBtnText) playAdviceBtnText.textContent = t.playAdvice;
  if (stopAdviceBtnText) stopAdviceBtnText.textContent = t.stopAdvice;
  if (audioStateBadge && !isVoicePlaying) audioStateBadge.textContent = t.audioReadyBadge;

  // OpenFDA Grounding Drawer
  if (fdaHeaderTitle) fdaHeaderTitle.textContent = t.fdaHeader;
  if (fdaDrugTitle) fdaDrugTitle.textContent = t.fdaDrugTitle;
  if (fdaPrescribingTitle) fdaPrescribingTitle.textContent = t.fdaPrescribingTitle;
  if (fdaDosageSnippet) fdaDosageSnippet.textContent = t.fdaDosageSnippet;
  if (fdaWarningsTitle) fdaWarningsTitle.textContent = t.fdaWarningsTitle;
  if (fdaWarningsSnippet) fdaWarningsSnippet.textContent = t.fdaWarningsSnippet;

  // 7. Auth Modal
  if (authLangLabelText) authLangLabelText.textContent = t.authLangLabel;
  if (authUsernameLabel) authUsernameLabel.textContent = t.authUsernameLabel;
  if (authUsername) authUsername.setAttribute("placeholder", t.authUsernamePlaceholder);
  if (authPasswordLabel) authPasswordLabel.textContent = t.authPasswordLabel;
  if (authPassword) authPassword.setAttribute("placeholder", t.authPasswordPlaceholder);
  if (tabSignIn) tabSignIn.textContent = t.authTabSignIn;
  if (tabSignUp) tabSignUp.textContent = t.authTabSignUp;
  if (guestDividerText) guestDividerText.textContent = t.guestDivider;
  if (guestLoginBtnText) guestLoginBtnText.textContent = t.guestLoginBtn;

  // Re-render auth mode texts
  if (typeof setAuthMode === "function") {
    setAuthMode(authMode);
  }
}

// ---------------------------------------------------------------------------
// 2. TOGGLE COCKPIT & MODAL HANDLERS
// ---------------------------------------------------------------------------
if (toggleCockpitBtn) {
  toggleCockpitBtn.addEventListener("click", () => {
    cockpitContainer.classList.toggle("collapsed");
    const isCollapsed = cockpitContainer.classList.contains("collapsed");
    const t = APP_I18N[currentAppLang] || APP_I18N.en;
    if (toggleCockpitBtnText) {
      toggleCockpitBtnText.textContent = isCollapsed ? t.cockpitShow : t.cockpitToggle;
    }
  });
}

if (privacyVaultPill) {
  privacyVaultPill.addEventListener("click", () => {
    if (vaultModal) vaultModal.style.display = "flex";
  });
}

if (closeVaultModalBtn) {
  closeVaultModalBtn.addEventListener("click", () => {
    if (vaultModal) vaultModal.style.display = "none";
  });
}

if (vaultModal) {
  vaultModal.addEventListener("click", (e) => {
    if (e.target === vaultModal) vaultModal.style.display = "none";
  });
}

// OpenFDA Drawer Toggle
if (fdaHeaderToggle && fdaDrawerContent) {
  let isFdaOpen = true;
  fdaHeaderToggle.addEventListener("click", () => {
    isFdaOpen = !isFdaOpen;
    fdaDrawerContent.style.display = isFdaOpen ? "flex" : "none";
    if (fdaChevron) {
      fdaChevron.style.transform = isFdaOpen ? "rotate(0deg)" : "rotate(-90deg)";
    }
  });
}

// ---------------------------------------------------------------------------
// 3. STARTER CHIPS HANDLER
// ---------------------------------------------------------------------------
document.querySelectorAll(".starter-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const promptText = chip.getAttribute("data-prompt");
    if (promptText) {
      inputEl.value = promptText;
      autoResize();
      sendMessage();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. NEW SESSION HANDLER
// ---------------------------------------------------------------------------
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    messagesEl.innerHTML = "";
    welcomeEl.style.display = "flex";
    isFirstMessageInSession = true;
    latestBotAdvice = "";
    latestUserQuery = "";
    latestSoapData = null;
    resetCockpitMetrics();
    applyAppLanguage(soapLangSelect ? soapLangSelect.value : "en");
    inputEl.value = "";
    autoResize();
    inputEl.focus();
  });
}

function resetCockpitMetrics() {
  const t = APP_I18N[currentAppLang] || APP_I18N.en;
  if (triageBadge) {
    triageBadge.className = "status-badge routine";
    triageBadge.textContent = t.triageRoutineBadge;
  }
  if (triageMeterMarker) {
    triageMeterMarker.className = "meter-marker routine";
  }
  if (triageHeadline) triageHeadline.textContent = t.triageDefaultHeadline;
  if (triageRec) triageRec.textContent = t.triageDefaultRec;
  if (triageTriggers) {
    triageTriggers.innerHTML = "";
    triageTriggers.style.display = "none";
  }

  if (ddiBadge) {
    ddiBadge.className = "status-badge safe";
    ddiBadge.textContent = t.ddiSafeBadge;
  }
  if (activeDrugsList) {
    activeDrugsList.innerHTML = `<span class="empty-tray-pill" id="emptyTrayPill">${t.emptyTray}</span>`;
  }
  if (ddiConflictBox) {
    ddiConflictBox.className = "ddi-conflict-box safe";
    ddiStatusIcon.textContent = "✅";
    ddiConflictTitle.textContent = t.ddiSafeTitle;
    ddiConflictDesc.textContent = t.ddiSafeDesc;
    if (ddiActionBox) ddiActionBox.style.display = "none";
  }

  if (soapSubjectivePreview) soapSubjectivePreview.textContent = t.soapDefaultS;
  if (soapObjectivePreview) soapObjectivePreview.textContent = t.soapDefaultO;
  if (soapAssessmentPreview) soapAssessmentPreview.textContent = t.soapDefaultA;
  if (soapPlanPreview) soapPlanPreview.textContent = t.soapDefaultP;

  stopVoiceAudio();
}

// ---------------------------------------------------------------------------
// 5. FILE UPLOAD HANDLING
// ---------------------------------------------------------------------------
uploadBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    pendingFile = fileInput.files[0];
    showFilePreview(pendingFile);
  }
});

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function showFilePreview(file) {
  let preview = document.getElementById("filePreview");
  if (!preview) {
    preview = document.createElement("div");
    preview.id = "filePreview";
    document.querySelector(".input-wrapper").insertAdjacentElement("afterbegin", preview);
  }

  const isImage = file.type.startsWith("image/");
  let thumbHtml;
  if (isImage) {
    const url = URL.createObjectURL(file);
    thumbHtml = `<img src="${url}" class="thumb-img" alt="preview">`;
  } else {
    thumbHtml = `
      <div class="thumb-file">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>`;
  }

  preview.innerHTML = `
    <div class="thumb-wrap">
      ${thumbHtml}
      <div class="thumb-details">
        <span class="thumb-details-name" title="${file.name}">${file.name}</span>
        <span class="thumb-details-size">${formatFileSize(file.size)} • Clinical attachment ready</span>
      </div>
      <button id="removeFileBtn" class="thumb-remove" title="Remove file" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  document.getElementById("removeFileBtn").addEventListener("click", () => {
    pendingFile = null;
    fileInput.value = "";
    preview.remove();
  });
}

// ---------------------------------------------------------------------------
// 6. MESSAGE RENDERING & ACTION BAR
// ---------------------------------------------------------------------------
function addMessage(text, sender) {
  welcomeEl.style.display = "none";
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  if (sender.includes("typing")) {
    div.innerHTML = `
      <span>${text}</span>
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <button class="typing-cancel-btn" type="button" title="Stop Generation">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
        <span>Stop</span>
      </button>
    `;
    const cancelBtn = div.querySelector(".typing-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (currentAbortController) {
          currentAbortController.abort();
        }
      });
    }
  } else {
    div.textContent = text;
  }
  messagesEl.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return div;
}

function addUserMessage(text, file) {
  welcomeEl.style.display = "none";
  const div = document.createElement("div");
  div.className = "msg user";

  if (file) {
    const isImage = file.type.startsWith("image/");
    const attachWrap = document.createElement("div");
    attachWrap.className = "chat-attachment";

    if (isImage) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "chat-attachment-img-wrap";
      imgWrap.title = "Click to enlarge document";

      const fileUrl = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.className = "chat-attachment-img";
      img.src = fileUrl;
      img.alt = file.name;
      img.onload = () => { chatArea.scrollTop = chatArea.scrollHeight; };
      imgWrap.onclick = () => window.open(fileUrl, "_blank");

      imgWrap.appendChild(img);
      attachWrap.appendChild(imgWrap);

      const meta = document.createElement("div");
      meta.className = "chat-attachment-meta";
      meta.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span>${file.name} (${formatFileSize(file.size)})</span>
      `;
      attachWrap.appendChild(meta);
    } else {
      const fileCard = document.createElement("div");
      fileCard.className = "chat-attachment-card";
      fileCard.innerHTML = `
        <div class="chat-attachment-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="chat-attachment-card-info">
          <div class="chat-attachment-card-name" title="${file.name}">${file.name}</div>
          <div class="chat-attachment-card-size">${file.type === "application/pdf" ? "Medical PDF Report" : "Document"} • ${formatFileSize(file.size)}</div>
        </div>
      `;
      attachWrap.appendChild(fileCard);
    }
    div.appendChild(attachWrap);
  }

  if (text) {
    const textDiv = document.createElement("div");
    textDiv.className = "msg-text";
    textDiv.textContent = text;
    div.appendChild(textDiv);
  }

  messagesEl.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return div;
}

function autoResize() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
}
inputEl.addEventListener("input", autoResize);

function formatInlineMarkdown(text) {
  if (!text) return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function renderBotMessage(container, rawText) {
  container.innerHTML = "";
  latestBotAdvice = rawText;

  const lines = rawText.split("\n");
  let tableLines = [];
  let isTable = false;
  let hasRenderedTable = false;

  const flushTable = () => {
    if (tableLines.length === 0) return;
    hasRenderedTable = true;
    const wrap = document.createElement("div");
    wrap.className = "schedule-table-wrap";
    const table = document.createElement("table");
    table.className = "schedule-table";

    const validRows = tableLines.filter(row => {
      const cleaned = row.replace(/\|/g, "").trim();
      return !/^[-:\s]+$/.test(cleaned);
    });

    validRows.forEach((rowStr, index) => {
      const row = document.createElement("tr");
      const cells = rowStr.split("|").slice(1, -1);
      cells.forEach(c => {
        const cell = document.createElement(index === 0 ? "th" : "td");
        cell.innerHTML = formatInlineMarkdown(c.trim());
        row.appendChild(cell);
      });
      table.appendChild(row);
    });

    wrap.appendChild(table);
    container.appendChild(wrap);
    tableLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      isTable = true;
      tableLines.push(trimmed);
    } else {
      if (isTable) {
        flushTable();
        isTable = false;
      }
      if (trimmed) {
        if (/^#{1,4}\s+/.test(trimmed)) {
          const h = document.createElement("div");
          h.innerHTML = formatInlineMarkdown(trimmed.replace(/^#{1,4}\s+/, ""));
          h.style.fontWeight = "700";
          h.style.color = "#86efac";
          h.style.margin = "10px 0 4px 0";
          h.style.fontSize = "1.05rem";
          container.appendChild(h);
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const p = document.createElement("p");
          p.innerHTML = "• " + formatInlineMarkdown(trimmed.slice(2));
          p.style.margin = "3px 0 3px 12px";
          container.appendChild(p);
        } else {
          const p = document.createElement("p");
          p.innerHTML = formatInlineMarkdown(trimmed);
          p.style.margin = "4px 0";
          container.appendChild(p);
        }
      }
    }
  }
  if (isTable) flushTable();

  // If table was rendered, add direct PDF download button
  if (hasRenderedTable) {
    const btn = document.createElement("button");
    btn.className = "pdf-download-btn";
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download Schedule PDF
    `;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Generating Schedule PDF...";
      try {
        const formData = new FormData();
        formData.append("message", rawText);
        formData.append("schedule_text", rawText);
        const res = await fetch("/api/generate-schedule-pdf", {
          method: "POST",
          body: formData
        });
        if (!res.ok) throw new Error("Failed to generate PDF");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "medhub_medication_schedule.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        btn.textContent = "Downloaded!";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Download Schedule PDF";
        }, 3000);
      } catch (err) {
        console.error(err);
        btn.textContent = "Error downloading PDF";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Download Schedule PDF";
        }, 2500);
      }
    });
    container.appendChild(btn);
  }

  // Action Bar at bottom of each message (Feature 4 Audio & Copy)
  const actionBar = document.createElement("div");
  actionBar.className = "bot-action-bar";

  const speakBtn = document.createElement("button");
  speakBtn.className = "bot-action-btn";
  speakBtn.type = "button";
  speakBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
    <span>Listen Aloud</span>
  `;
  speakBtn.addEventListener("click", () => toggleMessageVoice(speakBtn, rawText));

  const copyBtn = document.createElement("button");
  copyBtn.className = "bot-action-btn";
  copyBtn.type = "button";
  copyBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    <span>Copy</span>
  `;
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rawText);
    copyBtn.querySelector("span").textContent = "Copied!";
    setTimeout(() => { copyBtn.querySelector("span").textContent = "Copy"; }, 2000);
  });

  actionBar.appendChild(speakBtn);
  actionBar.appendChild(copyBtn);
  container.appendChild(actionBar);
}

// ---------------------------------------------------------------------------
// 7. COCKPIT LIVE TELEMETRY UPDATER
// ---------------------------------------------------------------------------
function updateCockpitDashboard(data) {
  if (!data) return;

  // 1. Feature 2: Emergency Triage Update
  if (data.triage) {
    const t = data.triage;
    triageBadge.className = `status-badge ${t.level}`;
    triageBadge.textContent = t.badge;

    triageMeterMarker.className = `meter-marker ${t.level}`;
    triageHeadline.textContent = t.title;
    triageRec.textContent = t.recommendation;

    if (t.triggers && t.triggers.length > 0) {
      triageTriggers.style.display = "flex";
      triageTriggers.innerHTML = t.triggers.map(k => `<span class="trigger-tag">Flag: ${k}</span>`).join("");
    } else {
      triageTriggers.style.display = "none";
    }
  }

  // 2. Feature 1: DDI Radar Update
  if (data.ddi) {
    const d = data.ddi;
    ddiBadge.className = `status-badge ${d.level}`;
    ddiBadge.textContent = d.badge;

    if (d.active_drugs && d.active_drugs.length > 0) {
      activeDrugsList.innerHTML = d.active_drugs.map(drug => `<span class="drug-pill">${drug}</span>`).join("");
    } else {
      activeDrugsList.innerHTML = `<span class="empty-tray-pill">No active medications detected</span>`;
    }

    ddiConflictBox.className = `ddi-conflict-box ${d.level}`;
    if (d.level === "danger") {
      ddiStatusIcon.textContent = "🚨";
    } else if (d.level === "warning") {
      ddiStatusIcon.textContent = "⚠️";
    } else {
      ddiStatusIcon.textContent = "✅";
    }

    ddiConflictTitle.textContent = d.title;
    ddiConflictDesc.textContent = d.description;

    if (d.interactions && d.interactions.length > 0) {
      const actions = d.interactions.map(item => `<strong>${item.title}:</strong> ${item.action}`).join("<br/>");
      ddiActionBox.innerHTML = actions;
      ddiActionBox.style.display = "block";
    } else {
      ddiActionBox.style.display = "none";
    }
  }

  // 3. Feature 3: S.O.A.P. Record Update
  if (data.soap) {
    latestSoapData = data.soap;
    soapSubjectivePreview.textContent = data.soap.subjective.replace(/\n/g, " • ").slice(0, 80) + "...";
    soapObjectivePreview.textContent = data.soap.objective.replace(/\n/g, " • ").slice(0, 80) + "...";
    soapAssessmentPreview.textContent = data.soap.assessment.replace(/\n/g, " • ").slice(0, 80) + "...";
    soapPlanPreview.textContent = data.soap.plan.replace(/\n/g, " • ").slice(0, 80) + "...";
  }

  // 4. Feature 5: OpenFDA Grounding Update
  if (data.fda_info && data.fda_info.verified) {
    fdaDrugTitle.textContent = data.fda_info.drug_name;
    fdaDosageSnippet.textContent = data.fda_info.dosage;
    fdaWarningsSnippet.textContent = data.fda_info.warnings;
  }
}

// ---------------------------------------------------------------------------
// 8. SEND MESSAGE WITH ACTIVE STOP GENERATION BUTTON
// ---------------------------------------------------------------------------
async function sendMessage() {
  if (currentAbortController) {
    return;
  }
  const text = inputEl.value.trim();
  const fileToSend = pendingFile;
  if (!text && !fileToSend) return;

  latestUserQuery = text;

  // Clean input
  pendingFile = null;
  fileInput.value = "";
  const preview = document.getElementById("filePreview");
  if (preview) preview.remove();

  inputEl.value = "";
  autoResize();

  // Toggle buttons: Hide Send, Show Stop Generation
  sendBtn.style.display = "none";
  if (stopGenBtn) stopGenBtn.style.display = "flex";

  // Post user message
  addUserMessage(text, fileToSend);

  // Show status
  const typingStatus = fileToSend
    ? "MedHub is analyzing clinical attachment & screening interactions..."
    : "MedHub is computing clinical decision support...";
  const typingDiv = addMessage(typingStatus, "bot typing");

  // Setup AbortController for Stopping Generation
  currentAbortController = new AbortController();

  try {
    const formData = new FormData();
    const promptMessage = text || (fileToSend ? `Please analyze this clinical document (${fileToSend.name}) and evaluate health insights.` : "");
    formData.append("message", promptMessage);
    formData.append("username", currentUser || "guest");
    formData.append("enhance", (typeof isAiMode !== "undefined" && isAiMode) ? "true" : "false");
    formData.append("is_first_message", isFirstMessageInSession ? "true" : "false");
    isFirstMessageInSession = false;
    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    const res = await fetch("/api/chat-with-file", {
      method: "POST",
      body: formData,
      signal: currentAbortController.signal
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    typingDiv.classList.remove("typing");
    renderBotMessage(typingDiv, data.response);

    // Update Live Cockpit Dashboard (Features 1, 2, 3, 5)
    updateCockpitDashboard(data);

  } catch (err) {
    typingDiv.classList.remove("typing");
    if (err.name === "AbortError") {
      typingDiv.innerHTML = `<p style="color:#fcd34d; margin:0; font-style:italic;">⏹ Consultation generation stopped by user.</p>`;
    } else {
      console.error("Error sending message:", err);
      const t = (typeof APP_I18N !== "undefined" && APP_I18N[currentAppLang]) ? APP_I18N[currentAppLang] : (typeof APP_I18N !== "undefined" ? APP_I18N.en : null);
      const errText = (t && t.chatError) ? t.chatError : "⚠️ Something went wrong while connecting to the local inference vault. Please try again.";
      typingDiv.innerHTML = `<p style="color:#fca5a5; margin:0;">${errText}</p>`;
    }
  } finally {
    currentAbortController = null;
    if (stopGenBtn) stopGenBtn.style.display = "none";
    sendBtn.style.display = "flex";
    sendBtn.disabled = false;
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

// Stop Generation Button Click Handler
if (stopGenBtn) {
  stopGenBtn.addEventListener("click", () => {
    if (currentAbortController) {
      currentAbortController.abort();
    }
  });
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ---------------------------------------------------------------------------
// 9. FEATURE 3: MULTILINGUAL S.O.A.P. / S.B.A.R. PDF EXPORT (6 LANGUAGES)
// Synchronized with Auth Modal Language Selector and App-Wide Localization
// ---------------------------------------------------------------------------
if (soapLangSelect) {
  soapLangSelect.addEventListener("change", (e) => {
    applyAppLanguage(e.target.value);
  });
}

if (authLangSelect) {
  authLangSelect.addEventListener("change", (e) => {
    applyAppLanguage(e.target.value);
  });
}

if (downloadSoapBtn) {
  downloadSoapBtn.addEventListener("click", async () => {
    const selectedLang = (soapLangSelect ? soapLangSelect.value : currentAppLang || "en").toLowerCase();
    const t = APP_I18N[selectedLang] || APP_I18N.en;

    downloadSoapBtn.disabled = true;
    if (downloadSoapBtnText) {
      downloadSoapBtnText.textContent = t.downloadSoapLoading;
    }

    try {
      const formData = new FormData();
      if (latestSoapData) {
        formData.append("soap_json", JSON.stringify(latestSoapData));
      }
      formData.append("patient_name", currentUser || "Guest Patient");
      formData.append("query", latestUserQuery || "Clinical Consultation Summary");
      formData.append("response", latestBotAdvice || "Routine medical advice provided.");
      formData.append("lang", selectedLang);

      const res = await fetch("/api/generate-soap-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to generate SOAP PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medhub_soap_${selectedLang}_${currentUser || 'patient'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      if (downloadSoapBtnText) {
        downloadSoapBtnText.textContent = t.downloadSoapSuccess;
      }
      setTimeout(() => {
        downloadSoapBtn.disabled = false;
        applyAppLanguage(selectedLang);
      }, 2800);
    } catch (err) {
      console.error("Error generating SOAP PDF:", err);
      if (downloadSoapBtnText) {
        downloadSoapBtnText.textContent = "Export Error";
      }
      setTimeout(() => {
        downloadSoapBtn.disabled = false;
        applyAppLanguage(selectedLang);
      }, 2500);
    }
  });
}

// ---------------------------------------------------------------------------
// 10. FEATURE 4: AUDIO PRESCRIPTION / VOICE READER (Web Speech API)
// ---------------------------------------------------------------------------
function cleanTextForVoice(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/\|/g, " ")
    .replace(/[*#_`]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resetAllVoiceButtons() {
  document.querySelectorAll(".bot-action-btn").forEach(btn => {
    if (btn.querySelector("span") && btn.querySelector("span").textContent.includes("Stop Audio")) {
      btn.classList.remove("active-audio");
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        <span>Listen Aloud</span>
      `;
    }
  });
  if (cockpitAudioPlayBtn) {
    cockpitAudioPlayBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      <span>Play Advice</span>
    `;
  }
}

function toggleMessageVoice(button, textToSpeak) {
  if (isVoicePlaying && activeSpeakingBtn === button) {
    stopVoiceAudio();
    return;
  }
  playVoiceAudio(textToSpeak, button);
}

function playVoiceAudio(textToSpeak, button = null) {
  if (!("speechSynthesis" in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any existing playback
  window.speechSynthesis.cancel();
  resetAllVoiceButtons();

  const text = cleanTextForVoice(textToSpeak || latestBotAdvice);
  if (!text) {
    if (audioStateBadge) {
      audioStateBadge.textContent = "NO ADVICE YET";
      setTimeout(() => { audioStateBadge.textContent = "READY"; }, 2000);
    }
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentSpeechSpeed;

  utterance.onstart = () => {
    isVoicePlaying = true;
    activeSpeakingBtn = button;
    soundwaveDisplay.classList.add("playing");
    audioStateBadge.textContent = "READING ALOUD";
    audioStateBadge.className = "status-badge emergency";

    if (button) {
      button.classList.add("active-audio");
      button.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
        <span>Stop Audio</span>
      `;
    }
    if (cockpitAudioPlayBtn) {
      cockpitAudioPlayBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
        <span>Stop Reading</span>
      `;
    }
  };

  utterance.onend = () => {
    stopVoiceAudio();
  };

  utterance.onerror = () => {
    stopVoiceAudio();
  };

  window.speechSynthesis.speak(utterance);
}

function stopVoiceAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  isVoicePlaying = false;
  activeSpeakingBtn = null;
  soundwaveDisplay.classList.remove("playing");
  audioStateBadge.textContent = "READY";
  audioStateBadge.className = "status-badge voice";
  resetAllVoiceButtons();
}

if (cockpitAudioPlayBtn) {
  cockpitAudioPlayBtn.addEventListener("click", () => {
    if (isVoicePlaying) {
      stopVoiceAudio();
    } else {
      playVoiceAudio(latestBotAdvice, null);
    }
  });
}
if (cockpitAudioStopBtn) {
  cockpitAudioStopBtn.addEventListener("click", stopVoiceAudio);
}

speedChips.forEach(chip => {
  chip.addEventListener("click", () => {
    speedChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentSpeechSpeed = parseFloat(chip.getAttribute("data-speed")) || 1.0;
    if (window.speechSynthesis.speaking) {
      playVoiceAudio(latestBotAdvice);
    }
  });
});

// ---------------------------------------------------------------------------
// 11. AUTHENTICATION (SIGN IN & SIGN UP) MODAL LOGIC
// ---------------------------------------------------------------------------
function setAuthMode(mode) {
  authMode = mode;
  const t = APP_I18N[currentAppLang] || APP_I18N.en;
  authAlert.style.display = "none";
  if (mode === "signup") {
    tabSignUp.classList.add("active");
    tabSignIn.classList.remove("active");
    authTitle.textContent = t.authSignUpTitle;
    authSubtitle.textContent = t.authSignUpSub;
    authSubmitBtn.textContent = t.authSignUpBtn;
    authSwitchText.textContent = t.authHasAccount;
    authSwitchBtn.textContent = t.authSignInBtn;
  } else {
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    authTitle.textContent = t.authSignInTitle;
    authSubtitle.textContent = t.authSignInSub;
    authSubmitBtn.textContent = t.authSignInBtn;
    authSwitchText.textContent = t.authNoAccount;
    authSwitchBtn.textContent = t.authSignUpBtn;
  }
  authPassword.value = "";
  authUsername.focus();
}

tabSignIn.addEventListener("click", () => setAuthMode("signin"));
tabSignUp.addEventListener("click", () => setAuthMode("signup"));
authSwitchBtn.addEventListener("click", () => setAuthMode(authMode === "signin" ? "signup" : "signin"));

function openAuthModal(defaultMode = "signin") {
  setAuthMode(defaultMode);
  authModal.style.display = "flex";
  if (authLangSelect) authLangSelect.value = currentAppLang;
  authUsername.value = "";
  authPassword.value = "";
  authAlert.style.display = "none";
  setTimeout(() => authUsername.focus(), 100);
}

function closeAuthModal() {
  authModal.style.display = "none";
  authAlert.style.display = "none";
}

// Close Modal Triggers (✕ button, backdrop click, Escape key)
if (closeAuthModalBtn) {
  closeAuthModalBtn.addEventListener("click", closeAuthModal);
}

authModal.addEventListener("click", (e) => {
  if (e.target === authModal) {
    closeAuthModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (currentAbortController) {
      currentAbortController.abort();
      return;
    }
    if (authModal && authModal.style.display !== "none") closeAuthModal();
    if (vaultModal && vaultModal.style.display !== "none") vaultModal.style.display = "none";
  }
});

// Continue as Guest Option
if (guestLoginBtn) {
  guestLoginBtn.addEventListener("click", () => {
    currentUser = "guest";
    localStorage.setItem("medhub_user", "guest");
    updateAuthUI();
    closeAuthModal();
  });
}

if (loginPromptBtn) {
  loginPromptBtn.addEventListener("click", () => openAuthModal("signin"));
}
if (signupPromptBtn) {
  signupPromptBtn.addEventListener("click", () => openAuthModal("signup"));
}
logoutBtn.addEventListener("click", handleLogout);

function updateAuthUI() {
  if (currentUser && currentUser !== "guest") {
    userProfile.style.display = "inline-flex";
    userNameDisplay.textContent = currentUser;
    if (authButtonsGroup) authButtonsGroup.style.display = "none";
  } else {
    // Guest or logged out
    userProfile.style.display = "none";
    userNameDisplay.textContent = "";
    if (authButtonsGroup) authButtonsGroup.style.display = "flex";
  }
}

async function handleLogout() {
  currentUser = "guest";
  localStorage.removeItem("medhub_user");
  updateAuthUI();
  messagesEl.innerHTML = "";
  welcomeEl.style.display = "flex";
  resetCockpitMetrics();
}

async function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const t = APP_I18N[currentAppLang] || APP_I18N.en;

  if (!username || !password) {
    authAlert.textContent = currentAppLang === "ta" ? "பயனர்பெயர் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்." :
      currentAppLang === "ml" ? "ഉപയോക്തൃനാമവും പാസ്‌വേഡും നൽകുക." :
      currentAppLang === "te" ? "దయచేసి యూజర్‌నేమ్ మరియు పాస్‌వర్డ్ రెండింటినీ నమోదు చేయండి." :
      currentAppLang === "kn" ? "ದಯವಿಟ್ಟು ಬಳಕೆದಾರಹೆಸರು ಮತ್ತು ಗುಪ್ತಪದ ಎರಡನ್ನೂ ನಮೂದಿಸಿ." :
      currentAppLang === "hi" ? "कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें।" :
      "Please enter both username and password.";
    authAlert.style.display = "block";
    return;
  }

  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = authMode === "signup" ? t.authCreatingVault : t.authSigningIn;

  const endpoint = authMode === "signup" ? "/api/signup" : "/api/login";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!data.success) {
      authAlert.textContent = data.error || "Authentication failed.";
      authAlert.style.display = "block";
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = authMode === "signup" ? t.authSignUpBtn : t.authSignInBtn;
      return;
    }

    currentUser = data.username;
    localStorage.setItem("medhub_user", currentUser);
    localStorage.setItem("medhub_user_lang_" + currentUser, currentAppLang);
    updateAuthUI();
    closeAuthModal();
    loadHistory();
  } catch (err) {
    console.error("Auth error:", err);
    authAlert.textContent = "Unable to connect to local server. Please verify daemon.";
    authAlert.style.display = "block";
  } finally {
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = authMode === "signup" ? t.authSignUpBtn : t.authSignInBtn;
  }
}

authForm.addEventListener("submit", handleAuthSubmit);

async function loadHistory() {
  if (!currentUser || currentUser === "guest") return;
  messagesEl.innerHTML = "";
  try {
    const res = await fetch(`/api/history?username=${encodeURIComponent(currentUser)}`);
    const data = await res.json();
    if (data.history && data.history.length > 0) {
      isFirstMessageInSession = false;
      welcomeEl.style.display = "none";
      let lastItem = null;
      data.history.forEach(item => {
        addUserMessage(item.patient, null);
        const botDiv = addMessage("", "bot");
        renderBotMessage(botDiv, item.doctor);
        lastItem = item;
      });
      if (lastItem) {
        fetch("/api/evaluate-telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: lastItem.patient,
            response: lastItem.doctor,
            username: currentUser
          })
        }).then(r => r.json()).then(payload => {
          updateCockpitDashboard(payload);
        }).catch(() => {});
      }
      chatArea.scrollTop = chatArea.scrollHeight;
    } else {
      isFirstMessageInSession = true;
      welcomeEl.style.display = "flex";
      resetCockpitMetrics();
    }
  } catch (err) {
    console.error("Error loading history:", err);
    welcomeEl.style.display = "flex";
  }
}

// Initial setup on page load: Update UI, apply language, and load history if logged in
updateAuthUI();
const savedLang = (currentUser && currentUser !== "guest" && localStorage.getItem("medhub_user_lang_" + currentUser)) || localStorage.getItem("medhub_app_lang") || "en";
applyAppLanguage(savedLang);
if (currentUser && currentUser !== "guest") {
  loadHistory();
}
