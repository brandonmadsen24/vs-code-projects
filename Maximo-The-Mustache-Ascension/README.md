# Maximo: The Mustache Ascension

A third-person open-world action RPG browser game featuring Maximo, a tuxedo cat with a magnificent mustache.

![Game Type](https://img.shields.io/badge/Type-Action%20RPG-red)
![Platform](https://img.shields.io/badge/Platform-Web%20Browser-blue)
![Status](https://img.shields.io/badge/Status-Playable%20Prototype-green)

## 🎮 Game Overview

Journey through a dangerous world as Maximo, fighting enemies, collecting Catnip (XP/Currency), and battling epic bosses to prove your might. Customize your playstyle with three unique skill trees and face legendary foes.

### Story
You are Maximo, a tuxedo cat blessed with the most magnificent mustache in the realm. Your mission: defeat the five legendary bosses and claim your rightful place as the greatest cat warrior.

## ✨ Features

### Core Gameplay
- **Real-time Combat**: Fast-paced action with mouse-aimed attacks
- **Open World Exploration**: Freely explore a gridded world
- **Enemy Types**:
  - Mice (Common)
  - Dogs (Uncommon)
  - Mini-Bosses (Rare)
  - World Bosses (Legendary)

### Five Epic Bosses
1. **Sewer King** - The Rodent Ruler (Level 5+)
2. **Golden Retriever Warlord** - The Canine Commander (Level 10+)
3. **Alley Shadow** - The Dark Prowler (Level 15+)
4. **Vacuum Titan** - The Devourer (Level 25+)
5. **Great Hound of the North** - The Final Challenge (Level 35+)

### Progression System
- **Level Cap**: 50
- **Catnip System**: Earn XP and currency from defeated enemies
- **Three Skill Trees**:
  - ⚡ **Agility**: Speed and evasion
  - 💪 **Strength**: Damage and defense
  - 🌀 **Chaos**: Attack speed and special abilities

### Game Systems
- Health and damage system
- Experience and leveling
- Skill point allocation
- Inventory system
- Minimap with enemy tracking
- Boss detection system

## 🎯 Controls

### Keyboard
- **WASD** - Move Maximo
- **SPACE** - Attack
- **I** - Toggle Inventory
- **K** - Open Skill Tree
- **ESC** - Close Menus

### Mouse
- **Move Mouse** - Aim attacks
- **Click** - Attack (alternative to SPACE)

## 🚀 How to Play

### Starting the Game
1. Open `index.html` in a modern web browser
2. Click "START GAME"
3. Use WASD to move and SPACE/Click to attack

### Gameplay Loop
1. **Explore** the world to find enemies
2. **Fight** mice, dogs, and mini-bosses
3. **Collect Catnip** (XP) from defeated foes
4. **Level Up** and allocate skill points
5. **Challenge Bosses** when you meet level requirements
6. **Repeat** to reach level 50 and defeat all bosses

### Tips
- Keep moving to avoid enemy attacks
- Watch your health bar - enemies hit hard!
- Upgrade skills strategically for your playstyle
- Check the minimap to locate enemies and bosses
- Boss locations are marked with red circles
- Level up before challenging bosses

## 🛠️ Technical Details

### Technologies
- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** (No frameworks)
- **Modular Architecture** for maintainability

### Project Structure
```
Maximo-The-Mustache-Ascension/
├── index.html              # Main game file
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── main.js           # Initialization
│   ├── game.js           # Main game engine
│   ├── entities.js       # Player, enemies, bosses
│   ├── combat.js         # Combat system
│   ├── progression.js    # Leveling and XP
│   ├── ui.js             # UI management
│   ├── world.js          # World generation
│   └── utils.js          # Utility functions
└── assets/
    ├── images/           # (Future: Game sprites)
    └── audio/            # (Future: Sound effects)
```

### Game Systems

**Entity System**
- Base Entity class
- Player with movement and combat
- Enemy AI with detection and pathfinding
- Boss variants with unique stats

**Combat System**
- Mouse-aimed attacks
- Cone-based hit detection
- Particle effects
- Damage calculation

**Progression System**
- XP-based leveling
- Skill point allocation
- Stat bonuses
- Level cap enforcement

**World System**
- Dynamic enemy spawning
- Boss spawn locations
- Grid-based world
- Camera follow system

## 🎨 Future Enhancements

### Planned Features
- [ ] Item drops and equipment system
- [ ] Shop system for spending Catnip
- [ ] Boss special attacks and patterns
- [ ] More enemy varieties
- [ ] Sound effects and music
- [ ] Particle effects improvements
- [ ] Save/Load system
- [ ] Achievements system
- [ ] Multiple difficulty modes
- [ ] Character customization

### Visual Improvements
- [ ] Sprite-based graphics
- [ ] Animated characters
- [ ] Environmental art
- [ ] Boss arenas
- [ ] Visual effects enhancements

## 🐛 Known Issues

- Game is currently in prototype stage
- Visual placeholder graphics (circles and basic shapes)
- No persistent save system
- Limited enemy variety

## 📝 Game Design

### Balance
- Player starts at Level 1
- Each level requires 100 XP × level
- Skill points: 3 per level
- Boss difficulty scales with player level

### Enemy Stats
| Enemy Type | Health | Damage | XP | Speed |
|-----------|--------|--------|----|----|
| Mouse | 30 | 5 | 10 | 1.5 |
| Dog | 80 | 15 | 30 | 2.5 |
| Mini-Boss | 150 | 20 | 50 | 2.0 |

### Boss Stats
| Boss | Health | Damage | XP | Level Req |
|------|--------|--------|----|----|
| Sewer King | 500 | 25 | 200 | 5 |
| Golden Retriever Warlord | 800 | 30 | 300 | 10 |
| Alley Shadow | 600 | 35 | 250 | 15 |
| Vacuum Titan | 1000 | 40 | 400 | 25 |
| Great Hound | 1500 | 50 | 500 | 35 |

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📜 License

This project is for educational and portfolio purposes.

## 🎮 Play Now!

Simply open `index.html` in your browser and start your adventure!

---

*May your mustache guide you to victory!* 🐱‍👤
