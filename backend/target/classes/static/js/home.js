/**
 * QUESTIFY - Home Page Dashboard Controller (Dynamic User State)
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadDashboardData();
    } catch (e) {
        console.error('Failed to load dashboard data:', e);
    }
});

async function loadDashboardData() {
    const user = await QuestifyAPI.user.getProfile();
    const quests = await QuestifyAPI.quests.getAll();

    // 1. Update Header Greeting
    const welcomeP = document.querySelector('.welcome p:first-child');
    if (welcomeP) {
        welcomeP.textContent = `WELCOME BACK, ${(user.username || 'ADVENTURER').toUpperCase()}`;
    }

    // 2. Update Sidebar Level & Rank
    const sidebarCircle = document.querySelector('.sidebar-level .level-circle');
    if (sidebarCircle) sidebarCircle.textContent = String(user.level || 1).padStart(2, '0');

    const sidebarRank = document.querySelector('.sidebar-level h3');
    if (sidebarRank) sidebarRank.textContent = user.rank || 'Novice Adventurer';

    // 3. Update Hero Level Card
    const heroLevelH2 = document.querySelector('.hero-level .level-top h2');
    if (heroLevelH2) heroLevelH2.textContent = `Level ${user.level || 1}`;

    const progressInfoSpans = document.querySelectorAll('.hero-level .progress-info span');
    if (progressInfoSpans.length >= 2) {
        progressInfoSpans[1].textContent = `${user.xp || 0} / ${user.xpToNextLevel || 100} XP`;
    }

    const progressFill = document.querySelector('.hero-level .progress-fill');
    if (progressFill) {
        const percent = Math.min(100, Math.round(((user.xp || 0) / (user.xpToNextLevel || 100)) * 100));
        progressFill.style.width = `${percent}%`;
    }

    const levelMessage = document.querySelector('.hero-level .level-message');
    if (levelMessage) {
        const remaining = (user.xpToNextLevel || 100) - (user.xp || 0);
        levelMessage.innerHTML = `<i class="fa-solid fa-fire"></i> Only ${remaining} XP to reach Level ${(user.level || 1) + 1}!`;
    }

    // 4. Update Stat Cards (Starting from 0)
    const statCards = document.querySelectorAll('.stats .stat-card');
    if (statCards.length >= 3) {
        // Streak Card
        const streakH2 = statCards[0].querySelector('h2');
        if (streakH2) streakH2.textContent = `${user.currentStreak || 0} Days`;

        // Total XP Card
        const xpH2 = statCards[1].querySelector('h2');
        if (xpH2) xpH2.textContent = `${(user.totalXp || 0).toLocaleString()} XP`;

        // Quests Completed Card
        const completedH2 = statCards[2].querySelector('h2');
        if (completedH2) completedH2.textContent = `${user.questsCompleted || 0} Quests`;
    }

    // 5. Populate Today's Quests Grid
    const questGrid = document.querySelector('.quest-grid');
    if (questGrid) {
        if (!quests || quests.length === 0) {
            questGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 18px;">
                    <i class="fa-solid fa-scroll" style="font-size: 38px; color: #a855f7; margin-bottom: 12px; display: block;"></i>
                    <h3 style="font-size: 18px; margin-bottom: 8px;">No Quests Created Yet</h3>
                    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 18px;">You start with a clean slate! Create your own quest to earn XP and level up.</p>
                    <a href="create.html" class="hero-btn" style="display: inline-flex; width: auto; padding: 10px 24px; text-decoration: none;">
                        <span>Create First Quest</span> <i class="fa-solid fa-plus"></i>
                    </a>
                </div>
            `;
        } else {
            const activeQuests = quests.slice(0, 3);
            questGrid.innerHTML = activeQuests.map(q => {
                const isCompleted = q.status === 'COMPLETED';
                return `
                    <div class="quest-card" data-quest-id="${q.id}">
                        <div class="quest-top">
                            <div class="quest-icon ${q.color || 'purple'}">
                                <i class="fa-solid ${q.icon || 'fa-scroll'}"></i>
                            </div>
                            <span class="xp-reward">
                                +${q.xpReward || 50} XP
                            </span>
                        </div>
                        <h3>${q.title}</h3>
                        <p>${q.description}</p>
                        <div class="quest-bottom">
                            <span>
                                <i class="fa-regular fa-clock"></i>
                                ${q.timeLimit || '30 min'}
                            </span>
                            ${isCompleted ? `
                                <span class="completed-badge" style="color: #10b981; font-weight: 700; font-size: 13px;">
                                    <i class="fa-solid fa-check"></i> Done
                                </span>
                            ` : `
                                <a href="quests.html?id=${q.id}" class="quest-action-btn">
                                    Start
                                    <i class="fa-solid fa-arrow-right"></i>
                                </a>
                            `}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}