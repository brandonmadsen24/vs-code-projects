// World System

class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.bosses = [];
        this.items = [];
        this.wave = 1;
        this.maxEnemies = 15;
        this.spawnTimer = 0;
        this.spawnInterval = 180; // frames

        // Boss spawn locations
        this.bossLocations = [
            { type: 'sewer-king', x: 500, y: 500, spawned: false },
            { type: 'golden-retriever', x: -500, y: 500, spawned: false },
            { type: 'alley-shadow', x: 500, y: -500, spawned: false },
            { type: 'vacuum-titan', x: -500, y: -500, spawned: false },
            { type: 'great-hound', x: 0, y: -1000, spawned: false }
        ];
    }

    update(player) {
        // Spawn enemies
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemies(player);
        }

        // Spawn bosses based on player level
        this.checkBossSpawns(player);

        // Update all enemies
        for (const enemy of this.enemies) {
            if (enemy.alive) {
                enemy.update(player);

                // Keep enemies in bounds
                enemy.x = Utils.clamp(enemy.x, -this.width/2, this.width/2);
                enemy.y = Utils.clamp(enemy.y, -this.height/2, this.height/2);
            }
        }

        // Remove dead enemies
        this.enemies = this.enemies.filter(e => e.alive);
    }

    spawnEnemies(player) {
        const aliveCount = this.enemies.filter(e => e.alive).length;

        if (aliveCount >= this.maxEnemies) return;

        const spawnCount = Utils.randomInt(1, 3);

        for (let i = 0; i < spawnCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 400 + Math.random() * 200;

            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;

            // Enemy type based on wave/level
            let type = 'mouse';
            const rand = Math.random();

            if (player.level >= 10 && rand < 0.3) {
                type = 'dog';
            } else if (player.level >= 20 && rand < 0.1) {
                type = 'mini-boss';
            }

            const enemy = new Enemy(x, y, type);
            this.enemies.push(enemy);
        }
    }

    checkBossSpawns(player) {
        for (const bossLoc of this.bossLocations) {
            if (bossLoc.spawned) continue;

            // Spawn boss when player is nearby and high enough level
            const dist = Utils.distance(player.x, player.y, bossLoc.x, bossLoc.y);
            const levelReq = this.getBossLevelRequirement(bossLoc.type);

            if (dist < 300 && player.level >= levelReq) {
                const boss = new Boss(bossLoc.x, bossLoc.y, bossLoc.type);
                this.enemies.push(boss);
                this.bosses.push(boss);
                bossLoc.spawned = true;
            }
        }
    }

    getBossLevelRequirement(bossType) {
        const requirements = {
            'sewer-king': 5,
            'golden-retriever': 10,
            'alley-shadow': 15,
            'vacuum-titan': 25,
            'great-hound': 35
        };
        return requirements[bossType] || 1;
    }

    drawWorld(ctx, camera) {
        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Grid
        this.drawGrid(ctx, camera);

        // Boss spawn indicators
        this.drawBossIndicators(ctx, camera);
    }

    drawGrid(ctx, camera) {
        const gridSize = 100;
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;

        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x < camera.x + ctx.canvas.width; x += gridSize) {
            const screenX = x - camera.x;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, ctx.canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = startY; y < camera.y + ctx.canvas.height; y += gridSize) {
            const screenY = y - camera.y;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(ctx.canvas.width, screenY);
            ctx.stroke();
        }
    }

    drawBossIndicators(ctx, camera) {
        for (const bossLoc of this.bossLocations) {
            if (bossLoc.spawned) continue;

            const screenX = bossLoc.x - camera.x;
            const screenY = bossLoc.y - camera.y;

            // Only draw if on screen
            if (screenX < -50 || screenX > ctx.canvas.width + 50 ||
                screenY < -50 || screenY > ctx.canvas.height + 50) {
                continue;
            }

            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(screenX, screenY, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#ff6b6b';
            ctx.font = '12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('BOSS', screenX, screenY);
            ctx.fillText(`Lv ${this.getBossLevelRequirement(bossLoc.type)}`, screenX, screenY + 15);
        }
    }

    getEnemies() {
        return this.enemies;
    }
}
