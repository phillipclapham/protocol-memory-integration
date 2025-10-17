/**
 * Protocol Memory Site Integration Library
 *
 * Drop-in JavaScript library that powers your website with Protocol Memory public profile data.
 * Auto-updates your site with current state, active projects, and expertise from your Protocol Memory profile.
 *
 * Features:
 * - Auto-refresh every 5 minutes (configurable)
 * - Graceful fallback to static content
 * - Zero dependencies (vanilla JavaScript)
 * - Framework-agnostic
 * - Works for ANY Protocol Memory username
 *
 * Usage:
 * ```html
 * <script src="protocol-integration.js"></script>
 * <script>
 *   const integration = new ProtocolIntegration('your-username', {
 *     apiUrl: 'https://YOUR-PROJECT.supabase.co/functions/v1/public-profile',
 *     refreshInterval: 5 * 60 * 1000 // 5 minutes
 *   });
 *   integration.init();
 * </script>
 * ```
 *
 * Required HTML elements (all optional, library only updates elements that exist):
 * - #pm-current-state: Current state (focus, energy, location, availability)
 * - #pm-about: About section (tagline, role)
 * - #pm-projects: Active projects (from seeds)
 * - #pm-expertise: Expertise areas (from contexts)
 * - #pm-last-updated: Last updated indicator with attribution
 *
 * @version 1.0.0
 * @author Protocol Memory
 * @license MIT
 */

class ProtocolIntegration {
  /**
   * Create a new Protocol Memory integration
   *
   * @param {string} username - Protocol Memory username (from public profile URL)
   * @param {Object} options - Configuration options
   * @param {string} options.apiUrl - API endpoint (default: auto-detect from Supabase)
   * @param {string} options.anonKey - Supabase anon key for authentication (default: Protocol Memory production key)
   * @param {number} options.refreshInterval - Auto-refresh interval in milliseconds (default: 5 minutes)
   * @param {number} options.retryDelay - Retry delay on error in milliseconds (default: 30 seconds)
   * @param {boolean} options.debug - Enable debug logging (default: false)
   */
  constructor(username, options = {}) {
    this.username = username;

    // Configuration with defaults
    this.config = {
      apiUrl: options.apiUrl || 'https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile',
      anonKey: options.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnV4aWZ4cGh0cXNya3VvaWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTY5NzUsImV4cCI6MjA3MzYzMjk3NX0.i_OioOUbgn6BN-38-ps26siSY4_iRH6Ac3boAHywPng',
      refreshInterval: options.refreshInterval || (5 * 60 * 1000), // 5 minutes
      retryDelay: options.retryDelay || (30 * 1000), // 30 seconds
      debug: options.debug || false
    };

    this.lastUpdate = null;
    this.data = null;
    this.refreshTimer = null;

    this.log('Protocol Memory Integration initialized', { username, config: this.config });
  }

  /**
   * Initialize integration - fetch data and start auto-refresh
   * Call this method after creating the instance
   */
  async init() {
    this.log('🔮 Protocol Memory: Initializing...');
    await this.loadProtocolData();
    this.startAutoRefresh();
  }

