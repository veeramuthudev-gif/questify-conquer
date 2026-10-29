/**
 * QUESTIFY - Universal API & State Manager (Dynamic User-Input Architecture)
 * 
 * - Starts fresh at Level 1 with 0 XP, 0 Streak, 0 Quests Completed.
 * - Every quest created by the user earns XP and levels them up dynamically.
 * - Works seamlessly with Spring Boot REST API and falls back to LocalStorage when offline.
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Fresh starter user configuration
const DEFAULT_USER = {
    id: 1,
    username: 'Adventurer',
    email: '',
    rank: 'Novice Adventurer',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    currentStreak: 0,
    bestStreak: 0,
    questsCompleted: 0,
    joinedDate: 'Adventurer since 2026',
    avatar: './IMAGES/gamer.jfif'
};

// Clean starter quest for onboarding
const DEFAULT_QUESTS = [
    {
        id: 1,
        title: 'Begin Your Journey',
        description: 'Welcome to Questify! Complete your first task, earn your first XP, and level up.',
        category: 'Personal',
        difficulty: 'Easy',
        xpReward: 50,
        timeLimit: '15 min',
        type: 'Daily',
        status: 'IN_PROGRESS',
        icon: 'fa-compass',
        color: 'purple',
        objectives: [
            { id: 101, title: 'Complete your first daily goal', current: 0, target: 1, unit: 'task' }
        ]
    }
];

// Clean achievements starting at 0%
const DEFAULT_ACHIEVEMENTS = [
    {
        id: 1,
        title: 'First Victory',
        description: 'Complete your first quest.',
        badge: '🏆',
        xpReward: 100,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 1
    },
    {
        id: 2,
        title: '3 Day Warrior',
        description: 'Maintain a 3 day streak.',
        badge: '🔥',
        xpReward: 150,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 3
    },
    {
        id: 3,
        title: 'XP Seeker',
        description: 'Earn 250 total XP.',
        badge: '⚡',
        xpReward: 200,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 250
    },
    {
        id: 4,
        title: 'Quest Apprentice',
        description: 'Complete 5 quests.',
        badge: '🎯',
        xpReward: 250,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 5
    },
    {
        id: 5,
        title: '7 Day Legend',
        description: 'Maintain a 7 day streak.',
        badge: '🔒',
        xpReward: 500,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 7
    },
    {
        id: 6,
        title: 'XP Titan',
        description: 'Reach 1,000 total XP.',
        badge: '🔒',
        xpReward: 750,
        unlocked: false,
        progress: 0,
        current: 0,
        target: 1000
    }
];

const DEFAULT_SETTINGS = {
    username: 'Adventurer',
    email: '',
    darkMode: true,
    animatedInterface: true,
    streakReminders: true,
    questReminders: true,
    achievementAlerts: true,
    dailySuggestions: true,
    xpCelebration: true
};

const DEFAULT_WEEKLY_ACTIVITY = [
    { day: 'MON', height: 0, active: false },
    { day: 'TUE', height: 0, active: false },
    { day: 'WED', height: 0, active: false },
    { day: 'THU', height: 0, active: false },
    { day: 'FRI', height: 0, active: false },
    { day: 'SAT', height: 0, active: false },
    { day: 'SUN', height: 0, active: false }
];

function calculateRank(level) {
    if (level >= 15) return 'Legendary Hero';
    if (level >= 10) return 'Quest Master';
    if (level >= 5) return 'Explorer';
    return 'Novice Adventurer';
}

function seedInitialStorage() {
    // If old seeded data exists with Veera/Level 12, reset it so it starts from zero
    const storedUser = JSON.parse(localStorage.getItem('questify_user') || 'null');
    if (!storedUser || storedUser.username === 'Veera' || storedUser.level > 10) {
        localStorage.setItem('questify_user', JSON.stringify(DEFAULT_USER));
        localStorage.setItem('questify_quests', JSON.stringify(DEFAULT_QUESTS));
        localStorage.setItem('questify_achievements', JSON.stringify(DEFAULT_ACHIEVEMENTS));
        localStorage.setItem('questify_settings', JSON.stringify(DEFAULT_SETTINGS));
        localStorage.setItem('questify_weekly', JSON.stringify(DEFAULT_WEEKLY_ACTIVITY));
    }
}
seedInitialStorage();

const QuestifyAPI = {
    backendAvailable: null,

    async isBackendOnline() {
        if (this.backendAvailable !== null) return this.backendAvailable;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);
            const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'omit', signal: controller.signal });
            clearTimeout(timeoutId);
            this.backendAvailable = res.ok;
        } catch (e) {
            this.backendAvailable = false;
        }
        return this.backendAvailable;
    },

    auth: {
        async login(email, password) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Login failed');
                localStorage.setItem('questify_token', data.token || 'backend_token');
                localStorage.setItem('questify_user', JSON.stringify(data.user));
                return data;
            } else {
                let user = JSON.parse(localStorage.getItem('questify_user') || '{}');
                if (user.email && user.email !== email) {
                    throw new Error('Account not found for this email. Please sign up.');
                }
                user.email = email;
                localStorage.setItem('questify_user', JSON.stringify(user));
                localStorage.setItem('questify_token', 'mock_token_' + Date.now());
                return { success: true, user, message: 'Welcome back!' };
            }
        },

        async signup(fullName, email, password) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: fullName, email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Signup failed');
                localStorage.setItem('questify_token', data.token || 'backend_token');
                localStorage.setItem('questify_user', JSON.stringify(data.user));
                return data;
            } else {
                const user = {
                    ...DEFAULT_USER,
                    username: fullName || 'Adventurer',
                    email: email || '',
                    level: 1,
                    xp: 0,
                    totalXp: 0,
                    questsCompleted: 0,
                    currentStreak: 0,
                    rank: 'Novice Adventurer'
                };
                localStorage.setItem('questify_user', JSON.stringify(user));
                localStorage.setItem('questify_token', 'mock_token_' + Date.now());
                return { success: true, user, message: 'Account created successfully!' };
            }
        },

        logout() {
            localStorage.removeItem('questify_token');
            window.location.href = 'login.html';
        },

        getCurrentUser() {
            return JSON.parse(localStorage.getItem('questify_user') || JSON.stringify(DEFAULT_USER));
        }
    },

    user: {
        async getProfile() {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/user/profile`);
                if (res.ok) return await res.json();
            }
            return JSON.parse(localStorage.getItem('questify_user') || JSON.stringify(DEFAULT_USER));
        },

        async updateProfile(updates) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('questify_user', JSON.stringify(data));
                    return data;
                }
            }
            let user = JSON.parse(localStorage.getItem('questify_user') || JSON.stringify(DEFAULT_USER));
            user = { ...user, ...updates };
            localStorage.setItem('questify_user', JSON.stringify(user));
            return user;
        },

        async addXp(amount) {
            let user = await this.getProfile();
            user.xp = (user.xp || 0) + amount;
            user.totalXp = (user.totalXp || 0) + amount;

            let leveledUp = false;
            while (user.xp >= user.xpToNextLevel) {
                user.xp -= user.xpToNextLevel;
                user.level = (user.level || 1) + 1;
                user.xpToNextLevel = Math.round(user.xpToNextLevel * 1.3);
                user.rank = calculateRank(user.level);
                leveledUp = true;
            }

            await this.updateProfile(user);

            // Check achievements progression
            await QuestifyAPI.achievements.checkProgress(user);

            return { user, leveledUp };
        }
    },

    quests: {
        async getAll() {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/quests`);
                if (res.ok) return await res.json();
            }
            return JSON.parse(localStorage.getItem('questify_quests') || JSON.stringify(DEFAULT_QUESTS));
        },

        async getById(id) {
            const all = await this.getAll();
            return all.find(q => q.id == id) || all[0];
        },

        async create(questData) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/quests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(questData)
                });
                if (res.ok) return await res.json();
            }

            const quests = await this.getAll();
            const newQuest = {
                id: Date.now(),
                title: questData.title || 'Untitled Quest',
                description: questData.description || 'No description provided.',
                category: questData.category || 'General',
                difficulty: questData.difficulty || 'Medium',
                xpReward: parseInt(questData.xpReward) || 100,
                timeLimit: questData.timeLimit || '30 mins',
                type: questData.type || 'Daily',
                status: 'IN_PROGRESS',
                icon: questData.icon || 'fa-crosshairs',
                color: questData.color || 'purple',
                objectives: questData.objectives || [
                    { id: Date.now() + 1, title: `Complete: ${questData.title}`, current: 0, target: 1, unit: 'task' }
                ],
                createdAt: new Date().toISOString()
            };

            quests.unshift(newQuest);
            localStorage.setItem('questify_quests', JSON.stringify(quests));
            return newQuest;
        },

        async complete(id) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/quests/${id}/complete`, { method: 'POST' });
                if (res.ok) return await res.json();
            }

            const quests = await this.getAll();
            const quest = quests.find(q => q.id == id);
            if (quest && quest.status !== 'COMPLETED') {
                quest.status = 'COMPLETED';
                if (quest.objectives) {
                    quest.objectives.forEach(o => o.current = o.target);
                }
                localStorage.setItem('questify_quests', JSON.stringify(quests));

                // Increment quests and streak
                let user = await QuestifyAPI.user.getProfile();
                user.questsCompleted = (user.questsCompleted || 0) + 1;
                if (!user.currentStreak) user.currentStreak = 1;
                if (user.currentStreak > (user.bestStreak || 0)) {
                    user.bestStreak = user.currentStreak;
                }
                await QuestifyAPI.user.updateProfile(user);

                // Award XP
                const xpGain = quest.xpReward || 100;
                const xpResult = await QuestifyAPI.user.addXp(xpGain);

                return { success: true, quest, xpGain, ...xpResult };
            }
            return { success: false, quest };
        },

        async updateObjective(questId, objectiveId, newCurrent) {
            const quests = await this.getAll();
            const quest = quests.find(q => q.id == questId);
            if (quest && quest.objectives) {
                const obj = quest.objectives.find(o => o.id == objectiveId);
                if (obj) {
                    obj.current = Math.min(newCurrent, obj.target);
                    localStorage.setItem('questify_quests', JSON.stringify(quests));
                    return { success: true, objective: obj };
                }
            }
            return { success: false };
        }
    },

    progress: {
        async getStats() {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/progress/stats`);
                if (res.ok) return await res.json();
            }
            const user = await QuestifyAPI.user.getProfile();
            const quests = await QuestifyAPI.quests.getAll();
            const completedCount = user.questsCompleted || 0;
            const overall = Math.min(100, completedCount * 10);

            return {
                overallProgress: overall,
                streak: user.currentStreak || 0,
                bestStreak: user.bestStreak || 0,
                totalXp: user.totalXp || 0,
                currentLevel: user.level || 1,
                questsCompleted: completedCount,
                weeklyXpGain: user.xp || 0
            };
        },

        async getWeeklyChart() {
            return JSON.parse(localStorage.getItem('questify_weekly') || JSON.stringify(DEFAULT_WEEKLY_ACTIVITY));
        }
    },

    achievements: {
        async getAll() {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/achievements`);
                if (res.ok) return await res.json();
            }
            return JSON.parse(localStorage.getItem('questify_achievements') || JSON.stringify(DEFAULT_ACHIEVEMENTS));
        },

        async checkProgress(user) {
            const list = await this.getAll();
            let changed = false;

            list.forEach(a => {
                if (a.title === 'First Victory') {
                    a.current = Math.min(1, user.questsCompleted || 0);
                    a.progress = (user.questsCompleted >= 1) ? 100 : 0;
                    if (user.questsCompleted >= 1 && !a.unlocked) { a.unlocked = true; changed = true; }
                } else if (a.title === '3 Day Warrior') {
                    a.current = Math.min(3, user.currentStreak || 0);
                    a.progress = Math.min(100, Math.round(((user.currentStreak || 0) / 3) * 100));
                    if (user.currentStreak >= 3 && !a.unlocked) { a.unlocked = true; changed = true; }
                } else if (a.title === 'XP Seeker') {
                    a.current = Math.min(250, user.totalXp || 0);
                    a.progress = Math.min(100, Math.round(((user.totalXp || 0) / 250) * 100));
                    if (user.totalXp >= 250 && !a.unlocked) { a.unlocked = true; changed = true; }
                } else if (a.title === 'Quest Apprentice') {
                    a.current = Math.min(5, user.questsCompleted || 0);
                    a.progress = Math.min(100, Math.round(((user.questsCompleted || 0) / 5) * 100));
                    if (user.questsCompleted >= 5 && !a.unlocked) { a.unlocked = true; changed = true; }
                } else if (a.title === '7 Day Legend') {
                    a.current = Math.min(7, user.currentStreak || 0);
                    a.progress = Math.min(100, Math.round(((user.currentStreak || 0) / 7) * 100));
                    if (user.currentStreak >= 7 && !a.unlocked) { a.unlocked = true; changed = true; }
                } else if (a.title === 'XP Titan') {
                    a.current = Math.min(1000, user.totalXp || 0);
                    a.progress = Math.min(100, Math.round(((user.totalXp || 0) / 1000) * 100));
                    if (user.totalXp >= 1000 && !a.unlocked) { a.unlocked = true; changed = true; }
                }
            });

            if (changed) {
                localStorage.setItem('questify_achievements', JSON.stringify(list));
            }
            return list;
        },

        async claim(id) {
            const list = await this.getAll();
            const achievement = list.find(a => a.id == id);
            if (achievement && !achievement.unlocked && achievement.progress >= 100) {
                achievement.unlocked = true;
                localStorage.setItem('questify_achievements', JSON.stringify(list));
                await QuestifyAPI.user.addXp(achievement.xpReward || 100);
                return { success: true, achievement };
            }
            return { success: false, achievement };
        }
    },

    settings: {
        async get() {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/settings`);
                if (res.ok) return await res.json();
            }
            return JSON.parse(localStorage.getItem('questify_settings') || JSON.stringify(DEFAULT_SETTINGS));
        },

        async update(newSettings) {
            const online = await QuestifyAPI.isBackendOnline();
            if (online) {
                const res = await fetch(`${API_BASE_URL}/settings`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                });
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('questify_settings', JSON.stringify(data));
                    return data;
                }
            }
            let settings = JSON.parse(localStorage.getItem('questify_settings') || JSON.stringify(DEFAULT_SETTINGS));
            settings = { ...settings, ...newSettings };
            localStorage.setItem('questify_settings', JSON.stringify(settings));

            if (newSettings.username || newSettings.email) {
                const user = await QuestifyAPI.user.getProfile();
                if (newSettings.username) user.username = newSettings.username;
                if (newSettings.email) user.email = newSettings.email;
                await QuestifyAPI.user.updateProfile(user);
            }

            return settings;
        }
    }
};

window.QuestifyAPI = QuestifyAPI;
