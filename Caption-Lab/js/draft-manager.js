// DraftManager - Handles localStorage persistence for drafts
class DraftManager {
    constructor() {
        this.storageKey = 'captionlab_drafts';
        this.setupEventListeners();
        this.updateDraftCount();
    }

    setupEventListeners() {
        // Save draft button
        document.getElementById('save-draft-btn').addEventListener('click', () => {
            this.saveDraft();
        });

        // Drafts button
        document.getElementById('drafts-btn').addEventListener('click', () => {
            this.showDraftsPanel();
        });

        // Close panel button
        document.querySelector('#drafts-panel .close-btn').addEventListener('click', () => {
            this.closeDraftsPanel();
        });
    }

    saveDraft() {
        if (!window.app.resultsManager.currentResults) {
            alert('No results to save!');
            return;
        }

        const draft = {
            id: Utils.generateId(),
            timestamp: Date.now(),
            media: window.app.mediaHandler.getFileData().name,
            inputs: window.app.formManager.getFormData(),
            results: window.app.resultsManager.currentResults
        };

        const drafts = this.getAllDrafts();
        drafts.unshift(draft); // Add to beginning (most recent first)

        // Limit to 20 drafts
        if (drafts.length > 20) {
            drafts.pop();
        }

        localStorage.setItem(this.storageKey, JSON.stringify(drafts));
        this.updateDraftCount();

        alert('Draft saved! 💾');
    }

    getAllDrafts() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    getDraft(id) {
        const drafts = this.getAllDrafts();
        return drafts.find(d => d.id === id);
    }

    deleteDraft(id) {
        const drafts = this.getAllDrafts().filter(d => d.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(drafts));
        this.updateDraftCount();
        this.showDraftsPanel(); // Refresh list
    }

    showDraftsPanel() {
        const panel = document.getElementById('drafts-panel');
        const list = document.getElementById('drafts-list');

        const drafts = this.getAllDrafts();

        if (drafts.length === 0) {
            list.innerHTML = '<p class="empty-state">No drafts yet. Generate some content!</p>';
        } else {
            list.innerHTML = drafts.map(draft => `
                <div class="draft-item">
                    <div class="draft-header">
                        <h3>${draft.media}</h3>
                        <button class="delete-btn" data-id="${draft.id}">🗑️</button>
                    </div>
                    <p class="draft-meta">${Utils.formatDate(new Date(draft.timestamp))}</p>
                    <p class="draft-preview">${this.getDraftPreview(draft)}</p>
                    <button class="load-btn" data-id="${draft.id}">📄 Load Draft</button>
                </div>
            `).join('');

            // Attach event listeners
            list.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    if (confirm('Delete this draft?')) {
                        this.deleteDraft(id);
                    }
                });
            });

            list.querySelectorAll('.load-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    this.loadDraft(id);
                });
            });
        }

        panel.classList.remove('hidden');
    }

    closeDraftsPanel() {
        document.getElementById('drafts-panel').classList.add('hidden');
    }

    loadDraft(id) {
        const draft = this.getDraft(id);
        if (!draft) {
            alert('Draft not found!');
            return;
        }

        // Display results
        window.app.resultsManager.displayResults(draft.results);
        window.app.ui.showScreen('results');
        this.closeDraftsPanel();
    }

    getDraftPreview(draft) {
        const firstCaption = draft.results.captions[0]?.caption || 'No caption';
        return Utils.truncate(firstCaption.replace(/\n/g, ' '), 80);
    }

    updateDraftCount() {
        const count = this.getAllDrafts().length;
        document.getElementById('drafts-btn').textContent = `📁 Drafts (${count})`;
    }
}
