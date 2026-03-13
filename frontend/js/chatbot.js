class StudentChatBot {
    constructor() {
        this.messagesContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        this.voiceToggle = document.getElementById('voiceToggle');
        
        this.messages = [];
        this.isVoiceEnabled = false;
        this.isTyping = false;
        this.backendURL = 'http://localhost:5000'; // Fixed URL
        
        this.init();
    }

    init() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());
        this.voiceToggle.addEventListener('click', () => this.toggleVoice());
        
        this.messageInput.focus();
        this.showWelcomeMessage();
        
        // Test backend connection
        this.testBackendConnection();
    }

    async testBackendConnection() {
        try {
            const response = await fetch(`${this.backendURL}/stats`);
            if (response.ok) {
                console.log('✅ Backend connected!');
                this.addMessage('🔗 Connected to AI Backend! Ready to chat.', 'bot');
            }
        } catch (error) {
            console.error('Backend not connected:', error);
            this.addMessage('⚠️ Backend not running. Start `python app.py` in backend folder.', 'bot');
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.showTyping();

        try {
            const response = await fetch(`${this.backendURL}/chat`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.toLowerCase().trim() })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.hideTyping();
            
            if (data.response) {
                this.addMessage(data.response, 'bot');
                if (this.isVoiceEnabled) {
                    if (window.Speech) {
                        window.Speech.speak(data.response);
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            let errorMsg = 'Connection failed. ';
            if (error.message.includes('500')) {
                errorMsg += 'Backend error - check server console.';
            } else if (error.message.includes('NetworkError')) {
                errorMsg += 'Backend not running. Run `python app.py`.';
            } else {
                errorMsg += 'Please try again.';
            }
            this.addMessage(errorMsg, 'bot');
        }
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' 
            ? '<div class="message-avatar"><i class="fas fa-user-circle"></i></div>'
            : '<div class="message-avatar"><i class="fas fa-robot"></i></div>';
            
        div.innerHTML = sender === 'bot' 
            ? `${avatar}<div class="message-content">${text}</div>`
            : `${avatar}<div class="message-content">${text}</div>`;

        this.messagesContainer.appendChild(div);
        this.messages.push({text, sender, time: new Date().toLocaleTimeString()});
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage(
                `👋 Hi! I'm **StudentBot AI** - your college assistant!

**I can help with:**
- 🎓 Admissions & Courses
- 💰 Fees & Payments
- 📚 Exams & Results  
- ⏰ Timetable
- 🎉 Events & Holidays
- 🏢 Departments

**Type your question!** 😊`, 'bot'
            );
        }, 300);
    }

    clearChat() {
        if (confirm('Clear chat?')) {
            this.messagesContainer.innerHTML = '';
            this.messages = [];
            this.showWelcomeMessage();
        }
    }

    exportChat() {
        const content = this.messages.map(m => 
            `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`
        ).join('\n\n');
        
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studentbot-chat-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        const icon = this.voiceToggle.querySelector('i');
        icon.classList.toggle('fa-volume-up');
        icon.classList.toggle('fa-volume-mute');
        
        this.addMessage(
            this.isVoiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF', 
            'bot'
        );
    }
}

// Global init
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new StudentChatBot();
    console.log('🎓 StudentBot Frontend Ready!');
});