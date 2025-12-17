/**
 * Google Analytics 4 Integration
 * Track events, page views, and user interactions
 */

export interface AnalyticsEvent {
  name: string
  parameters?: Record<string, any>
}

export interface PageViewEvent {
  page_path: string
  page_title: string
}

export interface UserProperty {
  key: string
  value: string | number | boolean
}

/**
 * Inicializar Google Analytics
 */
export function initializeAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return

  // Carregar Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Inicializar gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    ;(window as any).dataLayer.push(arguments)
  }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId, {
    page_path: window.location.pathname,
    page_title: document.title,
  })
}

/**
 * Rastrear evento customizado
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  ;(window as any).gtag('event', event.name, event.parameters || {})
}

/**
 * Rastrear page view
 */
export function trackPageView(event: PageViewEvent) {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  ;(window as any).gtag('event', 'page_view', {
    page_path: event.page_path,
    page_title: event.page_title,
  })
}

/**
 * Rastrear user property
 */
export function setUserProperty(property: UserProperty) {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  ;(window as any).gtag('set', { [property.key]: property.value })
}

/**
 * Rastrear conversão
 */
export function trackConversion(conversionName: string, value?: number) {
  trackEvent({
    name: 'conversion',
    parameters: {
      conversion_name: conversionName,
      value: value || 1,
    },
  })
}

/**
 * Rastrear erro
 */
export function trackError(errorName: string, errorMessage: string) {
  trackEvent({
    name: 'error',
    parameters: {
      error_name: errorName,
      error_message: errorMessage,
    },
  })
}

/**
 * Rastrear tempo de carregamento
 */
export function trackLoadTime(pageName: string, loadTimeMs: number) {
  trackEvent({
    name: 'page_load_time',
    parameters: {
      page_name: pageName,
      load_time_ms: loadTimeMs,
    },
  })
}

/**
 * Rastrear clique em botão
 */
export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent({
    name: 'button_click',
    parameters: {
      button_name: buttonName,
      location: location,
    },
  })
}

/**
 * Rastrear envio de formulário
 */
export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent({
    name: 'form_submit',
    parameters: {
      form_name: formName,
      success: success,
    },
  })
}

/**
 * Rastrear transação
 */
export function trackTransaction(
  transactionId: string,
  amount: number,
  currency: string = 'USD'
) {
  trackEvent({
    name: 'purchase',
    parameters: {
      transaction_id: transactionId,
      value: amount,
      currency: currency,
    },
  })
}

/**
 * Rastrear tempo gasto em página
 */
export function trackTimeOnPage(pageName: string, timeMs: number) {
  trackEvent({
    name: 'time_on_page',
    parameters: {
      page_name: pageName,
      time_ms: timeMs,
    },
  })
}

// Tipos globais
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
