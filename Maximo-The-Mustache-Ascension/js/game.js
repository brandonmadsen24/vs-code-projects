// Main Game Engine

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.player = null;
        this.world = null;
        this.combat = null;
        this.progression = null;
        this.ui = null;
        this.camera = { x: 0, y: 0 };

        this.running = false;
        this.paused = false;

        this.setupInput();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!this.player) return;
            this.player.keys[e.key] = true;

            // Attack
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (!this.ui.isPanelOpen()) {
                    this.combat.processPlayerAttack(this.player, this.world.getEnemies());
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (!this.player) return;
            this.player.keys[e.key] = false;
        });

        // Mouse
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.player) return;
            const rect = this.canvas.getBoundingClientRect();
            this.player.mouseX = this.camera.x + e.clientX - rect.left;
            this.player.mouseY = this.camera.y + e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
            if (!this.player || this.ui.isPanelOpen()) return;
            this.combat.processPlayerAttack(this.player, this.world.getEnemies());
        });

        // Respawn button
        document.getElementById('respawn-btn').addEventListener('click', () => {
            this.respawnPlayer();
        });

        // Continue button
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.ui.hideVictory();
        });
    }

    init() {
        this.player = new Player(0, 0);
        this.world = new World(2000, 2000);
        this.combat = new CombatSystem();
        this.progression = new ProgressionSystem();
        this.ui = new UISystem();

        this.running = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.running) return;

        if (!this.paused && !this.ui.isPanelOpen()) {
            this.update();
        }

        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (!this.player.alive) {
            this.ui.showGameOver();
            this.paused = true;
            return;
        }

        this.player.update();

        // Keep player in world bounds
        this.player.x = Utils.clamp(this.player.x, -this.world.width/2, this.world.width/2);
        this.player.y = Utils.clamp(this.player.y, -this.world.height/2, this.world.height/2);

        this.world.update(this.player);
        this.combat.update();

        // Update camera to follow player
        this.updateCamera();

        // Check for boss defeats
        this.checkBossDefeats();

        // Update UI
        this.ui.updateHUD(this.player, this.world.getEnemies(), this.progression);
    }

    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height / 2;

        this.camera.x = Utils.lerp(this.camera.x, targetX, 0.1);
        this.camera.y = Utils.lerp(this.camera.y, targetY, 0.1);
    }

    checkBossDefeats() {
        for (const boss of this.world.bosses) {
            if (!boss.alive && boss.defeatedShown !== true) {
                boss.defeatedShown = true;
                this.ui.showVictory(boss.name);
                this.paused = true;
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw world
        this.world.drawWorld(this.ctx, this.camera);

        // Draw player
        if (this.player.alive) {
            this.player.draw(this.ctx, this.camera);
        }

        // Draw enemies
        for (const enemy of this.world.getEnemies()) {
            if (enemy.alive) {
                enemy.draw(this.ctx, this.camera);
            }
        }

        // Draw combat effects
        this.combat.draw(this.ctx, this.camera);

        // Draw minimap
        this.drawMinimap();
    }

    drawMinimap() {
        const mapSize = 150;
        const mapX = this.canvas.width - mapSize - 20;
        const mapY = this.canvas.height - mapSize - 20;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(mapX, mapY, mapSize, mapSize);

        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.strokeRect(mapX, mapY, mapSize, mapSize);

        // Scale
        const scaleX = mapSize / this.world.width;
        const scaleY = mapSize / this.world.height;

        // Player
        const playerMapX = mapX + (this.player.x + this.world.width/2) * scaleX;
        const playerMapY = mapY + (this.player.y + this.world.height/2) * scaleY;

        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.beginPath();
        this.ctx.arc(playerMapX, playerMapY, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Enemies
        for (const enemy of this.world.getEnemies()) {
            if (!enemy.alive) continue;

            const enemyMapX = mapX + (enemy.x + this.world.width/2) * scaleX;
            const enemyMapY = mapY + (enemy.y + this.world.height/2) * scaleY;

            if (enemy instanceof Boss) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.beginPath();
                this.ctx.arc(enemyMapX, enemyMapY, 4, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.beginPath();
                this.ctx.arc(enemyMapX, enemyMapY, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    upgradePlayerSkill(skill) {
        return this.progression.upgradeSkill(this.player, skill, skill);
    }

    respawnPlayer() {
        this.player.health = this.player.maxHealth;
        this.player.alive = true;
        this.player.x = 0;
        this.player.y = 0;
        this.ui.hideGameOver();
        this.paused = false;
    }

    pauseGame() {
        this.paused = true;
    }

    resumeGame() {
        if (this.ui.isPanelOpen()) return;
        this.paused = false;
    }
}
