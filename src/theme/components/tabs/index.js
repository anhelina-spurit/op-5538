import './tab';
import './tab-list';

function resetSelected(tablist) {
  tablist.querySelectorAll('[role="tab"]').forEach((tab) => {
    const panelId = tab.getAttribute('aria-controls');
    tab.setAttribute('aria-selected', 'false');
    document.getElementById(panelId).setAttribute('hidden', '');
  });
}

function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    tablist.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        resetSelected(tablist);
        tab.setAttribute('aria-selected', 'true');
        const panelId = tab.getAttribute('aria-controls');
        document.getElementById(panelId).removeAttribute('hidden');
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      });
    });
  });
}

export { initTabs };
