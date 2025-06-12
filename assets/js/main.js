// Global variables to store data
let socialLinks = [];
let projects = [];
let affiliateLinks = [];
let siteConfig = {};

// Cache for loaded SVG icons
const iconCache = new Map();

// Function to load all data from JSON files
async function loadData() {
  try {
    // Load links data
    const linksResponse = await fetch('./assets/js/data.json');
    const linksData = await linksResponse.json();
    socialLinks = linksData.socialLinks;
    projects = linksData.projects;
    affiliateLinks = linksData.affiliateLinks;

    // Load config data
    const configResponse = await fetch('./assets/js/config.json');
    siteConfig = await configResponse.json();
    
    // Update page content with config data
    updatePageContent();
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to empty arrays if loading fails
    socialLinks = [];
    projects = [];
    affiliateLinks = [];
    siteConfig = {};
  }
}

// Function to update or create meta tag
function updateMetaTag(name, content, attribute = 'name') {
  if (!content) return;
  
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

// Function to update or create link tag
function updateLinkTag(rel, href) {
  if (!href) return;
  
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

// Function to load and create SVG icon
async function createSVGIcon(iconName, className = '') {
  // Check cache first
  if (iconCache.has(iconName)) {
    const cachedSvg = iconCache.get(iconName);
    const clonedSvg = cachedSvg.cloneNode(true);
    clonedSvg.setAttribute('class', className);
    return clonedSvg;
  }

  try {
    // Load SVG file
    const response = await fetch(`./assets/img/icons/${iconName}.svg`);
    if (!response.ok) {
      throw new Error(`Failed to load icon: ${iconName}`);
    }
    
    const svgText = await response.text();
    
    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) {
      throw new Error(`Invalid SVG file: ${iconName}`);
    }
    
    // Set standard attributes
    svgElement.setAttribute('fill', 'currentColor');
    svgElement.setAttribute('aria-hidden', 'true');
    svgElement.setAttribute('class', className);
    
    // Ensure viewBox is set
    if (!svgElement.getAttribute('viewBox')) {
      svgElement.setAttribute('viewBox', '0 0 24 24');
    }
    
    // Cache the SVG
    iconCache.set(iconName, svgElement.cloneNode(true));
    
    return svgElement;
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    
    // Return fallback icon
    const fallbackSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fallbackSvg.setAttribute('class', className);
    fallbackSvg.setAttribute('fill', 'currentColor');
    fallbackSvg.setAttribute('viewBox', '0 0 24 24');
    fallbackSvg.setAttribute('aria-hidden', 'true');
    
    // Simple circle as fallback
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    fallbackSvg.appendChild(circle);
    
    return fallbackSvg;
  }
}

// Function to generate a PNG-based favicon.ico equivalent
function generateFaviconIco(emoji, backgroundColor) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 32;
  canvas.height = 32;
  
  // Set background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, 32, 32);
  
  // Add emoji
  ctx.font = '20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 16, 16);
  
  // Convert to blob and create object URL
  canvas.toBlob((blob) => {
    const faviconUrl = URL.createObjectURL(blob);
    
    // Add as fallback favicon
    let faviconLink = document.querySelector('link[rel="icon"][type="image/png"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      faviconLink.setAttribute('type', 'image/png');
      faviconLink.setAttribute('sizes', '32x32');
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute('href', faviconUrl);
  }, 'image/png');
}

// Function to generate emoji favicon with traditional ICO support
function generateEmojiFavicon(emoji, backgroundColor = '#667eea') {
  // Create SVG with emoji
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <rect width="64" height="64" rx="12" fill="${backgroundColor}"/>
      <text x="32" y="44" text-anchor="middle" font-size="36" font-family="Arial, sans-serif">${emoji}</text>
    </svg>
  `;
  
  // Convert SVG to data URL
  const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  
  // Create traditional favicon.ico equivalent using canvas
  generateFaviconIco(emoji, backgroundColor);
  
  // Update favicon links
  updateLinkTag('icon', dataUrl);
  updateLinkTag('shortcut icon', dataUrl);
  
  // Create different sizes for different devices
  const sizes = [16, 32, 180];
  sizes.forEach(size => {
    const scaledSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="${backgroundColor}"/>
        <text x="${size/2}" y="${size * 0.7}" text-anchor="middle" font-size="${size * 0.6}" font-family="Arial, sans-serif">${emoji}</text>
      </svg>
    `;
    const scaledDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(scaledSvg)));
    
    if (size === 16) {
      updateLinkTag('icon', scaledDataUrl);
      // Also set as favicon.ico alternative
      let link = document.querySelector('link[rel="icon"][sizes="16x16"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        link.setAttribute('sizes', '16x16');
        link.setAttribute('type', 'image/svg+xml');
        document.head.appendChild(link);
      }
      link.setAttribute('href', scaledDataUrl);
    } else if (size === 32) {
      let link = document.querySelector('link[rel="icon"][sizes="32x32"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        link.setAttribute('sizes', '32x32');
        link.setAttribute('type', 'image/svg+xml');
        document.head.appendChild(link);
      }
      link.setAttribute('href', scaledDataUrl);
    } else if (size === 180) {
      let link = document.querySelector('link[rel="apple-touch-icon"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'apple-touch-icon');
        link.setAttribute('sizes', '180x180');
        document.head.appendChild(link);
      }
      link.setAttribute('href', scaledDataUrl);
    }
  });
}

