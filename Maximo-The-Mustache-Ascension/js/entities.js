// Game Entities

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 20;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 2;
        this.alive = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    draw(ctx) {
        // Override in subclasses
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.radius = 25;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 4;
        this.attackDamage = 10;
        this.attackRange = 90; // Increased for more dynamic combat
        this.attackCooldown = 0;
        this.attackSpeed = 20; // frames between attacks
        this.animFrame = 0; // For animation
        this.level = 1;
        this.xp = 0;
        this.catnip = 0;

        // Stats
        this.agility = 0;
        this.strength = 0;
        this.chaos = 0;
        this.skillPoints = 0;

        // Inventory
        this.inventory = [];

        // Movement
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.angle = 0;
    }

    update() {
        // Movement
        this.vx = 0;
        this.vy = 0;

        if (this.keys['w'] || this.keys['W']) this.vy = -this.speed;
        if (this.keys['s'] || this.keys['S']) this.vy = this.speed;
        if (this.keys['a'] || this.keys['A']) this.vx = -this.speed;
        if (this.keys['d'] || this.keys['D']) this.vx = this.speed;

        // Diagonal movement normalization
        if (this.vx !== 0 && this.vy !== 0) {
            const norm = Utils.normalize(this.vx, this.vy);
            this.vx = norm.x * this.speed;
            this.vy = norm.y * this.speed;
        }

        super.update();

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // Calculate angle to mouse
        this.angle = Utils.angle(this.x, this.y, this.mouseX, this.mouseY);

        // Update animation frame
        this.animFrame++;
    }

    attack() {
        if (this.attackCooldown > 0) return null;

        this.attackCooldown = this.attackSpeed;

        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            damage: this.attackDamage + this.strength * 2,
            range: this.attackRange
        };
    }

    gainXP(amount) {
        this.xp += amount;
        this.catnip += amount;

        // Level up check
        const xpNeeded = this.level * 100;
        if (this.xp >= xpNeeded) {
            this.levelUp();
        }
    }

    levelUp() {
        if (this.level >= 50) return;

        this.level++;
        this.xp = 0;
        this.skillPoints += 3;
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attackDamage += 2;
    }

    upgradeSkill(skill) {
        if (this.skillPoints <= 0) return false;

        this.skillPoints--;

        switch(skill) {
            case 'agility':
                this.agility++;
                this.speed += 0.2;
                break;
            case 'strength':
                this.strength++;
                this.attackDamage += 3;
                break;
            case 'chaos':
                this.chaos++;
                this.attackSpeed = Math.max(10, this.attackSpeed - 1);
                break;
        }

        return true;
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);

        // Running animation
        const bounce = Math.sin(this.animFrame * 0.3) * 2;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 20, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail (curled)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.quadraticCurveTo(-30, -10, -25, -20);
        ctx.stroke();

        // Back legs
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-10, 8 + bounce, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-10, 12 + bounce, 5, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (tuxedo pattern)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(0, 0 + bounce, 25, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // White chest/belly
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(5, 2 + bounce, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Front legs
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(15, 8 + bounce, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(15, 12 + bounce, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(25, -5 + bounce, 15, 0, Math.PI * 2);
        ctx.fill();

        // White muzzle
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(30, -2 + bounce, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(20, -15 + bounce);
        ctx.lineTo(15, -22 + bounce);
        ctx.lineTo(23, -18 + bounce);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(30, -15 + bounce);
        ctx.lineTo(35, -22 + bounce);
        ctx.lineTo(27, -18 + bounce);
        ctx.fill();

        // Magnificent Mustache!
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Left mustache
        ctx.moveTo(25, 0 + bounce);
        ctx.quadraticCurveTo(30, -3 + bounce, 38, -5 + bounce);
        ctx.moveTo(25, 2 + bounce);
        ctx.quadraticCurveTo(30, 1 + bounce, 38, 0 + bounce);
        // Right mustache
        ctx.moveTo(25, 0 + bounce);
        ctx.quadraticCurveTo(30, -3 + bounce, 38, -5 + bounce);
        ctx.stroke();

        // Eyes (bright and determined)
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(28, -7 + bounce, 3, 0, Math.PI * 2);
        ctx.arc(34, -7 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(29, -7 + bounce, 1.5, 0, Math.PI * 2);
        ctx.arc(35, -7 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.moveTo(31, -2 + bounce);
        ctx.lineTo(29, 0 + bounce);
        ctx.lineTo(33, 0 + bounce);
        ctx.fill();

        // Attack indicator (claw slash)
        if (this.attackCooldown > 15) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 4;
            ctx.globalAlpha = this.attackCooldown / 20;
            ctx.beginPath();
            ctx.moveTo(40, -10);
            ctx.lineTo(55, -5);
            ctx.moveTo(40, 0);
            ctx.lineTo(55, 5);
            ctx.moveTo(40, 10);
            ctx.lineTo(55, 15);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        ctx.restore();

        // Health bar
        this.drawHealthBar(ctx, screenX, screenY);
    }

    drawHealthBar(ctx, x, y) {
        const barWidth = 50;
        const barHeight = 5;
        const barY = y - this.radius - 10;

        ctx.fillStyle = '#333';
        ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

        ctx.fillStyle = '#ff6b6b';
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillRect(x - barWidth / 2, barY, healthWidth, barHeight);
    }
}

class Enemy extends Entity {
    constructor(x, y, type = 'mouse') {
        super(x, y);
        this.type = type;
        this.target = null;
        this.attackDamage = 5;
        this.attackRange = 30;
        this.attackCooldown = 0;
        this.attackSpeed = 60;
        this.xpValue = 10;
        this.detectionRange = 300;

        this.setupType();
    }

    setupType() {
        switch(this.type) {
            case 'mouse':
                this.radius = 12;
                this.health = 30;
                this.maxHealth = 30;
                this.speed = 1.5;
                this.attackDamage = 5;
                this.xpValue = 10;
                this.color = '#8B4513';
                break;
            case 'dog':
                this.radius = 30;
                this.health = 80;
                this.maxHealth = 80;
                this.speed = 2.5;
                this.attackDamage = 15;
                this.xpValue = 30;
                this.color = '#654321';
                break;
            case 'mini-boss':
                this.radius = 40;
                this.health = 150;
                this.maxHealth = 150;
                this.speed = 2;
                this.attackDamage = 20;
                this.xpValue = 50;
                this.color = '#8B0000';
                break;
        }
    }

    update(player) {
        if (!this.target) this.target = player;

        const dist = Utils.distance(this.x, this.y, player.x, player.y);

        // Chase player if in detection range
        if (dist < this.detectionRange) {
            const angle = Utils.angle(this.x, this.y, player.x, player.y);

            // Move towards player if not in attack range
            if (dist > this.attackRange) {
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
            } else {
                this.vx = 0;
                this.vy = 0;

                // Attack
                if (this.attackCooldown === 0) {
                    this.attackCooldown = this.attackSpeed;
                    player.takeDamage(this.attackDamage);
                }
            }
        } else {
            // Wander
            if (Math.random() < 0.02) {
                this.vx = Utils.randomFloat(-1, 1);
                this.vy = Utils.randomFloat(-1, 1);
            }
        }

        super.update();

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (this.type === 'mouse') {
            this.drawMouse(ctx, screenX, screenY);
        } else if (this.type === 'dog') {
            this.drawDog(ctx, screenX, screenY);
        } else if (this.type === 'mini-boss') {
            this.drawMiniBoss(ctx, screenX, screenY);
        }

        // Health bar
        this.drawHealthBar(ctx, screenX, screenY);
    }

    drawMouse(ctx, x, y) {
        const angle = this.vx !== 0 || this.vy !== 0 ? Math.atan2(this.vy, this.vx) : 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 8, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.quadraticCurveTo(-15, 3, -18, -2);
        ctx.stroke();

        // Body (rat brown)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(10, -2, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears (large rat ears)
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.ellipse(8, -8, 4, 6, -0.3, 0, Math.PI * 2);
        ctx.ellipse(12, -8, 4, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (beady and red)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(12, -3, 2, 0, Math.PI * 2);
        ctx.arc(16, -3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.arc(18, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(18, -2);
        ctx.lineTo(25, -4);
        ctx.moveTo(18, -2);
        ctx.lineTo(25, 0);
        ctx.moveTo(18, -2);
        ctx.lineTo(25, 2);
        ctx.stroke();

        ctx.restore();
    }

    drawDog(ctx, x, y) {
        const angle = this.vx !== 0 || this.vy !== 0 ? Math.atan2(this.vy, this.vx) : 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 18, 25, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail (wagging)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.quadraticCurveTo(-28, -8, -25, -15);
        ctx.stroke();

        // Back legs
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(-12, 12, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spots
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(-5, -5, 6, 0, Math.PI * 2);
        ctx.arc(5, 3, 5, 0, Math.PI * 2);
        ctx.fill();

        // Front legs
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(18, 12, 7, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(28, -3, 14, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.ellipse(38, 0, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Floppy ears
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(22, -12, 6, 10, -0.5, 0, Math.PI * 2);
        ctx.ellipse(28, -12, 6, 10, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (angry)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28, -6, 4, 0, Math.PI * 2);
        ctx.arc(36, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(29, -5, 2.5, 0, Math.PI * 2);
        ctx.arc(37, -5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(42, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Teeth (menacing)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(38, 4);
        ctx.lineTo(36, 8);
        ctx.lineTo(40, 8);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(42, 4);
        ctx.lineTo(40, 8);
        ctx.lineTo(44, 8);
        ctx.fill();

        ctx.restore();
    }

    drawMiniBoss(ctx, x, y) {
        const angle = this.vx !== 0 || this.vy !== 0 ? Math.atan2(this.vy, this.vx) : 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Larger, meaner dog with armor

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 25, 35, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.quadraticCurveTo(-40, -12, -35, -20);
        ctx.stroke();

        // Back legs
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(-18, 15, 10, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body with armor
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, 35, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Armor plating
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Front legs
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(25, 15, 9, 17, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(40, -5, 18, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.ellipse(52, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(32, -18);
        ctx.lineTo(28, -28);
        ctx.lineTo(36, -20);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(44, -18);
        ctx.lineTo(48, -28);
        ctx.lineTo(40, -20);
        ctx.fill();

        // Eyes (glowing red)
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(38, -8, 5, 0, Math.PI * 2);
        ctx.arc(48, -8, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(58, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Fangs
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(52, 6);
        ctx.lineTo(48, 14);
        ctx.lineTo(54, 14);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(58, 6);
        ctx.lineTo(54, 14);
        ctx.lineTo(60, 14);
        ctx.fill();

        ctx.restore();
    }

    drawHealthBar(ctx, x, y) {
        const barWidth = this.radius * 2;
        const barHeight = 4;
        const barY = y - this.radius - 8;

        ctx.fillStyle = '#333';
        ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

        ctx.fillStyle = '#ff6b6b';
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillRect(x - barWidth / 2, barY, healthWidth, barHeight);
    }
}

class Boss extends Enemy {
    constructor(x, y, bossType) {
        super(x, y, 'boss');
        this.bossType = bossType;
        this.setupBoss();
    }

    setupBoss() {
        const bosses = {
            'sewer-king': {
                name: 'Sewer King',
                radius: 60,
                health: 500,
                speed: 1.5,
                damage: 25,
                xp: 200,
                color: '#2F4F2F'
            },
            'golden-retriever': {
                name: 'Golden Retriever Warlord',
                radius: 70,
                health: 800,
                speed: 2,
                damage: 30,
                xp: 300,
                color: '#DAA520'
            },
            'alley-shadow': {
                name: 'Alley Shadow',
                radius: 50,
                health: 600,
                speed: 3,
                damage: 35,
                xp: 250,
                color: '#191970'
            },
            'vacuum-titan': {
                name: 'Vacuum Titan',
                radius: 80,
                health: 1000,
                speed: 1,
                damage: 40,
                xp: 400,
                color: '#696969'
            },
            'great-hound': {
                name: 'Great Hound of the North',
                radius: 90,
                health: 1500,
                speed: 2.5,
                damage: 50,
                xp: 500,
                color: '#FFFFFF'
            }
        };

        const config = bosses[this.bossType];
        this.name = config.name;
        this.radius = config.radius;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.attackDamage = config.damage;
        this.xpValue = config.xp;
        this.color = config.color;
        this.detectionRange = 500;
        this.attackSpeed = 45;
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Boss aura with pulsing effect
        const pulse = Math.sin(Date.now() * 0.005) * 5;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius + 15 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw specific boss type
        this.drawBossBody(ctx, screenX, screenY);

        // Boss name with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(screenX - 80, screenY - this.radius - 35, 160, 20);
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.name.toUpperCase(), screenX, screenY - this.radius - 20);

        // Health bar
        this.drawHealthBar(ctx, screenX, screenY);
    }

    drawBossBody(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // All bosses are massive legendary dogs
        const scale = this.radius / 60; // Scale based on boss size

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 40 * scale, 50 * scale, 20 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail (epic and flowing)
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 12 * scale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-40 * scale, 0);
        ctx.quadraticCurveTo(-60 * scale, -20 * scale, -50 * scale, -35 * scale);
        ctx.stroke();

        // Back legs (powerful)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(-25 * scale, 20 * scale, 15 * scale, 25 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (massive and muscular)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 50 * scale, 30 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legendary markings
        if (this.bossType === 'golden-retriever') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(0, -10 * scale, 30 * scale, 20 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.bossType === 'great-hound') {
            // White fur patches
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-10 * scale, -5 * scale, 12 * scale, 0, Math.PI * 2);
            ctx.arc(15 * scale, 5 * scale, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.bossType === 'alley-shadow') {
            // Dark shadowy wisps
            ctx.fillStyle = 'rgba(25, 25, 112, 0.7)';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc((i * 15 - 15) * scale, (i * 5 - 10) * scale, 8 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Front legs
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(35 * scale, 20 * scale, 12 * scale, 24 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head (fierce and legendary)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(55 * scale, -8 * scale, 25 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        const snoutColor = this.bossType === 'vacuum-titan' ? '#888' : this.color;
        ctx.fillStyle = snoutColor;
        ctx.beginPath();
        ctx.ellipse(72 * scale, 0, 15 * scale, 12 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears (different styles per boss)
        ctx.fillStyle = this.color;
        if (this.bossType === 'great-hound') {
            // Standing ears (wolf-like)
            ctx.beginPath();
            ctx.moveTo(45 * scale, -25 * scale);
            ctx.lineTo(40 * scale, -40 * scale);
            ctx.lineTo(50 * scale, -30 * scale);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(60 * scale, -25 * scale);
            ctx.lineTo(65 * scale, -40 * scale);
            ctx.lineTo(55 * scale, -30 * scale);
            ctx.fill();
        } else {
            // Floppy ears
            ctx.beginPath();
            ctx.ellipse(42 * scale, -20 * scale, 10 * scale, 16 * scale, -0.5, 0, Math.PI * 2);
            ctx.ellipse(58 * scale, -20 * scale, 10 * scale, 16 * scale, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Eyes (glowing and menacing)
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 15 * scale;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(50 * scale, -12 * scale, 7 * scale, 0, Math.PI * 2);
        ctx.arc(65 * scale, -12 * scale, 7 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(52 * scale, -11 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.arc(67 * scale, -11 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(80 * scale, 0, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Legendary fangs
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(72 * scale, 8 * scale);
        ctx.lineTo(68 * scale, 18 * scale);
        ctx.lineTo(74 * scale, 18 * scale);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(80 * scale, 8 * scale);
        ctx.lineTo(76 * scale, 18 * scale);
        ctx.lineTo(82 * scale, 18 * scale);
        ctx.fill();

        // Collar/armor (for some bosses)
        if (this.bossType === 'vacuum-titan') {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 5 * scale;
            ctx.beginPath();
            ctx.arc(40 * scale, 0, 20 * scale, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.bossType === 'golden-retriever') {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 6 * scale;
            ctx.beginPath();
            ctx.arc(40 * scale, 5 * scale, 18 * scale, -Math.PI / 4, Math.PI * 1.25);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawHealthBar(ctx, x, y) {
        const barWidth = this.radius * 2;
        const barHeight = 8;
        const barY = y - this.radius - 10;

        ctx.fillStyle = '#333';
        ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

        ctx.fillStyle = '#ff0000';
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillRect(x - barWidth / 2, barY, healthWidth, barHeight);

        // Health text
        ctx.fillStyle = '#fff';
        ctx.font = '10px Courier New';
        ctx.fillText(`${Math.ceil(this.health)}/${this.maxHealth}`, x, barY - 2);
    }
}
