const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

let pendingFile = null;

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
        <span class="thumb-details-size">${formatFileSize(file.size)} • Ready to send</span>
      </div>
      <button id="removeFileBtn" class="thumb-remove" title="Remove file" type="button">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  document.getElementById("removeFileBtn").addEventListener("click", () => {
    pendingFile = null;
    fileInput.value = "";
    preview.remove();
  });
}

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
      imgWrap.title = "Click to view original image";

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
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="chat-attachment-card-info">
          <div class="chat-attachment-card-name" title="${file.name}">${file.name}</div>
          <div class="chat-attachment-card-size">${file.type === "application/pdf" ? "PDF Document" : "Attached Document"} • ${formatFileSize(file.size)}</div>
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

function renderBotMessage(container, rawText) {
  container.innerHTML = "";

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
        cell.textContent = c.trim();
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
        const p = document.createElement("p");
        p.textContent = trimmed;
        p.style.margin = "4px 0";
        container.appendChild(p);
      }
    }
  }
  if (isTable) {
    flushTable();
  }

  if (hasRenderedTable) {
    const btn = document.createElement("button");
    btn.className = "pdf-download-btn";
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download as PDF
    `;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Generating PDF...";
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
        a.download = "medhub_schedule.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Downloaded!
        `;
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download as PDF
          `;
        }, 3000);
      } catch (err) {
        console.error(err);
        btn.textContent = "Error downloading PDF";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Download as PDF";
        }, 2500);
      }
    });
    container.appendChild(btn);
  }
}

async function sendMessage() {
  const text = inputEl.value.trim();
  const fileToSend = pendingFile;
  if (!text && !fileToSend) return;

  // 1. Immediately clean up input bar and remove file preview from input area
  pendingFile = null;
  fileInput.value = "";
  const preview = document.getElementById("filePreview");
  if (preview) preview.remove();

  inputEl.value = "";
  autoResize();
  sendBtn.disabled = true;

  // 2. Immediately place user message and uploaded file into chat feed
  addUserMessage(text, fileToSend);

  // 3. Show appropriate thinking / file analysis indicator
  const typingStatus = fileToSend
    ? "MedHub is analyzing your file and thinking..."
    : "MedHub is thinking...";
  const typingDiv = addMessage(typingStatus, "bot typing");

  try {
    const formData = new FormData();
    const promptMessage = text || (fileToSend ? `Please analyze this uploaded document (${fileToSend.name}) and provide medical insights.` : "");
    formData.append("message", promptMessage);
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
  } catch (err) {
    console.error("Error sending message:", err);
    typingDiv.classList.remove("typing");
    typingDiv.innerHTML = `<p style="color:#f28b82; margin:0;">⚠️ Something went wrong while processing your request. Please try again.</p>`;
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
