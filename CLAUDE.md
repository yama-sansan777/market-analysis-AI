# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is YOHOU US Stock AI, a Japanese stock market analysis website that provides AI-driven S&P 500 market analysis. It's a static website with a JSON-based data management system and automated content archiving.

## Core Architecture

### Data-Driven Static Site
- **Frontend**: Pure HTML/CSS/JavaScript with TailwindCSS, Chart.js, and ECharts
- **Data Layer**: JSON files with automated rotation between live and archived data
- **No Build Process**: Static site that runs directly in browsers
- **Bilingual**: Japanese/English with localStorage persistence via `lang.js`

### Data Flow Pattern
1. Market analysis data stored in `live_data/latest.json`
2. Content automation via `update_latest.js` rotates current analysis to `archive_data/YYYY.M.DD.json`
3. `archive_data/manifest.json` maintains searchable index of all historical analyses
4. Website loads data dynamically via fetch API

## Key Commands

### Content Management
```bash
# Update latest analysis (Windows)
update_latest.bat 2025.07.25pm.json

# Update latest analysis (Unix/Linux/Mac)
./update_latest.sh 2025.07.25pm.json

# Direct Node.js execution
node update_latest.js 2025.07.25pm.json
```

### Development
- **No build process required** - open `index.html` directly in browser
- **No package manager** - all dependencies loaded via CDN
- **No linting/testing setup** - manual code review

## Data Schema Requirements

Market analysis JSON must follow this structure:
- `session`: Analysis session identifier (e.g., "7月25日 市場分析")
- `date`: Full date string (e.g., "2025年7月25日")
- `summary`: Overall evaluation with score 1-10 and buy/sell/neutral assessment
- `dashboard`: Key metrics (breadth, sentiment, price levels, put/call ratio)
- `details`: Four analysis sections (internals, technicals, fundamentals, strategy)
- `marketOverview`: Array of market index data
- `hotStocks`: Array of notable stock movements

## Critical Architecture Notes

### Chart System Integration
- **ECharts**: Used for gauge charts (sentiment) and pie charts (market breadth)
- **Chart.js**: Used for line charts (technical analysis) and bar charts (contribution analysis)
- Charts auto-resize on window events and support dual Y-axis for technical indicators

### Language System (`lang.js`)
- 700+ translation keys covering all UI elements
- Dynamic content switching without page reload
- Browser localStorage persistence for user preference
- Always test both Japanese and English versions when making UI changes

### Archive System Logic
- Maximum 50 entries maintained in `manifest.json` (auto-cleanup)
- File naming pattern: `YYYY.M.DD(am/pm).json`
- Archive browser supports date filtering and keyword search
- URL parameter `?datafile=filename.json` loads specific historical analysis

### File Dependencies
- `index.html` - Main dashboard (loads `latest.json` by default)
- `archive.html` - Historical analysis browser (loads from `manifest.json`)
- `lang.js` - Must be included on all pages for internationalization
- CDN dependencies - TailwindCSS, Chart.js, ECharts, RemixIcon, Google Fonts

## Important Implementation Details

### Chart Data Format
- Technical charts expect dual Y-axis data (price + ADL indicator)
- Contribution charts use horizontal bars with positive/negative color coding
- All chart data includes proper Japanese labels and formatting

### Mobile Responsiveness
- Grid layouts collapse to single column on mobile
- Chart containers maintain aspect ratios
- Tab navigation adapts to smaller screens
- Touch-friendly interactive elements

### Content Validation
The update script validates JSON structure but manual verification is recommended for:
- Proper Japanese text encoding
- Chart data array lengths match label arrays
- Required fields presence in all analysis sections
- Valid color coding for bullish/bearish indicators