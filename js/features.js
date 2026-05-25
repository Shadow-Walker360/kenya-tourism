/**
 * Kenya Majestic - Advanced Features Module
 * Implements: Safari Planner, VR Previews, Live Webcams, Dynamic Pricing, 
 * Guide Profiles, Cultural Quiz, UGC Gallery, WhatsApp Agent, Audio Ambience, Conservation Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
    initSafariPlanner();
    initVRCorner();
    initLiveWebcams();
    initDynamicCalendar();
    initGuideProfiles();
    initCulturalQuiz();
    initUGCGallery();
    initWhatsAppAgent();
    initAudioAmbience();
    initConservationTracker();
});

/* ============================================
   1. INTERACTIVE SAFARI PLANNER WIZARD
   ============================================ */
function initSafariPlanner() {
    const plannerHTML = `
        <div id="safari-planner-modal" class="modal-overlay hidden">
            <div class="planner-modal">
                <button class="close-modal" onclick="toggleSafariPlanner()">&times;</button>
                <div class="planner-header">
                    <i class="fas fa-compass"></i>
                    <h2>Design Your Perfect Safari</h2>
                    <p>Answer 4 questions & get a custom itinerary</p>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>
                <form id="safari-wizard" class="wizard-form">
                    <!-- Step 1 -->
                    <div class="wizard-step active" data-step="1">
                        <h3>🗓️ What's your travel timeline?</h3>
                        <div class="option-grid">
                            <label class="option-card">
                                <input type="radio" name="timeline" value="flexible" required>
                                <i class="fas fa-calendar-alt"></i>
                                <span>Flexible Dates</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="timeline" value="specific">
                                <i class="fas fa-calendar-check"></i>
                                <span>Specific Dates</span>
                            </label>
                        </div>
                    </div>
                    <!-- Step 2 -->
                    <div class="wizard-step" data-step="2">
                        <h3>🦁 What's your safari focus?</h3>
                        <div class="option-grid">
                            <label class="option-card">
                                <input type="radio" name="focus" value="wildlife" required>
                                <i class="fas fa-paw"></i>
                                <span>Wildlife & Big 5</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="focus" value="beach">
                                <i class="fas fa-umbrella-beach"></i>
                                <span>Beach Relaxation</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="focus" value="culture">
                                <i class="fas fa-users"></i>
                                <span>Culture & History</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="focus" value="adventure">
                                <i class="fas fa-hiking"></i>
                                <span>Adventure & Hiking</span>
                            </label>
                        </div>
                    </div>
                    <!-- Step 3 -->
                    <div class="wizard-step" data-step="3">
                        <h3>💰 What's your budget range?</h3>
                        <div class="option-grid">
                            <label class="option-card">
                                <input type="radio" name="budget" value="budget" required>
                                <i class="fas fa-wallet"></i>
                                <span>Budget ($500-$1000)</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="budget" value="mid">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Mid-Range ($1000-$2500)</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="budget" value="luxury">
                                <i class="fas fa-gem"></i>
                                <span>Luxury ($2500+)</span>
                            </label>
                        </div>
                    </div>
                    <!-- Step 4 -->
                    <div class="wizard-step" data-step="4">
                        <h3>👥 Who are you traveling with?</h3>
                        <div class="option-grid">
                            <label class="option-card">
                                <input type="radio" name="group" value="solo" required>
                                <i class="fas fa-user"></i>
                                <span>Solo Traveler</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="group" value="couple">
                                <i class="fas fa-heart"></i>
                                <span>Couple</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="group" value="family">
                                <i class="fas fa-users"></i>
                                <span>Family with Kids</span>
                            </label>
                            <label class="option-card">
                                <input type="radio" name="group" value="friends">
                                <i class="fas fa-user-friends"></i>
                                <span>Group of Friends</span>
                            </label>
                        </div>
                    </div>
                    <!-- Results -->
                    <div class="wizard-step" data-step="5">
                        <h3>🎉 Your Custom Safari Awaits!</h3>
                        <div id="planner-results" class="results-container"></div>
                        <button type="button" class="btn primary" onclick="applyToBooking()">Book This Safari</button>
                    </div>
                </form>
                <div class="wizard-nav">
                    <button type="button" class="btn ghost" id="prev-btn" onclick="changeStep(-1)" disabled>Previous</button>
                    <button type="button" class="btn primary" id="next-btn" onclick="changeStep(1)">Next</button>
                </div>
            </div>
        </div>
        <button id="planner-trigger" class="floating-planner" onclick="toggleSafariPlanner()">
            <i class="fas fa-route"></i>
            <span>Plan Safari</span>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', plannerHTML);
    
    window.currentStep = 1;
    window.totalSteps = 4;
    window.plannerData = {};
}

window.toggleSafariPlanner = function() {
    const modal = document.getElementById('safari-planner-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) resetWizard();
};

window.changeStep = function(direction) {
    const form = document.getElementById('safari-wizard');
    const currentStepEl = form.querySelector(`.wizard-step[data-step="${window.currentStep}"]`);
    const nextStep = window.currentStep + direction;
    
    // Validate current step
    if (direction > 0) {
        const inputs = currentStepEl.querySelectorAll('input[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.checked) valid = false;
        });
        if (!valid) {
            alert('Please select an option before continuing.');
            return;
        }
        // Save data
        inputs.forEach(input => {
            if (input.checked) window.plannerData[input.name] = input.value;
        });
    }
    
    if (nextStep > window.totalSteps) {
        showResults();
        return;
    }
    
    if (nextStep < 1) return;
    
    // Update UI
    currentStepEl.classList.remove('active');
    const nextStepEl = form.querySelector(`.wizard-step[data-step="${nextStep}"]`);
    nextStepEl.classList.add('active');
    
    window.currentStep = nextStep;
    updateProgress();
    updateButtons();
};

function updateProgress() {
    const percent = ((window.currentStep - 1) / window.totalSteps) * 100;
    document.querySelector('.progress-fill').style.width = `${percent}%`;
}

function updateButtons() {
    document.getElementById('prev-btn').disabled = window.currentStep === 1;
    const nextBtn = document.getElementById('next-btn');
    nextBtn.textContent = window.currentStep === window.totalSteps ? 'See Results' : 'Next';
}

function resetWizard() {
    window.currentStep = 1;
    window.plannerData = {};
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    document.querySelector('.wizard-step[data-step="1"]').classList.add('active');
    document.getElementById('safari-wizard').reset();
    updateProgress();
    updateButtons();
}

function showResults() {
    const resultsDiv = document.getElementById('planner-results');
    const { focus, budget, group } = window.plannerData;
    
    let recommendation = '';
    let destinations = [];
    
    if (focus === 'wildlife') {
        recommendation = 'Classic Wildlife Safari';
        destinations = ['Maasai Mara', 'Amboseli', 'Tsavo'];
    } else if (focus === 'beach') {
        recommendation = 'Coastal Paradise Escape';
        destinations = ['Diani Beach', 'Lamu Island', 'Watamu'];
    } else if (focus === 'culture') {
        recommendation = 'Cultural Heritage Tour';
        destinations = ['Lamu Old Town', 'Fort Jesus', 'Maasai Village'];
    } else {
        recommendation = 'Adventure Explorer';
        destinations = ['Mount Kenya', 'Hell\'s Gate', 'Lake Naivasha'];
    }
    
    resultsDiv.innerHTML = `
        <div class="result-card">
            <h4>${recommendation}</h4>
            <p><strong>Best for:</strong> ${group.charAt(0).toUpperCase() + group.slice(1)} travelers</p>
            <p><strong>Budget Tier:</strong> ${budget.charAt(0).toUpperCase() + budget.slice(1)}</p>
            <div class="destinations-list">
                <strong>Recommended:</strong> ${destinations.join(' → ')}
            </div>
            <p class="estimated-price"><strong>Est. Price:</strong> $${getEstimatedPrice(budget, group)}</p>
        </div>
    `;
    
    document.querySelector('.wizard-step[data-step="5"]').classList.add('active');
    document.querySelector('.wizard-nav').style.display = 'none';
}

function getEstimatedPrice(budget, group) {
    const basePrices = { budget: 800, mid: 1800, luxury: 3500 };
    const groupMultipliers = { solo: 1.5, couple: 1, family: 0.7, friends: 0.8 };
    return Math.round(basePrices[budget] * groupMultipliers[group]);
}

window.applyToBooking = function() {
    localStorage.setItem('safariPlan', JSON.stringify(window.plannerData));
    window.location.href = 'booking.html';
};

/* ============================================
   2. 360° VR PREVIEWS
   ============================================ */
function initVRCorner() {
    const vrHTML = `
        <section id="vr-experience" class="vr-section">
            <div class="section-header">
                <h2><i class="fas fa-vr-cardboard"></i> Virtual Reality Preview</h2>
                <p>Explore destinations in 360° before you book</p>
            </div>
            <div class="vr-grid">
                <div class="vr-card" data-location="mara">
                    <div id="panorama-mara" class="panorama"></div>
                    <h3>Maasai Mara Plains</h3>
                </div>
                <div class="vr-card" data-location="diani">
                    <div id="panorama-diani" class="panorama"></div>
                    <h3>Diani Beach Coastline</h3>
                </div>
                <div class="vr-card" data-location="kenya">
                    <div id="panorama-kenya" class="panorama"></div>
                    <h3>Mount Kenya Summit</h3>
                </div>
            </div>
        </section>
    `;
    // Insert after features section if on homepage
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        featuresSection.insertAdjacentHTML('afterend', vrHTML);
        setTimeout(initPannellumViewers, 500);
    }
}

function initPannellumViewers() {
    // Using sample 360 images from Pannellum demo
    try {
        pannellum.viewer('panorama-mara', {
            "type": "equirectangular",
            "panorama": "https://pannellum.org/images/alma.jpg",
            "autoLoad": false,
            "compass": true
        });
        
        pannellum.viewer('panorama-diani', {
            "type": "equirectangular",
            "panorama": "https://pannellum.org/images/cerro.jpg",
            "autoLoad": false,
            "compass": true
        });
        
        pannellum.viewer('panorama-kenya', {
            "type": "equirectangular",
            "panorama": "https://pannellum.org/images/milan.jpg",
            "autoLoad": false,
            "compass": true
        });
    } catch (e) {
        console.log('VR viewer initialization pending user interaction');
    }
}

/* ============================================
   3. LIVE WILDLIFE WEBCAMS
   ============================================ */
function initLiveWebcams() {
    const webcamHTML = `
        <section id="live-webcams" class="webcam-section">
            <div class="section-header">
                <h2><i class="fas fa-video"></i> Live from the Wild</h2>
                <p>See what's happening right now in Kenya's parks</p>
                <span class="live-badge">LIVE</span>
            </div>
            <div class="webcam-grid">
                <div class="webcam-card">
                    <div class="webcam-placeholder">
                        <i class="fas fa-satellite-dish"></i>
                        <p>Mara River Crossing</p>
                        <small>Maasai Mara Reserve</small>
                    </div>
                    <div class="webcam-controls">
                        <button class="btn-small"><i class="fas fa-play"></i> Watch Live</button>
                        <span class="viewer-count"><i class="fas fa-eye"></i> 1.2k watching</span>
                    </div>
                </div>
                <div class="webcam-card">
                    <div class="webcam-placeholder">
                        <i class="fas fa-satellite-dish"></i>
                        <p>Elephant Waterhole</p>
                        <small>Amboseli National Park</small>
                    </div>
                    <div class="webcam-controls">
                        <button class="btn-small"><i class="fas fa-play"></i> Watch Live</button>
                        <span class="viewer-count"><i class="fas fa-eye"></i> 856 watching</span>
                    </div>
                </div>
                <div class="webcam-card">
                    <div class="webcam-placeholder">
                        <i class="fas fa-satellite-dish"></i>
                        <p>Lion Pride Territory</p>
                        <small>Tsavo East</small>
                    </div>
                    <div class="webcam-controls">
                        <button class="btn-small"><i class="fas fa-play"></i> Watch Live</button>
                        <span class="viewer-count"><i class="fas fa-eye"></i> 2.3k watching</span>
                    </div>
                </div>
            </div>
            <p class="webcam-note">* Live feeds subject to park connectivity. Check back during peak hours (6-9 AM & 4-7 PM EAT)</p>
        </section>
    `;
    const vrSection = document.getElementById('vr-experience');
    if (vrSection) {
        vrSection.insertAdjacentHTML('afterend', webcamHTML);
    } else {
        const featuresSection = document.querySelector('.features');
        if (featuresSection) featuresSection.insertAdjacentHTML('afterend', webcamHTML);
    }
}

/* ============================================
   4. DYNAMIC PRICING CALENDAR
   ============================================ */
function initDynamicCalendar() {
    const calendarHTML = `
        <section id="pricing-calendar" class="calendar-section">
            <div class="section-header">
                <h2><i class="fas fa-calendar-alt"></i> Best Time to Visit</h2>
                <p>Seasonal pricing & wildlife migration tracker</p>
            </div>
            <div class="calendar-container">
                <div class="legend">
                    <span class="legend-item low"><i class="fas fa-circle"></i> Low Season (Best Deals)</span>
                    <span class="legend-item shoulder"><i class="fas fa-circle"></i> Shoulder Season</span>
                    <span class="legend-item peak"><i class="fas fa-circle"></i> Peak Season</span>
                    <span class="legend-item migration"><i class="fas fa-circle"></i> Great Migration</span>
                </div>
                <div class="months-grid">
                    ${generateMonthCards()}
                </div>
            </div>
        </section>
    `;
    const webcamSection = document.getElementById('live-webcams');
    if (webcamSection) {
        webcamSection.insertAdjacentHTML('afterend', calendarHTML);
    }
}

function generateMonthCards() {
    const months = [
        { name: 'Jan', season: 'peak', migration: false, price: '+25%' },
        { name: 'Feb', season: 'peak', migration: false, price: '+25%' },
        { name: 'Mar', season: 'shoulder', migration: false, price: '+10%' },
        { name: 'Apr', season: 'low', migration: false, price: '-30%' },
        { name: 'May', season: 'low', migration: false, price: '-35%' },
        { name: 'Jun', season: 'shoulder', migration: true, price: '+15%' },
        { name: 'Jul', season: 'peak', migration: true, price: '+40%' },
        { name: 'Aug', season: 'peak', migration: true, price: '+45%' },
        { name: 'Sep', season: 'peak', migration: true, price: '+40%' },
        { name: 'Oct', season: 'shoulder', migration: true, price: '+15%' },
        { name: 'Nov', season: 'shoulder', migration: false, price: '+5%' },
        { name: 'Dec', season: 'peak', migration: false, price: '+30%' }
    ];
    
    return months.map(m => `
        <div class="month-card ${m.season} ${m.migration ? 'migration-month' : ''}">
            <h4>${m.name}</h4>
            <div class="price-tag">${m.price}</div>
            ${m.migration ? '<div class="migration-badge">🦓 Migration</div>' : ''}
        </div>
    `).join('');
}

/* ============================================
   5. MEET YOUR GUIDE PROFILES
   ============================================ */
function initGuideProfiles() {
    const guidesHTML = `
        <section id="meet-guides" class="guides-section">
            <div class="section-header">
                <h2><i class="fas fa-user-tie"></i> Meet Your Local Guides</h2>
                <p>Expert locals ready to show you the real Kenya</p>
            </div>
            <div class="guides-grid">
                <div class="guide-card">
                    <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400" alt="Guide" class="guide-photo">
                    <div class="guide-info">
                        <h3>James Kimani</h3>
                        <p class="guide-specialty">Big 5 Specialist • 15 years</p>
                        <div class="guide-languages">
                            <span>English</span><span>Swahili</span><span>Maasai</span>
                        </div>
                        <button class="btn-small">Request Guide</button>
                    </div>
                </div>
                <div class="guide-card">
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400" alt="Guide" class="guide-photo">
                    <div class="guide-info">
                        <h3>Grace Wanjiku</h3>
                        <p class="guide-specialty">Bird Watching Expert • 10 years</p>
                        <div class="guide-languages">
                            <span>English</span><span>Swahili</span><span>Kikuyu</span>
                        </div>
                        <button class="btn-small">Request Guide</button>
                    </div>
                </div>
                <div class="guide-card">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" alt="Guide" class="guide-photo">
                    <div class="guide-info">
                        <h3>Omar Hassan</h3>
                        <p class="guide-specialty">Coastal Culture • 12 years</p>
                        <div class="guide-languages">
                            <span>English</span><span>Swahili</span><span>Arabic</span>
                        </div>
                        <button class="btn-small">Request Guide</button>
                    </div>
                </div>
            </div>
        </section>
    `;
    const calendarSection = document.getElementById('pricing-calendar');
    if (calendarSection) {
        calendarSection.insertAdjacentHTML('afterend', guidesHTML);
    }
}

/* ============================================
   6. CULTURAL IMMERSION QUIZ
   ============================================ */
function initCulturalQuiz() {
    const quizHTML = `
        <section id="cultural-quiz" class="quiz-section">
            <div class="section-header">
                <h2><i class="fas fa-brain"></i> Learn Swahili & Culture</h2>
                <p>Test your knowledge & earn bonus rewards points!</p>
            </div>
            <div class="quiz-container">
                <div class="quiz-question">
                    <p class="question-text">What does "Karibu Kenya" mean?</p>
                    <div class="quiz-options">
                        <button class="quiz-option" onclick="checkAnswer(this, false)">Goodbye Kenya</button>
                        <button class="quiz-option" onclick="checkAnswer(this, true)">Welcome to Kenya</button>
                        <button class="quiz-option" onclick="checkAnswer(this, false)">Beautiful Kenya</button>
                        <button class="quiz-option" onclick="checkAnswer(this, false)">Visit Kenya</button>
                    </div>
                </div>
                <div class="quiz-feedback hidden"></div>
                <div class="quiz-score">
                    <span>Score: <strong id="quiz-points">0</strong>/5</span>
                    <span>Reward: <strong id="quiz-reward">0</strong> pts</span>
                </div>
            </div>
        </section>
    `;
    const guidesSection = document.getElementById('meet-guides');
    if (guidesSection) {
        guidesSection.insertAdjacentHTML('afterend', quizHTML);
    }
    
    window.quizScore = 0;
    window.quizPoints = 0;
}

window.checkAnswer = function(btn, isCorrect) {
    const feedback = document.querySelector('.quiz-feedback');
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
        btn.classList.add('correct');
        feedback.innerHTML = '<p class="success">✅ Hongera! (Congratulations!) +100 Rewards Points</p>';
        window.quizPoints += 100;
    } else {
        btn.classList.add('incorrect');
        feedback.innerHTML = '<p class="error">❌ Jaribu tena! (Try again!) The answer is "Welcome to Kenya"</p>';
    }
    
    document.getElementById('quiz-points').textContent = window.quizScore++;
    document.getElementById('quiz-reward').textContent = window.quizPoints;
    
    // Save to localStorage
    localStorage.setItem('culturalQuizPoints', window.quizPoints);
};

/* ============================================
   7. USER-GENERATED CONTENT GALLERY
   ============================================ */
function initUGCGallery() {
    const ugcHTML = `
        <section id="traveler-gallery" class="ugc-section">
            <div class="section-header">
                <h2><i class="fab fa-instagram"></i> Traveler Moments</h2>
                <p>Real photos from visitors like you • #MagicalKenya</p>
                <a href="#" class="btn-small"><i class="fab fa-instagram"></i> Follow on Instagram</a>
            </div>
            <div class="ugc-grid">
                <div class="ugc-item">
                    <img src="https://images.unsplash.com/photo-1516426122078-c23e76319811?w=400" alt="Traveler photo">
                    <div class="ugc-overlay">
                        <i class="fas fa-heart"></i> 234
                    </div>
                </div>
                <div class="ugc-item">
                    <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400" alt="Traveler photo">
                    <div class="ugc-overlay">
                        <i class="fas fa-heart"></i> 189
                    </div>
                </div>
                <div class="ugc-item">
                    <img src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400" alt="Traveler photo">
                    <div class="ugc-overlay">
                        <i class="fas fa-heart"></i> 456
                    </div>
                </div>
                <div class="ugc-item">
                    <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400" alt="Traveler photo">
                    <div class="ugc-overlay">
                        <i class="fas fa-heart"></i> 312
                    </div>
                </div>
            </div>
            <p class="ugc-cta">Share your photos with <strong>#MagicalKenya</strong> for a chance to be featured!</p>
        </section>
    `;
    const quizSection = document.getElementById('cultural-quiz');
    if (quizSection) {
        quizSection.insertAdjacentHTML('afterend', ugcHTML);
    }
}

/* ============================================
   8. WHATSAPP FLOATING AGENT
   ============================================ */
function initWhatsAppAgent() {
    const whatsappHTML = `
        <a href="https://wa.me/254799284824?text=Habari! I'm interested in booking a safari to Kenya. Please help me plan my trip." 
           class="whatsapp-float" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i>
            <span class="whatsapp-tooltip">Chat with us!</span>
        </a>
    `;
    document.body.insertAdjacentHTML('beforeend', whatsappHTML);
}

/* ============================================
   9. AUDIO AMBIENCE TOGGLE (ENHANCED)
   ============================================ */
function initAudioAmbience() {
    const audioToggle = document.getElementById('audio-toggle');
    if (!audioToggle) return;
    
    const ambienceSounds = {
        'savannah': 'media/audio/savannah.mp3',
        'coast': 'media/audio/ocean.mp3',
        'forest': 'media/audio/forest.mp3',
        'city': 'media/audio/nairobi.mp3'
    };
    
    let currentAmbience = 'savannah';
    
    audioToggle.addEventListener('click', () => {
        const audio = document.getElementById('bg-audio');
        if (audio.paused) {
            audio.src = ambienceSounds[currentAmbience];
            audio.play().catch(e => console.log('Audio autoplay blocked'));
            audioToggle.textContent = '🔊';
            audioToggle.title = `Playing: ${currentAmbience} sounds`;
        } else {
            audio.pause();
            audioToggle.textContent = '🔇';
            audioToggle.title = 'Click to enable ambient sounds';
        }
    });
    
    // Change ambience based on page/section
    window.changeAmbience = function(type) {
        currentAmbience = type;
        const audio = document.getElementById('bg-audio');
        if (!audio.paused) {
            audio.src = ambienceSounds[type];
            audio.load();
            audio.play();
        }
    };
}

/* ============================================
   10. CONSERVATION TRACKER
   ============================================ */
function initConservationTracker() {
    const conservationHTML = `
        <section id="conservation-tracker" class="conservation-section">
            <div class="section-header">
                <h2><i class="fas fa-leaf"></i> Your Impact Matters</h2>
                <p>Track how your visit supports Kenyan wildlife conservation</p>
            </div>
            <div class="conservation-dashboard">
                <div class="impact-stats">
                    <div class="stat-card">
                        <i class="fas fa-tree"></i>
                        <h4>Trees Planted</h4>
                        <p class="stat-number" id="trees-count">12,450</p>
                        <small>By our travelers this year</small>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-elephant"></i>
                        <h4>Rhinos Protected</h4>
                        <p class="stat-number" id="rhinos-count">487</p>
                        <small>In partner sanctuaries</small>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-hand-holding-usd"></i>
                        <h4>Funds Raised</h4>
                        <p class="stat-number" id="funds-count">$2.3M</p>
                        <small>For local communities</small>
                    </div>
                </div>
                <div class="impact-chart">
                    <canvas id="conservationChart"></canvas>
                </div>
            </div>
            <div class="conservation-pledge">
                <h3>🌿 Our Green Pledge</h3>
                <ul>
                    <li>✓ 5% of every booking goes to conservation</li>
                    <li>✓ Carbon-offset safaris available</li>
                    <li>✓ Support for anti-poaching units</li>
                    <li>✓ Community education programs</li>
                </ul>
            </div>
        </section>
    `;
    const ugcSection = document.getElementById('traveler-gallery');
    if (ugcSection) {
        ugcSection.insertAdjacentHTML('afterend', conservationHTML);
        setTimeout(initConservationChart, 500);
    }
}

function initConservationChart() {
    const ctx = document.getElementById('conservationChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Wildlife Protection', 'Community Projects', 'Reforestation', 'Research'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#2E7D32', '#FFA726', '#42A5F5', '#AB47BC'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Conservation Fund Allocation' }
            }
        }
    });
}

// Export functions for global access
window.initSafariPlanner = initSafariPlanner;
window.initVRCorner = initVRCorner;
window.initLiveWebcams = initLiveWebcams;
window.initDynamicCalendar = initDynamicCalendar;
window.initGuideProfiles = initGuideProfiles;
window.initCulturalQuiz = initCulturalQuiz;
window.initUGCGallery = initUGCGallery;
window.initWhatsAppAgent = initWhatsAppAgent;
window.initAudioAmbience = initAudioAmbience;
window.initConservationTracker = initConservationTracker;
