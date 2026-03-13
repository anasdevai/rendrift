import httpx

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "https://focuscast.ai",
    "X-Title": "FocusCast AI"
}

model = "qwen/qwen-2.5-coder-32b-instruct:free"
print(f"Testing model: {model} for tool use")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current temperature for a given location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and country e.g. Bogotá, Colombia"
                    }
                },
                "required": [
                    "location"
                ],
                "additionalProperties": False
            },
            "strict": True
        }
    }
]

resp = httpx.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    json={
        "model": model,
        "messages": [{"role": "user", "content": "What is the weather like in Boston?"}],
        "tools": tools
    }
)
print(f"Chat status: {resp.status_code}")
print(f"Chat response: {resp.text}")
