/**
 * QUESTIFY - Progress Tracker & Performance Analytics (Dynamic Zero Start)
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadProgressData();
    } catch (e) {
        console.error('Failed to load progress data:', e);
    }
});

async function loadProgressData() {
    const user = await QuestifyAPI.user.getProfile();
    const stats = await QuestifyAPI.progress.getStats();
    const weekly = await QuestifyAPI.progress.getWeeklyChart();

    // 1. Level badge in header
    const levelBadgeH3 = document.querySelector('.level-badge h3');
    if (levelBadgeH3) levelBadgeH3.textContent = `LEVEL ${String(user.level || 1).padStart(2, '0')}`;

    // 2. Overall Progress (starts from 0%)
    const overallH1 = document.querySelector('.overall-left h1');
    if (overallH1) overallH1.innerHTML = `${stats.overallProgress}<span>%</span>`;

    const overallTopSpan = document.querySelector('.overall-progress .progress-top span:last-child');
    if (overallTopSpan) overallTopSpan.textContent = `${stats.overallProgress}%`;

    const overallFill = document.querySelector('.overall-progress .progress-fill');
    if (overallFill) overallFill.style.width = `${stats.overallProgress}%`;

    const streakCircleStrong = document.querySelector('.overall-circle strong');
    if (streakCircleStrong) streakCircleStrong.textContent = user.currentStreak || 0;

    // 3. Stats Grid
    const statCards = document.querySelectorAll('.stats-grid .stat-card');
    if (statCards.length >= 3) {
        // Quests Completed
        const questsH2 = statCards[0].querySelector('h2');
        if (questsH2) questsH2.textContent = user.questsCompleted || 0;

        // Total XP
        const xpH2 = statCards[1].querySelector('h2');
        if (xpH2) xpH2.textContent = (user.totalXp || 0).toLocaleString();

        // Best Streak
        const streakH2 = statCards[2].querySelector('h2');
        if (streakH2) streakH2.textContent = user.bestStreak || 0;
    }

    // 4. Weekly Chart Bar heights & interactivity
    const chartBars = document.querySelectorAll('.chart .bar-item');
    if (chartBars.length > 0 && weekly) {
        chartBars.forEach((barItem, idx) => {
            const data = weekly[idx];
            if (data) {
                const span = barItem.querySelector('.bar span');
                if (span) {
                    span.style.height = `${data.height}%`;
                    span.title = `${data.day}: ${data.height}% completed`;
                }

                barItem.style.cursor = 'pointer';
                barItem.addEventListener('click', () => {
                    Toast.info(`${data.day}: Activity is at ${data.height}% productivity.`, 'Daily Performance');
                });
            }
        });
    }

    // 5. XP Panel / Next Level
    const xpLevelStrong = document.querySelector('.xp-panel .level-number strong');
    if (xpLevelStrong) xpLevelStrong.textContent = String(user.level || 1).padStart(2, '0');

    const xpInfoSpans = document.querySelectorAll('.xp-panel .xp-info span');
    if (xpInfoSpans.length >= 2) {
        xpInfoSpans[0].textContent = `${user.xp || 0} XP`;
        xpInfoSpans[1].textContent = `${user.xpToNextLevel || 100} XP`;
    }

    const xpFill = document.querySelector('.xp-panel .xp-fill');
    if (xpFill) {
        const percent = Math.min(100, Math.round(((user.xp || 0) / (user.xpToNextLevel || 100)) * 100));
        xpFill.style.width = `${percent}%`;
    }

    const remainingP = document.querySelector('.xp-panel .remaining');
    if (remainingP) {
        const remaining = (user.xpToNextLevel || 100) - (user.xp || 0);
        remainingP.textContent = `⚡ ${remaining} XP remaining to Level ${String((user.level || 1) + 1).padStart(2, '0')}`;
    }

    // 6. Next Achievement Progress Card
    try {
        const achievements = await QuestifyAPI.achievements.getAll();
        const nextAch = achievements.find(a => !a.unlocked) || achievements[0];
        if (nextAch) {
            const achH2 = document.querySelector('.achievement-progress h2');
            if (achH2) achH2.textContent = nextAch.title;

            const achFill = document.querySelector('.achievement-progress .achievement-fill');
            if (achFill) achFill.style.width = `${nextAch.progress || 0}%`;

            const achSpan = document.querySelector('.achievement-progress .achievement-content span');
            if (achSpan) achSpan.textContent = `${nextAch.current || 0} / ${nextAch.target || 1} completed`;

            const achPercent = document.querySelector('.achievement-progress .achievement-percent');
            if (achPercent) achPercent.textContent = `${nextAch.progress || 0}%`;
        }
    } catch (err) {
        console.warn('Could not load achievements for progress card:', err);
    }
}
