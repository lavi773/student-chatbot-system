// Comprehensive Animation Manager for Student Chatbot
class ChatAnimations {
    constructor() {
        this.initBotAnimations();
        this.initScrollAnimations();
        this.initButtonAnimations();
        this.initTypingEffects();
        this.initParticleSystem();
        this.initLoadingAnimations();
    }

    // 🔄 Bot Avatar & Character Animations
    initBotAnimations() {
        const botAvatar = document.getElementById('botAvatar');
        if (botAvatar) {
            // Breathing animation
            this.breathingEffect(botAvatar);
            
            // Eye blink every 3-5 seconds
            setInterval(() => {
                this.blinkEyes(botAvatar);
            }, Math.random() * 2000 + 3000);
        }
    }

    breathingEffect(element) {
        const keyframes = [
            { transform: 'scale(1)', filter: 'brightness(1)' },
            { transform: 'scale(1.02)', filter: 'brightness(1.05)' },
            { transform: 'scale(1)', filter: 'brightness(1)' }
        ];
        
        element.animate(keyframes, {
            duration: 4000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }

    blinkEyes(element) {
        const eyes = element.querySelectorAll('.eye');
        if (eyes.length === 0) return;
        
        eyes.forEach(eye => {
            eye.animate([
                { height: '25px', borderRadius: '50%' },
                { height: '3px', borderRadius: '2px', offset: 0.5 },
                { height: '25px', borderRadius: '50%' }
            ], {
                duration: 200,
                easing: 'ease-in-out'
            });
        });
    }

    // 📜 Scroll-based Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target, index);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.scrollObserver.observe(el);
        });

        document.querySelectorAll('.feature-card, .stat-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.dataset.index = index;
        });
    }

    revealElement(element, delayIndex = 0) {
        const delay = delayIndex * 0.1;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
    }

    // 🎯 Button Hover & Click Animations
    initButtonAnimations() {
        document.querySelectorAll('.btn, .quick-btn, .table-btn').forEach(button => {
            // Hover ripple effect
            button.addEventListener('mouseenter', (e) => this.rippleEffect(e, button));
            
            // Click scale effect
            button.addEventListener('click', (e) => this.clickScale(button));
        });
    }

    rippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    clickScale(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // ⌨️ Typing & Message Animations
    initTypingEffects() {
        // Typing indicator
        this.typingObserver = new MutationObserver(() => {
            const indicator = document.getElementById('typingIndicator');
            if (indicator && indicator.classList.contains('active')) {
                this.animateTypingDots(indicator);
            }
        });
        
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            this.typingObserver.observe(typingIndicator, { attributes: true });
        }
    }

    animateTypingDots(indicator) {
        const dots = indicator.querySelectorAll('span');
        dots.forEach((dot, index) => {
            dot.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // 🌊 Voice Wave Animation
    createVoiceWave(messageElement) {
        const existingWave = messageElement.querySelector('.voice-wave');
        if (existingWave) existingWave.remove();

        const wave = document.createElement('div');
        wave.className = 'voice-wave';
        wave.innerHTML = `
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
        `;
        
        messageElement.appendChild(wave);
        
        // Animate waves
        const waves = wave.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 0.1}s`;
            wave.style.animationDuration = `${0.8 + index * 0.1}s`;
        });
    }

    removeVoiceWave(messageElement) {
        const wave = messageElement.querySelector('.voice-wave');
        if (wave) {
            wave.style.opacity = '0';
            setTimeout(() => wave.remove(), 300);
        }
    }

    // ✨ Floating Particles (Homepage)
    initParticleSystem() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        this.createParticles(hero, 20);
    }

    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 5}s infinite linear;
                animation-delay: ${Math.random() * 5}s;
                z-index: -1;
            `;
            container.appendChild(particle);
        }
    }

    // ⏳ Loading & Skeleton Animations
    initLoadingAnimations() {
        // Skeleton loading for tables
        document.querySelectorAll('.skeleton').forEach(skeleton => {
            this.animateSkeleton(skeleton);
        });
    }

    animateSkeleton(skeleton) {
        skeleton.animate([
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        ], {
            duration: 1500,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }

    // 🎬 Public Methods (for external use)
    showTypingIndicator(show = true) {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.toggle('active', show);
        }
    }

    animateTyping(text, element, speed = 40) {
        element.innerHTML = '';
        let i = 0;
        
        return new Promise(resolve => {
            const timer = setInterval(() => {
                element.innerHTML += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    showVoiceWave(show = true) {
        const lastBotMessage = document.querySelector('.bot-message:last-child .message-content');
        if (lastBotMessage) {
            if (show) {
                this.createVoiceWave(lastBotMessage);
            } else {
                this.removeVoiceWave(lastBotMessage);
            }
        }
    }

    animateMessage(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    // Initialize Quick Buttons
    initQuickButtons() {
        document.querySelectorAll('.quick-btn').forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
            
            btn.addEventListener('click', () => {
                this.clickScale(btn);
                // Trigger ripple
                setTimeout(() => this.rippleEffect({ clientX: btn.offsetLeft + btn.offsetWidth/2, clientY: btn.offsetTop + btn.offsetHeight/2 }, btn), 50);
            });
        });
    }

    // Global initialization
    static init() {
        return new ChatAnimations();
    }
}

// CSS for particles (add to style.css)
const particleCSS = `
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(120deg); }
    66% { transform: translateY(-10px) rotate(240deg); }
}
@keyframes ripple {
    to { transform: scale(4); opacity: 0; }
}
@keyframes voiceWave {
    0%, 100% { transform: scaleY(1); opacity: 0.4; }
    50% { transform: scaleY(2.5); opacity: 1; }
}
@keyframes typing {
    0%, 60%, 100% { transform: scale(1); opacity: 0.4; }
    30% { transform: scale(1.3); opacity: 1; }
}
`;

// Inject CSS if needed
if (!document.querySelector('#animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = particleCSS;
    document.head.appendChild(style);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.chatAnimations = ChatAnimations.init();
    
    // Initialize quick buttons after short delay
    setTimeout(() => {
        window.chatAnimations?.initQuickButtons();
    }, 300);
    
    // Re-init on page transitions
    window.addEventListener('pageshow', () => {
        setTimeout(() => window.chatAnimations = ChatAnimations.init(), 100);
    });
});

// Export for external modules
window.ChatAnimations = ChatAnimations;