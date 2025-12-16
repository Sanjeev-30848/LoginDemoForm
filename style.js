const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function showTemporaryMessage(msg) {
    let el = document.getElementById('auth-message');
    if (!el) {
        el = document.createElement('div');
        el.id = 'auth-message';
        el.style.position = 'fixed';
        el.style.right = '20px';
        el.style.top = '20px';
        el.style.padding = '10px 14px';
        el.style.background = 'rgba(0,0,0,0.8)';
        el.style.color = '#fff';
        el.style.borderRadius = '6px';
        el.style.zIndex = 9999;
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => (el.style.display = 'none'), 3000);
}

registerTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.add('toggled');
});

loginTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.remove('toggled');
});

// Handle registration: save credentials to localStorage
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !email || !password) {
            showTemporaryMessage('Please fill all registration fields');
            return;
        }

        const user = { username, email, password };
        try {
            localStorage.setItem('auth_user', JSON.stringify(user));
            showTemporaryMessage('Registration successful — please sign in');
            // switch to login view
            authWrapper.classList.remove('toggled');
            // populate login username
            const loginUsername = document.getElementById('login-username');
            if (loginUsername) loginUsername.value = username;
        } catch (err) {
            console.error('Failed to save user', err);
            showTemporaryMessage('Registration failed (storage error)');
        }
    });
}

// Handle login: accept if matches registered user or if fields are non-empty
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            showTemporaryMessage('Please enter username and password');
            return;
        }

        const stored = localStorage.getItem('auth_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.username === username && parsed.password === password) {
                    completeLogin(username);
                    return;
                } else {
                    showTemporaryMessage('Invalid username or password');
                    return;
                }
            } catch (err) {
                console.warn('corrupt stored user', err);
            }
        }

        // No stored user — accept any non-empty credentials
        completeLogin(username);
    });
}

function completeLogin(username) {
    showTemporaryMessage('Login successful');
    // Replace auth UI with a simple welcome screen
    authWrapper.innerHTML = `\
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;">\
            <h1>Welcome, ${username}!</h1>\
            <button id="logout-btn">Logout</button>\
        </div>`;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('auth_user');
            location.reload();
        });
    }
}