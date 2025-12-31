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
        type: 'dynamic_multiple',
        question: 'Based on your goals, here are some activities that might help you. Select the ones that interest you:',
        options: [], // Will be populated by AI based on goals
        dependsOn: 'goals'
    },
    {
        id: 'custom_interests',
        type: 'text',
        question: 'Anything else you want to explore or learn?',
        placeholder: 'E.g., learning guitar, photography, public speaking, coding...',
        required: false
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
let habitStatus = {};

// LocalStorage keys
const STORAGE_KEYS = {
    answers: 'habits_planner_answers',
    habits: 'habits_planner_habits',
    status: 'habits_planner_status'
};

// Load data from localStorage
function loadFromStorage() {
    try {
        const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
        const savedHabits = localStorage.getItem(STORAGE_KEYS.habits);
        const savedStatus = localStorage.getItem(STORAGE_KEYS.status);
        
        if (savedAnswers) {
            answers = JSON.parse(savedAnswers);
        }
        if (savedHabits) {
            generatedHabits = JSON.parse(savedHabits);
        }
        if (savedStatus) {
            habitStatus = JSON.parse(savedStatus);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

// Save answers to localStorage
function saveAnswers() {
    try {
        localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
    } catch (e) {
        console.error('Error saving answers:', e);
    }
}

// Save habits to localStorage
function saveHabits() {
    try {
        localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(generatedHabits));
    } catch (e) {
        console.error('Error saving habits:', e);
    }
}

// Save habit completion status
function saveHabitStatus() {
    try {
        localStorage.setItem(STORAGE_KEYS.status, JSON.stringify(habitStatus));
    } catch (e) {
        console.error('Error saving habit status:', e);
    }
}

// Clear all saved data
function clearStorage() {
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.habits);
    localStorage.removeItem(STORAGE_KEYS.status);
}

// Fetch AI-generated activities based on goals
async function fetchActivitiesForGoals(goals) {
    try {
        const response = await fetch('/.netlify/functions/generate-activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goals })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate activities');
        }
        
        const data = await response.json();
        return data.activities;
    } catch (error) {
        console.error('Error fetching activities:', error);
        // Return fallback activities if AI fails
        return [
            { value: 'morning_routine', label: '🌅 Morning Routine & Planning' },
            { value: 'exercise', label: '🏃 Physical Exercise' },
            { value: 'meditation', label: '🧘 Meditation & Mindfulness' },
            { value: 'reading', label: '📚 Reading & Learning' },
            { value: 'journaling', label: '✍️ Journaling & Reflection' },
            { value: 'skill_practice', label: '🎯 Skill Practice' },
            { value: 'networking', label: '🤝 Networking & Relationships' },
            { value: 'finance_review', label: '💰 Financial Review' }
        ];
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('total-questions').textContent = questions.length;
    
    // Load saved data
    loadFromStorage();
    
    // If we have saved habits, show results directly
    if (generatedHabits && generatedHabits.days) {
        renderResults();
    }
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
    // Reset dynamic question options
    questions.forEach(q => {
        if (q.type === 'dynamic_multiple') {
            q.options = [];
        }
    });
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
            
        case 'dynamic_multiple':
            // Show loading state first, then load options
            if (question.options.length === 0) {
                html += `
                    <div id="dynamic-loading" class="text-center py-8">
                        <div class="loading-spinner mx-auto mb-4"></div>
                        <p class="text-gray-600">Generating personalized activities based on your goals...</p>
                    </div>
                `;
                container.innerHTML = html;
                updateProgress();
                updateNavigationButtons();
                // Fetch activities and re-render
                loadDynamicOptions(question);
                return;
            }
            html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
            const dynamicSelectedValues = answers[question.id] || [];
            question.options.forEach(option => {
                const isSelected = dynamicSelectedValues.includes(option.value);
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

// Load dynamic options from AI
async function loadDynamicOptions(question) {
    const dependsOnValue = answers[question.dependsOn];
    if (!dependsOnValue || dependsOnValue.length === 0) {
        // Use fallback if no goals selected
        question.options = [
            { value: 'morning_routine', label: '🌅 Morning Routine & Planning' },
            { value: 'exercise', label: '🏃 Physical Exercise' },
            { value: 'meditation', label: '🧘 Meditation & Mindfulness' },
            { value: 'reading', label: '📚 Reading & Learning' }
        ];
    } else {
        question.options = await fetchActivitiesForGoals(dependsOnValue);
    }
    renderQuestion();
}

// Handle text input keypress
function handleTextKeypress(event) {
    if (event.key === 'Enter') {
        const value = event.target.value.trim();
        if (value) {
            answers[questions[currentQuestionIndex].id] = value;
            saveAnswers();
            nextQuestion();
        }
    }
}

// Select single option
function selectSingleOption(questionId, value, element) {
    answers[questionId] = value;
    saveAnswers();
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
    saveAnswers();
}

// Navigation
function nextQuestion() {
    const question = questions[currentQuestionIndex];
    
    // Validate text input
    if (question.type === 'text') {
        const input = document.getElementById('answer-input');
        if (input) {
            answers[question.id] = input.value.trim();
            saveAnswers();
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
    
    // Validate dynamic multiple selection
    if (question.type === 'dynamic_multiple' && (!answers[question.id] || answers[question.id].length === 0)) {
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
        // Check if we're going back from a dynamic question - reset its options
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion.type === 'dynamic_multiple') {
            currentQuestion.options = [];
            answers[currentQuestion.id] = []; // Clear selections too
        }
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
        saveHabits();
        habitStatus = {};
        saveHabitStatus();
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
    const customInterests = answers.custom_interests || '';
    const timeAvailability = answers.time_availability || '30-60';
    const wakeTime = answers.wake_time || 'normal';
    const challengeLevel = answers.challenge_level || 'moderate';
    
    let interestsText = interests;
    if (customInterests) {
        interestsText += interestsText ? `, ${customInterests}` : customInterests;
    }
    
    return `Create a personalized weekly habit plan for ${name} with the following profile:
    
- Age group: ${ageGroup}
- Occupation: ${occupation}
- Main goals: ${goals}
- Interests: ${interestsText}
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
    
    const container = document.getElementById('habits-grid');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const categoryColors = {
        health: '#22c55e',
        mental: '#3b82f6',
        productivity: '#f97316',
        learning: '#a855f7',
        relationships: '#ec4899',
        creativity: '#eab308',
        finance: '#10b981'
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

    // Build tabs
    let tabsHtml = '<div class="day-tabs">';
    days.forEach((day, index) => {
        tabsHtml += `
            <button class="day-tab ${index === 0 ? 'active' : ''}" data-day="${day}">
                <span class="day-tab-short">${shortDays[index]}</span>
                <span class="day-tab-full">${day}</span>
            </button>
        `;
    });
    tabsHtml += '</div>';

    // Build content for each day
    let contentHtml = '<div class="day-contents">';
    days.forEach((day, index) => {
        const habits = generatedHabits.days[day] || [];
        
        contentHtml += `<div class="day-content ${index === 0 ? 'active' : ''}" data-day="${day}">`;
        contentHtml += `<div class="habits-list">`;
        
        habits.forEach((habit, habitIndex) => {
            const color = categoryColors[habit.category] || '#6b7280';
            const icon = categoryIcons[habit.category] || '✨';
            const key = `${day}-${habitIndex}`;
            const completed = !!habitStatus[key];
            
            contentHtml += `
                <div class="habit-card ${completed ? 'completed' : ''}" style="--accent-color: ${color}; animation-delay: ${habitIndex * 0.1}s">
                    <input type="checkbox" class="habit-checkbox" data-key="${key}" ${completed ? 'checked' : ''} aria-label="Complete">
                    <div class="habit-card-icon" style="background: ${color}">${icon}</div>
                    <div class="habit-card-content">
                        <h4 class="habit-card-title">${habit.title}</h4>
                        <div class="habit-card-meta">
                            <span class="habit-card-time">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                ${habit.time}
                            </span>
                            <span class="habit-card-duration">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                                </svg>
                                ${habit.duration}
                            </span>
                        </div>
                    </div>
                    <div class="habit-card-category" style="background: ${color}20; color: ${color}">
                        ${habit.category}
                    </div>
                </div>
            `;
        });
        
        contentHtml += `</div></div>`;
    });
    contentHtml += '</div>';

    container.innerHTML = tabsHtml + contentHtml;

    // Add tab click handlers
    container.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const day = tab.dataset.day;
            
            // Update active tab
            container.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            container.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));
            container.querySelector(`.day-content[data-day="${day}"]`).classList.add('active');
        });
    });

    // Checkbox handlers
    container.querySelectorAll('.habit-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const key = e.target.dataset.key;
            habitStatus[key] = e.target.checked;
            saveHabitStatus();
            const card = e.target.closest('.habit-card');
            if (card) card.classList.toggle('completed', e.target.checked);
        });
    });
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
    clearStorage();
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

// Download plan as PDF
function downloadPlan() {
    if (!generatedHabits) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const userName = answers.name || 'User';
    
    // Colors
    const primaryColor = [99, 102, 241]; // #6366f1
    const textDark = [31, 41, 55];
    const textGray = [107, 114, 128];
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('Weekly Habits Plan', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 12;
    doc.setFontSize(14);
    doc.setTextColor(...textGray);
    doc.text(`Personalized for ${userName}`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Summary if exists
    if (generatedHabits.summary) {
        doc.setFontSize(11);
        doc.setTextColor(...textGray);
        const summaryLines = doc.splitTextToSize(generatedHabits.summary, contentWidth);
        doc.text(summaryLines, margin, yPos);
        yPos += (summaryLines.length * 6) + 10;
    }
    
    // Days
    days.forEach(day => {
        const habits = generatedHabits.days[day] || [];
        if (habits.length === 0) return;
        
        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        // Day header
        doc.setFillColor(...primaryColor);
        doc.roundedRect(margin, yPos - 5, contentWidth, 10, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text(day, margin + 5, yPos + 2);
        yPos += 12;
        
        // Habits
        habits.forEach((habit, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            // Habit title
            doc.setFontSize(11);
            doc.setTextColor(...textDark);
            const titleLines = doc.splitTextToSize(`${index + 1}. ${habit.title}`, contentWidth - 10);
            doc.text(titleLines, margin + 5, yPos);
            yPos += titleLines.length * 5;
            
            // Time and duration
            doc.setFontSize(9);
            doc.setTextColor(...textGray);
            doc.text(`${habit.time}  •  ${habit.duration}  •  ${habit.category}`, margin + 10, yPos);
            yPos += 8;
        });
        
        yPos += 5;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...textGray);
        doc.text('Weekly Habits Planner - Build Better Habits', pageWidth / 2, 290, { align: 'center' });
    }
    
    // Save
    doc.save(`weekly-habits-plan-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
