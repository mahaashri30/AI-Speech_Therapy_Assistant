from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from transcription import transcribe_audio
from pronunciation import get_pronunciation_score
from feedback import generate_feedback
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze")
async def analyze_audio(audio: UploadFile, expected: str = Form(...)):
    audio_path = os.path.join(UPLOAD_DIR, audio.filename)
    with open(audio_path, "wb") as f:
        f.write(await audio.read())

    spoken_text = transcribe_audio(audio_path)
    score, expected_phonemes, actual_phonemes = get_pronunciation_score(expected, spoken_text)
    feedback = generate_feedback(expected, spoken_text, score, expected_phonemes, actual_phonemes)

    return {
        "expected": expected,
        "spoken": spoken_text,
        "score": score,
        "feedback": feedback
    }

