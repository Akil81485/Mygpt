---

# 📷 OCR Chatbot (Vision AI Web App)

A real-time **OCR + AI Chatbot Web Application** that uses camera input, extracts text using Tesseract.js, and sends it to an AI backend (OpenRouter) for intelligent responses.

---

## 🚀 Live Demo

👉 [https://stellar-cranachan-527de8.netlify.app/](https://stellar-cranachan-527de8.netlify.app/)

---

## 🧠 Features

* 📸 Real-time camera capture (mobile + desktop)
* 🔍 OCR text detection using Tesseract.js
* 🤖 AI responses using OpenRouter API (LLaMA model)
* ⚡ Live auto-processing every few seconds
* 🧹 Smart duplicate filtering (prevents spam requests)
* 📱 Mobile-friendly UI (works in browser camera)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Tesseract.js
* WebRTC (camera access)

### Backend

* Node.js
* Express.js
* OpenRouter API
* CORS + dotenv

---

## 📁 Project Structure

```

owngpt/
│
├── backend/
│   ├── routes/
│   │   └── chat.js
│   ├── server.js
│   └── .env (NOT pushed to GitHub)
│
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── OCRChat.jsx
│   └── App.jsx

```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Akil81485/Mygpt.git
cd Mygpt
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Frontend (Netlify)

* Deploy `/frontend` folder
* Update API URL from `localhost` → backend server URL

### Backend (Render / Railway)

* Deploy `/backend`
* Add environment variable:

  * `OPENROUTER_API_KEY`

---

## 📱 How It Works

1. Camera captures live video
2. Frame is extracted every 3 seconds
3. Tesseract.js converts image → text
4. Cleaned text is sent to backend API
5. OpenRouter AI generates response
6. Response is shown in UI

---

## ⚠️ Important Notes

* Do NOT commit `.env` file (contains API keys)
* Backend must be hosted (localhost will NOT work on mobile)
* Ensure HTTPS for camera access in production

---

## 🔥 Future Improvements

* Voice assistant integration 🎤
* Object detection (YOLO / TensorFlow)
* AR overlay text on camera
* Mobile app version (React Native)
* Faster OCR pipeline

---

## 👨‍💻 Author

Akilan Kannan
AI Full Stack Developer | AI/ML Enthusiast

---
