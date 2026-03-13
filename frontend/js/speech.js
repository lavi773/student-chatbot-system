class Speech {
    static synth = window.speechSynthesis;
    static voices = [];
    static currentVoice = null;

    static init() {
        if ('speechSynthesis' in window) {
            this.loadVoices();
        }
    }

    static loadVoices() {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
            this.voices = voices;
            // Prefer female voice or first available
            this.currentVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('zira')
            ) || voices[0];
        }
    }

    static speak(text) {
        if (!this.synth || !text) return;

        // Cancel previous speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.currentVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        // Show voice animation
        this.showVoiceAnimation();

        utterance.onend = () => {
            this.hideVoiceAnimation();
        };

        utterance.onerror = () => {
            this.hideVoiceAnimation();
            console.log('Speech synthesis error');
        };

        this.synth.speak(utterance);
    }

    static showVoiceAnimation() {
        const voiceWave = document.querySelector('.voice-wave');
        if (voiceWave) {
            voiceWave.classList.add('active');
        }
    }

    static hideVoiceAnimation() {
        const voiceWave = document.querySelector('.voice-wave');
        if (voiceWave) {
            voiceWave.classList.remove('active');
        }
    }
}

// Initialize speech when voices are loaded
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => {
        Speech.init();
    };
    Speech.init();
}