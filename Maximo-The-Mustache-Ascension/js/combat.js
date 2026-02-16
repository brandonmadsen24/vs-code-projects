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
        // Cat claw slash effect
        for (let i = 0; i < 8; i++) {
            const spreadAngle = angle + Utils.randomFloat(-0.4, 0.4);
            const distance = range * Utils.randomFloat(0.4, 0.9);

            this.particles.push({
                x: x + Math.cos(spreadAngle) * distance,
                y: y + Math.sin(spreadAngle) * distance,
                vx: Math.cos(spreadAngle) * 3,
                vy: Math.sin(spreadAngle) * 3,
                life: 15,
                maxLife: 15,
                color: Utils.randomChoice(['#ff6b6b', '#fff', '#ffd700']),
                size: Utils.randomInt(4, 8),
                type: 'slash'
            });
        }

        // Add claw streak effect
        this.particles.push({
            x: x,
            y: y,
            angle: angle,
            range: range,
            life: 8,
            maxLife: 8,
            type: 'claw-streak'
        });
    }

    createHitParticles(x, y) {
        // Impact explosion
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * Utils.randomFloat(3, 7),
                vy: Math.sin(angle) * Utils.randomFloat(3, 7),
                life: 25,
                maxLife: 25,
                color: Utils.randomChoice(['#ffff00', '#ffa500', '#ff6b6b', '#fff']),
                size: Utils.randomInt(3, 6),
                type: 'impact'
            });
        }

        // Add "POW!" effect
        this.particles.push({
            x: x,
            y: y - 20,
            vx: 0,
            vy: -1,
            life: 30,
            maxLife: 30,
            type: 'text',
            text: Utils.randomChoice(['POW!', 'SMACK!', 'HIT!', 'MEOW!']),
            color: '#fff'
        });
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

            if (p.type === 'claw-streak') {
                // Draw claw slash streaks
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff6b6b';

                const numClaws = 3;
                for (let i = 0; i < numClaws; i++) {
                    const offset = (i - 1) * 15;
                    const perpAngle = p.angle + Math.PI / 2;

                    ctx.beginPath();
                    ctx.moveTo(
                        screenX + Math.cos(perpAngle) * offset,
                        screenY + Math.sin(perpAngle) * offset
                    );
                    ctx.lineTo(
                        screenX + Math.cos(perpAngle) * offset + Math.cos(p.angle) * p.range,
                        screenY + Math.sin(perpAngle) * offset + Math.sin(p.angle) * p.range
                    );
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            } else if (p.type === 'text') {
                // Draw text effects
                ctx.fillStyle = p.color;
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.strokeText(p.text, screenX, screenY);
                ctx.fillText(p.text, screenX, screenY);
            } else {
                // Draw regular particles
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Add glow to impact particles
                if (p.type === 'impact') {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            ctx.globalAlpha = 1;
        }
    }
}
