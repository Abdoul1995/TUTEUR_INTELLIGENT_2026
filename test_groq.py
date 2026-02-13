
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv('GROQ_API_KEY')
print(f"API Key found: {bool(api_key)}")
if api_key:
    # Print first few chars to verify it's the one we expect
    print(f"Key starts with: {api_key[:10]}...")

try:
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=api_key
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "Hello, are you working?"}
        ],
        max_tokens=10
    )
    print("Response received:")
    print(response.choices[0].message.content)

except Exception as e:
    print(f"Error: {e}")
