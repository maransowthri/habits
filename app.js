// Weekly Habits Planner - Main Application

// Questions for the questionnaire
const questions = [
    {
        id: 'name',
        type: 'text',
        question: "What's your name?",
        placeholder: 'Enter your name',
        required: true
    },
    {
        id: 'age_group',
        type: 'single',
        question: 'Which age group do you belong to?',
        options: [
            { value: '18-25', label: '18-25 years' },
            { value: '26-35', label: '26-35 years' },
            { value: '36-45', label: '36-45 years' },
            { value: '46-55', label: '46-55 years' },
            { value: '55+', label: '55+ years' }
        ]
    },
    {
        id: 'occupation',
        type: 'single',
        question: 'What best describes your occupation?',
        options: [
            { value: 'student', label: '📚 Student' },
            { value: 'employed', label: '💼 Employed (Office/Remote)' },
            { value: 'freelancer', label: '🎨 Freelancer/Self-employed' },
            { value: 'homemaker', label: '🏠 Homemaker' },
            { value: 'retired', label: '🌴 Retired' }
        ]
    },
    {
        id: 'goals',
        type: 'multiple',
        question: 'What are your main goals? (Select all that apply)',
        options: [
            { value: 'health', label: '💪 Improve physical health' },
            { value: 'mental', label: '🧠 Better mental wellbeing' },
            { value: 'productivity', label: '⚡ Increase productivity' },
            { value: 'learning', label: '📖 Learn new skills' },
            { value: 'relationships', label: '❤️ Strengthen relationships' },
            { value: 'creativity', label: '🎯 Boost creativity' },
            { value: 'finance', label: '💰 Financial wellness' }
        ]
    },
    {
        id: 'interests',
        type: 'multiple',
        question: 'What activities interest you?',
        options: [
            { value: 'exercise', label: '🏃 Exercise & Sports' },
            { value: 'reading', label: '📚 Reading' },
            { value: 'meditation', label: '🧘 Meditation & Mindfulness' },
            { value: 'cooking', label: '🍳 Cooking & Nutrition' },
            { value: 'music', label: '🎵 Music' },
            { value: 'art', label: '🎨 Art & Crafts' },
            { value: 'nature', label: '🌿 Nature & Outdoors' },
            { value: 'tech', label: '💻 Technology' }
        ]
    },
    {
        id: 'time_availability',
        type: 'single',
        question: 'How much time can you dedicate to habits daily?',
        options: [
            { value: '15-30', label: '⏱️ 15-30 minutes' },
            { value: '30-60', label: '⏱️ 30-60 minutes' },
            { value: '60-90', label: '⏱️ 1-1.5 hours' },
            { value: '90+', label: '⏱️ More than 1.5 hours' }
        ]
    },
    {
        id: 'wake_time',
        type: 'single',
        question: 'What time do you usually wake up?',
        options: [
            { value: 'early', label: '🌅 Early bird (5-7 AM)' },
            { value: 'normal', label: '☀️ Normal (7-9 AM)' },
            { value: 'late', label: '🌙 Late riser (9 AM+)' }
        ]
    },
    {
        id: 'challenge_level',
        type: 'single',
        question: 'How challenging do you want your habit plan to be?',
        options: [
            { value: 'easy', label: '🌱 Easy - Start small and build up' },
            { value: 'moderate', label: '🌿 Moderate - Balanced challenge' },
            { value: 'intense', label: '🔥 Intense - Push my limits' }
        ]
    }
];

// State management
let currentQuestionIndex = 0;
let answers = {};
let generatedHabits = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('total-questions').textContent = questions.length;
});

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Start the questionnaire
function startQuestionnaire() {
    currentQuestionIndex = 0;
    answers = {};
    showScreen('questionnaire-screen');
    renderQuestion();
}

// Render current question
function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    
    let html = `<h3 class="text-2xl font-bold text-gray-800 mb-6">${question.question}</h3>`;
    
    switch (question.type) {
        case 'text':
            html += `
                <input type="text" 
                       id="answer-input" 
                       class="text-input" 
                       placeholder="${question.placeholder || ''}"
                       value="${answers[question.id] || ''}"
                       onkeypress="handleTextKeypress(event)">
            `;
            break;
            
        case 'single':
            html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
            question.options.forEach(option => {
                const isSelected = answers[question.id] === option.value;
                html += `
                    <div class="option-card ${isSelected ? 'selected' : ''}" 
                         onclick="selectSingleOption('${question.id}', '${option.value}', this)">
                        <span class="text-lg">${option.label}</span>
                    </div>
                `;
            });
            html += `</div>`;
            break;
            
        case 'multiple':
            html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
            const selectedValues = answers[question.id] || [];
            question.options.forEach(option => {
                const isSelected = selectedValues.includes(option.value);
                html += `
                    <div class="checkbox-option ${isSelected ? 'selected' : ''}" 
                         onclick="toggleMultipleOption('${question.id}', '${option.value}', this)">
                        <div class="checkbox">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <span class="text-lg">${option.label}</span>
                    </div>
                `;
            });
            html += `</div>`;
            break;
    }
    
    container.innerHTML = html;
    updateProgress();
    updateNavigationButtons();
    
    // Focus text input if present
    const textInput = document.getElementById('answer-input');
    if (textInput) {
        textInput.focus();
    }
}

// Handle text input keypress
function handleTextKeypress(event) {
    if (event.key === 'Enter') {
        const value = event.target.value.trim();
        if (value) {
            answers[questions[currentQuestionIndex].id] = value;
            nextQuestion();
        }
    }
}

