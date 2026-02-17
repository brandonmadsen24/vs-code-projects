// Main entry point - Bootstrap the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    app = {
        ui: new UISystem(),
        mediaHandler: new MediaHandler(),
        formManager: new FormManager(),
        aiAgents: new AIAgents(),
        resultsManager: new ResultsManager(),
        draftManager: new DraftManager()
    };

    // Make app globally accessible
    window.app = app;

    // Initialize UI
    app.ui.init();

    console.log('Caption Lab initialized! 🐱');
});
