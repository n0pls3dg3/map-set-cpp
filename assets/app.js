const sidebar = document.querySelector('#sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');
const menu = document.querySelector('.menu-toggle');
function setSidebar(open) {
    sidebar.classList.toggle('is-open', open);
    sidebar.inert = !open;
    backdrop.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
    if (open) sidebar.querySelector('.close-sidebar').focus();
}
menu.addEventListener('click', () => setSidebar(!sidebar.classList.contains('is-open')));
document.querySelector('.close-sidebar').addEventListener('click', () => {
    setSidebar(false);
    menu.focus();
});
backdrop.addEventListener('click', () => setSidebar(false));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
        setSidebar(false);
        menu.focus();
    }
});
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setSidebar(false)));

const solutions = [...document.querySelectorAll('.solution')];
const toggle = document.querySelector('#toggle-solutions');
function updateToggle() {
    toggle.textContent = solutions.every(item => item.open) ? 'Đóng tất cả lời giải' : 'Mở tất cả lời giải';
}
toggle.addEventListener('click', () => {
    const open = !solutions.every(item => item.open);
    solutions.forEach(item => { item.open = open; });
    updateToggle();
});
solutions.forEach(item => item.addEventListener('toggle', updateToggle));

document.querySelectorAll('.copy-code').forEach(button => {
    button.addEventListener('click', async () => {
        const code = button.closest('.code-block').querySelector('code').textContent;
        try {
            await navigator.clipboard.writeText(code);
            button.textContent = 'Đã sao chép';
            document.querySelector('#copy-status').textContent = 'Đã sao chép code C++.';
        } catch {
            button.textContent = 'Chọn code để sao chép';
            const range = document.createRange();
            range.selectNodeContents(button.closest('.code-block').querySelector('code'));
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        setTimeout(() => { button.textContent = 'Sao chép'; }, 2200);
    });
});

if (window.renderMathInElement) {
    renderMathInElement(document.querySelector('.markdown-body'), {
        delimiters: [{ left: '\\(', right: '\\)', display: false }],
        throwOnError: false,
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sidebar.querySelectorAll('a').forEach(link => {
            const active = link.hash === '#' + entry.target.id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    });
}, { rootMargin: '-70px 0px -65% 0px', threshold: 0 });
document.querySelectorAll('#tong-quan,.problem').forEach(section => observer.observe(section));
