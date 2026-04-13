# Martina Nutritionist

## What It Does
A personal AI nutritionist for Martina, accessible via Telegram. She can send text messages or photos of her food, and the bot responds like a nutritionist — estimating calories, giving advice, and keeping her on track. All data is saved to Firebase and visible on a personal dashboard.

## Who It's For
Martina (Fabricio's wife). Personal use only, not a public product.

## Problem It Solves
Gives Martina easy access to nutrition guidance and accountability without needing to hire a real nutritionist. She can log meals by just taking a photo, track her weight over time, and get personalized tips — all from Telegram.

## Stack
- **Telegram** — the interface (node-telegram-bot-api)
- **Gemini API** — AI brain, handles text and image analysis (free tier)
- **Firebase** — stores meals, weight, and chat history (Firestore)
- **HTML dashboard** — shows weight journey and meal log (Chart.js + Firebase JS SDK)

## Features
- Send a text message → get nutrition advice
- Send a photo of food → get calorie estimate and breakdown
- Log weight with /weight command
- Dashboard shows weight chart and meal history

## Folder Structure
- 1. HTML/ — dashboard page
- 2. Images/ — UI assets
- 3. Scripts/ — bot.js, gemini.js, firebase.js
- 4. Data/ — system prompt, config
- 5. Docs/ — setup guide

## Environment Variables (.env)
- TELEGRAM_TOKEN — from BotFather on Telegram
- GEMINI_API_KEY — from Google AI Studio (free)
- FIREBASE_* — from Firebase project settings

## How to Run
```
node 3. Scripts/bot.js
```

## Notes
- Keep the Gemini system prompt in 4. Data/system-prompt.txt so it's easy to edit without touching code
- Firebase rules should be locked down — this is private data
- The dashboard is a static HTML file that reads directly from Firebase using the JS SDK
