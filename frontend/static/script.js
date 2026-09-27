/**
 * MedHub Clinical Intelligence System
 * Split-Pane Clinical Cockpit (Option 1) & 6 Core Features
 */

// DOM Elements
const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
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
let currentUser = localStorage.getItem("medhub_user") || "";
let authMode = "signin";
const authModal = document.getElementById("authModal");
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

const userProfile = document.getElementById("userProfile");
const userNameDisplay = document.getElementById("userNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const loginPromptBtn = document.getElementById("loginPromptBtn");

// Session Clinical State
let pendingFile = null;
let isFirstMessageInSession = true;
let latestBotAdvice = "";
let latestSoapData = null;
let currentSpeechSpeed = 1.0;

// ---------------------------------------------------------------------------
// 1. STEALTH MODE TOGGLE (Triple click on logo)
// ---------------------------------------------------------------------------
const logoEl = document.querySelector(".logo");
const logoTextEl = document.querySelector(".logo-text");
let isEnhancedMode = localStorage.getItem("medhub_accent_mode") === "true";

function updateLogoAccent() {
  if (logoTextEl) {
    if (isEnhancedMode) {
      logoTextEl.classList.add("enhanced");
      if (fileInput) fileInput.setAttribute("accept", "*/*");
    } else {
      logoTextEl.classList.remove("enhanced");
      if (fileInput) fileInput.setAttribute("accept", "image/*,.pdf");
    }
  }
}
updateLogoAccent();

if (logoEl) {
  let clickCount = 0;
  let clickTimer = null;
  logoEl.addEventListener("click", () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    if (clickCount >= 3) {
      isEnhancedMode = !isEnhancedMode;
      localStorage.setItem("medhub_accent_mode", isEnhancedMode ? "true" : "false");
      updateLogoAccent();
      clickCount = 0;
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
    }
  });
}

// ---------------------------------------------------------------------------
// 2. TOGGLE COCKPIT & MODAL HANDLERS
// ---------------------------------------------------------------------------
if (toggleCockpitBtn) {
  toggleCockpitBtn.addEventListener("click", () => {
    cockpitContainer.classList.toggle("collapsed");
    const isCollapsed = cockpitContainer.classList.contains("collapsed");
    toggleCockpitBtn.querySelector(".toggle-text").textContent = isCollapsed ? "Show Cockpit" : "Cockpit";
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
    latestSoapData = null;
    resetCockpitMetrics();
    inputEl.value = "";
    autoResize();
    inputEl.focus();
  });
}

