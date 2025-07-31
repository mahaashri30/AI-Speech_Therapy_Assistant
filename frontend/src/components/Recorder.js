import React, { useState, useRef } from "react";
import "./Recorder.css";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [expected, setExpected] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    if (!expected.trim()) {
      alert("Please enter a target word or sentence.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("expected", expected);
      formData.append("audio", audioBlob, "speech.wav");

      try {
        const response = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        setFeedback(result);
      } catch (error) {
        console.error("Connection failed:", error);
        setFeedback({ spoken: "N/A", score: 0, feedback: "Server error. Please try again later." });
      }

      setRecording(false);
    };
  };

  return (
    <div className="recorder-container">
      <h1>🎙️ AI Speech Therapy Assistant</h1>
      <input
        type="text"
        placeholder="Enter expected word/sentence..."
        value={expected}
        onChange={(e) => setExpected(e.target.value)}
        className="input-field"
      />
      <button onClick={recording ? stopRecording : startRecording} className="record-btn">
        {recording ? "⏹ Stop Recording" : "🎤 Start Recording"}
      </button>
      {feedback && (
        <div className="feedback-card">
          <p><strong>🗣️ You Said:</strong> {feedback.spoken}</p>
          <p><strong>✅ Score:</strong> {feedback.score}%</p>
          <p><strong>💡 Suggestion:</strong> {feedback.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default Recorder;