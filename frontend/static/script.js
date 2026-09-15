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
    typingDiv.textContent = data.response;
    typingDiv.classList.remove("typing");
  } catch (err) {
    typingDiv.textContent = "Something went wrong. Please try again.";
    typingDiv.classList.remove("typing");
  }

  pendingFile = null;
  fileInput.value = "";
  sendBtn.disabled = false;
  const preview = document.getElementById("filePreview");
  if (preview) preview.remove();
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
