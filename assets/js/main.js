// Global variables to store data
let mainLinks = [];
let affiliateLinks = [];
let siteConfig = {};

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

// Function to update page content with config data
function updatePageContent() {
  // Update page title
  document.title = siteConfig.site?.title || 'MrGKanev\'s Links';
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && siteConfig.site?.description) {
    metaDescription.setAttribute('content', siteConfig.site.description);
  }
  
  // Update profile name
  const profileName = document.getElementById('profileName');
  if (profileName && siteConfig.profile?.name) {
    profileName.textContent = siteConfig.profile.name;
  }
  
  // Update profile bio
  const profileBio = document.getElementById('profileBio');
  if (profileBio && siteConfig.profile?.bio) {
    profileBio.innerHTML = siteConfig.profile.bio.replace(/@(\w+)/g, '<span class="font-semibold">@$1</span>');
  }
  
  // Update profile image
  const profileImage = document.getElementById('profileImage');
  if (profileImage && siteConfig.profile?.image) {
    profileImage.src = siteConfig.profile.image.src;
    profileImage.alt = siteConfig.profile.image.alt;
  }
  
  // Update footer
  const footerText = document.getElementById('footerText');
  const footerLink = document.getElementById('footerLink');
  if (footerText && siteConfig.footer?.text) {
    footerText.textContent = siteConfig.footer.text;
  }
  if (footerLink && siteConfig.footer?.linkText) {
    footerLink.textContent = siteConfig.footer.linkText;
    footerLink.href = siteConfig.footer.linkUrl || '#';
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

// Function to create a link card
function createLinkCard(link, isAffiliate = false) {
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

  card.innerHTML = `
    <div class="flex items-center">
      <div class="w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center mr-4">
        <i class="${link.icon} text-white text-xl"></i>
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">${link.title}</h3>
        <p class="text-gray-600 text-sm">${link.description}</p>
      </div>
      <i class="fas ${link.type === 'discord' ? 'fa-copy' : 'fa-external-link-alt'} text-gray-400"></i>
    </div>
  `;

  return card;
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

// Function to render main links
function renderMainLinks() {
  const container = document.getElementById('mainLinks');
  mainLinks.forEach(link => {
    const linkCard = createLinkCard(link);
    container.appendChild(linkCard);
  });
}

// Function to render affiliate links
function renderAffiliateLinks() {
  const container = document.getElementById('affiliateLinks');
  affiliateLinks.forEach(link => {
    const linkCard = createLinkCard(link, true);
    container.appendChild(linkCard);
  });
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
      const linkText = this.querySelector('h3').textContent;
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

// Initialize the page
async function initializePage() {
  // Load all data from JSON files
  await loadData();
  
  // Render links
  renderMainLinks();
  renderAffiliateLinks();

  // Add event listeners
  document.getElementById('affiliateToggle').addEventListener('click', toggleAffiliateSection);

  // Add analytics tracking
  addAnalyticsTracking();

  // Add loading animations
  addLoadingAnimations();

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);