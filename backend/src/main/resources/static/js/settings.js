/**
 * QUESTIFY - Settings & Customization Controller (Dynamic)
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSettings();
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
});

async function loadSettings() {
    const settings = await QuestifyAPI.settings.get();
    const user = await QuestifyAPI.user.getProfile();

    // 1. Account Information Inputs
    const usernameInput = document.querySelector('#account input[type="text"]');
    const emailInput = document.querySelector('#account input[type="email"]');
    const rankInput = document.querySelectorAll('#account input[disabled]')[0];
    const levelInput = document.querySelectorAll('#account input[disabled]')[1];

    if (usernameInput) usernameInput.value = user.username || settings.username || '';
    if (emailInput) emailInput.value = user.email || settings.email || '';
    if (rankInput) rankInput.value = user.rank || 'Novice Adventurer';
    if (levelInput) levelInput.value = `Level ${String(user.level || 1).padStart(2, '0')}`;

    // 2. Appearance Toggles
    const appearanceToggles = document.querySelectorAll('#appearance .toggle input');
    if (appearanceToggles.length >= 2) {
        appearanceToggles[0].checked = settings.darkMode ?? true;
        appearanceToggles[1].checked = settings.animatedInterface ?? true;

        appearanceToggles[0].addEventListener('change', (e) => {
            document.body.classList.toggle('light-theme', !e.target.checked);
        });
    }

    // 3. Notification Toggles
    const notifToggles = document.querySelectorAll('#notifications .toggle input');
    if (notifToggles.length >= 3) {
        notifToggles[0].checked = settings.streakReminders ?? true;
        notifToggles[1].checked = settings.questReminders ?? true;
        notifToggles[2].checked = settings.achievementAlerts ?? true;
    }

    // 4. Quest Preference Toggles
    const questToggles = document.querySelectorAll('#quest .toggle input');
    if (questToggles.length >= 2) {
        questToggles[0].checked = settings.dailySuggestions ?? true;
        questToggles[1].checked = settings.xpCelebration ?? true;
    }

    // 5. Save Changes Handler
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const updatedSettings = {
                username: usernameInput ? usernameInput.value.trim() : 'Adventurer',
                email: emailInput ? emailInput.value.trim() : '',
                darkMode: appearanceToggles[0] ? appearanceToggles[0].checked : true,
                animatedInterface: appearanceToggles[1] ? appearanceToggles[1].checked : true,
                streakReminders: notifToggles[0] ? notifToggles[0].checked : true,
                questReminders: notifToggles[1] ? notifToggles[1].checked : true,
                achievementAlerts: notifToggles[2] ? notifToggles[2].checked : true,
                dailySuggestions: questToggles[0] ? questToggles[0].checked : true,
                xpCelebration: questToggles[1] ? questToggles[1].checked : true
            };

            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            saveBtn.style.opacity = '0.7';

            try {
                await QuestifyAPI.settings.update(updatedSettings);
                Toast.success('Settings updated and synced successfully!', 'Configuration Saved');
            } catch (err) {
                Toast.error('Could not save settings.', 'Error');
            } finally {
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
                saveBtn.style.opacity = '1';
            }
        });
    }

    // 6. Logout Handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Toast.modal({
                icon: '🚪',
                title: 'Leave Questify?',
                message: 'Are you sure you want to log out of your adventure session?',
                btnText: 'Yes, Log Out',
                onConfirm: () => {
                    QuestifyAPI.auth.logout();
                }
            });
        });
    }
}