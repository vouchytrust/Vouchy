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

    const widgetId = script.dataset.widgetId;
    const spaceId = script.dataset.id || script.dataset.space;

    if (!widgetId && !spaceId) {
      console.warn('Vouchy: missing data-widget-id attribute. Usage: <script data-widget-id="..." src="..."></script>');
      return;
    }

    // Get host origin
    let host = '';
    try {
      const srcURL = new URL(script.src, window.location.origin);
      host = srcURL.origin;
    } catch (e) {
      host = window.location.origin;
    }

    let iframeUrl = '';

    if (widgetId) {
      iframeUrl = `${host}/embed/${widgetId}`;
      
      // Allow parent to explicitly override theme via data-theme
      if (script.dataset.theme) {
        iframeUrl += `?theme=${script.dataset.theme}`;
      }
    } else {
      // Build query params from all data attributes
      const params = new URLSearchParams();
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
      iframeUrl = `${host}/embed/${spaceId}?${params.toString()}`;
    }

    // Determine layout from params
    const layout = script.dataset.layout || 'clean';
    const height = layout === 'marquee' ? DEFAULT_MARQUEE_HEIGHT : DEFAULT_HEIGHT;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.cssText = 'width:100%;border:none;overflow:hidden;background:transparent;';
    iframe.style.height = height + 'px';
    iframe.className = 'vouchy-embed-iframe';
    iframe.loading = 'lazy';
    iframe.title = 'Vouchy Embed Widget';

    // Allow transparency
    iframe.allowtransparency = true;

    // Listen for height adjustments and ready signal from iframe
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'vouchy-resize' && event.data.height) {
        const newHeight = parseInt(event.data.height, 10);
        if (!isNaN(newHeight) && newHeight > 0) {
          iframe.style.height = newHeight + 'px';
        }
      }
      // When the embed signals it's ready, immediately resend current theme
      if (event.data && event.data.type === 'vouchy-ready') {
        sendTheme();
      }
    });

    // --- Auto Theme Sync Logic ---
    function sendTheme() {
      if (!iframe.contentWindow) return;
      
      const el = document.documentElement;
      const classDark = el.classList.contains('dark') || document.body.classList.contains('dark') || el.getAttribute('data-theme') === 'dark';
      const classLight = el.classList.contains('light') || document.body.classList.contains('light') || el.getAttribute('data-theme') === 'light';
      const colorScheme = el.style.colorScheme || document.body.style.colorScheme;
      
      let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (colorScheme === 'dark' || classDark) {
        isDark = true;
      } else if (colorScheme === 'light' || classLight) {
        isDark = false;
      }

      iframe.contentWindow.postMessage({ type: 'vouchy-theme-change', theme: isDark ? 'dark' : 'light' }, '*');
    }

    // Listen to system theme changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.addEventListener) {
      mql.addEventListener('change', sendTheme);
    } else if (mql.addListener) {
      mql.addListener(sendTheme); // fallbacks
    }

    // Listen to parent html/body class changes for "dark"
    const classObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          sendTheme();
        }
      });
    });
    classObserver.observe(document.documentElement, { attributes: true });
    classObserver.observe(document.body, { attributes: true });

    iframe.addEventListener('load', function() {
      // Retry sending theme to handle React not being mounted yet when the first message fires
      sendTheme();
      setTimeout(sendTheme, 100);
      setTimeout(sendTheme, 400);
      setTimeout(sendTheme, 1000);
    });
    // -----------------------------

    // Insert iframe right after script tag
    if (script.parentNode) {
      script.parentNode.insertBefore(iframe, script.nextSibling);
    }
  }

  // Bootstrap function
  function bootstrap() {
    // Find all Vouchy embed scripts
    const scripts = document.querySelectorAll('script[data-widget-id], script[data-id], script[data-space]');
    scripts.forEach(function(script) {
      if (script.src && script.src.includes('embed.js')) {
        initEmbed(script);
      }
    });

    // Also check scripts by src pattern
    const embedScripts = document.querySelectorAll('script[src*="embed.js"]');
    embedScripts.forEach(function(script) {
      if (!script.dataset.vouchyInitialized) {
        const widgetId = script.dataset.widgetId;
        const spaceId = script.dataset.id || script.dataset.space;
        if (widgetId || spaceId) {
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
