import time
from src.services.speechService import SpeechService
from src.services.geminiService import initializeGeminiService, getGeminiService

# Measure SpeechService latency
def measure_speech_service_latency():
    speech_service = SpeechService()

    if not speech_service.isSpeechRecognitionSupported():
        print("Speech recognition not supported.")
        return

    def on_transcript(text, is_final):
        if is_final:
            end_time = time.time()
            print(f"SpeechService latency: {end_time - start_time:.2f} seconds")
            speech_service.stopListening()

    speech_service.setOnTranscript(on_transcript)

    print("Starting SpeechService...")
    start_time = time.time()
    speech_service.startListening()

# Measure GeminiService latency
def measure_gemini_service_latency(api_key, test_question):
    initializeGeminiService(api_key)
    gemini_service = getGeminiService()

    print("Sending test question to Gemini API...")
    start_time = time.time()

    try:
        response = gemini_service.generateResponse(test_question)
        end_time = time.time()
        print(f"GeminiService latency: {end_time - start_time:.2f} seconds")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test SpeechService latency
    measure_speech_service_latency()

    # Test GeminiService latency
    gemini_api_key = "your_gemini_api_key_here"
    test_question = "What is your experience with machine learning?"
    measure_gemini_service_latency(gemini_api_key, test_question)