// Function to update page content with config data
function updatePageContent() {
  if (!siteConfig.site) return;
  
  // Update basic meta tags
  document.title = siteConfig.site.title || 'MrGKanev\'s Links';
  updateMetaTag('title', siteConfig.site.title);
  updateMetaTag('description', siteConfig.site.description);
  updateMetaTag('keywords', siteConfig.site.keywords);
  updateMetaTag('author', siteConfig.site.author);
  updateMetaTag('robots', siteConfig.site.robots);
  updateMetaTag('language', siteConfig.site.language);
  
  // Update canonical link
  updateLinkTag('canonical', siteConfig.site.canonical);
  
  // Generate emoji favicon if configured
  if (siteConfig.site.favicon && siteConfig.site.favicon.emoji) {
    generateEmojiFavicon(
      siteConfig.site.favicon.emoji, 
      siteConfig.site.favicon.backgroundColor || '#667eea'
    );
  }
  
  // Update Open Graph tags
  updateMetaTag('og:type', siteConfig.site.type, 'property');
  updateMetaTag('og:url', siteConfig.site.url, 'property');
  updateMetaTag('og:title', siteConfig.site.title, 'property');
  updateMetaTag('og:description', siteConfig.site.description, 'property');
  updateMetaTag('og:image', siteConfig.site.imageUrl, 'property');
  updateMetaTag('og:site_name', siteConfig.site.siteName, 'property');
  updateMetaTag('og:locale', siteConfig.site.locale, 'property');
  
  // Update Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image', 'property');
  updateMetaTag('twitter:url', siteConfig.site.url, 'property');
  updateMetaTag('twitter:title', siteConfig.site.title, 'property');
  updateMetaTag('twitter:description', siteConfig.site.description, 'property');
  updateMetaTag('twitter:image', siteConfig.site.imageUrl, 'property');
  updateMetaTag('twitter:creator', siteConfig.site.twitterHandle, 'property');
  
  // Update profile elements
  if (siteConfig.profile) {
    const profileName = document.getElementById('profileName');
    if (profileName && siteConfig.profile.name) {
      profileName.textContent = siteConfig.profile.name;
    }
    
    const profileBio = document.getElementById('profileBio');
    if (profileBio && siteConfig.profile.bio) {
      profileBio.innerHTML = siteConfig.profile.bio.replace(/@(\w+)/g, '<span class="font-semibold">@$1</span>');
    }
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage && siteConfig.profile.image) {
      profileImage.src = siteConfig.profile.image.src;
      profileImage.alt = siteConfig.profile.image.alt;
    }
  }
  
  // Update footer
  if (siteConfig.footer) {
    const footerText = document.getElementById('footerText');
    const footerLink = document.getElementById('footerLink');
    if (footerText && siteConfig.footer.text) {
      footerText.textContent = siteConfig.footer.text;
    }
    if (footerLink && siteConfig.footer.linkText) {
      footerLink.textContent = siteConfig.footer.linkText;
      footerLink.href = siteConfig.footer.linkUrl || '#';
    }
  }
  
  // Update structured data
  updateStructuredData();
}

// Function to update structured data (JSON-LD)
function updateStructuredData() {
  if (!siteConfig.profile || !siteConfig.site) return;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.profile.fullName || siteConfig.profile.name,
    "alternateName": siteConfig.profile.username,
    "description": siteConfig.profile.bio,
    "url": siteConfig.site.url,
    "image": siteConfig.site.imageUrl,
    "sameAs": (socialLinks || []).filter(link => link.type === 'external' && link.url).map(link => link.url),
    "jobTitle": siteConfig.profile.title,
    "worksFor": {
      "@type": "Organization",
      "name": "Self-employed"
    }
  };
  
  // Add location if available
  if (siteConfig.profile.location) {
    structuredData.homeLocation = {
      "@type": "Place",
      "name": siteConfig.profile.location
    };
  }
  
  // Create or update structured data script tag
  let structuredDataScript = document.getElementById('structured-data');
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script');
    structuredDataScript.id = 'structured-data';
    structuredDataScript.type = 'application/ld+json';
    document.head.appendChild(structuredDataScript);
  }
  structuredDataScript.textContent = JSON.stringify(structuredData);
}

// Function to create a social icon
async function createSocialIcon(link) {
  // Skip if no URL provided
  if (!link.url || link.url.trim() === '') {
    return null;
  }

  // Create the anchor element
  const iconLink = document.createElement('a');
  
  if (link.type === 'discord') {
    iconLink.href = '#';
    iconLink.className = 'social-icon block w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1';
    iconLink.addEventListener('click', handleDiscordClick);
  } else {
    iconLink.href = link.url;
    iconLink.target = '_blank';
    iconLink.rel = 'noopener noreferrer';
    iconLink.className = 'social-icon block w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1';
  }

  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = `w-full h-full ${link.bgColor} rounded-full flex items-center justify-center`;
  iconContainer.title = link.title;
  
  // Create icon (async)
  const icon = await createSVGIcon(link.icon, 'w-6 h-6 text-white');
  iconContainer.appendChild(icon);
  
  iconLink.appendChild(iconContainer);
  return iconLink;
}

