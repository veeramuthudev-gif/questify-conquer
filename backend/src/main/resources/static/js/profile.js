/**
 * QUESTIFY - Adventurer Profile Controller (Dynamic Real User State)
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadProfileData();
    } catch (e) {
        console.error('Failed to load profile:', e);
    }
});

async function loadProfileData() {
    const user = await QuestifyAPI.user.getProfile();
    const achievements = await QuestifyAPI.achievements.getAll();
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    // 1. Header & Hero Information
    const eyebrowSpan = document.querySelector('.page-header h2 span');
    if (eyebrowSpan) eyebrowSpan.textContent = `${user.username || 'Adventurer'} 👋`;

    const profileHeroH1 = document.querySelector('.user-details h1');
    if (profileHeroH1) profileHeroH1.textContent = user.username || 'Adventurer';

    const rankP = document.querySelector('.user-details .rank');
    if (rankP) rankP.innerHTML = `<i class="fa-solid fa-crown"></i> ${user.rank || 'Novice Adventurer'}`;

    // 2. Level Card
    const levelH2 = document.querySelector('.level-heading h2');
    if (levelH2) levelH2.textContent = `LEVEL ${String(user.level || 1).padStart(2, '0')}`;

    const levelRankP = document.querySelector('.level-heading p:last-child');
    if (levelRankP) levelRankP.textContent = user.rank || 'Novice Adventurer';

    const xpDetails = document.querySelectorAll('.xp-details span');
    if (xpDetails.length >= 2) {
        xpDetails[0].textContent = `${user.xp || 0} XP`;
        xpDetails[1].textContent = `${user.xpToNextLevel || 100} XP`;
    }

    const xpFill = document.querySelector('.xp-bar .xp-fill');
    const percent = Math.min(100, Math.round(((user.xp || 0) / (user.xpToNextLevel || 100)) * 100));
    if (xpFill) xpFill.style.width = `${percent}%`;

    const levelBottomPercent = document.querySelector('.level-bottom span');
    if (levelBottomPercent) levelBottomPercent.textContent = `${percent}%`;

    const levelBottomP = document.querySelector('.level-bottom p');
    if (levelBottomP) {
        const remaining = (user.xpToNextLevel || 100) - (user.xp || 0);
        levelBottomP.innerHTML = `🔥 Only <strong>${remaining} XP</strong> left to reach Level ${String((user.level || 1) + 1).padStart(2, '0')}!`;
    }

    // 3. Stats Grid
    const statCards = document.querySelectorAll('.stats-grid .stat-card');
    if (statCards.length >= 4) {
        // Streak
        const streakH2 = statCards[0].querySelector('h2');
        if (streakH2) streakH2.textContent = `${user.currentStreak || 0} Days`;

        // Total XP
        const xpH2 = statCards[1].querySelector('h2');
        if (xpH2) xpH2.textContent = `${(user.totalXp || 0).toLocaleString()} XP`;

        // Quests Completed
        const questsH2 = statCards[2].querySelector('h2');
        if (questsH2) questsH2.textContent = user.questsCompleted || 0;

        // Achievements
        const achH2 = statCards[3].querySelector('h2');
        if (achH2) achH2.textContent = `${unlockedAchievements} / ${achievements.length}`;
    }

    // 4. Streak Card
    const streakCardH2 = document.querySelector('.streak-card h2');
    if (streakCardH2) streakCardH2.textContent = `${user.bestStreak || 0} Days`;

    // 5. Productivity Overview Bars
    const completionBar = document.querySelector('.completion');
    const goalsBar = document.querySelector('.goals');
    const consistencyBar = document.querySelector('.consistency');
    const performanceTopStrongs = document.querySelectorAll('.performance-top strong');

    const completionRate = user.questsCompleted ? Math.min(100, user.questsCompleted * 20) : 0;
    const goalsRate = user.questsCompleted ? Math.min(100, user.questsCompleted * 15) : 0;
    const consistencyRate = user.currentStreak ? Math.min(100, user.currentStreak * 15) : 0;

    if (completionBar) completionBar.style.width = `${completionRate}%`;
    if (goalsBar) goalsBar.style.width = `${goalsRate}%`;
    if (consistencyBar) consistencyBar.style.width = `${consistencyRate}%`;

    if (performanceTopStrongs.length >= 3) {
        performanceTopStrongs[0].textContent = `${completionRate}%`;
        performanceTopStrongs[1].textContent = `${goalsRate}%`;
        performanceTopStrongs[2].textContent = `${consistencyRate}%`;
    }

    // 6. Recent Achievements Section
    const achGrid = document.querySelector('.recent-section .achievement-grid');
    if (achGrid) {
        const unlockedList = achievements.filter(a => a.unlocked);
        if (unlockedList.length > 0) {
            achGrid.innerHTML = unlockedList.slice(0, 3).map(a => `
                <div class="achievement-mini">
                    <div class="mini-icon">${a.badge || '🏆'}</div>
                    <div>
                        <h3>${a.title}</h3>
                        <p>${a.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            achGrid.innerHTML = `
                <div class="achievement-mini" style="opacity: 0.6;">
                    <div class="mini-icon">🔒</div>
                    <div>
                        <h3>No Badges Yet</h3>
                        <p>Complete quests to forge your legacy</p>
                    </div>
                </div>
            `;
        }
    }
}