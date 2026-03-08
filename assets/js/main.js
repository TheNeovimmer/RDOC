document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navBar = document.querySelector('.nav-pill-bar') || document.querySelector('.hero-nav') || document.querySelector('.main-nav-links');
    const authBtn = document.querySelector('.auth-button');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            if (navBar) navBar.classList.toggle('active');
            if (authBtn) authBtn.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-pill-link, .nav-pill');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            if (navBar) navBar.classList.remove('active');
            if (authBtn) authBtn.classList.remove('active');
        });
    });
});
