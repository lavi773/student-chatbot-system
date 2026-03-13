import requests
import json

base_url = "http://localhost:5000"

# Test endpoints
tests = [
    ("GET", "/stats"),
    ("POST", "/chat", {"message": "fees"}),
    ("POST", "/chat", {"message": "admissions"}),
    ("GET", "/get_invalid")
]

print("🧪 Testing Backend...")
for method, endpoint, data in tests:
    try:
        if method == "GET":
            r = requests.get(f"{base_url}{endpoint}")
        else:
            r = requests.post(f"{base_url}{endpoint}", json=data)
        
        print(f"✅ {method} {endpoint}: {r.status_code}")
        if r.status_code == 200:
            print(f"   Response: {json.dumps(r.json(), indent=2)[:100]}...")
    except Exception as e:
        print(f"❌ {method} {endpoint}: ERROR - {e}")

print("\n🎉 Backend is ready!" if all(t[0] for t in tests) else "\n❌ Fix errors above!")