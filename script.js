/* ==========================================
   ROMANTIC BIRTHDAY WEBSITE - JAVASCRIPT
   ========================================== */

// ==========================================
// CONFIGURATION - EASILY CHANGEABLE
// ==========================================

// ⭐ CHANGE THIS DATE TO YOUR RELATIONSHIP START DATE ⭐
const RELATIONSHIP_START_DATE = new Date('2021-04-02'); // Format: YYYY-MM-DD

// Birthday Letter Text
const BIRTHDAY_LETTER = `Happy Birthday, My Love,

Today is all about celebrating you—the most amazing person in my life. Words can never fully express how much you mean to me, but on your special day, I want you to know how grateful I am to have you by my side.

You have brought so much happiness, love, and warmth into my life. Every moment we spend together becomes a beautiful memory that I cherish deeply. Your smile brightens my darkest days, your support gives me strength, and your presence makes everything feel better.

Thank you for being patient with me, for understanding me, and for loving me the way you do. You have become such an important part of my life, and I feel incredibly lucky to share this journey with you.

As you begin another year of your life, I hope all your dreams come true. I hope you find success in everything you do, happiness in every moment, and peace in every challenge. You deserve all the love, joy, and blessings this world has to offer.

No matter what the future brings, I want you to know that you will always hold a special place in my heart. Thank you for all the laughter, the memories, and the love we have shared together.

May this birthday be filled with happiness, surprises, and everything that makes you smile.

Happy Birthday to my favorite person, my best friend, and the one who makes my heart feel at home.

With all my love,
Your Sukoon ❤️`;

// Reasons I Love You
const REASONS_I_LOVE_YOU = [
    'You always make me smile.',
    'You understand me even without words.',
    'You support my dreams.',
    'You make every ordinary day special.',
    'You are my safe place.',
    'Your kindness inspires me.',
    'Every moment with you becomes a beautiful memory.',
    'I love the way you make life feel brighter.'
];

// Birthday Wishes
const BIRTHDAY_WISHES = [
    'Wishing you endless happiness.',
    'May all your dreams come true.',
    'May every new day bring success and peace.',
    'Keep smiling because your smile lights up my world.',
    'Happy Birthday, my forever favorite person.'
];

// Romantic Quotes
const ROMANTIC_QUOTES = [
    'In your eyes, I found my home.',
    'You are my favorite adventure.',
    'Every day with you feels like a beautiful dream.',
    'You make my heart skip a beat every single day.',
    'I love you more than words could ever express.',
    'You are the best decision I ever made.',
    'My love for you grows stronger with each passing day.',
    'You complete me in ways I never knew possible.',
    'Forever is not enough time to love you.',
    'You are my happily ever after.'
];

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    generateParticles();
    initializeTypewriter();
    updateCounter();
    generateReasonCards();
    generateWishCards();
    initializeQuoteDisplay();
    setInterval(updateCounter, 1000);
});

// ==========================================
// PARTICLES ANIMATION
// ==========================================

function generateParticles() {
    const container = document.getElementById('particlesContainer');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const tx = (Math.random() - 0.5) * 200;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.animation = `particleFloat ${duration}s linear ${delay}s infinite`;

        container.appendChild(particle);
    }
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================

function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    let currentIndex = 0;
    const typingSpeed = 20; // milliseconds per character

    function type() {
        if (currentIndex < BIRTHDAY_LETTER.length) {
            const character = BIRTHDAY_LETTER[currentIndex];

            // Handle line breaks
            if (character === '\n') {
                typewriterElement.innerHTML += '<br>';
            } else {
                typewriterElement.textContent += character;
            }

            currentIndex++;
            setTimeout(type, typingSpeed);
        }
    }

    type();
}

// ==========================================
// COUNTER FUNCTIONALITY
// ==========================================

