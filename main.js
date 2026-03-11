document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    // Cursor
    const cursor = document.getElementById('cur2');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Mobile menu
    const ham = document.getElementById('ham-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (ham && drawer) {
        ham.addEventListener('click', () => {
            drawer.classList.toggle('open');
            ham.classList.toggle('active');
        });
        drawer.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
            drawer.classList.remove('open');
            ham.classList.remove('active');
        }));
    }

    // Scroll progress & Navigation
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('prog').style.width = scrolled + '%';
        const nav = document.getElementById('nav');
        if (window.scrollY > 50) nav.classList.add('solid'); else nav.classList.remove('solid');

        // Reveals
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('in');
        });
    });

    // FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-q').addEventListener('click', () => {
            const wasOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasOpen) item.classList.add('active');
        });
    });

    window.dispatchEvent(new Event('scroll'));
});
