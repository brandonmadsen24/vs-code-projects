// ResultsManager - Displays generated content and handles copying
class ResultsManager {
    constructor() {
        this.currentResults = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }

    displayResults(results) {
        this.currentResults = results;

        this.renderOnScreenText(results.onScreenText);
        this.renderCaptions(results.captions);
        this.renderHashtags(results.hashtags);
        this.renderAudio(results.trendingAudio);
    }

    renderOnScreenText(items) {
        const container = document.getElementById('onscreen-tab');
        container.innerHTML = '';

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            card.innerHTML = `
                <button class="copy-btn" data-text="${this.escapeHtml(item.text)}">📋 Copy</button>
                <div class="suggestion-content">
                    <p class="suggestion-text">${this.escapeHtml(item.text)}</p>
                    <div class="suggestion-meta">
                        <span class="badge">Hook: ${item.hookStrength}/5</span>
                        <span class="style-hint">${item.styleHint}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        this.attachCopyListeners(container);
    }

    renderCaptions(items) {
        const container = document.getElementById('captions-tab');
        container.innerHTML = '';

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'suggestion-card caption-card';
            card.innerHTML = `
                <button class="copy-btn" data-text="${this.escapeHtml(item.caption)}">📋 Copy</button>
                <div class="suggestion-content">
                    <p class="suggestion-text">${this.formatCaption(item.caption)}</p>
                    <div class="suggestion-meta">
                        <span class="badge">${item.tone}</span>
                        ${item.ctaIncluded ? '<span class="badge">CTA ✓</span>' : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        this.attachCopyListeners(container);
    }

    renderHashtags(items) {
        const container = document.getElementById('hashtags-tab');
        container.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'suggestion-card hashtag-card';
            card.innerHTML = `
                <button class="copy-btn" data-text="${this.escapeHtml(item.copyBlock)}">📋 Copy All</button>
                <div class="suggestion-content">
                    <h3>${item.platform.toUpperCase()}</h3>
                    <div class="hashtag-list">
                        ${item.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        this.attachCopyListeners(container);
    }

    renderAudio(items) {
        const container = document.getElementById('audio-tab');
        container.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'suggestion-card audio-card';
            card.innerHTML = `
                <button class="copy-btn" data-text="${this.escapeHtml(item.title + ' - ' + item.artist)}">📋 Copy</button>
                <div class="suggestion-content">
                    <h3>${this.escapeHtml(item.title)}</h3>
                    <p class="artist">by ${this.escapeHtml(item.artist)}</p>
                    <p class="rationale">${this.escapeHtml(item.whyItFits)}</p>
                    <div class="suggestion-meta">
                        <span class="badge">Trend: ${Math.round(item.trendScore * 100)}%</span>
                        <span class="badge">${item.platform}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        this.attachCopyListeners(container);
    }

    attachCopyListeners(container) {
        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const text = e.target.dataset.text;
                const success = await Utils.copyToClipboard(text);

                if (success) {
                    // Visual feedback
                    const originalText = e.target.textContent;
                    e.target.textContent = '✓ Copied!';
                    e.target.classList.add('copied');

                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.classList.remove('copied');
                    }, 2000);
                } else {
                    alert('Failed to copy. Please try again.');
                }
            });
        });
    }

    switchTab(tabName) {
        // Remove active from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        // Add active to selected
        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        const panel = document.getElementById(`${tabName}-tab`);

        if (tab) tab.classList.add('active');
        if (panel) panel.classList.add('active');
    }

    formatCaption(text) {
        // Convert newlines to <br> for HTML display
        return text.replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