function updateCounter() {
    const now = new Date();
    const diff = now - RELATIONSHIP_START_DATE;

    // Calculate time units
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = Math.floor((totalDays % 365) % 30);

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Update DOM
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ==========================================
// GENERATE REASON CARDS
// ==========================================

function generateReasonCards() {
    const reasonsGrid = document.getElementById('reasonsGrid');
    reasonsGrid.innerHTML = '';

    REASONS_I_LOVE_YOU.forEach((reason, index) => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.innerHTML = `<p>${reason}</p>`;
        reasonsGrid.appendChild(card);
    });
}

// ==========================================
// GENERATE WISH CARDS
// ==========================================

function generateWishCards() {
    const wishesGrid = document.getElementById('wishesGrid');
    wishesGrid.innerHTML = '';

    BIRTHDAY_WISHES.forEach((wish, index) => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `<p>${wish}</p>`;
        wishesGrid.appendChild(card);
    });
}

// ==========================================
// QUOTE DISPLAY
// ==========================================

function initializeQuoteDisplay() {
    const quoteText = document.getElementById('quoteText');
    let currentQuoteIndex = 0;

    function showNextQuote() {
        quoteText.textContent = ROMANTIC_QUOTES[currentQuoteIndex];
        currentQuoteIndex = (currentQuoteIndex + 1) % ROMANTIC_QUOTES.length;
    }

    // Show first quote immediately
    showNextQuote();

    // Change quote every 5 seconds
    setInterval(showNextQuote, 5000);
}

// ==========================================
// SCROLL TO SECTION
// ==========================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================
// ACTIVE NAVIGATION LINK
// ==========================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation;
        }
    });
}, observerOptions);

// ==========================================
// TOUCH SUPPORT FOR MOBILE
// ==========================================

let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Detect swipe down
    if (diff > 50) {
        // Swipe detected
    }
});

// ==========================================
// PRINT FUNCTIONALITY (Optional)
// ==========================================

function printLetter() {
    window.print();
}

// ==========================================
// SHARE FUNCTIONALITY (Optional)
// ==========================================

function shareWebsite() {
    const text = 'Happy Birthday, My Love ❤️ - A beautiful digital love letter created just for you!';

    if (navigator.share) {
        navigator.share({
            title: 'Happy Birthday, My Love ❤️',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
    // Press 'H' to go to home
    if (e.key.toLowerCase() === 'h') {
        scrollToSection('home');
    }

    // Press 'L' to go to letter
    if (e.key.toLowerCase() === 'l') {
        scrollToSection('letter');
    }

    // Press 'C' to go to counter
    if (e.key.toLowerCase() === 'c') {
        scrollToSection('counter');
    }

    // Press 'R' to go to reasons
    if (e.key.toLowerCase() === 'r') {
        scrollToSection('reasons');
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images (if any are added in future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load logic here
                imageObserver.unobserve(entry.target);
            }
        });
    });
}

// ==========================================
// ACCESSIBILITY IMPROVEMENTS
// ==========================================

// Add focus styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('click', () => {
    document.body.classList.remove('keyboard-nav');
});

// ==========================================
// CONFETTI-LIKE ANIMATION (Optional Enhancement)
// ==========================================

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.innerHTML = '❤️';
        piece.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -10px;
            font-size: ${Math.random() * 20 + 10}px;
            opacity: 0.8;
            animation: confettiFall ${Math.random() * 3 + 2}s linear;
        `;
        confettiContainer.appendChild(piece);
    }

    document.body.appendChild(confettiContainer);

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// DOUBLE-CLICK TO CREATE CONFETTI
// ==========================================

document.addEventListener('dblclick', (e) => {
    if (e.target.tagName !== 'INPUT') {
        createConfetti();
    }
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%cHappy Birthday, My Love! ❤️', 'font-size: 24px; font-weight: bold; color: #ff69b4; text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);');
console.log('%cThis website was created with love just for you.', 'font-size: 14px; color: #ff1493;');
console.log('%cDouble-click anywhere to see confetti!', 'font-size: 12px; color: #ffd700;');
console.log('%cKeyboard Shortcuts: H (Home) | L (Letter) | C (Counter) | R (Reasons)', 'font-size: 12px; color: #ffffff;');
