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
        // Tropical Paradise Background
        this.drawTropicalBackground(ctx, camera);

        // Grid (subtle)
        this.drawGrid(ctx, camera);

        // Palm trees and decorations
        this.drawPalmTrees(ctx, camera);

        // Boss spawn indicators
        this.drawBossIndicators(ctx, camera);
    }

    drawTropicalBackground(ctx, camera) {
        // Sky gradient (tropical blue)
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, '#87CEEB');  // Sky blue
        gradient.addColorStop(0.6, '#B0E0E6'); // Powder blue
        gradient.addColorStop(1, '#F0E68C');   // Khaki (sand transition)
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Sun
        const sunX = ctx.canvas.width - 100;
        const sunY = 80;
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#FFA500';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Clouds
        this.drawClouds(ctx, camera);

        // Ocean (visible in distance)
        const horizon = ctx.canvas.height * 0.7;
        const oceanGradient = ctx.createLinearGradient(0, horizon, 0, ctx.canvas.height);
        oceanGradient.addColorStop(0, '#4682B4'); // Steel blue
        oceanGradient.addColorStop(0.5, '#1E90FF'); // Dodger blue
        oceanGradient.addColorStop(1, '#00BFFF');  // Deep sky blue
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, horizon, ctx.canvas.width, ctx.canvas.height - horizon);

        // Waves (animated)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        const waveOffset = (Date.now() * 0.05) % 100;
        for (let y = horizon; y < ctx.canvas.height; y += 30) {
            ctx.beginPath();
            for (let x = -waveOffset; x < ctx.canvas.width + 100; x += 100) {
                const wave = Math.sin((x + waveOffset) * 0.02) * 5;
                if (x === -waveOffset) {
                    ctx.moveTo(x, y + wave);
                } else {
                    ctx.lineTo(x, y + wave);
                }
            }
            ctx.stroke();
        }

        // Sand (foreground)
        const sandGradient = ctx.createRadialGradient(
            ctx.canvas.width / 2, ctx.canvas.height / 2, 0,
            ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width
        );
        sandGradient.addColorStop(0, 'rgba(255, 248, 220, 0.3)');
        sandGradient.addColorStop(1, 'rgba(244, 164, 96, 0.2)');
        ctx.fillStyle = sandGradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    drawClouds(ctx, camera) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const cloudOffset = (camera.x * 0.1) % 300;

        // Draw several clouds
        for (let i = 0; i < 5; i++) {
            const x = (i * 250 - cloudOffset) % (ctx.canvas.width + 200);
            const y = 50 + i * 30;

            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 30, y, 30, 0, Math.PI * 2);
            ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 30, y - 15, 25, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawPalmTrees(ctx, camera) {
        const gridSize = 400;
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;

        // Draw palm trees at grid intersections
        for (let x = startX - gridSize; x < camera.x + ctx.canvas.width + gridSize; x += gridSize) {
            for (let y = startY - gridSize; y < camera.y + ctx.canvas.height + gridSize; y += gridSize) {
                // Only draw some trees (not every intersection)
                if ((x + y) % 800 === 0) {
                    const screenX = x - camera.x;
                    const screenY = y - camera.y;
                    this.drawPalmTree(ctx, screenX, screenY);
                }
            }
        }
    }

    drawPalmTree(ctx, x, y) {
        // Trunk
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y - 60);
        ctx.stroke();

        // Horizontal lines on trunk
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(x + 2, y - i * 12, 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Palm fronds
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const fronds = 8;
        for (let i = 0; i < fronds; i++) {
            const angle = (i / fronds) * Math.PI * 2;
            const length = 40;

            ctx.beginPath();
            ctx.moveTo(x + 5, y - 60);
            ctx.quadraticCurveTo(
                x + 5 + Math.cos(angle) * length * 0.6,
                y - 60 + Math.sin(angle) * length * 0.6 - 10,
                x + 5 + Math.cos(angle) * length,
                y - 60 + Math.sin(angle) * length
            );
            ctx.stroke();

            // Frond details
            ctx.strokeStyle = '#32CD32';
            ctx.lineWidth = 2;
            for (let j = 0; j < 3; j++) {
                const t = (j + 1) / 4;
                const px = x + 5 + Math.cos(angle) * length * t;
                const py = y - 60 + Math.sin(angle) * length * t - 10 * (1 - t);

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + Math.cos(angle + Math.PI / 2) * 8, py + Math.sin(angle + Math.PI / 2) * 8);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + Math.cos(angle - Math.PI / 2) * 8, py + Math.sin(angle - Math.PI / 2) * 8);
                ctx.stroke();
            }

            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 4;
        }

        // Coconuts
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x + 8, y - 55, 4, 0, Math.PI * 2);
        ctx.arc(x + 2, y - 58, 4, 0, Math.PI * 2);
        ctx.arc(x + 10, y - 62, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGrid(ctx, camera) {
        const gridSize = 100;
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;

        ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)'; // Subtle brown grid for sand
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

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

        ctx.setLineDash([]);
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
