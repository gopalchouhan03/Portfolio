# Gopal's Portfolio

A modern, premium developer portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dark Theme** - Elegant dark mode with glassmorphism design
- **Beautiful Animations** - Smooth Framer Motion transitions and micro-interactions
- **Custom Cursor** - Interactive cursor with hover effects
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Accessible** - WCAG compliant with ARIA labels and keyboard navigation
- **Fast Performance** - Next.js 16 with Turbopack for lightning-fast builds
- **SEO Optimized** - Metadata and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **Fonts**: Geist (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles and custom utilities
│   ├── layout.tsx        # Root layout wrapper
│   └── page.tsx          # Main homepage
├── components/
│   ├── Navbar.tsx        # Navigation bar with mobile menu
│   ├── HeroSection.tsx   # Hero section with intro
│   ├── SetupSection.tsx  # Development setup cards
│   ├── LifeSection.tsx   # Personal interests (books, movies)
│   ├── BlogsSection.tsx  # Featured blog posts
│   ├── CTASection.tsx    # Call-to-action section
│   ├── GitHubSection.tsx # GitHub activity and projects
│   ├── CustomCursor.tsx  # Custom cursor component
│   └── Footer.tsx        # Footer with links
└── public/               # Static assets
```

## 🎨 Customization

1. **Colors**: Update the color palette in `globals.css`
2. **Content**: Edit component files to personalize sections
3. **Fonts**: Change fonts in `layout.tsx` and `tailwind.config.js`
4. **Animations**: Adjust Framer Motion variants in individual components

## ⚡ Performance

- Optimized for Core Web Vitals
- Code splitting and lazy loading
- CSS minimization
- Efficient animations with GPU acceleration

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for keyboard users
- Color contrast compliance

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT - Feel free to use this portfolio as a template for your own.
