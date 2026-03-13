from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from chatbot_engine import ChatbotEngine  # Fixed import

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5500", "http://127.0.0.1:5500", "*"]}})

# Paths
DATA_FILE = 'data.json'
INVALID_QUERIES_FILE = '../database/invalid_queries.json'

# Create directories
os.makedirs('../database', exist_ok=True)
os.makedirs('data', exist_ok=True)

# Initialize chatbot
chatbot = ChatbotEngine()

def load_data():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except:
        return {}

def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Save data error: {e}")

def load_invalid_queries():
    try:
        if os.path.exists(INVALID_QUERIES_FILE):
            with open(INVALID_QUERIES_FILE, 'r') as f:
                return json.load(f)
        return []
    except:
        return []

def save_invalid_queries(queries):
    try:
        with open(INVALID_QUERIES_FILE, 'w') as f:
            json.dump(queries, f, indent=2)
    except Exception as e:
        print(f"Save invalid error: {e}")

@app.route('/')
def home():
    return jsonify({"message": "StudentBot AI Backend Running! 🎓", "endpoints": ["/chat", "/stats", "/get_invalid"]})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        message = data.get('message', '').lower().strip()
        
        if not message:
            return jsonify({'response': 'Please ask a question!'})
        
        response = chatbot.get_response(message)
        
        if response:
            return jsonify({'response': response})
        else:
            # Store invalid query
            queries = load_invalid_queries()
            queries.append({
                'query': message,
                'timestamp': datetime.now().isoformat()
            })
            save_invalid_queries(queries)
            
            return jsonify({
                'response': "I don't have that information yet. Please ask about admissions, fees, exams, courses, events, or our admin will add it soon!"
            })
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'response': 'Sorry, server error!'}), 500

@app.route('/stats', methods=['GET'])
def stats():
    try:
        invalid_count = len(load_invalid_queries())
        knowledge_size = len(chatbot.knowledge_base)
        return jsonify({
            'total_queries': invalid_count,
            'knowledge_size': knowledge_size,
            'invalid_queries': invalid_count,
            'status': 'active'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_invalid', methods=['GET'])
def get_invalid():
    try:
        queries = load_invalid_queries()
        return jsonify({'queries': queries})
    except Exception as e:
        return jsonify({'queries': [], 'error': str(e)}), 500

@app.route('/add_invalid', methods=['POST'])
def add_invalid():
    try:
        data = request.get_json() or {}
        query = data.get('query', '')
        
        queries = load_invalid_queries()
        queries.append({
            'query': query,
            'timestamp': datetime.now().isoformat()
        })
        save_invalid_queries(queries)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/delete_invalid/<int:query_id>', methods=['DELETE'])
def delete_invalid(query_id):
    try:
        queries = load_invalid_queries()
        if 0 <= query_id < len(queries):
            queries.pop(query_id)
            save_invalid_queries(queries)
            return jsonify({'success': True})
        return jsonify({'success': False})
    except Exception as e:
        return jsonify({'success': False}), 500

@app.route('/add_answer', methods=['POST'])
def add_answer():
    try:
        data = request.get_json() or {}
        keywords = [k.strip().lower() for k in data.get('keywords', '').split(',') if k.strip()]
        answer = data.get('answer', '').strip()
        
        if not keywords or not answer:
            return jsonify({'success': False, 'error': 'Keywords and answer required'})
        
        knowledge_base = load_data()
        for keyword in keywords:
            if keyword not in knowledge_base:
                knowledge_base[keyword] = []
            if answer not in knowledge_base[keyword]:
                knowledge_base[keyword].append(answer)
        
        save_data(knowledge_base)
        chatbot.load_knowledge_base(knowledge_base)
        
        return jsonify({'success': True, 'message': f'Added {len(keywords)} keywords'})
    except Exception as e:
        print(f"Add answer error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 StudentBot AI Backend Starting...")
    print("📡 Testing chatbot engine...")
    test_response = chatbot.get_response("fees")
    print(f"✅ Test OK: '{test_response}'")
    print("\n🌐 API Endpoints:")
    print("   GET  http://localhost:5000/")
    print("   POST http://localhost:5000/chat")
    print("   GET  http://localhost:5000/stats")
    print("\n📱 Frontend: http://localhost:5500")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)