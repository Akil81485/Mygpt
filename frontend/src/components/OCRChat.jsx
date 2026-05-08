import { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";

export default function OCRChat() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const lastText = useRef("");
  const isProcessing = useRef(false);
  const streamRef = useRef(null);

  // 📷 START CAMERA
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.onloadedmetadata = () => video.play();

    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  // 🧠 OCR LOOP (STABLE LENS MODE)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current || isProcessing.current) return;

      const video = videoRef.current;
      if (!video.videoWidth) return;

      isProcessing.current = true;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const w = video.videoWidth;
        const h = video.videoHeight;

        // 🎯 center crop (Lens style focus)
        const cropW = w * 0.6;
        const cropH = h * 0.4;
        const startX = (w - cropW) / 2;
        const startY = (h - cropH) / 2;

        canvas.width = cropW;
        canvas.height = cropH;

        ctx.drawImage(video, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

        // 🧼 grayscale only (no harsh threshold)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);

        const image = canvas.toDataURL("image/png");

        // 🔍 OCR
        const result = await Tesseract.recognize(image, "eng", {
          logger: () => {},
          tessedit_pageseg_mode: 6
        });

        let rawText = result.data.text || "";

        // 🧼 CLEANING (IMPORTANT FIX FOR YOUR ISSUE)
        let cleanText = rawText
          .replace(/\n/g, " ")
          .replace(/[^a-zA-Z0-9 .,]/g, " ")  // remove junk symbols
          .replace(/\s+/g, " ")
          .trim();

        console.log("📸 OCR:", cleanText);

        // 🚫 FILTER BAD OCR
        const isValid =
          cleanText &&
          cleanText.length >= 4 &&
          /[a-zA-Z]/.test(cleanText);

        if (!isValid) return;
        if (cleanText === lastText.current) return;

        lastText.current = cleanText;
        setText(cleanText);

        setLoading(true);

        const res = await axios.post("http://localhost:5000/api/chat", {
          message: cleanText,
          history: []
        });

        setResponse(res.data?.reply || "No response");

      } catch (err) {
        console.error("OCR ERROR:", err);
      } finally {
        isProcessing.current = false;
        setLoading(false);
      }

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 OCR Chatbot (Lens Base)</h2>

      <button onClick={startCapture}>
        Start Camera
      </button>

      <div style={{ marginTop: 10 }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "400px",
            border: "2px solid black",
            borderRadius: "8px"
          }}
        />
      </div>

      <h3>📝 Detected Text</h3>
      <div>{text || "No text detected"}</div>

      <h3>🤖 AI Response</h3>
      <div>{loading ? "Thinking..." : response}</div>
    </div>
  );
}