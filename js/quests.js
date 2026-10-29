/**
 * QUESTIFY - Quest Overview & Objective Tracker (Dynamic)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const questId = urlParams.get('id');

    try {
        await loadQuestDetails(questId);
    } catch (e) {
        console.error('Failed to load quest details:', e);
    }
});

async function loadQuestDetails(id) {
    const user = await QuestifyAPI.user.getProfile();
    const allQuests = await QuestifyAPI.quests.getAll();
    let quest = id ? allQuests.find(q => q.id == id) : allQuests[0];

    // 1. Sidebar level & rank
    const sidebarCircle = document.querySelector('.quest-sidebar .level-circle');
    if (sidebarCircle) sidebarCircle.textContent = String(user.level || 1).padStart(2, '0');

    const sidebarRank = document.querySelector('.quest-sidebar h3');
    if (sidebarRank) sidebarRank.textContent = user.rank || 'Novice Adventurer';

    if (!quest) {
        // Empty State: Prompt user to create their first quest
        const heroSection = document.querySelector('.quest-hero');
        if (heroSection) {
            heroSection.innerHTML = `
                <div class="hero-content" style="max-width: 100%; text-align: center;">
                    <p class="chapter">CHAPTER — 01</p>
                    <h1>Your Journey <span>Awaits</span></h1>
                    <p class="hero-description">You haven't forged any quests yet. Create your first goal to earn XP and level up!</p>
                    <div style="margin-top: 24px;">
                        <a href="create.html" class="start-btn" style="display: inline-flex; width: auto; padding: 12px 28px; text-decoration: none;">
                            <span>Create Your First Quest</span> <i class="fa-solid fa-plus"></i>
                        </a>
                    </div>
                </div>
            `;
        }
        const questInfo = document.querySelector('.quest-info');
        if (questInfo) questInfo.style.display = 'none';
        const progressSec = document.querySelector('.progress-section');
        if (progressSec) progressSec.style.display = 'none';
        const startArea = document.querySelector('.start-area');
        if (startArea) startArea.style.display = 'none';
        return;
    }

    // 2. Quest Title & Details
    const heroTitle = document.querySelector('.quest-hero h1');
    if (heroTitle && quest.title) {
        const parts = quest.title.split(' ');
        if (parts.length > 1) {
            const last = parts.pop();
            heroTitle.innerHTML = `${parts.join(' ')} <span>${last}</span>`;
        } else {
            heroTitle.innerHTML = `<span>${quest.title}</span>`;
        }
    }

    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc && quest.description) {
        heroDesc.textContent = quest.description;
    }

    // Details Grid (Duration, Difficulty, XP)
    const detailsGrid = document.querySelector('.details-grid');
    if (detailsGrid) {
        const strongs = detailsGrid.querySelectorAll('strong');
        if (strongs.length >= 3) {
            strongs[0].textContent = quest.timeLimit || '30 Min';
            strongs[1].textContent = quest.difficulty || 'Medium';
            strongs[2].textContent = `+${quest.xpReward || 50} XP`;
        }
    }

    // 3. Render Objectives
    renderObjectives(quest);

    // 4. Update Quest Progress Percentage
    updateProgressDisplay(quest);

    // 5. Action Button
    setupActionButton(quest);
}

function renderObjectives(quest) {
    const objectivesContainer = document.querySelector('.info-card.objectives');
    if (!objectivesContainer) return;

    const objectives = quest.objectives || [
        { id: 1, title: 'Complete challenge', current: 0, target: 1 }
    ];

    const existing = objectivesContainer.querySelectorAll('.objective');
    existing.forEach(e => e.remove());

    objectives.forEach(obj => {
        const isDone = obj.current >= obj.target;
        const percent = Math.min(100, Math.round((obj.current / obj.target) * 100));

        const div = document.createElement('div');
        div.className = 'objective';
        div.style.cursor = 'pointer';
        div.title = 'Click to advance objective';

        div.innerHTML = `
            <div class="objective-icon ${isDone ? 'blue' : ''}" style="transition: all 0.3s;">
                <i class="fa-solid ${isDone ? 'fa-check' : 'fa-bolt'}"></i>
            </div>
            <div class="objective-content" style="flex: 1;">
                <div class="objective-title">
                    <h3>${obj.title}</h3>
                    <span>${obj.current} / ${obj.target}</span>
                </div>
                <div class="objective-bar">
                    <div class="objective-fill" style="width: ${percent}%; background: ${isDone ? '#10b981' : 'linear-gradient(90deg, #7c3aed, #3b82f6)'};"></div>
                </div>
            </div>
        `;

        div.addEventListener('click', async () => {
            if (obj.current < obj.target) {
                obj.current = Math.min(obj.target, obj.current + 1);
                await QuestifyAPI.quests.updateObjective(quest.id, obj.id, obj.current);
                Toast.info(`Progress: ${obj.title} (${obj.current}/${obj.target})`);
                renderObjectives(quest);
                updateProgressDisplay(quest);
                setupActionButton(quest);
            } else {
                Toast.success(`${obj.title} is already finished!`, 'Objective Complete');
            }
        });

        objectivesContainer.appendChild(div);
    });
}

function calculateQuestPercentage(quest) {
    if (!quest.objectives || quest.objectives.length === 0) return quest.status === 'COMPLETED' ? 100 : 0;
    let totalTarget = 0;
    let totalCurrent = 0;
    quest.objectives.forEach(o => {
        totalTarget += o.target;
        totalCurrent += Math.min(o.current, o.target);
    });
    return Math.round((totalCurrent / totalTarget) * 100);
}

function updateProgressDisplay(quest) {
    const progressSection = document.querySelector('.progress-section');
    if (!progressSection) return;

    const strong = progressSection.querySelector('.progress-number strong');
    const percent = quest.status === 'COMPLETED' ? 100 : calculateQuestPercentage(quest);

    if (strong) strong.textContent = `${percent}%`;
}

function setupActionButton(quest) {
    const startArea = document.querySelector('.start-area');
    if (!startArea) return;

    const isAllObjectivesMet = (quest.objectives || []).every(o => o.current >= o.target);
    const isCompleted = quest.status === 'COMPLETED';

    startArea.innerHTML = '';
    const btn = document.createElement('a');
    btn.className = 'start-btn';
    btn.href = '#';

    if (isCompleted) {
        btn.innerHTML = `<span>Quest Completed</span> <i class="fa-solid fa-trophy"></i>`;
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.cursor = 'default';
    } else if (isAllObjectivesMet) {
        btn.innerHTML = `<span>Claim Victory (+${quest.xpReward || 50} XP)</span> <i class="fa-solid fa-gift"></i>`;
        btn.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
        btn.onclick = async (e) => {
            e.preventDefault();
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Claiming...`;

            const result = await QuestifyAPI.quests.complete(quest.id);

            Toast.xp(quest.xpReward || 50, 'Quest successfully cleared!');

            if (result && result.leveledUp) {
                Toast.modal({
                    icon: '👑',
                    title: `LEVEL UP! LEVEL ${result.user.level}`,
                    message: `You conquered "${quest.title}" and reached Level ${result.user.level}!`,
                    btnText: 'Claim Glory',
                    onConfirm: () => window.location.reload()
                });
            } else {
                setTimeout(() => window.location.reload(), 1200);
            }
        };
    } else {
        btn.innerHTML = `<span>Complete Step (+1 Progress)</span> <i class="fa-solid fa-bolt"></i>`;
        btn.onclick = async (e) => {
            e.preventDefault();
            const firstIncomplete = (quest.objectives || []).find(o => o.current < o.target);
            if (firstIncomplete) {
                firstIncomplete.current = Math.min(firstIncomplete.target, firstIncomplete.current + 1);
                await QuestifyAPI.quests.updateObjective(quest.id, firstIncomplete.id, firstIncomplete.current);
                Toast.info(`Advanced: ${firstIncomplete.title}`);
                renderObjectives(quest);
                updateProgressDisplay(quest);
                setupActionButton(quest);
            }
        };
    }

    startArea.appendChild(btn);
}
