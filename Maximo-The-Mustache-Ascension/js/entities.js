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
        this.attackRange = 60;
        this.attackCooldown = 0;
        this.attackSpeed = 20; // frames between attacks
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

        // Body (tuxedo cat)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // White chest
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(screenX, screenY + 5, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Mustache
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX - 15, screenY);
        ctx.lineTo(screenX - 25, screenY - 5);
        ctx.moveTo(screenX + 15, screenY);
        ctx.lineTo(screenX + 25, screenY - 5);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(screenX - 8, screenY - 5, 4, 0, Math.PI * 2);
        ctx.arc(screenX + 8, screenY - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(
            screenX + Math.cos(this.angle) * (this.radius + 15),
            screenY + Math.sin(this.angle) * (this.radius + 15)
        );
        ctx.stroke();

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

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(screenX - this.radius/3, screenY - this.radius/3, 3, 0, Math.PI * 2);
        ctx.arc(screenX + this.radius/3, screenY - this.radius/3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Health bar
        this.drawHealthBar(ctx, screenX, screenY);
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

        // Boss aura
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Boss body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Boss eyes (glowing)
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(screenX - this.radius/3, screenY - this.radius/4, 6, 0, Math.PI * 2);
        ctx.arc(screenX + this.radius/3, screenY - this.radius/4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Boss name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenX, screenY - this.radius - 20);

        // Health bar
        this.drawHealthBar(ctx, screenX, screenY);
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
