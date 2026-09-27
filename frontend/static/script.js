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
const appLangSelect = document.getElementById("appLangSelect");
const topbarLangDropdown = document.getElementById("topbarLangDropdown");
const topbarLangTrigger = document.getElementById("topbarLangTrigger");
const topbarLangCurrent = document.getElementById("topbarLangCurrent");
const topbarLangMenu = document.getElementById("topbarLangMenu");
const langOptionBtns = document.querySelectorAll(".lang-option");
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
const fdaMiniDrawer = document.getElementById("fdaMiniDrawer");
const fdaHeaderToggle = document.getElementById("fdaHeaderToggle");
const fdaChevron = document.getElementById("fdaChevron");
const fdaDrawerContent = document.getElementById("fdaDrawerContent");
const fdaBadgeText = document.getElementById("fdaBadgeText");
const fdaDrugTitle = document.getElementById("fdaDrugTitle");
const fdaDosageSnippet = document.getElementById("fdaDosageSnippet");
const fdaWarningsSnippet = document.getElementById("fdaWarningsSnippet");

// Privacy Vault Modal Elements
const vaultTitleText = document.getElementById("vaultTitleText");
const vaultSubText = document.getElementById("vaultSubText");
const vaultFeat1Text = document.getElementById("vaultFeat1Text");
const vaultFeat2Text = document.getElementById("vaultFeat2Text");
const vaultFeat3Text = document.getElementById("vaultFeat3Text");
const closeVaultModalBtnText = document.getElementById("closeVaultModalBtnText");

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
let latestTelemetryData = null;
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
const DDI_STATUS_ICONS = {
  safe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  danger: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

const LANG_DISPLAY_MAP = {
  en: "English (EN)",
  ta: "தமிழ் (TA)",
  ml: "മലയാളം (ML)",
  te: "తెలుగు (TE)",
  kn: "ಕನ್ನಡ (KN)",
  hi: "हिन्दी (HI)"
};

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
    disclaimer: "MedHub Clinical AI provides algorithmic decision support. Clinical judgment and physician verification required.",
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
    triageUrgentHeadline: "Prompt Clinical Evaluation Recommended",
    triageUrgentRec: "Schedule an urgent outpatient clinic appointment or visit a walk-in urgent care center within 24 to 48 hours.",
    triageEmergencyHeadline: "Immediate Emergency Medical Attention Required",
    triageEmergencyRec: "Call 911 (or local emergency 108) immediately. Do not attempt to drive yourself to the emergency department.",
    flagPrefix: "Flag:",
    ddiTitle: "DDI Safety Radar",
    ddiSafeBadge: "RADAR CLEAR",
    ddiWarningBadge: "WARNING",
    ddiDangerBadge: "CRITICAL CONFLICT",
    activeDrugsLabel: "Active Pharmacotherapy Identified:",
    emptyTray: "No active medications detected",
    ddiSafeTitle: "No Critical Contraindications Detected",
    ddiSafeDesc: "Active medications evaluated against the hospital interaction knowledge base with no high-risk pharmaceutical conflicts.",
    ddiWarningTitle: "Interaction Precaution Advised",
    ddiWarningDesc: "Potential cross-reactivity or altered bioavailability identified. Monitor patient symptoms or dosage spacing.",
    ddiDangerTitle: "Severe Pharmacological Conflict Detected",
    ddiDangerDesc: "Critical drug-drug interaction flagged. Immediate clinical review is required before co-administration.",
    actionTitle: "Clinical Actions & Export",
    auditBadge: "AUDIT READY",
    soapLangLabel: "Report Language",
    downloadSoapBtn: "Download S.O.A.P. Summary (PDF)",
    downloadSoapLoading: "Synthesizing Audit PDF...",
    downloadSoapSuccess: "Downloaded SOAP Note!",
    soapS: "Subjective",
    soapS_Full: "Subjective",
    soapO_Full: "Objective",
    soapA_Full: "Assessment",
    soapP_Full: "Plan",
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
    fdaBadge: "NDC Grounded",
    fdaDrugTitle: "Clinical Matrix Grounding",
    fdaPrescribingTitle: "FDA Prescribing & Administration:",
    fdaDosageSnippet: "Verified against local clinical pharmacological database and openFDA regulatory label guidelines.",
    fdaWarningsTitle: "Safety Warnings & Precautions:",
    fdaWarningsSnippet: "Standard clinical precautions apply. Monitor patient tolerance and renal clearance parameters.",
    listenAloud: "Listen Aloud",
    copy: "Copy",
    copied: "Copied!",
    downloadSchedule: "Download Schedule PDF",
    genSchedulePdf: "Generating Schedule PDF...",
    downloadedSchedule: "Downloaded!",
    errorSchedulePdf: "Error downloading PDF",
    generationStopped: "Consultation generation stopped by user.",
    chatError: "Something went wrong while connecting to the local inference vault. Please try again.",
    vaultTitle: "100% On-Premise HIPAA Privacy Vault",
    vaultSub: "Zero Cloud Data Transmission • Air-Gapped Medical Confidentiality",
    vaultFeat1Title: "100% Local GPU Execution",
    vaultFeat1Desc: "Every diagnostic query, uploaded prescription, and patient symptom is computed locally on dedicated on-premises hardware (NVIDIA B200 178GB). No data is ever sent to third-party commercial clouds.",
    vaultFeat2Title: "HIPAA & HITECH Architecture",
    vaultFeat2Desc: "Complies with strict Protected Health Information (PHI) air-gap requirements. Memory caches are isolated per user session with instant zero-retention wiping capabilities.",
    vaultFeat3Title: "No Third-Party Telemetry",
    vaultFeat3Desc: "Diagnostic consultations and medical histories remain strictly sovereign within the hospital's private intranet perimeter.",
    vaultCloseBtn: "Close Privacy Audit",
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
    disclaimer: "MedHub மருத்துவ AI முடிவெடுக்கும் ஆதரவை வழங்குகிறது. மருத்துவரின் சரிபார்ப்பு கட்டாயமாகும்.",
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
    triageUrgentHeadline: "விரைவான மருத்துவ பரிசோதனை பரிந்துரைக்கப்படுகிறது",
    triageUrgentRec: "24 முதல் 48 மணி நேரத்திற்குள் மருத்துவரை அல்லது அவசர சிகிச்சை மையத்தை அணுகவும்.",
    triageEmergencyHeadline: "உடனடி அவசர மருத்துவ சிகிச்சை தேவை",
    triageEmergencyRec: "உடனடியாக 108 அவசர ஆம்புலன்ஸ் சேவையை அழைக்கவும். நீங்களாக வாகனம் ஓட்ட வேண்டாம்.",
    flagPrefix: "அறிகுறி:",
    ddiTitle: "மருந்து இடைவினை பாதுகாப்பு ரேடார்",
    ddiSafeBadge: "ரேடார் தெளிவு",
    ddiWarningBadge: "எச்சரிக்கை",
    ddiDangerBadge: "முரண்பாடு கண்டறியப்பட்டது",
    activeDrugsLabel: "கண்டறியப்பட்ட மருந்துகள்:",
    emptyTray: "மருந்துகள் எதுவும் கண்டறியப்படவில்லை",
    ddiSafeTitle: "முரண்பாடுகள் எதுவும் கண்டறியப்படவில்லை",
    ddiSafeDesc: "மருத்துவமனை தரவுத்தளத்தில் மருந்துகள் சரிபார்க்கப்பட்டு ஆபத்தான முரண்பாடுகள் இல்லை என உறுதிசெய்யப்பட்டது.",
    ddiWarningTitle: "மருந்து பயன்பாட்டில் எச்சரிக்கை தேவை",
    ddiWarningDesc: "மருந்துகளிடையே மிதமான எதிர்வினை சாத்தியம் உள்ளது. அறிகுறிகள் மற்றும் நேர இடைவெளியைக் கண்காணிக்கவும்.",
    ddiDangerTitle: "கடுமையான மருந்து முரண்பாடு கண்டறியப்பட்டுள்ளது",
    ddiDangerDesc: "உயிருக்கு ஆபத்தான மருந்து முரண்பாடு. ஒன்றாக உட்கொள்வதற்கு முன் உடனடியாக மருத்துவரை அணுகவும்.",
    actionTitle: "மருத்துவ நடவடிக்கைகள் & ஏற்றுமதி",
    auditBadge: "ஆய்வுக்குத் தயார்",
    soapLangLabel: "அறிக்கை மொழி",
    downloadSoapBtn: "S.O.A.P. பதிவிறக்கு (தமிழ் PDF)",
    downloadSoapLoading: "தமிழ் அறிக்கை தயாராகிறது...",
    downloadSoapSuccess: "பதிவிறக்கம் முடிந்தது!",
    soapS: "அகநிலை",
    soapS_Full: "அகநிலை (Subjective)",
    soapO_Full: "புறநிலை (Objective)",
    soapA_Full: "மதிப்பீடு (Assessment)",
    soapP_Full: "திட்டம் (Plan)",
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
    fdaBadge: "NDC சரிபார்க்கப்பட்டது",
    fdaDrugTitle: "மருத்துவ தரவுத்தள ஆதாரம்",
    fdaPrescribingTitle: "FDA மருந்து பரிந்துரை & பயன்பாடு:",
    fdaDosageSnippet: "உள்ளூர் மருத்துவ மருந்தியல் தரவுத்தளம் மற்றும் openFDA வழிகாட்டுதல்களின்படி சரிபார்க்கப்பட்டது.",
    fdaWarningsTitle: "பாதுகாப்பு எச்சரிக்கைகள் & முன்னெச்சரிக்கைகள்:",
    fdaWarningsSnippet: "நிலையான மருத்துவ முன்னெச்சரிக்கைகள் பொருந்தும். நோயாளியின் சகிப்புத்தன்மை மற்றும் சிறுநீரக செயல்பாட்டைக் கண்காணிக்கவும்.",
    listenAloud: "ஆடியோ கேள்",
    copy: "நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    downloadSchedule: "மருந்து அட்டவணை PDF",
    genSchedulePdf: "அட்டவணை PDF தயாராகிறது...",
    downloadedSchedule: "பதிவிறக்கம் முடிந்தது!",
    errorSchedulePdf: "PDF பதிவிறக்கப் பிழை",
    generationStopped: "பயனரால் ஆலோசனை உருவாக்கம் நிறுத்தப்பட்டது.",
    chatError: "உள்ளூர் அனுமான இயந்திரத்துடன் இணைப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    vaultTitle: "100% உள்ளூர் HIPAA தனியுரிமைப் பெட்டகம்",
    vaultSub: "மேகக்கணி பரிமாற்றம் இல்லை • முழு மருத்துவ இரகசியத்தன்மை",
    vaultFeat1Title: "100% உள்ளூர் GPU இயக்கம்",
    vaultFeat1Desc: "ஒவ்வொரு மருத்துவக் கேள்வியும், பதிவேற்றப்பட்ட மருந்துச் சீட்டும் உள்ளூர் வன்பொருளில் மட்டுமே கணக்கிடப்படுகிறது. எந்தத் தரவும் மூன்றாம் தரப்பு மேகக்கணிக்கு அனுப்பப்படுவதில்லை.",
    vaultFeat2Title: "HIPAA & HITECH பாதுகாப்பு கட்டமைப்பு",
    vaultFeat2Desc: "பாதுகாக்கப்பட்ட சுகாதாரத் தகவல் (PHI) நெறிமுறைகளுக்கு முழுமையாக இணங்குகிறது. அமர்வு முடிந்ததும் நினைவகம் உடனடியாக அழிக்கப்படுகிறது.",
    vaultFeat3Title: "மூன்றாம் தரப்பு கண்காணிப்பு இல்லை",
    vaultFeat3Desc: "மருத்துவ ஆலோசனைகள் மற்றும் நோயாளியின் வரலாறு அனைத்தும் மருத்துவமனையின் உள்ளகப் பாதுகாப்பு எல்லைக்குள்ளேயே பாதுகாப்பாக இருக்கும்.",
    vaultCloseBtn: "தனியுரிமை தணிக்கையை மூடுக",
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
    disclaimer: "MedHub ക്ലിനിക്കൽ AI തീരുമാന പിന്തുണ നൽകുന്നു. ഡോക്ടറുടെ പരിശോധന അത്യന്താപേക്ഷിതമാണ്.",
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
    triageUrgentHeadline: "ഉടൻ തന്നെ ഡോക്ടറെ കണ്ട് പരിശോധന നടത്തുക",
    triageUrgentRec: "24 മുതൽ 48 മണിക്കൂറിനുള്ളിൽ ക്ലിനിക്കിലോ ആശുപത്രിയിലോ പരിശോധന നടത്തുക.",
    triageEmergencyHeadline: "ഉടനടി അടിയന്തിര വൈദ്യസഹായം ആവശ്യമാണ്",
    triageEmergencyRec: "ഉടൻ തന്നെ 108/ആംബുലൻസ് വിളിക്കുക. സ്വയം വാഹനം ഓടിച്ച് പോകരുത്.",
    flagPrefix: "ലക്ഷണം:",
    ddiTitle: "മരുന്ന് പ്രതിപ്രവർത്തന സുരക്ഷാ റഡാർ",
    ddiSafeBadge: "റഡാർ ക്ലിയർ",
    ddiWarningBadge: "മുന്നറിയിപ്പ്",
    ddiDangerBadge: "ഗുരുതര പ്രതിസന്ധി",
    activeDrugsLabel: "കണ്ടെത്തിയ സജീവ മരുന്നുകൾ:",
    emptyTray: "സജീവ മരുന്നുകളൊന്നും കണ്ടെത്തിയില്ല",
    ddiSafeTitle: "ഗുരുതരമായ പ്രതിപ്രവർത്തനങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    ddiSafeDesc: "ആശുപത്രി ഡാറ്റാബേസ് പരിശോധിച്ചതിൽ ഉയർന്ന അപകടസാധ്യതയുള്ള പ്രതിപ്രവർത്തനങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",
    ddiWarningTitle: "മരുന്ന് ഉപയോഗത്തിൽ ജാഗ്രത ആവശ്യമാണ്",
    ddiWarningDesc: "മിതമായ പ്രതിപ്രവർത്തന സാധ്യതയുണ്ട്. ലക്ഷണങ്ങളും സമയക്രമവും നിരീക്ഷിക്കുക.",
    ddiDangerTitle: "ഗുരുതരമായ മരുന്ന് പ്രതിപ്രവർത്തനം കണ്ടെത്തി",
    ddiDangerDesc: "ഗുരുതരമായ മരുന്ന് പ്രതിപ്രവർത്തനം. ഒരുമിച്ച് കഴിക്കുന്നതിന് മുൻപ് ഉടൻ ഡോക്ടറെ കാണുക.",
    actionTitle: "ക്ലിനിക്കൽ നടപടികളും കയറ്റുമതിയും",
    auditBadge: "ഓഡിറ്റ് തയ്യാർ",
    soapLangLabel: "റിപ്പോർട്ട് ഭാഷ",
    downloadSoapBtn: "S.O.A.P. ഡൗൺലോഡ് (മലയാളം PDF)",
    downloadSoapLoading: "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു...",
    downloadSoapSuccess: "ഡൗൺലോഡ് ചെയ്തു!",
    soapS: "സബ്ജക്റ്റീവ്",
    soapS_Full: "സബ്ജക്റ്റീവ് (Subjective)",
    soapO_Full: "ഒബ്ജക്റ്റീവ് (Objective)",
    soapA_Full: "അസസ്സ്മെന്റ് (Assessment)",
    soapP_Full: "പ്ലാൻ (Plan)",
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
    fdaBadge: "NDC പരിശോധിച്ചു",
    fdaDrugTitle: "ക്ലിനിക്കൽ മാട്രിക്സ് ആധാരം",
    fdaPrescribingTitle: "FDA നിർദ്ദേശവും ഉപയോഗവും:",
    fdaDosageSnippet: "പ്രാദേശിക ക്ലിനിക്കൽ ഫാർമക്കോളജിക്കൽ ഡാറ്റാബേസും openFDA മാർഗ്ഗനിർദ്ദേശങ്ങളും അനുസരിച്ച് പരിശോധിച്ചു.",
    fdaWarningsTitle: "സുരക്ഷാ മുന്നറിയിപ്പുകളും മുൻകരുതലുകളും:",
    fdaWarningsSnippet: "സാധാരണ ക്ലിനിക്കൽ മുൻകരുതലുകൾ ബാധകമാണ്. രോഗിയുടെ സഹിഷ്ണുതയും വൃക്കകളുടെ പ്രവർത്തനവും നിരീക്ഷിക്കുക.",
    listenAloud: "ഉപദേശം കേൾക്കുക",
    copy: "പകർത്തുക",
    copied: "പകർത്തി!",
    downloadSchedule: "ഷെഡ്യൂൾ PDF ഡൗൺലോഡ്",
    genSchedulePdf: "ഷെഡ്യൂൾ PDF തയ്യാറാക്കുന്നു...",
    downloadedSchedule: "ഡൗൺലോഡ് ചെയ്തു!",
    errorSchedulePdf: "PDF ഡൗൺലോഡ് പിശക്",
    generationStopped: "ഉപയോക്താവ് ജനറേഷൻ നിർത്തിവെച്ചു.",
    chatError: "പ്രാദേശിക ഇൻഫറൻസ് സെർവറിലേക്ക് ബന്ധിപ്പിക്കുന്നതിൽ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",
    vaultTitle: "100% പ്രാദേശിക HIPAA സ്വകാര്യതാ നിലവറ",
    vaultSub: "ക്ലൗഡ് ഡാറ്റാ കൈമാറ്റം ഇല്ല • എയർ-ഗാപ്പ്ഡ് മെഡിക്കൽ രഹസ്യാത്മകത",
    vaultFeat1Title: "100% പ്രാദേശിക GPU പ്രവർത്തനം",
    vaultFeat1Desc: "എല്ലാ ഡയഗ്നോസ്റ്റിക് ചോദ്യങ്ങളും മെഡിക്കൽ പ്രിസ്ക്രിപ്ഷനുകളും പ്രാദേശിക ഹാർഡ്‌വെയറിൽ മാത്രമാണ് പ്രോസസ്സ് ചെയ്യുന്നത്. ഡാറ്റ ക്ലൗഡിലേക്ക് അയക്കുന്നില്ല.",
    vaultFeat2Title: "HIPAA & HITECH സുരക്ഷാ ഘടന",
    vaultFeat2Desc: "കർശനമായ PHI മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു. ഓരോ സെഷനിലെയും വിവരങ്ങൾ പൂർണ്ണമായി മായ്ച്ചുകളയപ്പെടുന്നു.",
    vaultFeat3Title: "മൂന്നാം കക്ഷി ടെലിമെട്രി ഇല്ല",
    vaultFeat3Desc: "കൺസൾട്ടേഷനുകളും മെഡിക്കൽ ചരിത്രവും ആശുപത്രിയുടെ ആന്തരിക ശൃംഖലയ്ക്കുള്ളിൽ പൂർണ്ണമായും സുരക്ഷിതമായിരിക്കും.",
    vaultCloseBtn: "ഓഡിറ്റ് അടയ്ക്കുക",
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
    disclaimer: "MedHub క్లినికల్ AI నిర్ణయ మద్దతును అందిస్తుంది. వైద్యుల ధృవీకరణ తప్పనిసరి.",
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
    triageUrgentHeadline: "త్వరిత క్లినికల్ మూల్యాంకనం సిఫార్సు చేయబడింది",
    triageUrgentRec: "24 నుండి 48 గంటల్లో క్లినిక్ లేదా అత్యవసర సంరక్షణ కేంద్రాన్ని సందర్శించండి.",
    triageEmergencyHeadline: "వెంటనే అత్యవసర వైద్య సంరక్షణ అవసరం",
    triageEmergencyRec: "వెంటనే 108/అత్యవసర సేవలకు కాల్ చేయండి. మీరే స్వయంగా డ్రైవ్ చేయవద్దు.",
    flagPrefix: "ఫ్లాగ్:",
    ddiTitle: "ఔషధ పరస్పర చర్య భద్రతా రాడార్",
    ddiSafeBadge: "రాడార్ స్పష్టం",
    ddiWarningBadge: "హెచ్చరిక",
    ddiDangerBadge: "తీవ్ర సంఘర్షణ",
    activeDrugsLabel: "గుర్తించబడిన క్రియాశీల మందులు:",
    emptyTray: "ఎటువంటి మందులు కనుగొనబడలేదు",
    ddiSafeTitle: "ఎటువంటి తీవ్రమైన వ్యతిరేకతలు కనుగొనబడలేదు",
    ddiSafeDesc: "ఆసుపత్రి నాలెడ్జ్ బేస్‌తో పోల్చినప్పుడు ఎటువంటి అధిక-ప్రమాదకర ఔషధ సంఘర్షణలు లేవు.",
    ddiWarningTitle: "పరస్పర చర్య జాగ్రత్త సిఫార్సు చేయబడింది",
    ddiWarningDesc: "మితమైన ప్రతిచర్య అవకాశం ఉంది. లక్షణాలు మరియు మోతాదు విరామాలను గమనించండి.",
    ddiDangerTitle: "తీవ్రమైన ఔషధ సంఘర్షణ గుర్తించబడింది",
    ddiDangerDesc: "తీవ్రమైన ఔషధ పరస్పర చర్య. కలిపి తీసుకోవడానికి ముందు వెంటనే వైద్యుడిని సంప్రదించండి.",
    actionTitle: "క్లినికల్ చర్యలు & ఎగుమతి",
    auditBadge: "ఆడిట్‌కు సిద్ధం",
    soapLangLabel: "నివేదిక భాష",
    downloadSoapBtn: "S.O.A.P. డౌన్‌లోడ్ (తెలుగు PDF)",
    downloadSoapLoading: "నివేదిక సిద్ధమవుతోంది...",
    downloadSoapSuccess: "డౌన్‌లోడ్ పూర్తయింది!",
    soapS: "సబ్జెక్టివ్",
    soapS_Full: "సబ్జెక్టివ్ (Subjective)",
    soapO_Full: "ఆబ్జెక్టివ్ (Objective)",
    soapA_Full: "అంచనా (Assessment)",
    soapP_Full: "ప్రణాళిక (Plan)",
    soapO: "ఆబ్జెక్టివ్",
    soapA: "అంచనా",
    soapP: "ప్రణాళిక",
    soapDefaultS: "రోగి ఫిర్యాదు కోసం వేచి చూస్తోంది...",
    soapDefaultO: "ట్రయేజ్ వర్గీకరణ & ఔషధ పరీక్ష",
    soapDefaultA: "క్లినికల్ అభిప్రాయం & పరస్పర చర్య ప్రమాదం",
    soapDefaultP: "యాక్షన్ ప్రోటోకాల్ & డాక్టర్ ఫాలో-అప్",
    playAdvice: "సలహా వినండి",
    stopAdvice: "ఆపు",
    audioReadyBadge: "సిద్ధం",
    audioPlayingBadge: "ప్లే అవుతోంది",
    fdaHeader: "OpenFDA నియంత్రణ ఆధారం",
    fdaBadge: "NDC ధృవీకరించబడింది",
    fdaDrugTitle: "క్లినికల్ మ్యాట్రిక్స్ ఆధారం",
    fdaPrescribingTitle: "FDA ప్రిస్క్రిప్షన్ & నిర్వహణ:",
    fdaDosageSnippet: "స్థానిక క్లినికల్ ఫార్మకాలజికల్ డేటాబేస్ మరియు openFDA మార్గదర్శకాల ప్రకారం ధృవీకరించబడింది.",
    fdaWarningsTitle: "భద్రతా హెచ్చరికలు & జాగ్రత్తలు:",
    fdaWarningsSnippet: "ప్రామాణిక క్లినికల్ జాగ్రత్తలు వర్తిస్తాయి. రోగి సహనశీలత మరియు మూత్రపిండాల పనితీరును పర్యవేక్షించండి.",
    listenAloud: "వినండి",
    copy: "కాపీ చేయండి",
    copied: "కాపీ చేయబడింది!",
    downloadSchedule: "షెడ్యూల్ PDF డౌన్‌లోడ్",
    genSchedulePdf: "షెడ్యూల్ PDF సిద్ధమవుతోంది...",
    downloadedSchedule: "డౌన్‌లోడ్ పూర్తయింది!",
    errorSchedulePdf: "PDF డౌన్‌లోడ్ లోపం",
    generationStopped: "వినియోగదారు ఉత్పత్తిని నిలిపివేశారు.",
    chatError: "స్థానిక సర్వర్‌ను కనెక్ట్ చేయడంలో లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    vaultTitle: "100% స్థానిక HIPAA గోప్యతా వాల్ట్",
    vaultSub: "క్లౌడ్ డేటా ప్రసారం లేదు • పూర్తి వైద్య గోప్యత",
    vaultFeat1Title: "100% స్థానిక GPU ఎగ్జిక్యూషన్",
    vaultFeat1Desc: "ప్రతి రోగనిర్ధారణ ప్రశ్న మరియు ప్రిస్క్రిప్షన్ స్థానిక హార్డ్‌వేర్‌లో మాత్రమే ప్రాసెస్ చేయబడుతుంది. డేటా బయటకు పంపబడదు.",
    vaultFeat2Title: "HIPAA & HITECH భద్రతా నిర్మాణం",
    vaultFeat2Desc: "కఠినమైన PHI ప్రమాణాలకు కట్టుబడి ఉంటుంది. ప్రతి సెషన్ పూర్తయిన వెంటనే మెమరీ క్లియర్ అవుతుంది.",
    vaultFeat3Title: "థర్డ్-పార్టీ టెలిమెట్రీ లేదు",
    vaultFeat3Desc: "వైద్య సంప్రదింపులు మరియు రికార్డులు ఆసుపత్రి అంతర్గత నెట్‌వర్క్‌లోనే సురక్షితంగా ఉంటాయి.",
    vaultCloseBtn: "ఆడిట్‌ను మూసివేయండి",
    authLangLabel: "ఇష్టపడే భాష / Preferred Language",
    authUsernameLabel: "క్లినీషియన్ / పేషెంట్ ID",
    authUsernamePlaceholder: "ఉదా. siva",
    authPasswordLabel: "వాల్ట్ పాస్‌వర్డ్",
    authPasswordPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
    authSignInTitle: "క్లినికల్ సైన్ ఇన్",
    authSignInSub: "మీ ప్రైవేట్ సంప్రదింపుల వాల్ట్‌ను యాక్సెస్ చేయడానికి వివరాలను నమోదు చేయండి",
    authSignInBtn: "కాక్‌పిట్‌కు సైన్ ఇన్ చేయండి",
    authSignUpTitle: "మెడికల్ వాల్ట్ సృష్టించండి",
    authSignUpSub: "రికార్డులను భద్రపరచడానికి సురక్షిత వినియోగదారు పేరు మరియు పాస్‌వర్డ్‌ను నమోదు చేయండి",
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
    inputPlaceholder: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ, ಔಷಧೀಯ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ ಅಥವಾ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ...",
    stopBtn: "ನಿಲ್ಲಿಸು",
    disclaimer: "MedHub ಕ್ಲಿನಿಕಲ್ AI ನಿರ್ಧಾರ ಬೆಂಬಲವನ್ನು ನೀಡುತ್ತದೆ. ವೈದ್ಯರ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.",
    dashTitle: "ಕ್ಲಿನಿಕಲ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಸುರಕ್ಷತೆ",
    dashSub: "ನೈಜ-ಸಮಯದ ಅಲ್ಗಾರಿದಮಿಕ್ ನಿರ್ಧಾರ ಬೆಂಬಲ",
    triageTitle: "ತುರ್ತು ಟ್ರಯಾಜ್ (ESI)",
    triageRoutineBadge: "ವಾಡಿಕೆಯ ಆರೈಕೆ",
    triageUrgentBadge: "ತುರ್ತು ಆರೈಕೆ",
    triageEmergencyBadge: "ತುರ್ತು ಕೊಠಡಿ (ER)",
    meterRoutine: "ಸಾಮಾನ್ಯ",
    meterUrgent: "ತುರ್ತು (24-48 ಗಂ)",
    meterER: "ತುರ್ತು ಕೊಠಡಿ (ER)",
    triageDefaultHeadline: "ಪ್ರಮಾಣಿತ ಮನೆ ಆರೈಕೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ",
    triageDefaultRec: "ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ, ನೀರು ಸೇವಿಸಿ. 5-7 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ರೋಗಲಕ್ಷಣಗಳು ಮುಂದುವರಿದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
    triageUrgentHeadline: "ಶೀಘ್ರ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    triageUrgentRec: "24 ರಿಂದ 48 ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ಲಿನಿಕ್ ಅಥವಾ ತುರ್ತು ಆರೈಕೆ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.",
    triageEmergencyHeadline: "ತಕ್ಷಣದ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಅಗತ್ಯವಿದೆ",
    triageEmergencyRec: "ತಕ್ಷಣವೇ 108 ತುರ್ತು ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ. ನೀವೇ ವಾಹನ ಚಾಲನೆ ಮಾಡಬೇಡಿ.",
    flagPrefix: "ಗುರುತು:",
    ddiTitle: "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆ ಸುರಕ್ಷತಾ ರಾಡಾರ್",
    ddiSafeBadge: "ರಾಡಾರ್ ಸ್ಪಷ್ಟ",
    ddiWarningBadge: "ಎಚ್ಚರಿಕೆ",
    ddiDangerBadge: "ಗಂಭೀರ ಸಂಘರ್ಷ",
    activeDrugsLabel: "ಗುರುತಿಸಲಾದ ಸಕ್ರಿಯ ಔಷಧಿಗಳು:",
    emptyTray: "ಯಾವುದೇ ಔಷಧಿಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ",
    ddiSafeTitle: "ಯಾವುದೇ ಗಂಭೀರ ಪ್ರತಿಕೂಲತೆ ಕಂಡುಬಂದಿಲ್ಲ",
    ddiSafeDesc: "ಆಸ್ಪತ್ರೆ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿದಾಗ ಯಾವುದೇ ಹೆಚ್ಚಿನ ಅಪಾಯದ ಔಷಧೀಯ ಸಂಘರ್ಷಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    ddiWarningTitle: "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆಯ ಎಚ್ಚರಿಕೆ ಅಗತ್ಯವಿದೆ",
    ddiWarningDesc: "ಮಧ್ಯಮ ಪ್ರತಿಕ್ರಿಯೆಯ ಸಾಧ್ಯತೆಯಿದೆ. ರೋಗಲಕ್ಷಣಗಳು ಮತ್ತು ಸಮಯದ ಅಂತರವನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    ddiDangerTitle: "ತೀವ್ರವಾದ ಔಷಧೀಯ ಸಂಘರ್ಷ ಪತ್ತೆಯಾಗಿದೆ",
    ddiDangerDesc: "ಅಪಾಯಕಾರಿ ಔಷಧೀಯ ಸಂಘರ್ಷ. ಒಟ್ಟಿಗೆ ಸೇವಿಸುವ ಮೊದಲು ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    actionTitle: "ಕ್ಲಿನಿಕಲ್ ಕ್ರಮಗಳು ಮತ್ತು ರಫ್ತು",
    auditBadge: "ಆಡಿಟ್‌ಗೆ ಸಿದ್ಧ",
    soapLangLabel: "ವರದಿ ಭಾಷೆ",
    downloadSoapBtn: "S.O.A.P. ಡೌನ್‌ಲೋಡ್ (ಕನ್ನಡ PDF)",
    downloadSoapLoading: "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    downloadSoapSuccess: "ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
    soapS: "ಸಬ್ಜೆಕ್ಟಿವ್",
    soapS_Full: "ಸಬ್ಜೆಕ್ಟಿವ್ (Subjective)",
    soapO_Full: "ಆಬ್ಜೆಕ್ಟಿವ್ (Objective)",
    soapA_Full: "ಮೌಲ್ಯಮಾಪನ (Assessment)",
    soapP_Full: "ಯೋಜನೆ (Plan)",
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
    fdaBadge: "NDC ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    fdaDrugTitle: "ಕ್ಲಿನಿಕಲ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಆಧಾರ",
    fdaPrescribingTitle: "FDA ಶಿಫಾರಸು ಮತ್ತು ಬಳಕೆ:",
    fdaDosageSnippet: "ಸ್ಥಳೀಯ ಕ್ಲಿನಿಕಲ್ ಫಾರ್ಮಾಕಾಲಾಜಿಕಲ್ ಡೇಟಾಬೇಸ್ ಮತ್ತು openFDA ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    fdaWarningsTitle: "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು:",
    fdaWarningsSnippet: "ಪ್ರಮಾಣಿತ ವೈದ್ಯಕೀಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಅನ್ವಯಿಸುತ್ತವೆ. ರೋಗಿಯ ಸಹಿಷ್ಣುತೆ ಮತ್ತು ಮೂತ್ರಪಿಂಡದ ಕ್ರಿಯೆಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    listenAloud: "ಆಲಿಸಿ",
    copy: "ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    downloadSchedule: "ವೇಳಾಪಟ್ಟಿ PDF ಡೌನ್‌ಲೋಡ್",
    genSchedulePdf: "ವೇಳಾಪಟ್ಟಿ PDF ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    downloadedSchedule: "ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
    errorSchedulePdf: "PDF ಡೌನ್‌ಲೋಡ್ ದೋಷ",
    generationStopped: "ಬಳಕೆದಾರರಿಂದ ಸಲಹೆ ರಚನೆ ನಿಲ್ಲಿಸಲಾಗಿದೆ.",
    chatError: "ಸ್ಥಳೀಯ ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    vaultTitle: "100% ಸ್ಥಳೀಯ HIPAA ಗೌಪ್ಯತೆ ವಾಲ್ಟ್",
    vaultSub: "ಕ್ಲೌಡ್ ಡೇಟಾ ಪ್ರಸರಣವಿಲ್ಲ • ಸಂಪೂರ್ಣ ವೈದ್ಯಕೀಯ ಗೌಪ್ಯತೆ",
    vaultFeat1Title: "100% ಸ್ಥಳೀಯ GPU ಕಾರ್ಯಾಚರಣೆ",
    vaultFeat1Desc: "ಪ್ರತಿಯೊಂದು ರೋಗನಿರ್ಣಯದ ಪ್ರಶ್ನೆ ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅನ್ನು ಸ್ಥಳೀಯ ಹಾರ್ಡ್‌ವೇರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ. ಡೇಟಾವನ್ನು ಹೊರಗೆ ಕಳುಹಿಸುವುದಿಲ್ಲ.",
    vaultFeat2Title: "HIPAA ಮತ್ತು HITECH ವಾಸ್ತುಶಿಲ್ಪ",
    vaultFeat2Desc: "ಕಟ್ಟುನಿಟ್ಟಾದ PHI ನಿಯಮಗಳಿಗೆ ಬದ್ಧವಾಗಿದೆ. ಪ್ರತಿ ಸೆಷನ್ ನಂತರ ಮೆಮೊರಿಯನ್ನು ತಕ್ಷಣವೇ ಅಳಿಸಲಾಗುತ್ತದೆ.",
    vaultFeat3Title: "ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಟೆಲಿಮೆಟ್ರಿ ಇಲ್ಲ",
    vaultFeat3Desc: "ವೈದ್ಯಕೀಯ ಸಮಾಲೋಚನೆಗಳು ಮತ್ತು ಇತಿಹಾಸಗಳು ಆಸ್ಪತ್ರೆಯ ಆಂತರಿಕ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.",
    vaultCloseBtn: "ಆಡಿಟ್ ಮುಚ್ಚಿ",
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
    disclaimer: "MedHub क्लिनिकल AI निर्णय समर्थन प्रदान करता है। चिकित्सक का सत्यापन अनिवार्य है।",
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
    triageUrgentHeadline: "शीघ्र चिकित्सकीय परामर्श की सिफारिश की जाती है",
    triageUrgentRec: "24 से 48 घंटों के भीतर किसी क्लिनिक या डॉक्टर से परामर्श अवश्य लें।",
    triageEmergencyHeadline: "तत्काल आपातकालीन चिकित्सा सहायता आवश्यक",
    triageEmergencyRec: "तुरंत आपातकालीन एम्बुलेंस (108) को कॉल करें। स्वयं वाहन न चलाएं।",
    flagPrefix: "संकेत:",
    ddiTitle: "दवा पारस्परिक क्रिया सुरक्षा रडार",
    ddiSafeBadge: "रडार सुरक्षित",
    ddiWarningBadge: "चेतावनी",
    ddiDangerBadge: "गंभीर टकराव",
    activeDrugsLabel: "पहचानी गई सक्रिय औषधियां:",
    emptyTray: "कोई सक्रिय दवा नहीं मिली",
    ddiSafeTitle: "कोई गंभीर विरोधाभास नहीं मिला",
    ddiSafeDesc: "सक्रिय दवाओं का अस्पताल ज्ञानकोष से मिलान किया गया, कोई उच्च-जोखिम पारस्परिक टकराव नहीं मिला।",
    ddiWarningTitle: "औषधि परस्पर प्रभाव सावधानी अनुशंसित",
    ddiWarningDesc: "संभावित परस्पर क्रिया पाई गई है। रोगी के लक्षणों या खुराक के अंतराल की निगरानी करें।",
    ddiDangerTitle: "गंभीर औषधीय टकराव का पता चला",
    ddiDangerDesc: "गंभीर दवा अंतर्क्रिया पाई गई। साथ में लेने से पहले तत्काल डॉक्टर से संपर्क करें।",
    actionTitle: "क्लिनिकल क्रियाएं और निर्यात",
    auditBadge: "ऑडिट तैयार",
    soapLangLabel: "रिपोर्ट भाषा",
    downloadSoapBtn: "S.O.A.P. सारांश डाउनलोड (हिन्दी PDF)",
    downloadSoapLoading: "हिन्दी रिपोर्ट तैयार हो रही है...",
    downloadSoapSuccess: "डाउनलोड पूरा हुआ!",
    soapS: "व्यक्तिपरक",
    soapS_Full: "व्यक्तिपरक (Subjective)",
    soapO_Full: "वस्तुपरक (Objective)",
    soapA_Full: "मूल्यांकन (Assessment)",
    soapP_Full: "योजना (Plan)",
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
    fdaBadge: "NDC सत्यापित",
    fdaDrugTitle: "क्लिनिकल मैट्रिक्स आधार",
    fdaPrescribingTitle: "FDA नुस्खा और व्यवस्थापन:",
    fdaDosageSnippet: "स्थानीय क्लिनिकल औषधीय डेटाबेस और openFDA लेबल दिशानिर्देशों के तहत सत्यापित।",
    fdaWarningsTitle: "सुरक्षा चेतावनियां और सावधानियां:",
    fdaWarningsSnippet: "मानक चिकित्सीय सावधानियां लागू होती हैं। रोगी की सहनशीलता और गुर्दे की कार्यप्रणाली की निगरानी करें।",
    listenAloud: "सुनें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    downloadSchedule: "शेड्यूल PDF डाउनलोड",
    genSchedulePdf: "शेड्यूल PDF तैयार हो रहा है...",
    downloadedSchedule: "डाउनलोड पूरा हुआ!",
    errorSchedulePdf: "PDF डाउनलोड त्रुटि",
    generationStopped: "परामर्श जनरेशन रोक दिया गया।",
    chatError: "स्थानीय इनफरेंस इंजन से कनेक्ट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    vaultTitle: "100% ऑन-प्रेमिस HIPAA गोपनीयता वॉल्ट",
    vaultSub: "शून्य क्लाउड डेटा ट्रांसमिशन • एयर-गैप्ड चिकित्सीय गोपनीयता",
    vaultFeat1Title: "100% स्थानीय GPU निष्पादन",
    vaultFeat1Desc: "प्रत्येक नैदानिक प्रश्न और नुस्खा स्थानीय हार्डवेयर पर ही संसाधित किया जाता है। कोई डेटा तृतीय-पक्ष क्लाउड पर नहीं भेजा जाता।",
    vaultFeat2Title: "HIPAA और HITECH वास्तुकला",
    vaultFeat2Desc: "सख्त PHI नियमों का अनुपालन करता है। सत्र समाप्त होने पर मेमोरी तुरंत सुरक्षित रूप से साफ हो जाती है।",
    vaultFeat3Title: "कोई तृतीय-पक्ष टेलीमेट्री नहीं",
    vaultFeat3Desc: "परामर्श और चिकित्सीय इतिहास अस्पताल के निजी आंतरिक नेटवर्क में पूरी तरह सुरक्षित रहते हैं।",
    vaultCloseBtn: "ऑडिट बंद करें",
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

function setTopbarLangDisplay(lang) {
  const code = (lang || "en").toLowerCase();
  if (topbarLangCurrent) {
    topbarLangCurrent.textContent = LANG_DISPLAY_MAP[code] || "English (EN)";
  }
  if (langOptionBtns) {
    langOptionBtns.forEach(btn => {
      const btnLang = btn.getAttribute("data-lang");
      if (btnLang === code) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

// Custom Green Language Selector Dropdown Event Listeners (Always responsive & solid)
function toggleLangDropdown(forceOpen) {
  if (!topbarLangMenu || !topbarLangTrigger) return;
  const isCurrentlyOpen = topbarLangMenu.classList.contains("open") && topbarLangMenu.style.display === "flex";
  const shouldOpen = (typeof forceOpen === "boolean") ? forceOpen : !isCurrentlyOpen;

  if (shouldOpen) {
    topbarLangMenu.classList.add("open");
    topbarLangMenu.style.display = "flex";
    topbarLangTrigger.classList.add("open");
    topbarLangTrigger.setAttribute("aria-expanded", "true");
  } else {
    topbarLangMenu.classList.remove("open");
    topbarLangMenu.style.display = "none";
    topbarLangTrigger.classList.remove("open");
    topbarLangTrigger.setAttribute("aria-expanded", "false");
  }
}

if (topbarLangTrigger) {
  topbarLangTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLangDropdown();
  });
}

document.addEventListener("click", (e) => {
  if (topbarLangDropdown && !topbarLangDropdown.contains(e.target)) {
    toggleLangDropdown(false);
  }
});

if (langOptionBtns) {
  langOptionBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedLang = btn.getAttribute("data-lang");
      if (selectedLang) {
        applyAppLanguage(selectedLang);
      }
      toggleLangDropdown(false);
    });
  });
}