// Select single option
function selectSingleOption(questionId, value, element) {
    answers[questionId] = value;
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Auto-advance after selection
    setTimeout(() => nextQuestion(), 300);
}

// Toggle multiple option
function toggleMultipleOption(questionId, value, element) {
    if (!answers[questionId]) {
        answers[questionId] = [];
    }
    
    const index = answers[questionId].indexOf(value);
    if (index > -1) {
        answers[questionId].splice(index, 1);
        element.classList.remove('selected');
    } else {
        answers[questionId].push(value);
        element.classList.add('selected');
    }
}

// Navigation
function nextQuestion() {
    const question = questions[currentQuestionIndex];
    
    // Validate text input
    if (question.type === 'text') {
        const input = document.getElementById('answer-input');
        if (input) {
            answers[question.id] = input.value.trim();
        }
        if (question.required && !answers[question.id]) {
            input.classList.add('border-red-500');
            return;
        }
    }
    
    // Validate single selection
    if (question.type === 'single' && !answers[question.id]) {
        return;
    }
    
    // Validate multiple selection
    if (question.type === 'multiple' && (!answers[question.id] || answers[question.id].length === 0)) {
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        completeQuestionnaire();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (currentQuestionIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.innerHTML = `
            Generate Plan
            <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
    } else {
        nextBtn.innerHTML = `
            Next
            <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
        `;
    }
}

// Complete questionnaire
function completeQuestionnaire() {
    generateHabits();
}

// Generate habits using Netlify Function
async function generateHabits() {
    showScreen('loading-screen');
    
    const prompt = buildPrompt();
    
    try {
        const response = await fetch('/.netlify/functions/generate-habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate habits');
        }
        
        generatedHabits = await response.json();
        renderResults();
        
    } catch (error) {
        console.error('Error generating habits:', error);
        document.getElementById('error-message').textContent = error.message;
        showScreen('error-screen');
    }
}

// Build prompt from answers
function buildPrompt() {
    const name = answers.name || 'User';
    const ageGroup = answers.age_group || 'adult';
    const occupation = answers.occupation || 'employed';
    const goals = (answers.goals || []).join(', ');
    const interests = (answers.interests || []).join(', ');
    const timeAvailability = answers.time_availability || '30-60';
    const wakeTime = answers.wake_time || 'normal';
    const challengeLevel = answers.challenge_level || 'moderate';
    
    return `Create a personalized weekly habit plan for ${name} with the following profile:
    
- Age group: ${ageGroup}
- Occupation: ${occupation}
- Main goals: ${goals}
- Interests: ${interests}
- Daily time available: ${timeAvailability} minutes
- Wake up time: ${wakeTime}
- Desired challenge level: ${challengeLevel}

Create practical, specific habits that:
1. Align with their goals and interests
2. Fit their available time
3. Consider their occupation and lifestyle
4. Have appropriate timing based on wake time
5. Include a mix of morning, afternoon, and evening habits
6. Make weekends slightly different (more relaxed or personal time)
7. Are achievable given their challenge preference

Make habits specific and actionable (e.g., "10-minute morning stretch" instead of just "exercise").`;
}

// Render results
function renderResults() {
    showScreen('results-screen');
    
    const grid = document.getElementById('habits-grid');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const categoryColors = {
        health: 'bg-green-500',
        mental: 'bg-blue-500',
        productivity: 'bg-orange-500',
        learning: 'bg-purple-500',
        relationships: 'bg-pink-500',
        creativity: 'bg-yellow-500',
        finance: 'bg-emerald-500'
    };
    
    const categoryIcons = {
        health: '💪',
        mental: '🧠',
        productivity: '⚡',
        learning: '📚',
        relationships: '❤️',
        creativity: '🎨',
        finance: '💰'
    };
    
    let html = '';
    
    days.forEach(day => {
        const habits = generatedHabits.days[day] || [];
        
        html += `
            <div class="day-card">
                <div class="day-card-header">${day}</div>
                <div class="day-card-body">
        `;
        
        habits.forEach(habit => {
            const colorClass = categoryColors[habit.category] || 'bg-gray-500';
            const icon = categoryIcons[habit.category] || '✨';
            
            html += `
                <div class="habit-item">
                    <div class="habit-icon ${colorClass}">${icon}</div>
                    <div class="habit-content">
                        <div class="habit-title">${habit.title}</div>
                        <div class="habit-time">${habit.time} • ${habit.duration}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

// Regenerate habits
function regenerateHabits() {
    generateHabits();
}

// Start over
function startOver() {
    currentQuestionIndex = 0;
    answers = {};
    generatedHabits = null;
    showScreen('welcome-screen');
}

// Retry generation
function retryGeneration() {
    if (Object.keys(answers).length > 0) {
        generateHabits();
    } else {
        startOver();
    }
}

// Download plan as text
function downloadPlan() {
    if (!generatedHabits) return;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let text = `WEEKLY HABITS PLAN FOR ${(answers.name || 'User').toUpperCase()}\n`;
    text += `Generated on ${new Date().toLocaleDateString()}\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    if (generatedHabits.summary) {
        text += `${generatedHabits.summary}\n\n`;
    }
    
    days.forEach(day => {
        text += `${day.toUpperCase()}\n${'-'.repeat(20)}\n`;
        const habits = generatedHabits.days[day] || [];
        habits.forEach((habit, index) => {
            text += `${index + 1}. ${habit.title}\n`;
            text += `   Time: ${habit.time} | Duration: ${habit.duration}\n`;
        });
        text += '\n';
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-habits-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
