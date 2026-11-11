/**
 * Vercount integration for dumi.
 *
 * The official Vercount script only looks up its elements once, right after
 * DOMContentLoaded. dumi is a single page app, so footers may be rendered (or
 * page views change) later on client side navigation; in that case the
 * official script never sees it. Keep the official nodes mounted on every page
 * (hidden) and mirror their values onto the dumi footers. Client side
 * navigations are tracked through the same API used by the official script.
 */
;(function () {
  var API_URL = 'https://events.vercount.one/api/v2/log'
  var SITE_PV_ID = 'vercount_value_site_pv'
  var SITE_UV_ID = 'vercount_value_site_uv'
  var PAGE_PV_ID = 'vercount_value_page_pv'
  var CACHE_KEY = 'visitorCountData'
  var UV_COOKIE_PREFIX = 'vercount_uv_'
  var UV_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
  var FOOTER_SELECTOR = '[data-vercount-stats]'
  var PAGE_STATS_SELECTOR = '[data-vercount-page-stats]'
  var FOOTER_META_SELECTOR = '.__dumi-default-layout-footer-meta'
  var UPDATED_AT_SELECTOR = '[data-updated-text]'

  var sink = document.createElement('div')
  sink.setAttribute('aria-hidden', 'true')
  sink.style.display = 'none'
  sink.innerHTML =
    '<span id="' +
    SITE_PV_ID +
    '"></span><span id="' +
    SITE_UV_ID +
    '"></span><span id="' +
    PAGE_PV_ID +
    '"></span>'
  ;(document.head || document.documentElement).appendChild(sink)

  var pagePv = null
  var routeUrl = currentUrl()
  var routeChanged = false
  var retryTimer = null
  var retries = 0
  var scheduled = false

  function currentUrl() {
    return (
      window.location.origin + window.location.pathname + window.location.search
    )
  }

  function isZhLocale() {
    return /(^|\/)zh-CN(\/|$)/.test(window.location.pathname)
  }

  function toNumber(text) {
    var digits = String(text == null ? '' : text).replace(/[^\d]/g, '')
    return digits ? Number(digits) : null
  }

  function format(number) {
    return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  function setText(node, value) {
    // Avoid re-writing equal text: the body observer would keep firing.
    if (node && node.textContent !== value) node.textContent = value
  }

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY)
      if (!raw) return null
      var data = JSON.parse(raw)
      return data && typeof data === 'object' ? data : null
    } catch (err) {
      return null
    }
  }

  function writeCache(data) {
    try {
      window.localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          site_pv: toNumber(data.site_pv) || 0,
          page_pv: toNumber(data.page_pv) || 0,
          site_uv: toNumber(data.site_uv) || 0,
        })
      )
    } catch (err) {
      /* localStorage might be disabled or full */
    }
  }

  function getCookie(name) {
    var prefix = name + '='
    var parts = document.cookie ? document.cookie.split('; ') : []
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(prefix) === 0) {
        return parts[i].slice(prefix.length)
      }
    }
    return null
  }

  function uvCookieName() {
    return (
      UV_COOKIE_PREFIX +
      (window.location.host || 'unknown-host').replace(/[^a-zA-Z0-9_-]/g, '_')
    )
  }

  function hasUvCookie() {
    return getCookie(uvCookieName()) === '1'
  }

  function setUvCookie() {
    document.cookie =
      uvCookieName() +
      '=1; path=/; max-age=' +
      UV_COOKIE_MAX_AGE +
      '; samesite=lax'
  }

  // Same request the official script (and @vercount/react) sends. It is only
  // called for client side navigations, so the initial page load is not
  // counted twice.
  function trackPageView() {
    if (!window.fetch) return

    var isNewUv = !hasUvCookie()
    if (isNewUv) setUvCookie()

    window
      .fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          isNewUv: isNewUv,
        }),
      })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status)
        return response.json()
      })
      .then(function (response) {
        var data = response && response.data ? response.data : response
        if (!data) return

        pagePv = toNumber(data.page_pv)
        setText(
          document.getElementById(SITE_PV_ID),
          String(toNumber(data.site_pv) || 0)
        )
        setText(
          document.getElementById(SITE_UV_ID),
          String(toNumber(data.site_uv) || 0)
        )
        writeCache(data)
        scheduleUpdate()
      })
      .catch(function () {
        // Keep the placeholder; a later navigation will try again.
      })
  }

  function syncRoute() {
    var url = currentUrl()
    if (url === routeUrl) return

    routeUrl = url
    routeChanged = true
    pagePv = null
    trackPageView()
  }

  function updateFooterStats() {
    var footer = document.querySelector(FOOTER_SELECTOR)
    if (!footer) return

    var pvNode = footer.querySelector('[data-vercount-pv]')
    var uvNode = footer.querySelector('[data-vercount-uv]')
    if (!pvNode || !uvNode) return

    var pvSource = document.getElementById(SITE_PV_ID)
    var uvSource = document.getElementById(SITE_UV_ID)
    var pv = toNumber(pvSource && pvSource.textContent)
    var uv = toNumber(uvSource && uvSource.textContent)

    // Use the last known site totals while the request is still in flight.
    if (pv === null || uv === null) {
      var cache = readCache()
      if (cache) {
        if (pv === null) pv = toNumber(cache.site_pv)
        if (uv === null) uv = toNumber(cache.site_uv)
      }
    }

    if (pv !== null) setText(pvNode, format(pv))
    if (uv !== null) setText(uvNode, format(uv))
    if (pv === null || uv === null) scheduleRetry()
  }

  function updatePageStats() {
    var meta = document.querySelector(FOOTER_META_SELECTOR)
    if (!meta) return

    var updatedAt = meta.querySelector(UPDATED_AT_SELECTOR)
    if (!updatedAt) return

    var locale = isZhLocale() ? 'zh-CN' : 'en-US'
    var node = meta.querySelector(PAGE_STATS_SELECTOR)
    if (!node) {
      node = document.createElement('span')
      node.setAttribute('data-vercount-page-stats', '')
      meta.insertBefore(node, updatedAt)
    }
    if (node.getAttribute('data-vercount-locale') !== locale) {
      node.innerHTML =
        locale === 'zh-CN'
          ? '累计浏览<span data-vercount-page-pv>--</span>次 · '
          : 'Total views: <span data-vercount-page-pv>--</span> · '
      node.setAttribute('data-vercount-locale', locale)
    }

    var value = pagePv
    // On the initial route the official script owns the current page count.
    if (value === null && !routeChanged) {
      var source = document.getElementById(PAGE_PV_ID)
      value = toNumber(source && source.textContent)
    }
    if (value === null) {
      if (!routeChanged) scheduleRetry()
      return
    }

    var target = node.querySelector('[data-vercount-page-pv]')
    if (target) setText(target, format(value))
  }

  function refresh() {
    syncRoute()
    updateFooterStats()
    updatePageStats()
  }

  function scheduleRetry() {
    if (retryTimer !== null || retries >= 10) return
    retries += 1
    retryTimer = window.setTimeout(function () {
      retryTimer = null
      refresh()
    }, 1000)
  }

  function scheduleUpdate() {
    if (scheduled) return
    scheduled = true
    var raf =
      window.requestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 16)
      }
    raf(function () {
      scheduled = false
      refresh()
    })
  }

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true })
    } else {
      callback()
    }
  }

  ready(function () {
    refresh()

    if (window.MutationObserver) {
      // Vercount writes the numbers asynchronously.
      new MutationObserver(scheduleUpdate).observe(sink, {
        childList: true,
        characterData: true,
        subtree: true,
      })

      // Footers and the current route change after client side navigation.
      new MutationObserver(scheduleUpdate).observe(document.body, {
        childList: true,
        subtree: true,
      })
    }

    ;['pushState', 'replaceState'].forEach(function (method) {
      var original = window.history[method]
      window.history[method] = function () {
        var result = original.apply(this, arguments)
        scheduleUpdate()
        return result
      }
    })
    window.addEventListener('popstate', scheduleUpdate)
  })
})()