// Function to create a project card
async function createProjectCard(project) {
  // Create list item element for proper semantics
  const listItem = document.createElement('li');
  
  // Create the anchor element
  const card = document.createElement('a');
  card.href = project.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className = 'link-card block w-full bg-white rounded-lg p-4 shadow-md hover:shadow-lg';

  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = `w-12 h-12 ${project.bgColor} rounded-lg flex items-center justify-center mr-4`;
  
  // Create icon (async)
  const icon = await createSVGIcon(project.icon, 'w-6 h-6 text-white');
  iconContainer.appendChild(icon);
  
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'flex-1';
  
  const title = document.createElement('span');
  title.className = 'font-semibold text-gray-900';
  title.textContent = project.title;
  
  const description = document.createElement('p');
  description.className = 'text-gray-600 text-sm';
  description.textContent = project.description;
  
  contentContainer.appendChild(title);
  contentContainer.appendChild(description);
  
  // Create external icon (async)
  const externalIcon = await createSVGIcon('external', 'w-5 h-5 text-gray-400');
  
  // Create main container
  const mainContainer = document.createElement('div');
  mainContainer.className = 'flex items-center';
  mainContainer.appendChild(iconContainer);
  mainContainer.appendChild(contentContainer);
  mainContainer.appendChild(externalIcon);
  
  card.appendChild(mainContainer);
  
  // Append the anchor to the list item
  listItem.appendChild(card);
  return listItem;
}

// Function to create an affiliate card (reusing existing logic)
async function createAffiliateCard(link) {
  return await createProjectCard(link);
}

// Function to handle Discord click
function handleDiscordClick(e) {
  e.preventDefault();
  const discordLink = socialLinks.find(link => link.id === 'discord');
  const discordUsername = discordLink ? discordLink.discordUsername : 'mrgkanev#1234';
  
  navigator.clipboard.writeText(discordUsername).then(function () {
    showToast('Discord username copied to clipboard!');
  });
}

// Function to show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.querySelector('span').textContent = message;
  toast.classList.remove('translate-y-full', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(function () {
    toast.classList.add('translate-y-full', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

// Function to render social icons
async function renderSocialIcons() {
  const container = document.getElementById('socialIcons');
  container.innerHTML = ''; // Clear existing content
  
  for (const link of socialLinks) {
    const socialIcon = await createSocialIcon(link);
    if (socialIcon) { // Only add if icon was created (URL exists)
      container.appendChild(socialIcon);
    }
  }
}

// Function to render project links
async function renderProjectLinks() {
  const container = document.getElementById('projectLinks');
  container.innerHTML = ''; // Clear existing content
  
  for (const project of projects) {
    const projectCard = await createProjectCard(project);
    container.appendChild(projectCard);
  }
}

// Function to render affiliate links
async function renderAffiliateLinks() {
  const container = document.getElementById('affiliateLinks');
  container.innerHTML = ''; // Clear existing content
  
  for (const link of affiliateLinks) {
    const linkCard = await createAffiliateCard(link);
    container.appendChild(linkCard);
  }
}

// Function to toggle affiliate section
function toggleAffiliateSection() {
  const section = document.getElementById('affiliateSection');
  const icon = document.getElementById('toggleIcon');
  
  section.classList.toggle('expanded');
  icon.classList.toggle('rotate-180');
}

// Function to add analytics tracking
function addAnalyticsTracking() {
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function () {
      const linkText = this.querySelector('h4')?.textContent || this.title || 'Social Icon';
      console.log(`Clicked on: ${linkText}`);
      // Here you could send analytics data to your preferred service
      // Example: gtag('event', 'click', { link: linkText });
    });
  });
}

// Function to add loading animations
function addLoadingAnimations() {
  window.addEventListener('load', function () {
    // Animate social icons
    document.querySelectorAll('.social-icon').forEach((icon, index) => {
      icon.style.opacity = '0';
      icon.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        icon.style.transition = 'all 0.5s ease';
        icon.style.opacity = '1';
        icon.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Animate project cards
    document.querySelectorAll('.link-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';

      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, (index + socialLinks.length) * 100);
    });
  });
}

// Initialize the page
async function initializePage() {
  try {
    // Load all data from JSON files
    await loadData();
    
    // Render all sections (async to load icons)
    await renderSocialIcons();
    await renderProjectLinks();
    await renderAffiliateLinks();

    // Add event listeners
    const affiliateToggle = document.getElementById('affiliateToggle');
    if (affiliateToggle) {
      affiliateToggle.addEventListener('click', toggleAffiliateSection);
    }

    // Add analytics tracking
    addAnalyticsTracking();

    // Add loading animations
    addLoadingAnimations();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  } catch (error) {
    console.error('Error initializing page:', error);
  }
}

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);