import json
import os
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from google import genai
from google.genai import types

from .models import Project
from .forms import ContactForm

# .env file se environment variables load karo
load_dotenv()

# GEMINI SETUP
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def home(request):
    projects = Project.objects.all()
    return render(request, 'home.html', {'projects': projects})


def about(request):
    return render(request, 'about.html')


def resume(request):
    return render(request, 'resume.html')


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/#contact')
    # GET request ya invalid form hone par wapas home ke contact section par bhej do
    return redirect('/#contact')

@csrf_exempt
def gemini_chatbot_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            if not user_message:
                return JsonResponse({'reply': 'Please say something!'})

            # AI Rules
            bot_rules = """
            You are a smart, professional, witty and friendly AI assistant for Abhishek Sharma's portfolio website. 
            Answer naturally like a human. Keep answers under 3-4 sentences. Do not use markdown.
            Abhishek's Info:
            - Education: B.Sc IT from LPU (2023-2026).
            - Skills: Python, Django, REST APIs, SQL, HTML, CSS, Bootstrap.
            - Projects: Multi-Author CMS, RESTful API Task Tracker, Security Incident Portal.
            - Contact: Email is Mex3yoursis@gmail.com, Phone is +91 7018874881.
            """

            response = client.models.generate_content(
                model='gemini-2.5-flash', 
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=bot_rules,
                    temperature=0.7
                )
            )
            
            return JsonResponse({'reply': response.text})

        except Exception as e:
            print(f"🔥 ERROR: {e}")
            return JsonResponse({'reply': "Sorry, my AI servers are taking a quick nap! 😴 Try again later."})
            
    return JsonResponse({'error': 'Invalid request'}, status=400)