// Combat System

class CombatSystem {
    constructor() {
        this.particles = [];
    }

    processPlayerAttack(player, enemies) {
        const attack = player.attack();
        if (!attack) return;

        const hitEnemies = [];

        for (const enemy of enemies) {
            if (!enemy.alive) continue;

            const dist = Utils.distance(player.x, player.y, enemy.x, enemy.y);
            const angleToEnemy = Utils.angle(player.x, player.y, enemy.x, enemy.y);
            const angleDiff = Math.abs(attack.angle - angleToEnemy);

            // Check if enemy is in attack cone
            if (dist <= attack.range && angleDiff < Math.PI / 4) {
                enemy.takeDamage(attack.damage);
                hitEnemies.push(enemy);

                // Create hit particles
                this.createHitParticles(enemy.x, enemy.y);

                // Grant XP if enemy died
                if (!enemy.alive) {
                    player.gainXP(enemy.xpValue);
                }
            }
        }

        // Create attack effect particles
        this.createAttackParticles(
            player.x,
            player.y,
            attack.angle,
            attack.range
        );

        return hitEnemies;
    }

    createAttackParticles(x, y, angle, range) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + Math.cos(angle) * (range * 0.5),
                y: y + Math.sin(angle) * (range * 0.5),
                vx: Math.cos(angle + Utils.randomFloat(-0.3, 0.3)) * 4,
                vy: Math.sin(angle + Utils.randomFloat(-0.3, 0.3)) * 4,
                life: 20,
                maxLife: 20,
                color: '#ff6b6b',
                size: Utils.randomInt(3, 6)
            });
        }
    }

    createHitParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * Utils.randomFloat(2, 5),
                vy: Math.sin(angle) * Utils.randomFloat(2, 5),
                life: 30,
                maxLife: 30,
                color: '#ffff00',
                size: Utils.randomInt(2, 4)
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, camera) {
        for (const p of this.particles) {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;

            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}
