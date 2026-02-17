// UISystem - Manages UI state and orchestrates the application
class UISystem {
    constructor() {
        this.currentScreen = 'upload';
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.handleGenerate();
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('upload');
        });
    }

    async handleGenerate() {
        // Validate form
        const formValid = window.app.formManager.validate();
        if (!formValid) return;

        // Show loading
        this.showLoading();

        try {
            // Get inputs
            const inputs = window.app.formManager.getFormData();
            const mediaData = window.app.mediaHandler.getFileData();

            // Generate results
            const results = await window.app.aiAgents.generate(inputs, mediaData);

            // Display results
            window.app.resultsManager.displayResults(results);

            // Switch to results screen
            this.showScreen('results');
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Error generating content. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Show selected screen
        if (screenName === 'upload') {
            document.getElementById('upload-screen').classList.add('active');
        } else if (screenName === 'results') {
            document.getElementById('results-screen').classList.add('active');
        }

        this.currentScreen = screenName;
    }

    showLoading() {
        document.getElementById('generate-btn').disabled = true;
        document.getElementById('loading-indicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('generate-btn').disabled = false;
        document.getElementById('loading-indicator').classList.add('hidden');
    }
}