function resetCockpitMetrics() {
  // Reset Triage
  if (triageBadge) {
    triageBadge.className = "status-badge routine";
    triageBadge.textContent = "ROUTINE CARE";
  }
  if (triageMeterMarker) {
    triageMeterMarker.className = "meter-marker routine";
  }
  if (triageHeadline) triageHeadline.textContent = "Standard Supportive Home Care & Monitoring";
  if (triageRec) triageRec.textContent = "Maintain adequate rest, hydration, and monitor symptoms. Consult primary doctor if symptoms persist beyond 5-7 days.";
  if (triageTriggers) {
    triageTriggers.innerHTML = "";
    triageTriggers.style.display = "none";
  }

  // Reset DDI
  if (ddiBadge) {
    ddiBadge.className = "status-badge safe";
    ddiBadge.textContent = "RADAR CLEAR";
  }
  if (activeDrugsList) {
    activeDrugsList.innerHTML = `<span class="empty-tray-pill">No active medications detected yet</span>`;
  }
  if (ddiConflictBox) {
    ddiConflictBox.className = "ddi-conflict-box safe";
    ddiStatusIcon.textContent = "✅";
    ddiConflictTitle.textContent = "No Critical Contraindications Detected";
    ddiConflictDesc.textContent = "Active medications evaluated against the hospital interaction knowledge base with no high-risk pharmaceutical conflicts.";
    if (ddiActionBox) ddiActionBox.style.display = "none";
  }

  // Reset SOAP previews
  if (soapSubjectivePreview) soapSubjectivePreview.textContent = "Awaiting patient complaint...";
  if (soapObjectivePreview) soapObjectivePreview.textContent = "Triage classification & drug screening";
  if (soapAssessmentPreview) soapAssessmentPreview.textContent = "Clinical impression & interaction risk";
  if (soapPlanPreview) soapPlanPreview.textContent = "Action protocol & physician follow-up";

  // Stop Audio
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
// 6. MESSAGE RENDERING & CLINICAL COCKPIT UPDATER
// ---------------------------------------------------------------------------
function addMessage(text, sender) {
  welcomeEl.style.display = "none";
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  if (sender.includes("typing")) {
    div.innerHTML = `<span>${text}</span><div class="typing-dots"><span></span><span></span><span></span></div>`;
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
  speakBtn.addEventListener("click", () => playVoiceAudio(rawText));

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
// 8. SEND MESSAGE
// ---------------------------------------------------------------------------
async function sendMessage() {
  if (!currentUser) {
    openAuthModal("signin");
    return;
  }

  const text = inputEl.value.trim();
  const fileToSend = pendingFile;
  if (!text && !fileToSend) return;

  // Clean input
  pendingFile = null;
  fileInput.value = "";
  const preview = document.getElementById("filePreview");
  if (preview) preview.remove();

  inputEl.value = "";
  autoResize();
  sendBtn.disabled = true;

  // Post user message
  addUserMessage(text, fileToSend);

  // Show status
  const typingStatus = fileToSend
    ? "MedHub is analyzing clinical attachment & screening interactions..."
    : "MedHub is computing clinical decision support...";
  const typingDiv = addMessage(typingStatus, "bot typing");

  try {
    const formData = new FormData();
    const promptMessage = text || (fileToSend ? `Please analyze this clinical document (${fileToSend.name}) and evaluate health insights.` : "");
    formData.append("message", promptMessage);
    formData.append("username", currentUser);
    formData.append("enhance", isEnhancedMode ? "true" : "false");
    formData.append("is_first_message", isFirstMessageInSession ? "true" : "false");
    isFirstMessageInSession = false;
    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    const res = await fetch("/api/chat-with-file", {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    typingDiv.classList.remove("typing");
    renderBotMessage(typingDiv, data.response);

    // Update Live Cockpit Dashboard (Features 1, 2, 3, 5)
    updateCockpitDashboard(data);

  } catch (err) {
    console.error("Error sending message:", err);
    typingDiv.classList.remove("typing");
    typingDiv.innerHTML = `<p style="color:#fca5a5; margin:0;">⚠️ Something went wrong while connecting to the local inference vault. Please try again.</p>`;
  } finally {
    sendBtn.disabled = false;
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ---------------------------------------------------------------------------
// 9. FEATURE 3: ONE-CLICK S.O.A.P. / S.B.A.R. PDF EXPORT
// ---------------------------------------------------------------------------
if (downloadSoapBtn) {
  downloadSoapBtn.addEventListener("click", async () => {
    downloadSoapBtn.disabled = true;
    const originalText = downloadSoapBtn.innerHTML;
    downloadSoapBtn.innerHTML = `<span>Synthesizing Audit PDF...</span>`;

    try {
      const formData = new FormData();
      if (latestSoapData) {
        formData.append("soap_json", JSON.stringify(latestSoapData));
      }
      formData.append("patient_name", currentUser || "Guest Patient");
      formData.append("query", "Clinical Consultation Summary");
      formData.append("response", latestBotAdvice || "Routine medical advice provided.");

      const res = await fetch("/api/generate-soap-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to generate SOAP PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medhub_soap_report_${currentUser || 'patient'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      downloadSoapBtn.innerHTML = `<span>Downloaded SOAP Note!</span>`;
      setTimeout(() => {
        downloadSoapBtn.disabled = false;
        downloadSoapBtn.innerHTML = originalText;
      }, 3000);
    } catch (err) {
      console.error("Error generating SOAP PDF:", err);
      downloadSoapBtn.innerHTML = `<span>Export Error</span>`;
      setTimeout(() => {
        downloadSoapBtn.disabled = false;
        downloadSoapBtn.innerHTML = originalText;
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

function playVoiceAudio(textToSpeak) {
  if (!("speechSynthesis" in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const text = cleanTextForVoice(textToSpeak || latestBotAdvice);
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentSpeechSpeed;

  utterance.onstart = () => {
    soundwaveDisplay.classList.add("playing");
    audioStateBadge.textContent = "READING ALOUD";
    audioStateBadge.className = "status-badge emergency";
  };

  utterance.onend = () => {
    soundwaveDisplay.classList.remove("playing");
    audioStateBadge.textContent = "READY";
    audioStateBadge.className = "status-badge voice";
  };

  utterance.onerror = () => {
    soundwaveDisplay.classList.remove("playing");
    audioStateBadge.textContent = "READY";
    audioStateBadge.className = "status-badge voice";
  };

  window.speechSynthesis.speak(utterance);
}

function stopVoiceAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  soundwaveDisplay.classList.remove("playing");
  audioStateBadge.textContent = "READY";
  audioStateBadge.className = "status-badge voice";
}

if (cockpitAudioPlayBtn) {
  cockpitAudioPlayBtn.addEventListener("click", () => playVoiceAudio(latestBotAdvice));
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
// 11. AUTHENTICATION & SESSION PERSISTENCE
// ---------------------------------------------------------------------------
function setAuthMode(mode) {
  authMode = mode;
  authAlert.style.display = "none";
  if (mode === "signup") {
    tabSignUp.classList.add("active");
    tabSignIn.classList.remove("active");
    authTitle.textContent = "Create Medical Vault";
    authSubtitle.textContent = "Register a sovereign credentials pair for local consultations";
    authSubmitBtn.textContent = "Sign Up";
    authSwitchText.textContent = "Already have an account?";
    authSwitchBtn.textContent = "Sign In";
  } else {
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    authTitle.textContent = "Clinical Sign In";
    authSubtitle.textContent = "Enter your credentials to access your private consultation vault";
    authSubmitBtn.textContent = "Sign In to Cockpit";
    authSwitchText.textContent = "Don't have an account?";
    authSwitchBtn.textContent = "Sign Up";
  }
}

tabSignIn.addEventListener("click", () => setAuthMode("signin"));
tabSignUp.addEventListener("click", () => setAuthMode("signup"));
authSwitchBtn.addEventListener("click", () => setAuthMode(authMode === "signin" ? "signup" : "signin"));

function openAuthModal(defaultMode = "signin") {
  setAuthMode(defaultMode);
  authModal.style.display = "flex";
  authUsername.value = "";
  authPassword.value = "";
  authAlert.style.display = "none";
  setTimeout(() => authUsername.focus(), 120);
}

function closeAuthModal() {
  authModal.style.display = "none";
}

loginPromptBtn.addEventListener("click", () => openAuthModal("signin"));
logoutBtn.addEventListener("click", handleLogout);

function updateAuthUI() {
  if (currentUser) {
    userProfile.style.display = "flex";
    userNameDisplay.textContent = currentUser;
    loginPromptBtn.style.display = "none";
  } else {
    userProfile.style.display = "none";
    userNameDisplay.textContent = "";
    loginPromptBtn.style.display = "block";
  }
}

async function handleLogout() {
  currentUser = "";
  localStorage.removeItem("medhub_user");
  updateAuthUI();
  messagesEl.innerHTML = "";
  welcomeEl.style.display = "flex";
  resetCockpitMetrics();
  openAuthModal("signin");
}

async function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value;

  if (!username || !password) {
    authAlert.textContent = "Please enter both username and password.";
    authAlert.style.display = "block";
    return;
  }

  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = authMode === "signup" ? "Creating vault..." : "Signing in...";

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
      authSubmitBtn.textContent = authMode === "signup" ? "Sign Up" : "Sign In to Cockpit";
      return;
    }

    currentUser = data.username;
    localStorage.setItem("medhub_user", currentUser);
    updateAuthUI();
    closeAuthModal();
    loadHistory();
  } catch (err) {
    console.error("Auth error:", err);
    authAlert.textContent = "Unable to connect to local server. Please verify daemon.";
    authAlert.style.display = "block";
  } finally {
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = authMode === "signup" ? "Sign Up" : "Sign In to Cockpit";
  }
}

authForm.addEventListener("submit", handleAuthSubmit);

async function loadHistory() {
  if (!currentUser) return;
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
        // Run light telemetry update on last item
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: lastItem.patient,
            username: currentUser,
            is_first_message: false
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

// Initial authentication setup on load
updateAuthUI();
if (currentUser) {
  loadHistory();
} else {
  openAuthModal("signin");
}