  /**
   * Fetch data from Protocol Memory API
   * Updates DOM automatically on success
   */
  async loadProtocolData() {
    try {
      const apiUrl = `${this.config.apiUrl}/${this.username}`;
      this.log(`📡 Fetching from: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.anonKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.data = await response.json();
      this.lastUpdate = new Date();

      this.log('✅ Protocol Memory: Data loaded', this.data);

      // Update all site sections
      this.updateCurrentState(this.data.fields?.current_state);
      await this.updateAbout(this.data.fields?.identity, this.data.fields?.about);
      this.updateProjects(this.data.seeds);
      this.updateExpertise(this.data.contexts);
      this.updateLastUpdatedIndicator();

    } catch (error) {
      this.log('⚠️ Protocol Memory: Using static fallback', error.message);
      // Graceful fallback - site continues with static content
      this.showStaticContent();
    }
  }

  /**
   * Update Current State section
   * Displays: focus, energy, location, availability
   *
   * @param {Object} currentState - Current state data from API
   */
  updateCurrentState(currentState) {
    if (!currentState) return;

    const stateEl = document.getElementById('pm-current-state');
    if (!stateEl) return;

    const { focus, energy, location, availability } = currentState;

    // Build energy display (handle both simple and complex formats)
    let energyHTML = '';
    if (energy) {
      if (typeof energy === 'string') {
        // Simple format: just a string
        energyHTML = `
          <div class="pm-state-item">
            <span class="pm-label">Energy</span>
            <span class="pm-value">${this.escapeHtml(energy)}</span>
          </div>
        `;
      } else if (energy.display) {
        // Display format with optional timestamp
        const timestampText = energy.updated_at
          ? ` <small>(${this.formatRelativeTime(energy.updated_at)})</small>`
          : '';
        energyHTML = `
          <div class="pm-state-item">
            <span class="pm-label">Energy</span>
            <span class="pm-value">${this.escapeHtml(energy.display)}${timestampText}</span>
          </div>
        `;
      }
    }

    // Build secondary items (energy, location, availability)
    const secondaryItems = [energyHTML];
    if (location) {
      secondaryItems.push(`
        <div class="pm-state-item">
          <span class="pm-label">Location</span>
          <span class="pm-value">${this.escapeHtml(location)}</span>
        </div>
      `);
    }
    if (availability) {
      secondaryItems.push(`
        <div class="pm-state-item">
          <span class="pm-label">Availability</span>
          <span class="pm-value">${this.escapeHtml(availability)}</span>
        </div>
      `);
    }

    stateEl.innerHTML = `
      <div class="pm-state-grid">
        ${focus ? `
          <div class="pm-state-item pm-state-focus">
            <span class="pm-label">Current Focus</span>
            <span class="pm-value">${this.escapeHtml(focus)}</span>
          </div>
        ` : ''}
        ${secondaryItems.length > 0 ? `
          <div class="pm-state-secondary">
            ${secondaryItems.join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Update About section
   * Displays: avatar, tagline, philosophy, bio, current work, expertise summary
   *
   * @async
   * @param {Object} identity - Identity fields
   * @param {Object} about - About fields
   */
  async updateAbout(identity, about) {
    const aboutEl = document.getElementById('pm-about');
    if (!aboutEl) return;

    // Extract all available fields
    const name = identity?.name || '';
    const tagline = about?.tagline || identity?.tagline || '';
    const philosophy = identity?.philosophy || '';
    const role = identity?.role || '';
    const bio = about?.bio || identity?.bio || '';
    const customBio = this.data?.custom_bio || '';
    const currentWork = about?.current_work || '';
    const expertise = identity?.expertise || '';

    // Determine which bio to use (prefer custom_bio)
    const bioContent = customBio || bio;

    // Only show tagline if it's different from philosophy (avoid duplication)
    const showTagline = tagline && tagline !== philosophy;

    // Fetch avatar URL (server-side pre-computed OR client-side generated)
    let avatarHTML = '';
    const avatarUrl = this.data?.avatar_url; // Server-side pre-computed (privacy-preserving)
    const email = this.data?.email; // Fallback: client-side generation

    if (avatarUrl) {
      // Use pre-computed avatar URL from server (preferred)
      avatarHTML = `<div class="profile-avatar" style="background-image: url('${avatarUrl}')"></div>`;
    } else if (email) {
      // Fallback: Generate avatar URL client-side using Gravatar
      const generatedUrl = await GravatarHelper.getAvatarUrl(email, 256, 'identicon');
      if (generatedUrl) {
        avatarHTML = `<div class="profile-avatar" style="background-image: url('${generatedUrl}')"></div>`;
      }
    }

    // Build comprehensive about section with semantic hierarchy
    // Order: avatar, tagline, role, current work, background, philosophy
    aboutEl.innerHTML = `
      ${avatarHTML}
      ${showTagline ? `<p class="pm-tagline">${this.escapeHtml(tagline)}</p>` : ''}
      ${role ? `<p class="pm-role"><strong>Role:</strong> ${this.escapeHtml(role)}</p>` : ''}
      ${currentWork ? `<p class="pm-current-work"><strong>Current Work:</strong> ${this.escapeHtml(currentWork)}</p>` : ''}
      ${bioContent ? `<div class="pm-bio"><strong>Background:</strong> ${this.escapeHtml(bioContent)}</div>` : ''}
      ${philosophy ? `<p class="pm-philosophy"><strong>Philosophy:</strong> ${this.escapeHtml(philosophy)}</p>` : ''}
      ${expertise ? `<p class="pm-expertise-summary"><strong>Expertise:</strong> ${this.escapeHtml(expertise)}</p>` : ''}
    `;
  }

  /**
   * Update Active Projects section (from conversation seeds)
   * Displays top 5 seeds ordered by priority
   *
   * @param {Array} seeds - Array of seed objects
   */
  updateProjects(seeds) {
    const projectsEl = document.getElementById('pm-projects');
    if (!projectsEl) return;

    if (!seeds || seeds.length === 0) {
      projectsEl.innerHTML = '<p class="pm-empty">No active projects shared publicly.</p>';
      return;
    }

    // Priority order for sorting
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };

    // Show top 5 seeds by priority
    const topSeeds = seeds
      .sort((a, b) => {
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      })
      .slice(0, 5);

    projectsEl.innerHTML = `
      <ul class="pm-projects-list">
        ${topSeeds.map((seed, index) => `
          <li class="pm-project-item" data-seed-index="${index}">
            <button class="pm-maximize-icon" data-modal-seed="${index}" aria-label="Open in modal">⤢</button>
            <div class="pm-project-header">
              <span class="pm-project-title">${this.escapeHtml(seed.text || seed.title || 'Untitled')}</span>
              ${(seed.priority || seed.status) ? `
                <div class="pm-badges">
                  ${seed.priority ? `<span class="pm-priority pm-priority-${seed.priority}">${seed.priority}</span>` : ''}
                  ${seed.status ? `<span class="pm-status pm-status-${seed.status}">${seed.status}</span>` : ''}
                </div>
              ` : ''}
            </div>
            ${seed.description ? `
              <p class="pm-project-desc">${this.escapeHtml(seed.description)}</p>
            ` : ''}
            ${seed.tags && seed.tags.length > 0 ? `
              <div class="pm-project-tags">
                ${seed.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
          </li>
        `).join('')}
      </ul>
    `;

    // Store seeds data for modal
    this.cachedSeeds = topSeeds;
    // Attach modal handlers for seeds
    this.attachModalHandlers('seed');
  }

  /**
   * Update Expertise section (from contexts)
   * Displays expertise areas with preview text and expandable content
   *
   * @param {Array} contexts - Array of context objects
   */
  updateExpertise(contexts) {
    const expertiseEl = document.getElementById('pm-expertise');
    if (!expertiseEl) return;

    if (!contexts || contexts.length === 0) {
      expertiseEl.innerHTML = '<p class="pm-empty">No expertise areas shared publicly.</p>';
      return;
    }

    const PREVIEW_LENGTH = 500; // Character limit for preview

    expertiseEl.innerHTML = `
      <div class="pm-expertise-grid">
        ${contexts.map((context, index) => {
          const contentLength = context.content ? context.content.length : 0;
          const needsExpansion = contentLength > PREVIEW_LENGTH;
          const previewText = needsExpansion
            ? context.content.substring(0, PREVIEW_LENGTH).replace(/\s+\S*$/, '') + '...'
            : context.content;

          return `
            <div class="pm-expertise-card" data-card-index="${index}">
              <button class="pm-maximize-icon" data-modal-context="${index}" aria-label="Open in modal">⤢</button>
              <h3 class="pm-expertise-name">${this.escapeHtml(context.name)}</h3>
              ${context.type ? `<p class="pm-expertise-type">${this.escapeHtml(context.type)}</p>` : ''}
              ${context.content ? `
                <div class="pm-expertise-content">
                  <p class="pm-expertise-preview ${needsExpansion ? 'pm-can-expand' : ''}" data-collapsed="true">
                    ${this.escapeHtml(previewText)}
                  </p>
                  ${needsExpansion ? `
                    <p class="pm-expertise-full" data-full-content style="display: none;">
                      ${this.escapeHtml(context.content)}
                    </p>
                    <button class="pm-show-more-btn" data-expand-btn>
                      <span data-expand-text>Show more</span> ▼
                    </button>
                  ` : ''}
                </div>
              ` : ''}
              ${context.tags && context.tags.length > 0 ? `
                <div class="pm-expertise-tags">
                  ${context.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Store contexts data for modal
    this.cachedContexts = contexts;
    // Add click handlers for expansion buttons
    this.attachExpertiseExpansionHandlers();
    // Attach modal handlers for contexts
    this.attachModalHandlers('context');
  }

  /**
   * Attach click handlers for expertise card expansion
   */
  attachExpertiseExpansionHandlers() {
    const expertiseEl = document.getElementById('pm-expertise');
    if (!expertiseEl) return;

    const expandButtons = expertiseEl.querySelectorAll('[data-expand-btn]');
    expandButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const card = button.closest('.pm-expertise-card');
        const preview = card.querySelector('.pm-expertise-preview');
        const fullContent = card.querySelector('.pm-expertise-full');
        const expandText = button.querySelector('[data-expand-text]');
        const isCollapsed = preview.dataset.collapsed === 'true';

        if (isCollapsed) {
          // Expand
          preview.style.display = 'none';
          fullContent.style.display = 'block';
          preview.dataset.collapsed = 'false';
          expandText.textContent = 'Show less';
          button.innerHTML = '<span data-expand-text>Show less</span> ▲';
        } else {
          // Collapse
          preview.style.display = 'block';
          fullContent.style.display = 'none';
          preview.dataset.collapsed = 'true';
          expandText.textContent = 'Show more';
          button.innerHTML = '<span data-expand-text>Show more</span> ▼';

          // Scroll card back into view
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  /**
   * Update "Last Updated" indicator
   * Shows timestamp and "Powered by Protocol Memory" attribution
   */
  updateLastUpdatedIndicator() {
    const indicatorEl = document.getElementById('pm-last-updated');
    if (!indicatorEl) return;

    const timeAgo = this.formatRelativeTime(this.lastUpdate);
    indicatorEl.innerHTML = `
      <span class="pm-indicator">
        <span class="pm-dot"></span>
        Updated ${timeAgo} via
        <a href="https://protocolmemory.com" target="_blank" rel="noopener">Protocol Memory</a>
      </span>
    `;
  }

  /**
   * Show static content when API unavailable
   * Displays offline indicator but keeps existing static HTML
   */
  showStaticContent() {
    const indicatorEl = document.getElementById('pm-last-updated');
    if (indicatorEl) {
      indicatorEl.innerHTML = `
        <span class="pm-indicator pm-offline">
          <span class="pm-dot"></span>
          Showing static content
        </span>
      `;
    }
  }

  /**
   * Start auto-refresh loop
   * Fetches fresh data at configured interval
   */
  startAutoRefresh() {
    // Clear existing timer if any
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.log('🔄 Protocol Memory: Auto-refreshing...');
      this.loadProtocolData();
    }, this.config.refreshInterval);

    this.log(`⏰ Auto-refresh started (every ${this.config.refreshInterval / 1000}s)`);
  }

  /**
   * Stop auto-refresh loop
   * Useful for cleanup or manual control
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      this.log('⏸️ Auto-refresh stopped');
    }
  }

  /**
   * Manual refresh
   * Forces immediate data fetch
   */
  async refresh() {
    this.log('🔄 Manual refresh triggered');
    await this.loadProtocolData();
  }

  /**
   * Get current data
   * Returns the most recently fetched data
   *
   * @returns {Object} Current profile data
   */
  getData() {
    return this.data;
  }

  /**
   * Escape HTML to prevent XSS
   *
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format timestamp as relative time
   * Examples: "just now", "2m ago", "3h ago", "2 days ago"
   *
   * @param {Date|string} timestamp - Date object or ISO string
   * @returns {string} Formatted relative time
   */
  formatRelativeTime(timestamp) {
    if (!timestamp) return 'recently';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 minute ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return '1 hour ago';
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'yesterday';
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return 'recently';
  }

  /**
   * Attach modal handlers for maximize icons
   * @param {string} type - 'seed' or 'context'
   */
  attachModalHandlers(type) {
    const buttons = document.querySelectorAll(`[data-modal-${type}]`);
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(button.dataset[`modal${type.charAt(0).toUpperCase() + type.slice(1)}`]);
        this.openModal(type, index);
      });
    });
  }

  /**
   * Open modal with content
   * @param {string} type - 'seed' or 'context'
   * @param {number} index - Index in cached data
   */
  openModal(type, index) {
    const modal = document.getElementById('pm-modal');
    const modalBody = modal.querySelector('.pm-modal-body');

    if (!modal || !modalBody) return;

    let content = '';

    if (type === 'seed' && this.cachedSeeds && this.cachedSeeds[index]) {
      const seed = this.cachedSeeds[index];
      content = `
        <h3>${this.escapeHtml(seed.text || seed.title || 'Untitled')}</h3>
        ${(seed.priority || seed.status) ? `
          <div class="pm-modal-badges">
            ${seed.priority ? `<span class="pm-priority pm-priority-${seed.priority}">${seed.priority}</span>` : ''}
            ${seed.status ? `<span class="pm-status pm-status-${seed.status}">${seed.status}</span>` : ''}
          </div>
          <br>
        ` : ''}
        ${seed.description ? `<p>${this.escapeHtml(seed.description)}</p>` : ''}
        ${seed.tags && seed.tags.length > 0 ? `
          <div class="pm-project-tags">
            ${seed.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      `;
    } else if (type === 'context' && this.cachedContexts && this.cachedContexts[index]) {
      const context = this.cachedContexts[index];
      content = `
        <h3>${this.escapeHtml(context.name)}</h3>
        ${context.type ? `<p class="pm-expertise-type">${this.escapeHtml(context.type)}</p>` : ''}
        ${context.content ? `<p>${this.escapeHtml(context.content)}</p>` : ''}
        ${context.tags && context.tags.length > 0 ? `
          <div class="pm-expertise-tags">
            ${context.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      `;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Setup modal close handlers
    this.setupModalCloseHandlers(modal);
  }

  /**
   * Setup modal close event handlers
   * @param {HTMLElement} modal - Modal element
   */
  setupModalCloseHandlers(modal) {
    const closeBtn = modal.querySelector('.pm-modal-close');
    const backdrop = modal.querySelector('.pm-modal-backdrop');

    // Close button
    if (closeBtn) {
      closeBtn.onclick = () => this.closeModal(modal);
    }

    // Click outside (backdrop)
    if (backdrop) {
      backdrop.onclick = () => this.closeModal(modal);
    }

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Close modal
   * @param {HTMLElement} modal - Modal element
   */
  closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  /**
   * Log debug messages
   * Only logs when debug mode enabled
   *
   * @param {...any} args - Arguments to log
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[Protocol Memory]', ...args);
    }
  }
}

/**
 * GravatarHelper - Generate Gravatar URLs from email addresses
 *
 * Gravatar (Globally Recognized Avatar) is a service that provides profile pictures
 * based on email addresses. This helper generates Gravatar URLs for use in Protocol Memory
 * public profiles and site integrations.
 *
 * Privacy-preserving: Uses cryptographic hash (SHA-256) instead of raw email
 * Fallback: identicon (geometric pattern) for emails without Gravatar
 *
 * Usage:
 * ```javascript
 * const avatarUrl = await GravatarHelper.getAvatarUrl('user@example.com', 256);
 * // Returns: https://www.gravatar.com/avatar/[hash]?s=256&d=identicon
 * ```
 *
 * @class GravatarHelper
 */
class GravatarHelper {
  /**
   * Generate Gravatar URL from email address
   *
   * @static
   * @param {string} email - User email address
   * @param {number} [size=256] - Image size in pixels (1-2048)
   * @param {string} [defaultImage='identicon'] - Fallback image type
   *   Options: 'identicon', 'mp' (mystery person), 'robohash', 'retro', 'wavatar'
   * @returns {Promise<string|null>} Gravatar URL or null if email invalid
   *
   * @example
   * const url = await GravatarHelper.getAvatarUrl('test@example.com', 128, 'identicon');
   * // Returns: "https://www.gravatar.com/avatar/[hash]?s=128&d=identicon"
   */
  static async getAvatarUrl(email, size = 256, defaultImage = 'identicon') {
    if (!email || typeof email !== 'string') {
      return null;
    }

    // Gravatar requires lowercase, trimmed email
    const normalized = email.toLowerCase().trim();

    // Generate hash using SHA-256 (Web Crypto API doesn't support MD5)
    // Gravatar accepts various hash formats including SHA-256
    const hash = await this.sha256(normalized);

    // Construct Gravatar URL with size and default image parameters
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
  }

  /**
   * Generate SHA-256 hash of string using Web Crypto API
   *
   * Note: Gravatar traditionally uses MD5, but accepts SHA-256 as well.
   * Using SHA-256 because it's available in Web Crypto API (MD5 is not).
   *
   * @static
   * @private
   * @param {string} string - String to hash
   * @returns {Promise<string>} Hexadecimal hash string
   */
  static async sha256(string) {
    // Convert string to Uint8Array
    const msgBuffer = new TextEncoder().encode(string);

    // Hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProtocolIntegration, GravatarHelper };
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.ProtocolIntegration = ProtocolIntegration;
  window.GravatarHelper = GravatarHelper;
}
