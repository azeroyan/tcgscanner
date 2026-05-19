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
});
