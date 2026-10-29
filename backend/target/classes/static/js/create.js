/**
 * QUESTIFY - Create Quest Controller with Live Interactive Preview (User-Input Driven)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const titleInput = document.querySelector('input[placeholder*="title"]');
    const descInput = document.querySelector('textarea');
    const selects = document.querySelectorAll('.form-row select');
    const categorySelect = selects[0];
    const difficultySelect = selects[1];
    const xpInput = document.querySelector('input[type="number"]');
    const timeInput = document.querySelector('input[placeholder*="mins"]');
    const typeRadios = document.querySelectorAll('input[name="type"]');
    const createBtn = document.querySelector('.create-btn');

    // Preview Elements
    const previewCategory = document.querySelector('.preview-category');
    const previewTitle = document.querySelector('.preview-content h3');
    const previewDesc = document.querySelector('.preview-description');
    const previewMeta = document.querySelectorAll('.preview-meta div span');
    const previewXp = previewMeta[0];
    const previewTime = previewMeta[1];
    const previewDifficulty = document.querySelector('.difficulty strong');
    const previewRewardXp = document.querySelector('.reward-box h3');

    // Helper to get selected radio value
    function getSelectedType() {
        for (const radio of typeRadios) {
            if (radio.checked) {
                const label = radio.closest('.type-option')?.querySelector('span');
                return label ? label.innerText.trim() : 'Daily';
            }
        }
        return 'Daily';
    }

    // Live update function
    function updatePreview() {
        const title = titleInput?.value.trim() || 'Your Quest Title';
        const desc = descInput?.value.trim() || 'Describe your challenge or goal here...';
        const category = categorySelect?.value || 'Personal';
        const difficulty = difficultySelect?.value || 'Medium';
        const xp = xpInput?.value.trim() || '50';
        const time = timeInput?.value.trim() || '30 mins';
        const type = getSelectedType().toUpperCase();

        if (previewCategory) previewCategory.textContent = `${type} QUEST • ${category.toUpperCase()}`;
        if (previewTitle) previewTitle.textContent = title;
        if (previewDesc) previewDesc.textContent = desc;
        if (previewXp) previewXp.textContent = `+${xp} XP`;
        if (previewTime) previewTime.textContent = time.includes('min') ? time : `${time} mins`;
        if (previewDifficulty) {
            previewDifficulty.innerHTML = `<i class="fa-solid fa-fire"></i> ${difficulty}`;
        }
        if (previewRewardXp) previewRewardXp.textContent = `+${xp} XP`;
    }

    // Attach real-time listeners
    titleInput?.addEventListener('input', updatePreview);
    descInput?.addEventListener('input', updatePreview);
    categorySelect?.addEventListener('change', updatePreview);
    difficultySelect?.addEventListener('change', updatePreview);
    xpInput?.addEventListener('input', updatePreview);
    timeInput?.addEventListener('input', updatePreview);
    typeRadios.forEach(r => r.addEventListener('change', updatePreview));

    // Handle Quest Creation
    createBtn?.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = titleInput?.value.trim();
        const desc = descInput?.value.trim();
        const category = categorySelect?.value || 'Personal';
        const difficulty = difficultySelect?.value || 'Medium';
        const xpReward = parseInt(xpInput?.value) || 50;
        const timeLimit = timeInput?.value.trim() || '30 mins';
        const type = getSelectedType();

        if (!title) {
            Toast.error('Please enter a title for your quest.', 'Missing Title');
            titleInput?.focus();
            return;
        }

        let icon = 'fa-scroll';
        let color = 'purple';
        if (category === 'Coding') { icon = 'fa-code'; color = 'blue'; }
        if (category === 'Fitness') { icon = 'fa-dumbbell'; color = 'pink'; }
        if (category === 'Mind') { icon = 'fa-brain'; color = 'purple'; }
        if (category === 'Study') { icon = 'fa-book-open'; color = 'gold'; }

        const questData = {
            title,
            description: desc || 'Conquer this challenge and level up your life!',
            category,
            difficulty,
            xpReward,
            timeLimit,
            type,
            icon,
            color,
            objectives: [
                { id: Date.now() + 1, title: `Complete: ${title}`, current: 0, target: 1 }
            ]
        };

        try {
            createBtn.style.opacity = '0.7';
            createBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Forging Quest...';

            const newQuest = await QuestifyAPI.quests.create(questData);

            Toast.success(`Quest "${title}" created successfully!`, 'Quest Forged');

            Toast.modal({
                icon: '⚔️',
                title: 'Quest Created!',
                message: `"${title}" is now added to your quest log (+${xpReward} XP). Ready to tackle it?`,
                btnText: 'View Quests',
                onConfirm: () => {
                    window.location.href = `quests.html?id=${newQuest.id}`;
                }
            });

            // Reset form
            titleInput.value = '';
            descInput.value = '';
            xpInput.value = '';
            timeInput.value = '';
            updatePreview();

        } catch (err) {
            Toast.error(err.message || 'Failed to create quest.', 'Creation Error');
        } finally {
            createBtn.style.opacity = '1';
            createBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create Quest <i class="fa-solid fa-arrow-right"></i>';
        }
    });

    // Run initial preview
    updatePreview();
});