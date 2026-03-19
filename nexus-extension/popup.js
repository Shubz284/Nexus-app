const API_BASE = "http://localhost:3000";
const APP_BASE = "http://localhost:5173";

const titleInput = document.getElementById("title");
const linkInput = document.getElementById("link");
const typeInput = document.getElementById("type");
const tagsInput = document.getElementById("tags");
const typeBadge = document.getElementById("typeBadge");
const saveForm = document.getElementById("saveForm");
const saveBtn = document.getElementById("saveBtn");
const openBtn = document.getElementById("openBtn");
const statusEl = document.getElementById("status");

function setStatus(message, tone = "") {
  statusEl.textContent = message;
  statusEl.className = "status";
  if (tone) {
    statusEl.classList.add(tone);
  }
}

function normalizeHost(urlString) {
  try {
    const parsed = new URL(urlString);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function detectContentType(urlString) {
  const host = normalizeHost(urlString);
  if (host.includes("youtube.com") || host.includes("youtu.be"))
    return "youtube";
  if (host.includes("twitter.com") || host.includes("x.com")) return "twitter";
  if (host.includes("instagram.com")) return "instagram";
  if (host.includes("facebook.com") || host.includes("fb.watch"))
    return "facebook";
  return "other";
}

function parseTags(rawTags) {
  return rawTags
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

function renderTypeBadge(typeValue) {
  const type = (typeValue || "other").toLowerCase();
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  if (typeBadge) {
    typeBadge.textContent = label;
  }
}

async function getCurrentTabData() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  if (!activeTab) {
    throw new Error("No active tab found.");
  }

  return {
    title: activeTab.title || "",
    url: activeTab.url || "",
  };
}

async function saveContent(payload) {
  const response = await fetch(`${API_BASE}/auth/content`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Please log in to Nexus in your browser first."
        : `Save failed (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}

function openNexusApp() {
  chrome.tabs.create({ url: `${APP_BASE}/app/dashboard` });
}

async function initPopup() {
  try {
    setStatus("Reading current page...");
    const { title, url } = await getCurrentTabData();
    titleInput.value = title;
    linkInput.value = url;
    typeInput.value = detectContentType(url);
    renderTypeBadge(typeInput.value);
    setStatus("Ready to save.");
  } catch (error) {
    setStatus(error.message || "Could not read active tab.", "err");
  }
}

linkInput.addEventListener("input", () => {
  typeInput.value = detectContentType(linkInput.value);
  renderTypeBadge(typeInput.value);
});

openBtn.addEventListener("click", () => {
  openNexusApp();
});

saveForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const link = linkInput.value.trim();
  const type = typeInput.value.trim() || detectContentType(link);
  const tags = parseTags(tagsInput.value);

  if (!title || !link) {
    setStatus("Title and link are required.", "err");
    return;
  }

  const payload = {
    title,
    link,
    type,
    tags,
  };

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    setStatus("Saving to Nexus...");

    await saveContent(payload);
    setStatus("Saved successfully.", "ok");
    tagsInput.value = "";
  } catch (error) {
    setStatus(error.message || "Could not save content.", "err");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save to Nexus";
  }
});

initPopup();
