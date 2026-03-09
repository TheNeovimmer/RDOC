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
    // Video Modal Functionality
    const videoTrigger = document.getElementById('videoTrigger');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.querySelector('.close-modal');
    const videoIframe = document.getElementById('videoIframe');

    if (videoTrigger && videoModal && closeModal) {
        videoTrigger.addEventListener('click', () => {
            // Using a sample video for demonstration
            videoIframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        closeModal.addEventListener('click', () => {
            videoModal.style.display = 'none';
            videoIframe.src = "";
            document.body.style.overflow = '';
        });

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.style.display = 'none';
                videoIframe.src = "";
                document.body.style.overflow = '';
            }
        });
    }

    // FAQ accordion on index page
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    // "Pourquoi RDOC ?" interactive tabs on apropos page
    const pourquoiTabs = document.querySelectorAll('.pourquoi-tab');
    const pourquoiBox = document.querySelector('.pourquoi-box');
    if (pourquoiTabs.length && pourquoiBox) {
        const titleEl = pourquoiBox.querySelector('h3');
        const textEl = pourquoiBox.querySelector('p');

        pourquoiTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const title = tab.dataset.title;
                const text = tab.dataset.text;
                if (title && text && titleEl && textEl) {
                    pourquoiTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    // Simple fade/slide effect via class
                    pourquoiBox.classList.add('updating');
                    setTimeout(() => {
                        titleEl.textContent = title;
                        textEl.textContent = text;
                        pourquoiBox.classList.remove('updating');
                    }, 150);
                }
            });
        });
    }
});
