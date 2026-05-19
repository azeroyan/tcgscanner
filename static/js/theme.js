const themeKey = 'tcgScannerTheme';
const themeToggleButton = document.getElementById('theme-toggle');

function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    if (themeToggleButton) {
        themeToggleButton.textContent = isDark ? 'Light mode' : 'Dark mode';
        themeToggleButton.classList.toggle('btn-outline-light', isDark);
        themeToggleButton.classList.toggle('btn-outline-primary', !isDark);
    }
}

function loadTheme() {
    const stored = localStorage.getItem(themeKey);
    const isDark = stored === 'dark' || (stored === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(isDark);
}

function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
    applyTheme(isDark);
}

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
    // Fallback: ensure navbar toggler works if Bootstrap's data-api isn't initializing
    const toggler = document.querySelector('.navbar-toggler');
    const collapseEl = document.getElementById('navbarNav');
    if (toggler && collapseEl) {
        console.log('Navbar toggler fallback attached');
        toggler.addEventListener('click', (e) => {
            console.log('Navbar toggler clicked (fallback)');
            // toggle the Bootstrap collapse 'show' class as a fallback
            collapseEl.classList.toggle('show');
            const expanded = toggler.getAttribute('aria-expanded') === 'true';
            toggler.setAttribute('aria-expanded', (!expanded).toString());
        });
    }
});
