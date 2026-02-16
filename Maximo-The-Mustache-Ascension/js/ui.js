// UI System

class UISystem {
    constructor() {
        this.inventoryOpen = false;
        this.skillPanelOpen = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Inventory toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'i' || e.key === 'I') {
                this.toggleInventory();
            }
            if (e.key === 'k' || e.key === 'K') {
                this.toggleSkillPanel();
            }
            if (e.key === 'Escape') {
                this.closeAllPanels();
            }
        });

        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllPanels();
            });
        });

        // Skills button
        const skillsBtn = document.getElementById('skills-btn');
        if (skillsBtn) {
            skillsBtn.addEventListener('click', () => this.toggleSkillPanel());
        }

        // Skill upgrade buttons
        document.querySelectorAll('.skill-upgrade').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skill = e.target.dataset.skill;
                this.onSkillUpgrade(skill, e.target.textContent);
            });
        });
    }

    updateHUD(player, enemies, progression) {
        // Health
        const healthPercent = (player.health / player.maxHealth) * 100;
        document.getElementById('health-bar').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent =
            `${Math.ceil(player.health)}/${player.maxHealth}`;

        // XP
        const xpProgress = progression.getXPProgress(player);
        const xpPercent = xpProgress.percentage;
        document.getElementById('xp-bar').style.width = xpPercent + '%';
        document.getElementById('xp-text').textContent =
            `${xpProgress.current}/${xpProgress.needed}`;

        // Level and Catnip
        document.getElementById('level-display').textContent = player.level;
        document.getElementById('catnip-display').textContent = player.catnip;

        // Skills
        document.getElementById('agility-stat').textContent = player.agility;
        document.getElementById('strength-stat').textContent = player.strength;
        document.getElementById('chaos-stat').textContent = player.chaos;
        document.getElementById('skill-points').textContent = player.skillPoints;

        // Enemy counter
        const aliveEnemies = enemies.filter(e => e.alive).length;
        document.getElementById('enemy-counter').textContent = `Enemies: ${aliveEnemies}`;

        // Boss indicator
        const hasBoss = enemies.some(e => e.alive && e instanceof Boss);
        const bossIndicator = document.getElementById('boss-indicator');
        if (hasBoss) {
            bossIndicator.classList.remove('hidden');
        } else {
            bossIndicator.classList.add('hidden');
        }
    }

    toggleInventory() {
        this.inventoryOpen = !this.inventoryOpen;
        const panel = document.getElementById('inventory-panel');

        if (this.inventoryOpen) {
            panel.classList.remove('hidden');
            this.skillPanelOpen = false;
            document.getElementById('skill-panel').classList.add('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    toggleSkillPanel() {
        this.skillPanelOpen = !this.skillPanelOpen;
        const panel = document.getElementById('skill-panel');

        if (this.skillPanelOpen) {
            panel.classList.remove('hidden');
            this.inventoryOpen = false;
            document.getElementById('inventory-panel').classList.add('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    closeAllPanels() {
        this.inventoryOpen = false;
        this.skillPanelOpen = false;
        document.getElementById('inventory-panel').classList.add('hidden');
        document.getElementById('skill-panel').classList.add('hidden');
    }

    onSkillUpgrade(skill, skillName) {
        // This will be called by the game
        if (window.game) {
            const success = window.game.upgradePlayerSkill(skill);
            if (success) {
                // Visual feedback
                event.target.classList.add('unlocked');
            }
        }
    }

    showGameOver() {
        document.getElementById('gameover-screen').classList.remove('hidden');
    }

    hideGameOver() {
        document.getElementById('gameover-screen').classList.add('hidden');
    }

    showVictory(bossName) {
        const victoryScreen = document.getElementById('victory-screen');
        const message = document.getElementById('victory-message');
        message.textContent = `You defeated ${bossName}! The mustache grows stronger!`;
        victoryScreen.classList.remove('hidden');
    }

    hideVictory() {
        document.getElementById('victory-screen').classList.add('hidden');
    }

    isPanelOpen() {
        return this.inventoryOpen || this.skillPanelOpen;
    }
}
