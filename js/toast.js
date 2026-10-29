/**
 * QUESTIFY - Toast & Celebration Helper
 */
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'questify-toast-container';
            document.body.appendChild(this.container);
        }
    },

    show({ title = 'Notification', message = '', type = 'info', duration = 3500 }) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `questify-toast toast-${type}`;

        let iconClass = 'fa-solid fa-info';
        if (type === 'success') iconClass = 'fa-solid fa-check';
        if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';
        if (type === 'xp') iconClass = 'fa-solid fa-bolt';

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.onclick = () => this.dismiss(toast);

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }

        return toast;
    },

    dismiss(toast) {
        if (!toast || toast.classList.contains('toast-hiding')) return;
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    },

    success(message, title = 'Success!') {
        return this.show({ title, message, type: 'success' });
    },

    error(message, title = 'Error') {
        return this.show({ title, message, type: 'error' });
    },

    info(message, title = 'Questify') {
        return this.show({ title, message, type: 'info' });
    },

    xp(amount, message = 'Quest progress saved') {
        return this.show({
            title: `+${amount} XP Earned!`,
            message,
            type: 'xp',
            duration: 4000
        });
    },

    modal({ icon = '🏆', title = 'Congratulations!', message = '', btnText = 'Continue Adventure', onConfirm = null }) {
        const overlay = document.createElement('div');
        overlay.className = 'questify-modal-overlay';
        overlay.innerHTML = `
            <div class="questify-modal">
                <div class="modal-glow-circle">${icon}</div>
                <h2>${title}</h2>
                <p>${message}</p>
                <button class="modal-btn">${btnText}</button>
            </div>
        `;

        const btn = overlay.querySelector('.modal-btn');
        btn.onclick = () => {
            overlay.remove();
            if (typeof onConfirm === 'function') onConfirm();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        document.body.appendChild(overlay);
    }
};

// Global Notification Dropdown Handler
document.addEventListener('DOMContentLoaded', () => {
    const notifButtons = document.querySelectorAll('.notification');
    notifButtons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.cursor = 'pointer';

        let dropdown = btn.querySelector('.notification-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'notification-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <h4>Notifications</h4>
                    <span id="markAllRead">Mark all read</span>
                </div>
                <div class="dropdown-item">
                    <i class="fa-solid fa-sparkles"></i>
                    <div>
                        <h5>Welcome, Adventurer!</h5>
                        <p>Your journey begins at Level 1. Forge your destiny!</p>
                    </div>
                </div>
                <div class="dropdown-item">
                    <i class="fa-solid fa-scroll"></i>
                    <div>
                        <h5>Quest System Active</h5>
                        <p>Create or conquer quests to earn XP and level up.</p>
                    </div>
                </div>
                <div class="dropdown-item">
                    <i class="fa-solid fa-trophy"></i>
                    <div>
                        <h5>Milestones Awaiting</h5>
                        <p>Complete your first quest to unlock First Victory!</p>
                    </div>
                </div>
            `;
            btn.appendChild(dropdown);
        }

        btn.addEventListener('click', (e) => {
            if (e.target.closest('.notification-dropdown') && !e.target.id?.includes('markAllRead')) {
                return;
            }
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.notification-dropdown.active').forEach(d => d.classList.remove('active'));
    });
});
