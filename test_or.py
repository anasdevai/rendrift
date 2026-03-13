import httpx
import os

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "https://focuscast.ai",
    "X-Title": "FocusCast AI"
}

try:
    # Test 1: List models
    resp = httpx.get("https://openrouter.ai/api/v1/models", headers=headers)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        models = resp.json()['data']
        free_models = [m['id'] for m in models if 'free' in m['id']]
        print(f"Found {len(free_models)} free models.")
        print(f"Top 5 free models: {free_models[:5]}")
    else:
        print(f"Error: {resp.text}")
        
    # Test 2: Chat completion with a known free model
    model = "google/gemini-2.0-flash-exp:free"
    print(f"Testing model: {model}")
    resp = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json={
            "model": model,
            "messages": [{"role": "user", "content": "hi"}]
        }
    )
    print(f"Chat status: {resp.status_code}")
    print(f"Chat response: {resp.text[:200]}")
except Exception as e:
    print(f"Exception: {e}")
