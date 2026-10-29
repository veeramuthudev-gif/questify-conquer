/**
 * QUESTIFY - Achievement Hall Controller (Dynamic Zero Start)
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAchievements();
    } catch (e) {
        console.error('Failed to load achievements:', e);
    }
});

async function loadAchievements() {
    const list = await QuestifyAPI.achievements.getAll();
    const user = await QuestifyAPI.user.getProfile();

    const unlockedCount = list.filter(a => a.unlocked).length;

    // 1. Update collection count
    const sectionSpan = document.querySelector('.section-title span');
    if (sectionSpan) sectionSpan.textContent = `${unlockedCount} / ${list.length} Unlocked`;

    // 2. Dynamic Featured Next Achievement
    const nextLocked = list.find(a => !a.unlocked) || list[0];
    if (nextLocked) {
        const featuredH1 = document.querySelector('.featured-content h1');
        if (featuredH1) featuredH1.textContent = nextLocked.title;

        const featuredDesc = document.querySelector('.featured-description');
        if (featuredDesc) featuredDesc.textContent = nextLocked.description;

        const progressTopSpans = document.querySelectorAll('.achievement-progress .progress-top span');
        if (progressTopSpans.length >= 2) {
            progressTopSpans[0].textContent = `${nextLocked.current || 0} / ${nextLocked.target || 1}`;
            progressTopSpans[1].textContent = `${nextLocked.progress || 0}%`;
        }

        const progressFill = document.querySelector('.achievement-progress .progress-fill');
        if (progressFill) progressFill.style.width = `${nextLocked.progress || 0}%`;

        const badgeStatus = document.querySelector('.badge-status');
        if (badgeStatus) badgeStatus.textContent = `${nextLocked.progress || 0}% COMPLETE`;

        const rewardXp = document.querySelector('.reward-xp strong');
        if (rewardXp) rewardXp.textContent = `+${nextLocked.xpReward || 100} XP`;

        const unlockMsg = document.querySelector('.unlock-message');
        if (unlockMsg) {
            const remaining = (nextLocked.target || 1) - (nextLocked.current || 0);
            unlockMsg.innerHTML = `🔥 ${remaining} more needed to unlock!`;
        }
    }

    // 3. Render Hall Grid
    const grid = document.querySelector('.achievement-grid');
    if (grid && list.length > 0) {
        grid.innerHTML = list.map(item => {
            const isUnlocked = item.unlocked;
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" data-id="${item.id}" style="cursor: pointer; transition: transform 0.25s, box-shadow 0.25s;">
                    <div class="card-badge">
                        ${isUnlocked ? (item.badge || '🏆') : '🔒'}
                    </div>
                    <div class="card-content">
                        <span class="status">
                            ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <strong>+${item.xpReward || 100} XP</strong>
                    </div>
                </div>
            `;
        }).join('');

        // Attach click listener for details or claiming
        grid.querySelectorAll('.achievement-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const ach = list.find(a => a.id == id);
                if (!ach) return;

                if (ach.unlocked) {
                    Toast.success(`Earned +${ach.xpReward} XP. Badge proudly displayed!`, ach.title);
                } else {
                    const progress = ach.progress || 0;
                    Toast.info(`Progress: ${progress}%. Keep adventuring to unlock this milestone!`, ach.title);
                }
            });
        });
    }

    // 4. Featured Achievement Click
    const featuredCard = document.querySelector('.featured-achievement');
    if (featuredCard && nextLocked) {
        featuredCard.style.cursor = 'pointer';
        featuredCard.addEventListener('click', () => {
            Toast.info(`Complete the objectives for "${nextLocked.title}" to unlock this achievement and earn +${nextLocked.xpReward} XP!`, 'Next Milestone');
        });
    }
}