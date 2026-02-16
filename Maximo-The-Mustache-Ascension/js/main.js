// Main initialization

let game;

document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', startGame);

    function startGame() {
        titleScreen.classList.remove('active');
        gameScreen.classList.add('active');

        // Initialize game
        game = new Game();
        window.game = game; // Make available globally for UI
        game.init();
    }
});
