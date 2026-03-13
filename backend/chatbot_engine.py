import json
import re
from difflib import SequenceMatcher

class ChatbotEngine:  # ← Make sure class name is EXACTLY "ChatbotEngine"
    def __init__(self):
        self.knowledge_base = {}
        self.load_knowledge_base()
    
    def load_knowledge_base(self, data=None):
        """Load or reload knowledge base"""
        if data:
            self.knowledge_base = data
        else:
            try:
                with open('data.json', 'r', encoding='utf-8') as f:
                    self.knowledge_base = json.load(f)
            except FileNotFoundError:
                # Create default knowledge base if file doesn't exist
                self.knowledge_base = self.get_default_knowledge()
                self.save_knowledge()
    
    def get_default_knowledge(self):
        """Default knowledge base"""
        return {
            "admissions": [
                "Admissions for BCA start in June every year.",
                "Eligibility: 10+2 with minimum 50% marks.",
                "Apply online through college website."
            ],
            "fees": [
                "BCA annual fee: ₹40,000 (approx).",
                "First semester fee: ₹22,000.",
                "Fee payment: Online/Offline both available."
            ],
            "exams": [
                "Semester exams: Twice a year (Dec & May).",
                "Internal exams: Monthly.",
                "Results declared within 30 days."
            ],
            "timetable": [
                "Regular classes: 9 AM - 4 PM.",
                "Monday-Friday: 5 periods daily.",
                "Check college app for detailed timetable."
            ],
            "courses": [
                "BCA 3-year program.",
                "Subjects: Programming, Database, Web Dev, AI.",
                "Semester-wise curriculum available."
            ],
            "events": [
                "Annual Tech Fest: March.",
                "Cultural Fest: February.",
                "Sports Week: November."
            ],
            "holidays": [
                "Summer Vacation: May-June.",
                "Diwali: 3 days.",
                "Christmas: 1 week."
            ],
            "results": [
                "Results on college portal.",
                "SMS alerts enabled.",
                "Revaluation within 7 days."
            ],
            "departments": [
                "Computer Science Dept.",
                "Contact: 0123456780.",
                "HOD: Dr. ABC."
            ]
        }
    
    def save_knowledge(self):
        """Save knowledge base to file"""
        try:
            with open('data.json', 'w', encoding='utf-8') as f:
                json.dump(self.knowledge_base, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving knowledge: {e}")
    
    def preprocess_message(self, message):
        """Clean and preprocess user message"""
        message = message.lower().strip()
        message = re.sub(r'[^\w\s]', ' ', message)
        return message
    
    def keyword_match(self, message, threshold=0.4):
        """Find best matching keyword"""
        best_match = None
        best_score = 0
        
        message_words = set(message.split())
        
        for keyword, responses in self.knowledge_base.items():
            keyword_words = set(keyword.split())
            intersection = message_words.intersection(keyword_words)
            score = len(intersection) / len(message_words) if message_words else 0
            
            if score > best_score:
                best_score = score
                best_match = keyword
        
        return best_match, best_score
    
    def get_response(self, message):
        """Generate response based on message"""
        processed_message = self.preprocess_message(message)
        
        # Exact keyword match (highest priority)
        for keyword in self.knowledge_base:
            if keyword in processed_message:
                responses = self.knowledge_base[keyword]
                return responses[0]  # Return first/best response
        
        # Fuzzy matching
        matched_keyword, score = self.keyword_match(processed_message)
        if matched_keyword and score > 0.3:
            responses = self.knowledge_base[matched_keyword]
            return responses[0]
        
        # Fallback category matching
        if any(word in processed_message for word in ['admission', 'apply', 'join', 'eligibility']):
            return "Admissions start in June. Apply online through college website. Eligibility: 10+2 with 50% marks."
        elif any(word in processed_message for word in ['fee', 'fees', 'payment', 'cost']):
            return "BCA annual fee is ₹40,000. First semester: ₹22,000. Pay online/offline."
        elif any(word in processed_message for word in ['exam', 'test', 'result']):
            return "Semester exams twice yearly (Dec/May). Results on portal within 30 days."
        elif any(word in processed_message for word in ['time', 'schedule', 'class', 'timetable']):
            return "Classes: 9 AM - 4 PM (Mon-Fri). Check college app for timetable."
        elif any(word in processed_message for word in ['course', 'subject', 'syllabus']):
            return "BCA: Programming, Database, Web Dev, AI. 3-year program."
        elif any(word in processed_message for word in ['event', 'fest', 'celebration']):
            return "Tech Fest (March), Cultural Fest (Feb), Sports Week (Nov)."
        else:
            return None  # Invalid query - will be stored separately
    
    def add_knowledge(self, keyword, response):
        """Add new knowledge"""
        keyword = keyword.lower().strip()
        if keyword not in self.knowledge_base:
            self.knowledge_base[keyword] = []
        if response not in self.knowledge_base[keyword]:
            self.knowledge_base[keyword].append(response)
        self.save_knowledge()