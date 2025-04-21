import os
import requests

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
BASE_URL = "https://api-inference.huggingface.co/models/"

headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

def generate_text(model_name, prompt):
    url = f"{BASE_URL}{model_name}"
    response = requests.post(url, headers=headers, json={"inputs": prompt})
    response.raise_for_status()
    return response.json()

def summarize_text(model_name, text):
    url = f"{BASE_URL}{model_name}"
    response = requests.post(url, headers=headers, json={"inputs": text})
    response.raise_for_status()
    return response.json()
