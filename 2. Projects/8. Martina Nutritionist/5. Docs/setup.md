# Setup Guide

## Step 1 — Create the Telegram Bot
1. Open Telegram and message **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the token it gives you — this is your `TELEGRAM_TOKEN`
4. Message **@userinfobot** to find Martina's Telegram user ID — this is `ALLOWED_USER_ID`

## Step 2 — Get a Gemini API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account
3. Click "Create API Key"
4. Copy it — this is your `GEMINI_API_KEY`

## Step 3 — Set Up Firebase
1. Go to https://console.firebase.google.com
2. Create a new project (e.g. "martina-nutritionist")
3. Enable **Firestore Database** (start in test mode for now)
4. Go to Project Settings > Service Accounts > Generate New Private Key
5. Download the JSON file
6. Open the JSON file and paste its entire contents as one line into `FIREBASE_SERVICE_ACCOUNT` in your `.env`
7. Also copy the `apiKey`, `authDomain`, and `projectId` into the dashboard HTML file

## Step 4 — Configure Environment
1. Copy `.env.example` to `.env`
2. Fill in all the values from the steps above

## Step 5 — Install and Run
```bash
cd "2. Projects/8. Martina Nutritionist"
npm install
npm start
```

The bot will print "Nuti bot is running..." when it's ready.

## Step 6 — Test It
1. Find the bot on Telegram (search by its username)
2. Send /start
3. Send a photo of food or ask a nutrition question

## Dashboard
Open `1. HTML/dashboard.html` in a browser. It reads data directly from Firebase.
For Martina to access it from her phone, you can host it for free on Firebase Hosting or GitHub Pages later.
