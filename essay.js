// essay.js — IntersectionObserver for .fade-in elements + language/theme toggle
(function () {
    // Fade-in on scroll
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    // Language toggle
    const langBtn = document.getElementById('langBtn');
    const html = document.documentElement;
    if (localStorage.getItem('mia-lang') === 'zh') {
        html.lang = 'zh';
        if (langBtn) langBtn.textContent = 'EN';
    }
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const isZh = html.lang === 'zh';
            html.lang = isZh ? 'en' : 'zh';
            langBtn.textContent = isZh ? '中文' : 'EN';
            localStorage.setItem('mia-lang', isZh ? 'en' : 'zh');
        });
    }

    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const root = document.documentElement;
        const update = () => {
            const isDark = root.getAttribute('data-theme') !== 'light';
            themeBtn.textContent = isDark ? '☀' : '☾';
        };
        update();
        themeBtn.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') !== 'light';
            root.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('mia-theme', isDark ? 'light' : 'dark');
            update();
        });
    }
})();
