/* WoTOX SECURE LOGIC - VERIFIED VERSION */
const SECURITY = {
    KEY: "_lKbXyqVEc0v62GZA",
    TEMP: "template_d3a0otj",
    SERV: "service_6izqusf"
};

(function () { emailjs.init(SECURITY.KEY); })();

let appState = {
    otp: "",
    currentUser: null,
    isRecovering: false
};

// 1. BOOTLOADER
window.onload = () => {
    let p = 0;
    const bar = document.getElementById('progress-fill');
    const txt = document.getElementById('progress-text');

    const interval = setInterval(() => {
        p += Math.floor(Math.random() * 5) + 2;
        if (p > 100) p = 100;
        bar.style.width = p + '%';
        txt.innerText = p + '%';

        if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('splash-screen').classList.add('hidden');
                checkNodeSession();
            }, 600);
        }
    }, 70);
};

function checkNodeSession() {
    const active = localStorage.getItem('wotox_session');
    if (active) {
        document.getElementById('pin-screen').classList.remove('hidden');
    } else {
        document.getElementById('auth-section').classList.remove('hidden');
    }
}

// 2. PROTOCOL & NAVIGATION
function validateProtocol() {
    const isChecked = document.getElementById('agree-check').checked;
    const btn = document.getElementById('btn-continue');
    btn.disabled = !isChecked;
    btn.className = isChecked ? "btn-primary-black" : "btn-dimmed";
}

function navToLogin() {
    hideAllPanels();
    document.getElementById('login-box').classList.remove('hidden');
}

function navToSignup() {
    hideAllPanels();
    document.getElementById('signup-box').classList.remove('hidden');
}

// 3. AUTHENTICATION LOGIC (FIXED)
function executeLoginFlow() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem(email));

    if (storedUser && storedUser.pass === pass) {
        localStorage.setItem('wotox_session', email);
        alert("ACCESS GRANTED. REDIRECTING TO PIN SHIELD.");
        location.reload(); // Refresh to trigger PIN screen
    } else {
        alert("SECURITY ALERT: INVALID CREDENTIALS");
    }
}

// 4. SIGNUP & EMAIL ENGINE
function triggerEmailVerification() {
    const email = document.getElementById('regEmail').value;
    if (!email) return alert("EMAIL REQUIRED");

    appState.otp = Math.floor(100000 + Math.random() * 900000).toString();
    const params = { to_email: email, from_name: "WoTOX SYSTEM", passcode: appState.otp };

    emailjs.send(SECURITY.SERV, SECURITY.TEMP, params).then(() => {
        alert("ENCRYPTED OTP SENT TO: " + email);
        hideAllPanels();
        document.getElementById('verify-box').classList.remove('hidden');
    });
}

function verifyHandshake() {
    const code = document.getElementById('vCode').value;
    if (code !== appState.otp) return alert("INVALID HANDSHAKE CODE");

    hideAllPanels();
    document.getElementById('setup-box').classList.remove('hidden');
}

function finalizeAccount() {
    const email = document.getElementById('regEmail').value;
    const userData = {
        email: email,
        pass: document.getElementById('regPass').value,
        name: document.getElementById('fName').value + " " + document.getElementById('lName').value,
        img: localStorage.getItem('temp_avatar') || "",
        pin: document.getElementById('setPin').value
    };

    localStorage.setItem(email, JSON.stringify(userData));
    alert("NODE CREATED. PLEASE LOGIN.");
    navToLogin(); // Redirect to Login after signup
}

// 5. PIN SYSTEM
function unlockSystem() {
    const email = localStorage.getItem('wotox_session');
    const user = JSON.parse(localStorage.getItem(email));
    const pin = document.getElementById('loginPin').value;

    if (user && pin === user.pin) {
        alert("SYSTEM UNLOCKED");
        // Here you would show the main chat interface
    } else {
        alert("INVALID PIN");
    }
}

// HELPERS
function hideAllPanels() {
    const panels = document.querySelectorAll('.auth-panel');
    panels.forEach(p => p.classList.add('hidden'));
}

function processAvatar(e) {
    const reader = new FileReader();
    reader.onload = () => {
        localStorage.setItem('temp_avatar', reader.result);
        document.getElementById('imgPrev').style.backgroundImage = `url(${reader.result})`;
        document.getElementById('imgPrev').innerHTML = "";
    };
    reader.readAsDataURL(e.target.files[0]);
}