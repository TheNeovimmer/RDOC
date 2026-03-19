/* ============================================================
   RDOC AI Chatbot - Text & Voice Functionality
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const modeText = document.getElementById('modeText');
    const modeVoice = document.getElementById('modeVoice');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    // State
    let currentMode = 'text';
    let isListening = false;
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let conversationHistory = [];

    // ============================================================
    // AI RESPONSE ENGINE
    // ============================================================
    const aiResponses = {
        greeting: [
            "Bonjour ! Je suis RDOC IA, votre assistant robotique. Comment puis-je vous aider aujourd'hui ?",
            "Bienvenue ! Je suis la pour vous aider avec toutes vos questions sur nos robots et services. Que puis-je faire pour vous ?",
            "Salut ! Je suis RDOC IA. Je peux vous parler de nos robots, prix, livraison et bien plus encore. Que voulez-vous savoir ?"
        ],
        robots: [
            "Nous proposons plusieurs categories de robots :\n\n1. Robots Educatifs - parfaits pour l'apprentissage et la formation.\n2. Robots de Gestion - pour automatiser vos taches quotidiennes.\n3. Robots Informatives -为您提供 des informations en temps reel.\n4. Robots de Localisation - pour le suivi et la navigation.\n\nVoulez-vous en savoir plus sur l'une de ces categories ?"
        ],
        prix: [
            "Nos prix varient selon le type de robot et les specifications souhaitees. Voici une estimation generale :\n\n• Robots Educatifs : a partir de 1,500 DT\n• Robots de Gestion : a partir de 3,000 DT\n• Robots Informatives : a partir de 2,500 DT\n• Robots de Localisation : a partir de 4,000 DT\n\nContactez-nous pour un devis personnalise !"
        ],
        livraison: [
            "Nous livrons dans toute la Tunisie !\n\n• Livraison standard : 3-5 jours ouvres\n• Livraison express : 24-48h (supplement)\n• Installation et configuration incluses\n• Garantie 2 ans sur tous nos robots\n\nLa livraison est-elle actuellement disponible dans votre region ?"
        ],
        contact: [
            "Vous pouvez nous contacter par :\n\n• Telephone : +216 73 987 296\n• Email : RDOC@gmail.com\n• WhatsApp : +216 73 987 296\n• Adresse : Taieb mhiri, Sousse, Tunis\n\nNous sommes disponibles 24h/7 pour vous servir !"
        ],
        support: [
            "Notre equipe de support est disponible 24h/7 pour vous aider. Nous proposons :\n\n• Assistance technique dediee\n• Mises a jour logicielles gratuites\n• Maintenance preventive et corrective\n• Formation a distance\n\nComment puis-je vous assister ?"
        ],
        default: [
            "Je comprends votre question. Pourriez-vous etre plus precis ? Je peux vous aider avec :\n\n• Nos produits et robots\n• Les prix et promotions\n• La livraison et installation\n• Le support technique\n• Les contacts et horaires",
            "Merci pour votre message ! Je suis encore en apprentissage. Pourriez-vous reformuler ou me poser une question sur nos robots, prix, livraison ou support ?",
            "Bonne question ! Je vous recommande de contacter notre equipe directement pour des informations personnalisees. Vous pouvez appeler +216 73 987 296 ou ecrire a RDOC@gmail.com"
        ],
        thanks: [
            "Avec plaisir ! Je suis la si vous avez d'autres questions.",
            "De rien ! N'hesitez pas a revenir vers moi si vous avez besoin d'autre chose.",
            "Merci a vous ! RDOC est toujours la pour vous aider."
        ]
    };

    function getAIResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello') || msg.includes('hi')) {
            return randomFrom(aiResponses.greeting);
        }
        if (msg.includes('robot') || msg.includes('produit') || msg.includes('categorie') || msg.includes('type')) {
            return randomFrom(aiResponses.robots);
        }
        if (msg.includes('prix') || msg.includes('cout') || msg.includes('tarif') || msg.includes('cher') || msg.includes(' combien')) {
            return randomFrom(aiResponses.prix);
        }
        if (msg.includes('livraison') || msg.includes('livrer') || msg.includes('delai') || msg.includes('expédition')) {
            return randomFrom(aiResponses.livraison);
        }
        if (msg.includes('contact') || msg.includes('adresse') || msg.includes('email') || msg.includes('telephone') || msg.includes('appel')) {
            return randomFrom(aiResponses.contact);
        }
        if (msg.includes('support') || msg.includes('aide') || msg.includes('help') || msg.includes('probleme') || msg.includes('assistance')) {
            return randomFrom(aiResponses.support);
        }
        if (msg.includes('merci') || msg.includes('thanks') || msg.includes('remercie')) {
            return randomFrom(aiResponses.thanks);
        }

        return randomFrom(aiResponses.default);
    }

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ============================================================
    // MESSAGE RENDERING
    // ============================================================
    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, type = 'bot') {
        // Hide suggestions after first real message
        if (suggestionsContainer && suggestionsContainer.style.display !== 'none') {
            suggestionsContainer.style.display = 'none';
        }

        const time = formatTime();
        const avatarIcon = type === 'bot'
            ? `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2M7.5 13A2.5 2.5 0 005 15.5 2.5 2.5 0 007.5 18a2.5 2.5 0 002.5-2.5A2.5 2.5 0 007.5 13m9 0a2.5 2.5 0 00-2.5 2.5 2.5 2.5 0 002.5 2.5 2.5 2.5 0 002.5-2.5 2.5 2.5 0 00-2.5-2.5z"/></svg>`
            : `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = `
            <div class="message-avatar">${avatarIcon}</div>
            <div>
                <div class="message-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Speak the bot response if in voice mode
        if (type === 'bot' && currentMode === 'voice') {
            speakText(text);
        }
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="#5CC4E5" width="18" height="18"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2"/></svg>
            </div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        conversationHistory.push({ role: 'user', text });
        chatInput.value = '';
        sendBtn.disabled = true;

        // Simulate AI thinking + response
        const typing = addTypingIndicator();
        const delay = 800 + Math.random() * 1200;

        setTimeout(() => {
            removeTypingIndicator();
            const response = getAIResponse(text);
            addMessage(response, 'bot');
            conversationHistory.push({ role: 'assistant', text: response });
            sendBtn.disabled = false;
            chatInput.focus();
        }, delay);
    }

    // ============================================================
    // QUICK SUGGESTIONS
    // ============================================================
    function sendSuggestion(text) {
        chatInput.value = text;
        sendMessage();
    }

    // ============================================================
    // VOICE / SPEECH RECOGNITION
    // ============================================================
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser.');
            return null;
        }

        recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            chatInput.value = transcript;

            if (event.results[0].isFinal) {
                stopListening();
                if (transcript.trim()) {
                    sendMessage();
                }
            }
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            stopListening();
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Don't show error for natural aborts
            } else {
                addMessage("Desole, je n'ai pas pu entendre clairement. Veuillez reessayer ou taper votre message.", 'bot');
            }
        };

        recognition.onend = () => {
            stopListening();
            const text = chatInput.value.trim();
            if (text) sendMessage();
        };

        return recognition;
    }

    function startListening() {
        if (!recognition) recognition = initSpeechRecognition();
        if (!recognition) {
            addMessage("La reconnaissance vocale n'est pas disponible dans votre navigateur. Veuillez utiliser Chrome ou Edge.", 'bot');
            return;
        }

        try {
            isListening = true;
            voiceBtn.classList.add('listening');
            chatInput.placeholder = 'Ecoute en cours...';
            recognition.start();
        } catch (e) {
            console.warn('Recognition start error:', e);
            stopListening();
        }
    }

    function stopListening() {
        isListening = false;
        voiceBtn.classList.remove('listening');
        chatInput.placeholder = currentMode === 'voice' ? 'Ecoutez ma reponse...' : 'Tapez votre message...';
        if (recognition) {
            try { recognition.stop(); } catch (e) { /* ignore */ }
        }
    }

    function toggleVoice() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    // ============================================================
    // TEXT-TO-SPEECH (SYNTHESIS)
    // ============================================================
    function speakText(text) {
        if (!synthesis) return;
        synthesis.cancel(); // Cancel any ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to find a French voice
        const voices = synthesis.getVoices();
        const frVoice = voices.find(v => v.lang.startsWith('fr'));
        if (frVoice) utterance.voice = frVoice;

        synthesis.speak(utterance);
    }

    // Load voices (needed for some browsers)
    if (synthesis) {
        synthesis.onvoiceschanged = () => { synthesis.getVoices(); };
    }

    // ============================================================
    // MODE SWITCH (Text / Voice)
    // ============================================================
    function setMode(mode) {
        currentMode = mode;
        if (mode === 'text') {
            modeText.classList.add('active');
            modeVoice.classList.remove('active');
            chatInput.placeholder = 'Tapez votre message...';
            chatInput.disabled = false;
            if (isListening) stopListening();
        } else {
            modeVoice.classList.add('active');
            modeText.classList.remove('active');
            chatInput.placeholder = 'Ecoutez ma reponse...';
            chatInput.disabled = false;
            // Add a welcome voice message
            if (!conversationHistory.length) {
                setTimeout(() => {
                    addMessage("Mode vocal active. Je vais vous lire mes reponses. Cliquez sur le microphone et parlez, ou tapez votre question.", 'bot');
                    speakText("Mode vocal active. Je vais vous lire mes reponses. Cliquez sur le microphone et parlez, ou tapez votre question.");
                }, 500);
            }
        }
    }

    // ============================================================
    // INPUT ENABLED STATE
    // ============================================================
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            sendBtn.disabled = !chatInput.value.trim();
        });
    }

    if (sendBtn) {
        sendBtn.disabled = true;
    }

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to send
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            sendMessage();
        }
        // Escape to stop listening
        if (e.key === 'Escape' && isListening) {
            stopListening();
        }
    });

    // ============================================================
    // AUTO-FOCUS INPUT ON LOAD
    // ============================================================
    setTimeout(() => {
        if (chatInput) chatInput.focus();
    }, 800);
});