if (appLangSelect) {
  appLangSelect.addEventListener("change", (e) => {
    applyAppLanguage(e.target.value);
  });
}

function applyAppLanguage(lang) {
  if (!lang) lang = "en";
  currentAppLang = lang.toLowerCase();
  if (!APP_I18N[currentAppLang]) currentAppLang = "en";
  localStorage.setItem("medhub_app_lang", currentAppLang);

  if (currentUser && currentUser !== "guest") {
    localStorage.setItem("medhub_user_lang_" + currentUser, currentAppLang);
  }

  const t = APP_I18N[currentAppLang];

  // Synchronize language dropdowns
  setTopbarLangDisplay(currentAppLang);

  if (appLangSelect && appLangSelect.value !== currentAppLang) {
    appLangSelect.value = currentAppLang;
  }
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

  // 5. DDI Radar (Card 2)
  if (ddiCardTitle) ddiCardTitle.textContent = t.ddiTitle;
  if (activeDrugsLabel) activeDrugsLabel.textContent = t.activeDrugsLabel;

  // Telemetry Cards: Re-render live data in selected language if exists, else defaults
  if (latestTelemetryData) {
    updateCockpitDashboard(latestTelemetryData);
  } else {
    if (triageHeadline && triageRec) {
      triageHeadline.textContent = t.triageDefaultHeadline;
      triageRec.textContent = t.triageDefaultRec;
      if (triageBadge) triageBadge.textContent = t.triageRoutineBadge;
    }
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
  // Standard S.O.A.P. 4 Full Form Points (Always standard, stable, never changing into messy paragraphs)
  if (soapSubjectivePreview) {
    soapSubjectivePreview.textContent = t.soapS_Full || "Subjective";
    if (soapSubjectivePreview.parentElement) {
      soapSubjectivePreview.parentElement.title = (latestSoapData && latestSoapData.subjective) ? latestSoapData.subjective : (t.soapS_Full || "Subjective");
    }
  }
  if (soapObjectivePreview) {
    soapObjectivePreview.textContent = t.soapO_Full || "Objective";
    if (soapObjectivePreview.parentElement) {
      soapObjectivePreview.parentElement.title = (latestSoapData && latestSoapData.objective) ? latestSoapData.objective : (t.soapO_Full || "Objective");
    }
  }
  if (soapAssessmentPreview) {
    soapAssessmentPreview.textContent = t.soapA_Full || "Assessment";
    if (soapAssessmentPreview.parentElement) {
      soapAssessmentPreview.parentElement.title = (latestSoapData && latestSoapData.assessment) ? latestSoapData.assessment : (t.soapA_Full || "Assessment");
    }
  }
  if (soapPlanPreview) {
    soapPlanPreview.textContent = t.soapP_Full || "Plan";
    if (soapPlanPreview.parentElement) {
      soapPlanPreview.parentElement.title = (latestSoapData && latestSoapData.plan) ? latestSoapData.plan : (t.soapP_Full || "Plan");
    }
  }
  if (playAdviceBtnText) playAdviceBtnText.textContent = t.playAdvice;
  if (stopAdviceBtnText) stopAdviceBtnText.textContent = t.stopAdvice;
  if (audioStateBadge && !isVoicePlaying) audioStateBadge.textContent = t.audioReadyBadge;

  // OpenFDA Grounding Drawer (Card 4)
  if (fdaHeaderTitle) fdaHeaderTitle.textContent = t.fdaHeader;
  if (fdaBadgeText) fdaBadgeText.textContent = t.fdaBadge;
  if (fdaPrescribingTitle) fdaPrescribingTitle.textContent = t.fdaPrescribingTitle;
  if (fdaWarningsTitle) fdaWarningsTitle.textContent = t.fdaWarningsTitle;

  if (latestTelemetryData && latestTelemetryData.fda_info && latestTelemetryData.fda_info.verified) {
    if (fdaDrugTitle) fdaDrugTitle.textContent = latestTelemetryData.fda_info.drug_name;
    if (fdaDosageSnippet) fdaDosageSnippet.textContent = latestTelemetryData.fda_info.dosage;
    if (fdaWarningsSnippet) fdaWarningsSnippet.textContent = latestTelemetryData.fda_info.warnings;
  } else {
    if (fdaDrugTitle) fdaDrugTitle.textContent = t.fdaDrugTitle;
    if (fdaDosageSnippet) fdaDosageSnippet.textContent = t.fdaDosageSnippet;
    if (fdaWarningsSnippet) fdaWarningsSnippet.textContent = t.fdaWarningsSnippet;
  }

  // Privacy Vault Modal
  if (vaultTitleText) vaultTitleText.textContent = t.vaultTitle;
  if (vaultSubText) vaultSubText.textContent = t.vaultSub;
  if (vaultFeat1Text) vaultFeat1Text.textContent = t.vaultFeat1Title;
  const vFeat1Desc = document.getElementById("vaultFeat1Desc");
  if (vFeat1Desc) vFeat1Desc.textContent = t.vaultFeat1Desc;
  if (vaultFeat2Text) vaultFeat2Text.textContent = t.vaultFeat2Title;
  const vFeat2Desc = document.getElementById("vaultFeat2Desc");
  if (vFeat2Desc) vFeat2Desc.textContent = t.vaultFeat2Desc;
  if (vaultFeat3Text) vaultFeat3Text.textContent = t.vaultFeat3Title;
  const vFeat3Desc = document.getElementById("vaultFeat3Desc");
  if (vFeat3Desc) vFeat3Desc.textContent = t.vaultFeat3Desc;
  if (closeVaultModalBtnText) closeVaultModalBtnText.textContent = t.vaultCloseBtn;

  // Translate existing message action buttons
  document.querySelectorAll(".bot-action-btn").forEach(btn => {
    const span = btn.querySelector("span");
    if (!span) return;
    const txt = span.textContent.trim().toLowerCase();
    if (txt.includes("listen") || txt.includes("ஆடியோ") || txt.includes("കേൾ") || txt.includes("విన") || txt.includes("ಆಲಿಸು") || txt.includes("सुन")) {
      span.textContent = t.listenAloud;
    } else if (txt.includes("cop") || txt.includes("நகல்") || txt.includes("പകർ") || txt.includes("కాపీ") || txt.includes("ನಕಲಿ") || txt.includes("कॉपी")) {
      span.textContent = t.copy;
    }
  });

  document.querySelectorAll(".pdf-download-btn").forEach(btn => {
    if (!btn.disabled) {
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        ${t.downloadSchedule}
      `;
    }
  });

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

// OpenFDA Drawer Toggle & Helper Functions
function openFdaDrawer() {
  if (!fdaDrawerContent) return;
  fdaDrawerContent.style.display = "flex";
  fdaDrawerContent.classList.add("open");
  if (fdaChevron) fdaChevron.style.transform = "rotate(0deg)";
  const drawerCard = fdaMiniDrawer || document.getElementById("fdaMiniDrawer") || document.querySelector(".fda-mini-drawer");
  if (drawerCard) drawerCard.classList.add("open");
}

function closeFdaDrawer() {
  if (!fdaDrawerContent) return;
  fdaDrawerContent.style.display = "none";
  fdaDrawerContent.classList.remove("open");
  if (fdaChevron) fdaChevron.style.transform = "rotate(-90deg)";
  const drawerCard = fdaMiniDrawer || document.getElementById("fdaMiniDrawer") || document.querySelector(".fda-mini-drawer");
  if (drawerCard) drawerCard.classList.remove("open");
}

function toggleFdaDrawer(e) {
  if (e) e.stopPropagation();
  if (!fdaDrawerContent) return;
  const isClosed = fdaDrawerContent.style.display === "none" || !fdaDrawerContent.classList.contains("open");
  if (isClosed) {
    openFdaDrawer();
  } else {
    closeFdaDrawer();
  }
}

if (fdaHeaderToggle) {
  fdaHeaderToggle.addEventListener("click", toggleFdaDrawer);
}

const fdaMiniDrawerCard = fdaMiniDrawer || document.getElementById("fdaMiniDrawer") || document.querySelector(".fda-mini-drawer");
if (fdaMiniDrawerCard) {
  fdaMiniDrawerCard.addEventListener("click", (e) => {
    // If closed, clicking anywhere on the mini drawer opens it on the 1st click
    if (fdaDrawerContent && (fdaDrawerContent.style.display === "none" || !fdaDrawerContent.classList.contains("open"))) {
      toggleFdaDrawer(e);
    }
  });
}

if (fdaDrawerContent) {
  fdaDrawerContent.addEventListener("click", (e) => {
    // Keep clicks inside the content block from bubbling and closing the drawer
    e.stopPropagation();
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
    applyAppLanguage(currentAppLang);
    inputEl.value = "";
    autoResize();
    inputEl.focus();
  });
}

function resetCockpitMetrics() {
  const t = APP_I18N[currentAppLang] || APP_I18N.en;
  latestTelemetryData = null;
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
    if (ddiStatusIcon) ddiStatusIcon.innerHTML = DDI_STATUS_ICONS.safe;
    ddiConflictTitle.textContent = t.ddiSafeTitle;
    ddiConflictDesc.textContent = t.ddiSafeDesc;
    if (ddiActionBox) ddiActionBox.style.display = "none";
  }

  // Standard S.O.A.P. 4 Full Form Points (Always standard)
  if (soapSubjectivePreview) {
    soapSubjectivePreview.textContent = t.soapS_Full || "Subjective";
    if (soapSubjectivePreview.parentElement) {
      soapSubjectivePreview.parentElement.classList.remove("active");
      soapSubjectivePreview.parentElement.title = t.soapS_Full || "Subjective";
    }
  }
  if (soapObjectivePreview) {
    soapObjectivePreview.textContent = t.soapO_Full || "Objective";
    if (soapObjectivePreview.parentElement) {
      soapObjectivePreview.parentElement.classList.remove("active");
      soapObjectivePreview.parentElement.title = t.soapO_Full || "Objective";
    }
  }
  if (soapAssessmentPreview) {
    soapAssessmentPreview.textContent = t.soapA_Full || "Assessment";
    if (soapAssessmentPreview.parentElement) {
      soapAssessmentPreview.parentElement.classList.remove("active");
      soapAssessmentPreview.parentElement.title = t.soapA_Full || "Assessment";
    }
  }
  if (soapPlanPreview) {
    soapPlanPreview.textContent = t.soapP_Full || "Plan";
    if (soapPlanPreview.parentElement) {
      soapPlanPreview.parentElement.classList.remove("active");
      soapPlanPreview.parentElement.title = t.soapP_Full || "Plan";
    }
  }

  if (fdaDrugTitle) fdaDrugTitle.textContent = t.fdaDrugTitle;
  if (fdaDosageSnippet) fdaDosageSnippet.textContent = t.fdaDosageSnippet;
  if (fdaWarningsSnippet) fdaWarningsSnippet.textContent = t.fdaWarningsSnippet;
  closeFdaDrawer();

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
    const tLoc = APP_I18N[currentAppLang] || APP_I18N.en;
    const btn = document.createElement("button");
    btn.className = "pdf-download-btn";
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      ${tLoc.downloadSchedule}
    `;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const tNow = APP_I18N[currentAppLang] || APP_I18N.en;
      btn.textContent = tNow.genSchedulePdf;
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
        btn.textContent = tNow.downloadedSchedule;
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = tNow.downloadSchedule;
        }, 3000);
      } catch (err) {
        console.error(err);
        btn.textContent = tNow.errorSchedulePdf;
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = tNow.downloadSchedule;
        }, 2500);
      }
    });
    container.appendChild(btn);
  }

  // Action Bar at bottom of each message (Feature 4 Audio & Copy)
  const actionBar = document.createElement("div");
  actionBar.className = "bot-action-bar";
  const tCur = APP_I18N[currentAppLang] || APP_I18N.en;

  const speakBtn = document.createElement("button");
  speakBtn.className = "bot-action-btn";
  speakBtn.type = "button";
  speakBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
    <span>${tCur.listenAloud}</span>
  `;
  speakBtn.addEventListener("click", () => toggleMessageVoice(speakBtn, rawText));

  const copyBtn = document.createElement("button");
  copyBtn.className = "bot-action-btn";
  copyBtn.type = "button";
  copyBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    <span>${tCur.copy}</span>
  `;
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rawText);
    const tNow = APP_I18N[currentAppLang] || APP_I18N.en;
    copyBtn.querySelector("span").textContent = tNow.copied;
    setTimeout(() => { copyBtn.querySelector("span").textContent = tNow.copy; }, 2000);
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
  latestTelemetryData = data;
  const tLoc = APP_I18N[currentAppLang] || APP_I18N.en;

  // 1. Feature 2: Emergency Triage Update
  if (data.triage) {
    const t = data.triage;
    const lvl = t.level || "routine";
    triageBadge.className = `status-badge ${lvl}`;
    if (lvl === "emergency") {
      triageBadge.textContent = tLoc.triageEmergencyBadge || t.badge;
      triageHeadline.textContent = tLoc.triageEmergencyHeadline || t.title;
      triageRec.textContent = tLoc.triageEmergencyRec || t.recommendation;
    } else if (lvl === "urgent") {
      triageBadge.textContent = tLoc.triageUrgentBadge || t.badge;
      triageHeadline.textContent = tLoc.triageUrgentHeadline || t.title;
      triageRec.textContent = tLoc.triageUrgentRec || t.recommendation;
    } else {
      triageBadge.textContent = tLoc.triageRoutineBadge || t.badge;
      triageHeadline.textContent = tLoc.triageDefaultHeadline || t.title;
      triageRec.textContent = tLoc.triageDefaultRec || t.recommendation;
    }

    triageMeterMarker.className = `meter-marker ${lvl}`;

    if (t.triggers && t.triggers.length > 0) {
      triageTriggers.style.display = "flex";
      const flagPrefix = tLoc.flagPrefix || "Flag:";
      triageTriggers.innerHTML = t.triggers.map(k => `<span class="trigger-tag">${flagPrefix} ${k}</span>`).join("");
    } else {
      triageTriggers.style.display = "none";
    }
  }

  // 2. Feature 1: DDI Radar Update
  if (data.ddi) {
    const d = data.ddi;
    const lvl = d.level || "safe";
    ddiBadge.className = `status-badge ${lvl}`;

    if (d.active_drugs && d.active_drugs.length > 0) {
      activeDrugsList.innerHTML = d.active_drugs.map(drug => `<span class="drug-pill">${drug}</span>`).join("");
    } else {
      activeDrugsList.innerHTML = `<span class="empty-tray-pill" id="emptyTrayPill">${tLoc.emptyTray}</span>`;
    }

    ddiConflictBox.className = `ddi-conflict-box ${lvl}`;
    if (ddiStatusIcon) {
      ddiStatusIcon.innerHTML = DDI_STATUS_ICONS[lvl] || DDI_STATUS_ICONS.safe;
    }

    if (lvl === "danger") {
      ddiBadge.textContent = tLoc.ddiDangerBadge || d.badge;
      ddiConflictTitle.textContent = tLoc.ddiDangerTitle || d.title;
      ddiConflictDesc.textContent = tLoc.ddiDangerDesc || d.description;
    } else if (lvl === "warning") {
      ddiBadge.textContent = tLoc.ddiWarningBadge || d.badge;
      ddiConflictTitle.textContent = tLoc.ddiWarningTitle || d.title;
      ddiConflictDesc.textContent = tLoc.ddiWarningDesc || d.description;
    } else {
      ddiBadge.textContent = tLoc.ddiSafeBadge || d.badge;
      ddiConflictTitle.textContent = tLoc.ddiSafeTitle || d.title;
      ddiConflictDesc.textContent = tLoc.ddiSafeDesc || d.description;
    }

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
    // Standard SOAP 4 full-form points stay constant to preserve UI integrity!
    if (soapSubjectivePreview) {
      soapSubjectivePreview.textContent = tLoc.soapS_Full || "Subjective";
      if (soapSubjectivePreview.parentElement) {
        soapSubjectivePreview.parentElement.classList.add("active");
        soapSubjectivePreview.parentElement.title = data.soap.subjective || tLoc.soapS_Full;
      }
    }
    if (soapObjectivePreview) {
      soapObjectivePreview.textContent = tLoc.soapO_Full || "Objective";
      if (soapObjectivePreview.parentElement) {
        soapObjectivePreview.parentElement.classList.add("active");
        soapObjectivePreview.parentElement.title = data.soap.objective || tLoc.soapO_Full;
      }
    }
    if (soapAssessmentPreview) {
      soapAssessmentPreview.textContent = tLoc.soapA_Full || "Assessment";
      if (soapAssessmentPreview.parentElement) {
        soapAssessmentPreview.parentElement.classList.add("active");
        soapAssessmentPreview.parentElement.title = data.soap.assessment || tLoc.soapA_Full;
      }
    }
    if (soapPlanPreview) {
      soapPlanPreview.textContent = tLoc.soapP_Full || "Plan";
      if (soapPlanPreview.parentElement) {
        soapPlanPreview.parentElement.classList.add("active");
        soapPlanPreview.parentElement.title = data.soap.plan || tLoc.soapP_Full;
      }
    }
  }

  // 4. Feature 5: OpenFDA Grounding Update
  if (data.fda_info && data.fda_info.verified) {
    if (fdaDrugTitle) fdaDrugTitle.textContent = data.fda_info.drug_name;
    if (fdaDosageSnippet) fdaDosageSnippet.textContent = data.fda_info.dosage;
    if (fdaWarningsSnippet) fdaWarningsSnippet.textContent = data.fda_info.warnings;
    openFdaDrawer();
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
    formData.append("lang", currentAppLang || "en");
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
    const tLoc = APP_I18N[currentAppLang] || APP_I18N.en;
    if (err.name === "AbortError") {
      typingDiv.innerHTML = `<p style="color:#fcd34d; margin:0; font-style:italic; display:flex; align-items:center; gap:6px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg> <span>${tLoc.generationStopped || "Consultation generation stopped by user."}</span></p>`;
    } else {
      console.error("Error sending message:", err);
      const errText = (tLoc && tLoc.chatError) ? tLoc.chatError : "Something went wrong while connecting to the local inference vault. Please try again.";
      typingDiv.innerHTML = `<p style="color:#fca5a5; margin:0; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> <span>${errText}</span></p>`;
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
if (appLangSelect) {
  appLangSelect.addEventListener("change", (e) => {
    applyAppLanguage(e.target.value);
  });
}

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
    const selectedLang = (currentAppLang || (appLangSelect ? appLangSelect.value : "en")).toLowerCase();
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
            username: currentUser,
            lang: currentAppLang || "en"
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
