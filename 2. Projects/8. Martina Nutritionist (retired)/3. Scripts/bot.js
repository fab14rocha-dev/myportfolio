require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { chat, analyzeImage } = require("./gemini");
const { logMeal, logWeight } = require("./firebase");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Only respond to messages from Martina's Telegram ID
// Set ALLOWED_USER_ID in .env to her Telegram user ID
const ALLOWED_ID = parseInt(process.env.ALLOWED_USER_ID);

function isAllowed(msg) {
  if (!ALLOWED_ID) return true; // If not set, allow all (during setup)
  return msg.from.id === ALLOWED_ID;
}

function deny(chatId) {
  bot.sendMessage(chatId, "Sorry, this bot is private.");
}

// /start command
bot.onText(/\/start/, (msg) => {
  if (!isAllowed(msg)) return deny(msg.chat.id);
  bot.sendMessage(
    msg.chat.id,
    "Hey Martina! I'm your Nutri 🌿 Fabricio set me up to help you with nutrition.\n\nHere's what I can do:\n- Analyze photos of your food\n- Estimate calories\n- Answer nutrition questions\n- Suggest easy recipes with simple ingredients\n- Track your weight over time\n- Give you tips based on your goals\n\nBut first — tell me a bit about yourself. What are you hoping to work on?"
  );
});

// /weight command — e.g. /weight 62.5
bot.onText(/\/weight (.+)/, async (msg, match) => {
  if (!isAllowed(msg)) return deny(msg.chat.id);

  const kg = parseFloat(match[1]);
  if (isNaN(kg)) {
    return bot.sendMessage(msg.chat.id, "Please send your weight like this: /weight 62.5");
  }

  try {
    await logWeight(kg);
    const reply = await chat(msg.from.id, `I just logged my weight: ${kg} kg`);
    bot.sendMessage(msg.chat.id, reply);
  } catch (err) {
    console.error("Weight log error:", err);
    bot.sendMessage(msg.chat.id, "Got it! Weight logged. (Dashboard will update soon.)");
  }
});

// Text messages — general nutrition chat
bot.on("message", async (msg) => {
  if (!isAllowed(msg)) return deny(msg.chat.id);

  // Skip commands and photo messages (handled separately)
  if (msg.text && msg.text.startsWith("/")) return;
  if (msg.photo) return;

  const userText = msg.text || msg.caption;
  if (!userText) return;

  try {
    bot.sendChatAction(msg.chat.id, "typing");
    const reply = await chat(msg.from.id, userText);
    bot.sendMessage(msg.chat.id, reply);

    // Log the meal if the message sounds like a food log
    logMeal({
      type: "text",
      userMessage: userText,
      botReply: reply,
    }).catch(console.error);
  } catch (err) {
    console.error("Chat error:", err);
    const userMsg = err?.status === 429
      ? "I'm getting too many requests right now. Give me a minute and try again!"
      : "Something went wrong on my end. Try again in a moment.";
    bot.sendMessage(msg.chat.id, userMsg);
  }
});

// Photo messages — analyze food image
bot.on("photo", async (msg) => {
  if (!isAllowed(msg)) return deny(msg.chat.id);

  try {
    bot.sendChatAction(msg.chat.id, "typing");

    // Get the largest version of the photo
    const photo = msg.photo[msg.photo.length - 1];
    const fileInfo = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${fileInfo.file_path}`;

    // Download the image
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);

    const reply = await analyzeImage(imageBuffer, "image/jpeg", msg.caption, msg.from.id);
    bot.sendMessage(msg.chat.id, reply);

    // Log the meal
    logMeal({
      type: "photo",
      caption: msg.caption || null,
      botReply: reply,
    }).catch(console.error);
  } catch (err) {
    console.error("Photo analysis error:", err);
    bot.sendMessage(msg.chat.id, "I couldn't analyze that photo. Try sending it again.");
  }
});

console.log("Nuti bot is running...");
