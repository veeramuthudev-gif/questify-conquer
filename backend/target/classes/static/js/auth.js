/**
 * QUESTIFY - Authentication Script
 * Handles both Login and Signup forms with real validation, feedback, and redirection
 */
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // LOGIN FORM HANDLING
    // ----------------------------------------------------
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        const form = loginCard.querySelector('form');
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        const loginBtn = form.querySelector('.login-btn');

        // Prevent accidental form submission
        form.addEventListener('submit', handleLogin);
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogin(e);
            });
        }

        async function handleLogin(e) {
            e.preventDefault();
            const email = emailInput?.value.trim();
            const password = passwordInput?.value;

            if (!email || !password) {
                Toast.error('Please enter both your email and password.', 'Required Fields');
                return;
            }

            // Simple email validation regex
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                Toast.error('Please enter a valid email address.', 'Invalid Email');
                return;
            }

            try {
                loginBtn.style.opacity = '0.7';
                loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entering Realm...';

                const response = await QuestifyAPI.auth.login(email, password);
                Toast.success('Welcome back, adventurer!', 'Login Successful');

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } catch (err) {
                loginBtn.style.opacity = '1';
                loginBtn.innerHTML = 'LOGIN <i class="fa-solid fa-arrow-right"></i>';
                Toast.error(err.message || 'Invalid credentials. Please try again.', 'Login Failed');
            }
        }
    }

    // ----------------------------------------------------
    // SIGNUP FORM HANDLING
    // ----------------------------------------------------
    const signupCard = document.querySelector('.signup-card');
    if (signupCard) {
        const form = signupCard.querySelector('form');
        const nameInput = form.querySelector('input[placeholder*="Name"]');
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        const signupBtn = form.querySelector('.signup-btn');

        form.addEventListener('submit', handleSignup);
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleSignup(e);
            });
        }

        async function handleSignup(e) {
            e.preventDefault();
            const name = nameInput?.value.trim();
            const email = emailInput?.value.trim();
            const password = passwordInput?.value;

            if (!name || !email || !password) {
                Toast.error('Please fill in all the required fields.', 'Missing Information');
                return;
            }

            if (password.length < 6) {
                Toast.error('Password should be at least 6 characters long.', 'Weak Password');
                return;
            }

            try {
                signupBtn.style.opacity = '0.7';
                signupBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Hero...';

                await QuestifyAPI.auth.signup(name, email, password);
                Toast.success('Account created! Your adventure begins now.', 'Welcome to Questify');

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1200);
            } catch (err) {
                signupBtn.style.opacity = '1';
                signupBtn.innerHTML = 'START JOURNEY <i class="fa-solid fa-arrow-right"></i>';
                Toast.error(err.message || 'Could not create account.', 'Signup Failed');
            }
        }
    }
});