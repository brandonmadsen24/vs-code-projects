// Progression System

class ProgressionSystem {
    constructor() {
        this.unlockedSkills = {
            agility: [],
            strength: [],
            chaos: []
        };
    }

    getXPForLevel(level) {
        return level * 100;
    }

    getXPProgress(player) {
        const needed = this.getXPForLevel(player.level);
        return {
            current: player.xp,
            needed: needed,
            percentage: (player.xp / needed) * 100
        };
    }

    canLevelUp(player) {
        return player.xp >= this.getXPForLevel(player.level) && player.level < 50;
    }

    upgradeSkill(player, skill, skillName) {
        if (player.skillPoints <= 0) return false;

        const success = player.upgradeSkill(skill);
        if (success) {
            this.unlockedSkills[skill].push(skillName);
        }

        return success;
    }

    getPlayerStats(player) {
        return {
            level: player.level,
            health: player.health,
            maxHealth: player.maxHealth,
            xp: player.xp,
            catnip: player.catnip,
            skillPoints: player.skillPoints,
            agility: player.agility,
            strength: player.strength,
            chaos: player.chaos,
            attackDamage: player.attackDamage,
            speed: player.speed,
            attackSpeed: player.attackSpeed
        };
    }
}
