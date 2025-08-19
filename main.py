import requests

api = requests.get('https://shikohabad.in/course/api/')

print(api.json())