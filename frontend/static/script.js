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
    thumbHtml = `<img src="${url}" class="thumb-img">`;
  } else {
    thumbHtml = `<div class="thumb-file">📄</div>`;
  }

  preview.innerHTML = `
    <div class="thumb-wrap">
      ${thumbHtml}
      <button id="removeFileBtn" class="thumb-remove">
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
  div.textContent = text;
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

  const mentionsSchedule = /schedule|timeline|medication plan|routine/i.test(rawText);
  if (hasRenderedTable || mentionsSchedule) {
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
  if (!text && !pendingFile) return;

  addMessage(text || `[File uploaded: ${pendingFile ? pendingFile.name : ""}]`, "user");
  inputEl.value = "";
  autoResize();
  sendBtn.disabled = true;

  const typingDiv = addMessage("MedHub is thinking...", "bot typing");

  try {
    const formData = new FormData();
    formData.append("message", text);
    if (pendingFile) formData.append("file", pendingFile);

    const res = await fetch("/api/chat-with-file", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    typingDiv.classList.remove("typing");
    renderBotMessage(typingDiv, data.response);
  } catch (err) {
    typingDiv.textContent = "Something went wrong. Please try again.";
    typingDiv.classList.remove("typing");
  }

  pendingFile = null;
  fileInput.value = "";
  sendBtn.disabled = false;
  const preview = document.getElementById("filePreview");
  if (preview) preview.remove();
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
