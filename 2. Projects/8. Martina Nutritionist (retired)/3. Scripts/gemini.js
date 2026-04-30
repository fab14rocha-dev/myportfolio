const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { saveConversationHistory, loadConversationHistory, saveProfile, loadProfile } = require("./firebase");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemPromptBase = fs.readFileSync(
  path.join(__dirname, "../4. Data/system-prompt.txt"),
  "utf8"
);

const histories = {};
const profiles = {};

async function getHistory(userId) {
  if (!histories[userId]) {
    histories[userId] = await loadConversationHistory(userId);
  }
  return histories[userId];
}

async function getProfile(userId) {
  if (!profiles[userId]) {
    profiles[userId] = await loadProfile(userId);
  }
  return profiles[userId];
}

function buildSystemPrompt(profile) {
  if (!profile) return systemPromptBase;
  return `${systemPromptBase}\n\n## What you know about Martina\n${profile}`;
}

// Waits ms milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calls Gemini with automatic retry on 429
async function callWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err?.status === 429 && i < retries - 1) {
        const delay = (i + 1) * 15000; // 15s, 30s, 45s
        console.log(`Rate limited. Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

async function chat(userId, userMessage) {
  const [history, profile] = await Promise.all([getHistory(userId), getProfile(userId)]);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: buildSystemPrompt(profile),
  });

  const chatSession = model.startChat({ history });
  const result = await callWithRetry(() => chatSession.sendMessage(userMessage));
  const reply = result.response.text();

  history.push({ role: "user", parts: [{ text: userMessage }] });
  history.push({ role: "model", parts: [{ text: reply }] });

  if (history.length > 40) {
    histories[userId] = history.slice(-40);
  }

  saveConversationHistory(userId, histories[userId] || history).catch(console.error);

  // Profile update runs in background, silently skipped on rate limit
  maybeUpdateProfile(userId, userMessage, history).catch(() => {});

  return reply;
}

async function maybeUpdateProfile(userId, userMessage, history) {
  // Only update every 10 messages
  if (history.length % 10 !== 0) return;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const currentProfile = profiles[userId] || "(empty)";

  const result = await model.generateContent(
    `Martina just said: "${userMessage}"\n\nCurrent profile:\n${currentProfile}\n\nDoes this message contain anything worth saving to her nutritionist profile? (goals, food preferences, dislikes, allergies, lifestyle, weight, age, etc.)\n\nIf NO, reply with just: NO\nIf YES, reply with the full updated profile (max 15 lines), incorporating the new info. Be concise and factual.`
  );

  const response = result.response.text().trim();
  if (response.toUpperCase().startsWith("NO")) return;

  profiles[userId] = response;
  lastProfileUpdate[userId] = now;
  await saveProfile(userId, response);
}

async function analyzeImage(imageBuffer, mimeType, caption, userId) {
  const profile = userId ? await getProfile(userId) : null;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: buildSystemPrompt(profile),
  });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: mimeType || "image/jpeg",
    },
  };

  const prompt = caption
    ? `Martina sent this photo with the message: "${caption}". Analyze the food and give her a calorie estimate and nutritional breakdown.`
    : "Martina sent this photo of her food. Analyze it and give her a calorie estimate and nutritional breakdown.";

  const result = await callWithRetry(() => model.generateContent([prompt, imagePart]));
  return result.response.text();
}

module.exports = { chat, analyzeImage };