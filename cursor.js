// Liquid cursor system — site-wide (optimized)
(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function initCursor() {
        if (!document.body || document.querySelector('.cursor-main')) return;

        const style = document.createElement('style');
        style.textContent = `
            * { cursor: none !important; }
            .cursor-main {
                position: fixed; top: 0; left: 0;
                width: 20px; height: 20px;
                background: var(--accent, #C9A87C);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
                transition: width 0.35s cubic-bezier(0.16,1,0.3,1),
                            height 0.35s cubic-bezier(0.16,1,0.3,1),
                            background 0.35s, opacity 0.3s;
                will-change: left, top;
            }
            .cursor-main.hovering {
                width: 56px; height: 56px;
                background: transparent;
                border: 1.5px solid var(--accent, #C9A87C);
            }
            .cursor-main.hidden { opacity: 0; }
            .cursor-glow {
                position: fixed; top: 0; left: 0;
                width: 300px; height: 300px;
                background: radial-gradient(circle, rgba(201,168,124,0.06) 0%, rgba(201,168,124,0.02) 40%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99990;
                transform: translate(-50%, -50%);
                will-change: left, top;
            }
        `;
        document.head.appendChild(style);

        const main = document.createElement('div');
        main.className = 'cursor-main hidden';
        document.body.appendChild(main);

        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        let mx = -100, my = -100, gx = -100, gy = -100;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            main.style.left = mx + 'px';
            main.style.top = my + 'px';
            main.classList.remove('hidden');
        });

        document.addEventListener('mouseleave', () => main.classList.add('hidden'));
        document.addEventListener('mouseenter', () => main.classList.remove('hidden'));

        function isInteractive(el) {
            if (!el) return false;
            const tag = el.tagName;
            if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
            if (el.getAttribute('role') === 'button') return true;
            return false;
        }

        document.addEventListener('mouseover', e => {
            let el = e.target;
            while (el && el !== document.body) {
                if (isInteractive(el)) { main.classList.add('hovering'); return; }
                el = el.parentElement;
            }
            main.classList.remove('hovering');
        });

        function tick() {
            gx += (mx - gx) * 0.12;
            gy += (my - gy) * 0.12;
            glow.style.left = gx + 'px';
            glow.style.top = gy + 'px';
            requestAnimationFrame(tick);
        }
        tick();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor, { once: true });
    } else {
        initCursor();
    }
})();
