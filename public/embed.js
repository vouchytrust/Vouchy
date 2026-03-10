/**
 * Vouchy Embed Loader v3.0
 * Script-to-Iframe system - similar to Intercom/Vouchy
 *:
 * <script 
 * Usage async src="https://cdn.vouchy.click/embed.js" data-id="your-space-slug"></script>
 * 
 * Optional config via data-config JSON:
 * <script async src="https://cdn.vouchy.click/embed.js" data-id="your-space-slug" data-config='{"layout":"marquee","darkMode":true}'></script>
 */
(function () {
  'use strict';

  const DEFAULT_HEIGHT = 600;
  const DEFAULT_MARQUEE_HEIGHT = 300;

  function initEmbed(script) {
    if (script.dataset.vouchyInitialized) return;
    script.dataset.vouchyInitialized = 'true';

    const spaceId = script.dataset.id || script.dataset.space;
    if (!spaceId) {
      console.warn('Vouchy: missing data-id attribute. Usage: <script data-id="your-space-slug" src="..."></script>');
      return;
    }

    // Build query params from all data attributes
    const params = new URLSearchParams();
    params.set('id', spaceId);

    // Copy all data attributes to query params (except id and config)
    for (const [key, value] of Object.entries(script.dataset)) {
      if (key === 'id' || key === 'space' || key === 'config' || key === 'vouchyInitialized') continue;
      if (value) params.set(key, value);
    }

    // Add config JSON as single param
    if (script.dataset.config) {
      params.set('config', script.dataset.config);
    }

    // Add timestamp to prevent caching
    params.set('t', Date.now().toString());

    // Get host origin
    let host = '';
    try {
      const srcURL = new URL(script.src, window.location.origin);
      host = srcURL.origin;
    } catch (e) {
      host = window.location.origin;
    }

    // Determine layout from params
    const layout = script.dataset.layout || 'clean';
    const height = layout === 'marquee' ? DEFAULT_MARQUEE_HEIGHT : DEFAULT_HEIGHT;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${host}/embed/${spaceId}?${params.toString()}`;
    iframe.style.cssText = 'width:100%;border:none;overflow:hidden;background:transparent;';
    iframe.style.height = height + 'px';
    iframe.className = 'vouchy-embed-iframe';
    iframe.loading = 'lazy';
    iframe.title = 'Vouchy Testimonials';

    // Allow transparency
    iframe.allowtransparency = true;

    // Listen for height adjustments from iframe
    window.addEventListener('message', function(event) {
      // Verify origin for security
      if (event.origin !== host) return;
      
      if (event.data && event.data.type === 'vouchy-resize' && event.data.height) {
        const newHeight = parseInt(event.data.height, 10);
        if (!isNaN(newHeight) && newHeight > 0) {
          iframe.style.height = newHeight + 'px';
        }
      }
    });

    // Insert iframe right after script tag
    if (script.parentNode) {
      script.parentNode.insertBefore(iframe, script.nextSibling);
    }
  }

  // Bootstrap function
  function bootstrap() {
    // Find all Vouchy embed scripts
    const scripts = document.querySelectorAll('script[data-id], script[data-space]');
    scripts.forEach(function(script) {
      if (script.src && script.src.includes('embed.js')) {
        initEmbed(script);
      }
    });

    // Also check scripts by src pattern
    const embedScripts = document.querySelectorAll('script[src*="embed.js"]');
    embedScripts.forEach(function(script) {
      if (!script.dataset.vouchyInitialized) {
        const spaceId = script.dataset.id || script.dataset.space;
        if (spaceId) {
          initEmbed(script);
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // Also run immediately if script is synchronous
  if (document.currentScript) {
    initEmbed(document.currentScript);
  }
})();
