// Global variables to store data
let mainLinks = [];
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
    mainLinks = linksData.mainLinks;
    affiliateLinks = linksData.affiliateLinks;

    // Load config data
    const configResponse = await fetch('./assets/js/config.json');
    siteConfig = await configResponse.json();
    
    // Update page content with config data
    updatePageContent();
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to empty arrays if loading fails
    mainLinks = [];
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
    "sameAs": mainLinks.filter(link => link.type === 'external').map(link => link.url),
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

// Add loading placeholders to prevent layout shifts
function createLoadingPlaceholder(count = 6) {
  const placeholder = document.createElement('div');
  placeholder.className = 'space-y-4';
  placeholder.id = 'loading-placeholder';
  
  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'link-card block w-full bg-white rounded-lg p-4 shadow-md animate-pulse';
    item.innerHTML = `
      <div class="flex items-center">
        <div class="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    `;
    placeholder.appendChild(item);
  }
  
  return placeholder;
}

// Function to create a link card
async function createLinkCard(link, isAffiliate = false) {
  // Create list item element for proper semantics
  const listItem = document.createElement('li');
  
  // Create the anchor element
  const card = document.createElement('a');
  
  if (link.type === 'discord') {
    card.href = '#';
    card.className = 'link-card block w-full bg-white rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer';
    card.addEventListener('click', handleDiscordClick);
  } else {
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = `link-card block w-full bg-white rounded-lg p-4 shadow-md hover:shadow-lg ${isAffiliate ? 'border-l-4 border-purple-500' : ''}`;
  }

  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = `w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center mr-4`;
  
  // Create icon (async)
  const icon = await createSVGIcon(link.icon, 'w-6 h-6 text-white');
  iconContainer.appendChild(icon);
  
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'flex-1';
  
  // Use span instead of h4 to fix heading hierarchy issue
  const title = document.createElement('span');
  title.className = 'font-semibold text-gray-900 block';
  title.textContent = link.title;
  
  const description = document.createElement('p');
  description.className = 'text-gray-600 text-sm';
  description.textContent = link.description;
  
  contentContainer.appendChild(title);
  contentContainer.appendChild(description);
  
  // Create external icon (async)
  const externalIcon = await createSVGIcon(
    link.type === 'discord' ? 'copy' : 'external', 
    'w-5 h-5 text-gray-400'
  );
  
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

// Function to handle Discord click
function handleDiscordClick(e) {
  e.preventDefault();
  const discordLink = mainLinks.find(link => link.id === 'discord');
  const discordUsername = discordLink ? discordLink.discordUsername : 'mrgkanev#1234';
  
  navigator.clipboard.writeText(discordUsername).then(function () {
    showToast('Discord username copied to clipboard!');
  });
}

// Updated toast function to prevent layout shifts
function showToast(message) {
  const toast = document.getElementById('toast');
  const messageSpan = toast.querySelector('span');
  
  messageSpan.textContent = message;
  
  // Use transform instead of Tailwind classes to prevent layout shifts
  toast.style.transform = 'translateY(0) translateZ(0)';
  toast.style.opacity = '1';
  toast.classList.add('show');

  setTimeout(function () {
    toast.style.transform = 'translateY(100%) translateZ(0)';
    toast.style.opacity = '0';
    toast.classList.remove('show');
  }, 3000);
}

// Function to render main links with layout shift prevention
async function renderMainLinks() {
  const container = document.getElementById('mainLinks');
  
  // Add placeholder to reserve space
  const placeholder = createLoadingPlaceholder(mainLinks.length || 6);
  container.appendChild(placeholder);
  
  // Create a document fragment to batch DOM updates
  const fragment = document.createDocumentFragment();
  
  for (const link of mainLinks) {
    const linkCard = await createLinkCard(link);
    fragment.appendChild(linkCard);
  }
  
  // Replace placeholder with actual content in one operation
  container.removeChild(placeholder);
  container.appendChild(fragment);
  
  // Remove min-height after content is loaded
  container.style.minHeight = 'auto';
}

// Function to render affiliate links with layout shift prevention
async function renderAffiliateLinks() {
  const container = document.getElementById('affiliateLinks');
  
  if (affiliateLinks.length > 0) {
    // Add placeholder for affiliate links
    const placeholder = createLoadingPlaceholder(affiliateLinks.length);
    container.appendChild(placeholder);
    
    const fragment = document.createDocumentFragment();
    
    for (const link of affiliateLinks) {
      const linkCard = await createLinkCard(link, true);
      fragment.appendChild(linkCard);
    }
    
    // Replace placeholder with actual content
    container.removeChild(placeholder);
    container.appendChild(fragment);
    
    // Remove min-height after content is loaded
    container.style.minHeight = 'auto';
  }
}

// Updated toggle function to prevent layout shifts
function toggleAffiliateSection() {
  const section = document.getElementById('affiliateSection');
  const icon = document.getElementById('toggleIcon');
  const isExpanded = section.classList.contains('expanded');
  
  // Use transform instead of height to prevent layout shifts
  if (isExpanded) {
    section.style.transform = 'scaleY(0)';
    section.style.transformOrigin = 'top';
    section.style.opacity = '0';
    icon.classList.remove('rotate-180');
    section.classList.remove('expanded');
  } else {
    section.style.transform = 'scaleY(1)';
    section.style.transformOrigin = 'top';
    section.style.opacity = '1';
    icon.classList.add('rotate-180');
    section.classList.add('expanded');
  }
}

// Function to add analytics tracking
function addAnalyticsTracking() {
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function () {
      const linkText = this.querySelector('span').textContent;
      console.log(`Clicked on: ${linkText}`);
      // Here you could send analytics data to your preferred service
      // Example: gtag('event', 'click', { link: linkText });
    });
  });
}

// Function to add loading animations
function addLoadingAnimations() {
  window.addEventListener('load', function () {
    document.querySelectorAll('.link-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';

      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  });
}

// Updated initialization function with better loading management
async function initializePage() {
  try {
    // Load all data from JSON files
    await loadData();
    
    // Render links (now with placeholders to prevent shifts)
    await renderMainLinks();
    await renderAffiliateLinks();

    // Add event listeners
    document.getElementById('affiliateToggle').addEventListener('click', toggleAffiliateSection);

    // Add analytics tracking
    addAnalyticsTracking();

    // Remove loading animations with a slight delay to ensure smooth transition
    setTimeout(() => {
      addLoadingAnimations();
    }, 100);

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
  } catch (error) {
    console.error('Error initializing page:', error);
    // Show error state instead of leaving empty space
    document.getElementById('mainLinks').innerHTML = '<div class="text-center text-white">Failed to load content</div>';
  }
}

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);