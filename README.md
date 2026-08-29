# Kd — Kundan Sonji Portfolio

A cinematic, responsive portfolio for **Kundan Sonji**, Digital Growth Strategist.

## Overview

This portfolio presents growth strategy, social media management, content systems, paid media, YouTube growth and performance marketing work through an interactive dark neon interface.

## Features

- Animated Three.js 3D `Kd` hero scene
- Smooth scrolling and scroll-based transitions
- Responsive desktop, tablet and mobile layouts
- Actionable navigation and section links
- Interactive metrics and animated sparklines
- Brand ecosystem and case-study sections
- Clickable social-media links opening in new tabs
- WhatsApp contact CTA
- Accessible labels, focus states and reduced-motion support
- Performance-conscious rendering tiers for the 3D scene

## Tech Stack

- Vite
- Vanilla JavaScript with ES modules
- Three.js
- GSAP and ScrollTrigger
- Lenis smooth scrolling
- CSS custom properties and responsive media queries

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Project Structure

```text
.
├── public/              Static assets and brand logos
├── src/
│   ├── data.js          Portfolio content and links
│   ├── main.jsx         Page rendering and interactions
│   ├── scene.js         Three.js 3D scene
│   ├── styles.css       Main responsive styling
│   └── responsive-fixes.css
├── index.html            Application shell
├── package.json          Scripts and dependencies
└── README.md             Project documentation
```

## Updating Portfolio Content

Edit `src/data.js` to update:

- Personal profile and contact details
- Verified metrics
- Brand names and websites
- Social-media URLs
- Services, experience and case studies

Keep performance figures factual and verified before publishing.

## Deployment

This is a client-side Vite application and can be deployed to GitHub Pages, Vercel, Netlify or any static hosting provider.

For GitHub Pages, build the project and publish the generated `dist/` directory using a Pages workflow or a static hosting action.

## Contact

- Email: `kdstudio96@gmail.com`
- WhatsApp: available through the portfolio's **Hire Me** CTA

