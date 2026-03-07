// Liquid cursor system — site-wide
// Include: <script src="cursor.js"></script>
// Auto-injects DOM elements + styles, no setup needed.

(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Inject styles
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
            mix-blend-mode: difference;
            transform: translate(-50%, -50%);
            transition: width 0.35s cubic-bezier(0.16,1,0.3,1),
                        height 0.35s cubic-bezier(0.16,1,0.3,1),
                        background 0.35s, opacity 0.3s;
            will-change: transform;
        }
        .cursor-main.hovering {
            width: 56px; height: 56px;
            background: transparent;
            border: 1.5px solid var(--accent, #C9A87C);
        }
        .cursor-main.hidden { opacity: 0; }
        .cursor-trail {
            position: fixed; top: 0; left: 0;
            width: 6px; height: 6px;
            background: var(--accent, #C9A87C);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99998;
            mix-blend-mode: difference;
            transform: translate(-50%, -50%);
            will-change: transform;
        }
        .cursor-glow {
            position: fixed; top: 0; left: 0;
            width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(201,168,124,0.06) 0%, rgba(201,168,124,0.02) 40%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99990;
            transform: translate(-50%, -50%);
            will-change: transform;
        }
    `;
    document.head.appendChild(style);

    // Inject DOM
    const main = document.createElement('div');
    main.className = 'cursor-main hidden';
    document.body.appendChild(main);

    const trails = [];
    for (let i = 0; i < 3; i++) {
        const t = document.createElement('div');
        t.className = 'cursor-trail';
        t.style.opacity = '0';
        document.body.appendChild(t);
        trails.push({ el: t, x: 0, y: 0 });
    }

    let mx = -100, my = -100, cx = -100, cy = -100;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        main.classList.remove('hidden');
    });

    document.addEventListener('mouseleave', () => {
        main.classList.add('hidden');
        trails.forEach(t => t.el.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        main.classList.remove('hidden');
    });

    // Hover detection — delegate
    function isInteractive(el) {
        if (!el) return false;
        const tag = el.tagName;
        if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        if (el.getAttribute('role') === 'button' || el.onclick || el.style.cursor === 'pointer') return true;
        const cls = el.className || '';
        if (typeof cls === 'string' && /nav-item|entry|tool|diary-node|btn|clickable/.test(cls)) return true;
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

    // Ambient glow — soft light following cursor
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    // Animation
    function tick() {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        main.style.left = cx + 'px';
        main.style.top = cy + 'px';
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';

        trails.forEach((t, i) => {
            const speed = 0.08 - i * 0.015;
            t.x += (cx - t.x) * speed;
            t.y += (cy - t.y) * speed;
            t.el.style.left = t.x + 'px';
            t.el.style.top = t.y + 'px';
            t.el.style.opacity = String(0.35 - i * 0.1);
        });

        requestAnimationFrame(tick);
    }
    tick();
})();
