# Changelog

All notable changes to Maximo: The Mustache Ascension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-17

### Changed
- **Major Visual Overhaul: Tropical Cat Paradise Theme**
  - Redesigned Maximo as realistic tuxedo cat on all fours with prominent mustache
  - Added running animation with bounce effects
  - Increased attack range from 60 to 90 pixels for more dynamic combat
  - Replaced enemy circles with actual rats (mice) for regular enemies
  - Replaced boss circles with detailed dogs (Chihuahua, Poodle, Bulldog, Golden Retriever, German Shepherd)
  - Transformed environment to tropical beach paradise:
    - Sky gradient with sun and drifting clouds
    - Ocean with animated waves
    - Sandy beach
    - Palm trees with detailed fronds and coconuts
  - Enhanced combat visual effects:
    - Cat claw slash effects
    - POW!/SMACK!/HIT!/MEOW! text effects
    - Glowing particle systems
  - Updated UI theme from dark to tropical (cream/golden beach colors)

## [1.0.0] - 2026-02-17

### Added
- Initial release of Maximo: The Mustache Ascension browser game
- **Core Gameplay:**
  - Top-down action RPG controls (WASD movement, mouse aim, click to attack)
  - Camera follow system centered on player
  - Collision detection and physics
  - Wave-based enemy spawning system

- **Combat System:**
  - Melee attack mechanics with range and cooldown
  - Particle effects for attacks and hits
  - Damage calculation and knockback
  - Enemy AI with chase and attack behaviors

- **Progression System:**
  - XP and leveling system
  - Skill tree with three branches: Agility, Strength, Survival
  - Stat upgrades (speed, attack damage, max HP)
  - Level-gated skill unlocks

- **Boss Battles:**
  - 5 unique bosses with escalating difficulty
  - Boss-specific stats and behaviors
  - Victory and defeat screens

- **UI/HUD:**
  - Health and XP bars
  - Level display
  - Skills panel with upgrade buttons
  - Inventory panel (placeholder)
  - Combat info (wave counter, boss warnings)
  - Game over and victory overlays

- **World:**
  - Grid-based world visualization
  - Dynamic enemy spawning at world edges
  - Boss spawn system

- **Entities:**
  - Player (Maximo the tuxedo cat)
  - Regular enemies (5 types: Mouse, Rat, Squirrel, Bird, Raccoon)
  - Mini-bosses
  - 5 main bosses: Sewer King, Golden Retriever, Park Bully, Alpha Raccoon, Mega Pigeon

- **Technical Features:**
  - Modular JavaScript architecture (8 modules)
  - HTML5 Canvas rendering
  - Responsive game loop with requestAnimationFrame
  - Object-oriented entity system
  - Event-driven UI updates

### Technical Details
- Pure vanilla HTML/CSS/JS (no frameworks)
- File structure:
  - `index.html`: Main entry point
  - `css/style.css`: All styling
  - `js/utils.js`: Utility functions
  - `js/entities.js`: Player, Enemy, Boss classes
  - `js/combat.js`: Combat system and particle effects
  - `js/progression.js`: XP, leveling, and skill trees
  - `js/ui.js`: UI management and DOM manipulation
  - `js/world.js`: World rendering and enemy spawning
  - `js/game.js`: Main game loop and orchestration
  - `js/main.js`: Bootstrap and initialization
