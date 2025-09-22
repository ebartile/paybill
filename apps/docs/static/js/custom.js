window.addEventListener('DOMContentLoaded', () => {
  // Only show banner if consent not already given
  if (localStorage.getItem('cookieConsent') !== 'true') {
    createConsentBanner();
  } else {
    runTrackingScripts();
  }

  function createConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.background = '#f1f1f1';
    banner.style.padding = '15px';
    banner.style.textAlign = 'center';
    banner.style.zIndex = '9999';
    banner.style.fontFamily = 'sans-serif';

    const text = document.createTextNode('This site uses cookies and tracking for marketing and analytics.');
    const button = document.createElement('button');
    button.id = 'accept-cookies';
    button.textContent = 'Accept';
    button.style.marginLeft = '10px';
    button.style.padding = '6px 12px';

    banner.appendChild(text);
    banner.appendChild(button);
    document.body.appendChild(banner);

    button.addEventListener('click', () => {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'functionality_storage': 'granted',
          'personalization_storage': 'granted'
        });
      }

      localStorage.setItem('cookieConsent', 'true');
      banner.style.display = 'none';
      runTrackingScripts();
    });
  }

  function runTrackingScripts() {
    const hubspotKeys = ['__hstc', '__hssc', '__hsfp'];
    const marketingKeys = ['utm_', '_hs', '_gl', 'li'];
    const exactKeys = ['gclid', '_ga', '_gid', 'msclkid', 'fbclid', 'li_fat_id', 'gbraid'];

    function getStoredParams() {
      const keys = JSON.parse(localStorage.getItem("storedQueryParamsKeys") || "[]");
      const params = {};
      keys.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) params[key] = val;
      });
      return params;
    }

    function storeUTMParams() {
      try {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const keysToStore = [];
        for (const [key, value] of params.entries()) {
          const isMatch = exactKeys.includes(key) || marketingKeys.some(prefix => key.startsWith(prefix)) || hubspotKeys.includes(key);
          if (isMatch && value && value !== '[object Object]') {
            localStorage.setItem(key, value);
            keysToStore.push(key);
          }
        }
        if (keysToStore.length > 0) {
          localStorage.setItem("storedQueryParamsKeys", JSON.stringify(keysToStore));
        }
      } catch (e) {
        console.warn('UTM store error:', e);
      }
    }

    function appendTrackingToLinks() {
      const utmParams = getStoredParams();
      const links = document.querySelectorAll('a[href]');
      const allowedDomains = ['paybill.dev', 'docs.paybill.dev'];

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        const tempA = document.createElement('a');
        tempA.href = href;
        const isInternal = allowedDomains.some(domain => tempA.hostname.includes(domain));
        if (!isInternal) return;

        const linkParams = new URLSearchParams(tempA.search);
        Object.entries(utmParams).forEach(([key, value]) => {
          if (!linkParams.has(key)) linkParams.set(key, value);
        });

        const newHref = tempA.origin + tempA.pathname +
          (linkParams.toString() ? '?' + linkParams.toString() : '') +
          tempA.hash;

        link.setAttribute('href', newHref);
      });
    }

    function clearStoredUTMParams() {
      try {
        const storedKeys = JSON.parse(localStorage.getItem("storedQueryParamsKeys") || "[]");
        storedKeys.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem("storedQueryParamsKeys");
      } catch (e) {
        console.warn('Error clearing UTM params:', e);
      }
    }

    window.addEventListener('load', () => {
      clearStoredUTMParams();
      storeUTMParams();
      appendTrackingToLinks();
    });

    window.addEventListener('beforeunload', clearStoredUTMParams);

    // Expose for debugging
    window.clearStoredUTMParams = clearStoredUTMParams;
    window.getStoredUTMParams = getStoredParams;
  }
});
