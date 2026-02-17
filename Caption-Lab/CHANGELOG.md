# Changelog

All notable changes to Caption Lab will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### Added
- Initial release of Caption Lab MVP
- Drag-and-drop media upload (images and videos)
- Context form with platforms, post type, series, tone, CTA, notes, and constraints
- 3 AI agents simulation:
  - Hook & On-Screen Text Agent: Generates 8-12 on-screen text options with hook strength scores
  - Caption & Hashtag Agent: Generates 6-10 captions and platform-specific hashtag sets
  - Trending Audio & Fit Agent: Recommends 5-8 trending audio tracks with rationales
- Recurring series format support:
  - Steve Harvey Mustache series
  - Mr. Monopoly series
  - Poker Face series
- Results display with 4 tabs (On-Screen Text, Captions, Hashtags, Trending Audio)
- Copy-to-clipboard functionality for all suggestions
- Draft management with localStorage persistence (save, load, delete drafts)
- Mobile-responsive design
- Tropical cat-themed UI adapted from Maximo game patterns
- Template-based content generation with tone awareness
- Platform-specific hashtag generation (Instagram, TikTok, Facebook)
- Loading states and visual feedback
- File validation (type and size checking)
- Media preview for uploaded images and videos

### Technical Details
- Pure vanilla HTML/CSS/JS (no build tools required)
- Class-based architecture with separation of concerns
- localStorage for draft persistence
- Clipboard API with fallback for older browsers
- File structure:
  - `index.html`: Main application
  - `css/style.css`: All styling
  - `js/utils.js`: Utility functions
  - `js/media-handler.js`: File upload and preview
  - `js/form-manager.js`: Form data collection
  - `js/ai-agents.js`: Mock AI agents with template system
  - `js/results-manager.js`: Results display and copy functionality
  - `js/draft-manager.js`: localStorage persistence
  - `js/ui.js`: Screen management and orchestration
  - `js/main.js`: Application bootstrap
