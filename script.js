/* =========================================
SELECT HTML ELEMENTS
========================================= */
const scene = document.getElementById("scene");
const pullHit = document.getElementById("pullHit");
const pullCord = document.getElementById("pullCord");
const lampCaption = document.getElementById("lampCaption");
const authForm = document.getElementById("authForm");
const signInTab = document.getElementById("signInTab");
const signUpTab = document.getElementById("signUpTab");
const tabIndicator = document.querySelector(".tab-indicator");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const formMessage = document.getElementById("formMessage");
const successOverlay = document.getElementById("successOverlay");
const successText = document.getElementById("successText");
/* =========================================
2. GLOBAL VARIABLES
========================================= */
let isSignUp = false;
let soundOn = true;
let audioContext;
/* =========================================
3. LAMP COLOUR THEMES
========================================= */
const themes = {
amber: ["#ffb43e", "255,180,62"],

cyan: ["#53d9e7", "83,217,231"],

rose: ["#f28aa8", "242,138,168"],

mint: ["#7be0b3", "123,224,179"],

moonlight: ["#b9c8ed", "185,200,237"]
};
/* =========================================
4. SOUND EFFECT FUNCTION
========================================= */
function playTone(
frequency = 440,
duration = .12,
type = "sine",
volume = .035
) {
if (!soundOn) return;

try {

    audioContext ||= new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();


    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );


    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioContext.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );

}

catch (error) {

    /* Sound is optional */

}
}
/* =========================================
5. TURN LAMP ON AND OFF
========================================= */
function switchLamp() {
scene.classList.toggle("lit");

const on = scene.classList.contains("lit");


lampCaption.textContent = on
    ? "Welcome to your space."
    : "A little light changes everything.";


pullCord.classList.toggle("pulling", false);


/* Lamp Switching Sound */

playTone(
    on ? 520 : 260,
    .25,
    "sine",
    .045
);


if (on) {

    setTimeout(() => {

        playTone(
            680,
            .16,
            "sine",
            .02
        );

    }, 110);

}
}
/* =========================================
6. CLICK THE LAMP CORD
========================================= */
pullHit.addEventListener("click", switchLamp);
/* =========================================
7. DRAG THE LAMP CORD
========================================= */
let dragStart = null;
/* When User Touches The Cord */
pullHit.addEventListener("pointerdown", (event) => {
dragStart = event.clientY;

pullHit.setPointerCapture(event.pointerId);
});
/* When User Drags The Cord */
pullHit.addEventListener("pointermove", (event) => {
if (dragStart === null) return;


const distance = Math.max(
    0,
    Math.min(
        55,
        event.clientY - dragStart
    )
);


pullCord.style.transform =
    `translateY(${distance}px)`;
});
/* Release The Cord */
function releaseCord(event) {
if (dragStart === null) return;


const distance = event.clientY - dragStart;

dragStart = null;


pullCord.style.transform = "";


if (distance > 18) {

    switchLamp();

}
}
pullHit.addEventListener("pointerup", releaseCord);
pullHit.addEventListener("pointercancel", () => {
dragStart = null;

pullCord.style.transform = "";
});
/* =========================================
8. CHANGE LAMP COLOURS
========================================= */
document.querySelectorAll(".swatch").forEach(button => {
button.addEventListener("click", () => {

    const theme = button.dataset.theme;


    /* Get Selected Colour */

    const [color, rgb] = themes[theme];


    /* Update Website Lighting */

    scene.style.setProperty(
        "--glow",
        color
    );


    scene.style.setProperty(
        "--glow-rgb",
        rgb
    );


    scene.dataset.theme = theme;


    /* Update Selected Colour Indicator */

    document.querySelectorAll(".swatch").forEach(swatch => {

        swatch.classList.toggle(
            "selected",
            swatch === button
        );

    });


    /* Colour Change Sound */

    playTone(
        620,
        .09,
        "triangle",
        .025
    );

});
});
/* =========================================
9. SIGN IN / SIGN UP SWITCHING
========================================= */
function setMode(signUp) {
isSignUp = signUp;


/* Update Active Tabs */

signInTab.classList.toggle(
    "active",
    !signUp
);


signUpTab.classList.toggle(
    "active",
    signUp
);


signInTab.setAttribute(
    "aria-selected",
    String(!signUp)
);


signUpTab.setAttribute(
    "aria-selected",
    String(signUp)
);


/* Move Animated Tab Indicator */

tabIndicator.style.transform = signUp
    ? "translateX(68px)"
    : "translateX(0)";


tabIndicator.style.width = signUp
    ? "28px"
    : "25px";


/* Change Heading */

formTitle.textContent = signUp
    ? "Join us"
    : "Welcome";


/* Change Subtitle */

formSubtitle.textContent = signUp
    ? "Create an account to make this space yours"
    : "Sign in to continue to your account";


/* Change Submit Button */

submitBtn.querySelector("span").textContent =
    signUp
        ? "Create Account"
        : "Sign In";


/* Change Password Autocomplete */

password.autocomplete = signUp
    ? "new-password"
    : "current-password";


/* Clear Previous Messages */

formMessage.textContent = "";
}
/* Sign In Tab */
signInTab.addEventListener("click", () => {
setMode(false);
});
/* Sign Up Tab */
signUpTab.addEventListener("click", () => {
setMode(true);
});
/* =========================================
10. SHOW AND HIDE PASSWORD
========================================= */
showPassword.addEventListener("click", () => {
const reveal = password.type === "password";


/* Change Input Type */

password.type = reveal
    ? "text"
    : "password";


/* Update Accessibility Label */

showPassword.setAttribute(
    "aria-label",
    reveal
        ? "Hide password"
        : "Show password"
);


/* Change Eye Icon */

showPassword.textContent = reveal
    ? "◎"
    : "◉";
});
/* =========================================
11. FORGOT PASSWORD
========================================= */
document.getElementById("forgotBtn").addEventListener(
"click",
() => {
    formMessage.textContent =
        "Password reset is a demo here. Connect an authentication service to enable it.";

    playTone(330, .1);

}
);
/* =========================================
12. LOGIN AND REGISTRATION FORM
========================================= */
authForm.addEventListener("submit", event => {
event.preventDefault();


/* Validate Form */

if (!authForm.reportValidity()) return;


const email = document
    .getElementById("email")
    .value
    .trim();


/* Loading Button Text */

const buttonText = isSignUp
    ? "Creating account…"
    : "Signing in…";


submitBtn.disabled = true;


submitBtn.querySelector("span").textContent =
    buttonText;


formMessage.textContent = "";


/* Simulated Loading Animation */

setTimeout(() => {

    submitBtn.disabled = false;


    /* Success Message */

    successText.textContent = isSignUp
        ? "Your account has been created successfully."
        : `Welcome back, ${email}.`;



    /* Display Success Screen */
successOverlay.classList.add("show");


    /* Success Sound */

    playTone(
        660,
        .18,
        "sine",
        .035
    );


    setTimeout(() => {

        playTone(
            880,
            .22,
            "sine",
            .025
        );

    }, 130);


}, 850);
});
/* =========================================
13. TEST AGAIN BUTTON
========================================= */
document.getElementById("tryAgain").addEventListener(
"click",
() => {
    /* Hide Success Screen */

    successOverlay.classList.remove("show");


    /* Reset Form */

    authForm.reset();


    /* Return To Sign In */

    setMode(false);


    /* Reset Button Text */

    submitBtn.querySelector("span").textContent =
        "Sign In";

}
);
/* =========================================
14. SOCIAL LOGIN BUTTONS
========================================= */
document.querySelectorAll(".social").forEach(button => {
button.addEventListener("click", () => {

    const provider = button.dataset.provider;


    formMessage.textContent =
        `${provider} sign-in is a visual demo. Add OAuth credentials to activate it.`;



    playTone(390, .1);

});
});
/* =========================================
15. SOUND ON / OFF BUTTON
========================================= */
document.getElementById("soundToggle").addEventListener(
"click",
event => {
    soundOn = !soundOn;


    /* Update Sound Icon */

    event.currentTarget.textContent =
        soundOn ? "♪" : "×";


    /* Update Tooltip */

    event.currentTarget.title =
        soundOn
            ? "Mute sound"
            : "Enable sound";


    if (soundOn) {

        playTone(520, .1);

    }

}
);
/* =========================================
16. FLOATING DUST PARTICLES
========================================= */
/* Get Canvas Element */
const canvas = document.getElementById("dust");
/* Canvas Drawing Context */
const ctx = canvas.getContext("2d");
/* Particle Array */
let particles = [];
/* Resize Canvas */
function resizeCanvas() {
const rect = scene.getBoundingClientRect();


const ratio = Math.min(
    window.devicePixelRatio || 1,
    2
);


canvas.width = rect.width * ratio;

canvas.height = rect.height * ratio;


ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
);


