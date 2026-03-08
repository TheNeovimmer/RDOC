document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navBar = document.querySelector('.nav-pill-bar') || document.querySelector('.hero-nav') || document.querySelector('.main-nav-links');
    const authBtn = document.querySelector('.auth-button');
    
    // Create Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    const toggleMenu = (forceClose = false) => {
        const action = forceClose ? 'remove' : 'toggle';
        hamburger.classList[action]('active');
        if (navBar) navBar.classList[action]('active');
        if (authBtn) authBtn.classList[action]('active');
        backdrop.classList[action]('active');
        document.body.style.overflow = (hamburger.classList.contains('active')) ? 'hidden' : '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', () => toggleMenu());
    }

    backdrop.addEventListener('click', () => toggleMenu(true));

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-pill-link, .nav-pill');
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });
});
