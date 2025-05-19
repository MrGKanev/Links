# 🔗 Links Page

A modern, customizable, and SEO-optimized links page (similar to Linktree) that you can self-host and fully control. Perfect for developers, creators, and businesses who want a professional landing page for all their important links.

![Links Page Preview](https://img.shields.io/badge/Status-Active-green?style=flat-square) 
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎨 **Modern Design**
- Beautiful gradient background
- Smooth animations and hover effects
- Responsive design that works on all devices
- Clean, professional layout

### ⚙️ **Fully Configurable**
- All content managed through JSON files
- No need to edit HTML/CSS for content changes
- Easy to add, remove, or modify links
- Profile information and bio management

### 🔍 **SEO Optimized**
- Dynamic meta tags generation
- Open Graph and Twitter Cards support
- Structured data (JSON-LD) for search engines
- Configurable canonical URLs and descriptions

### 🌟 **Advanced Features**
- **Emoji Favicons**: Dynamic favicon generation using any emoji
- **Discord Integration**: Copy Discord username with one click
- **Affiliate Links**: Dedicated section for monetization links
- **Analytics Ready**: Built-in click tracking (Google Analytics compatible)
- **PWA Support**: Automatically generated web app manifest

### 🚀 **Deployment Ready**
- GitHub Actions workflow for automatic deployment
- HTML minification for faster loading
- Build reports and optimization
- GitHub Pages compatible

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Build**: HTML Minifier, GitHub Actions
- **Hosting**: GitHub Pages (or any static host)

## 🚀 Quick Start

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/links.git
cd links
```

### 2. Install Dependencies (Optional)
```bash
npm install
```

### 3. Configure Your Site
Edit `assets/js/config.json`:
```json
{
  "site": {
    "title": "Your Name's Links",
    "description": "Find all my links in one place",
    "favicon": {
      "emoji": "🚀",
      "backgroundColor": "#667eea"
    }
  },
  "profile": {
    "name": "Your Name",
    "bio": "Your bio here...",
    "image": {
      "src": "./assets/img/your-photo.png",
      "alt": "Your Name Profile Picture"
    }
  }
}
```

### 4. Add Your Links
Edit `assets/js/data.json`:
```json
{
  "mainLinks": [
    {
      "id": "github",
      "title": "GitHub",
      "description": "Check out my repositories",
      "url": "https://github.com/yourusername",
      "icon": "fab fa-github",
      "bgColor": "bg-gray-900",
      "type": "external"
    }
  ]
}
```

### 5. Deploy
The site includes GitHub Actions for automatic deployment to GitHub Pages. Just push to your repository!

## 📝 Configuration Guide

### Site Configuration (`config.json`)

#### Basic Settings
```json
{
  "site": {
    "title": "Page title for SEO",
    "description": "Meta description for search engines",
    "url": "https://yoursite.com",
    "keywords": "keyword1, keyword2, keyword3"
  }
}
```

#### Favicon Configuration
```json
{
  "site": {
    "favicon": {
      "emoji": "🔗",           // Any emoji
      "backgroundColor": "#667eea"  // Hex color
    }
  }
}
```

#### Profile Settings
```json
{
  "profile": {
    "name": "Display Name",
    "fullName": "Full Legal Name",
    "username": "username",
    "title": "Job Title",
    "bio": "Your bio with @mentions",
    "image": {
      "src": "./path/to/image.png",
      "alt": "Alt text for image"
    },
    "location": "City, Country"
  }
}
```

### Links Configuration (`data.json`)

#### Regular Links
```json
{
  "mainLinks": [
    {
      "id": "unique-id",
      "title": "Link Title",
      "description": "Link description",
      "url": "https://example.com",
      "icon": "fab fa-icon-name",  // Font Awesome class
      "bgColor": "bg-blue-500",    // Tailwind color class
      "type": "external"
    }
  ]
}
```

#### Discord Integration
```json
{
  "id": "discord",
  "title": "Discord",
  "description": "Chat with me",
  "url": "#",
  "icon": "fab fa-discord",
  "bgColor": "bg-indigo-600",
  "type": "discord",
  "discordUsername": "username#1234"
}
```

#### Affiliate/Support Links
```json
{
  "affiliateLinks": [
    {
      "id": "support",
      "title": "Buy Me a Coffee",
      "description": "Support my work",
      "url": "https://buymeacoffee.com/username",
      "icon": "fas fa-coffee",
      "bgColor": "bg-yellow-500",
      "type": "external"
    }
  ]
}
```

## 🎨 Customization

### Colors
The site uses Tailwind CSS. You can customize colors by editing the `bgColor` classes in your links or modifying the CSS variables.

### Fonts
Change the font by updating the Google Fonts import in `index.html` and the CSS in `styles.css`.

### Layout
Modify the HTML structure in `index.html` or add custom CSS to `styles.css`.

### Animations
Customize animations by editing the CSS transitions and JavaScript animation functions.

## 🏗️ Build & Deploy

### Local Development
```bash
# No build step needed for development
# Just open index.html in your browser
```

### Production Build
```bash
npm run build
```

### GitHub Pages Deployment
1. Enable GitHub Pages in your repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - automatic deployment will start

### Manual Deployment
Upload the contents to any static hosting provider:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

## 📊 Analytics

The site includes built-in click tracking. To enable Google Analytics:

1. Uncomment the GA script in `index.html`
2. Replace `GA_TRACKING_ID` with your tracking ID
3. The `addAnalyticsTracking()` function will automatically track link clicks

## 🔧 Troubleshooting

### Links not loading?
- Check that `data.json` and `config.json` are valid JSON
- Ensure all URLs are properly formatted
- Check browser console for JavaScript errors

### Favicon not appearing?
- Verify the emoji is properly encoded in `config.json`
- Check that the backgroundColor is a valid hex color
- Clear browser cache and reload

### Deployment issues?
- Check GitHub Actions logs for errors
- Ensure GitHub Pages is enabled in repository settings
- Verify all files are committed and pushed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Credits

- Built with ❤️ by [MrGKanev](https://github.com/mrgkanev)
- Icons by [Font Awesome](https://fontawesome.com/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## 📞 Support

If you have any questions or run into issues, please [open an issue](https://github.com/mrgkanev/links/issues) on GitHub.

---

⭐ **If you found this project helpful, please give it a star!** ⭐