/* Create Particles */

particles = Array.from(
    {
        length: Math.min(
            85,
            Math.floor(rect.width / 10)
        )
    },

    () => ({

        x: Math.random() * rect.width,

        y: Math.random() * rect.height,

        r: Math.random() * 1.5 + .35,

        speed: Math.random() * .22 + .06,

        alpha: Math.random() * .5 + .12

    })

);
}
/* =========================================
17. DRAW FLOATING PARTICLES
========================================= */
function drawDust() {
const rect = scene.getBoundingClientRect();


/* Clear Previous Frame */

ctx.clearRect(
    0,
    0,
    rect.width,
    rect.height
);


/* Get Current Lamp Colour */

const glow = getComputedStyle(scene)
    .getPropertyValue("--glow")
    .trim() || "#ffb43e";


/* Animate Each Particle */

particles.forEach(particle => {


    /* Move Particle Upwards */

    particle.y -= particle.speed;


    /* Slight Horizontal Movement */

    particle.x += Math.sin(
        particle.y * .012
    ) * .12;


    /* Reset Particle When It Leaves Screen */

    if (particle.y < -5) {

        particle.y = rect.height + 5;

        particle.x = Math.random() * rect.width;

    }


    /* Draw Particle */

    ctx.beginPath();


    ctx.arc(
        particle.x,
        particle.y,
        particle.r,
        0,
        Math.PI * 2
    );


    ctx.fillStyle = glow;

    ctx.globalAlpha = particle.alpha;

    ctx.fill();

});


ctx.globalAlpha = 1;


/* Continue Animation */

requestAnimationFrame(drawDust);
}
/* =========================================
18. INITIALIZE CANVAS
========================================= */
/* Resize When Browser Changes Size */
window.addEventListener(
"resize",
resizeCanvas
);
/* Create Initial Particles */
resizeCanvas();
/* Start Particle Animation */
drawDust();
/* =========================================
END OF YOUR SPACE PROJECT
========================================= */