import { useEffect } from 'react'

export interface WebVitalsMetrics {
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  FCP?: number // First Contentful Paint
  TTFB?: number // Time to First Byte
}

/**
 * Hook para monitorar Web Vitals
 * Envia métricas para analytics ou servidor
 */
export function useWebVitals(onMetric?: (metric: WebVitalsMetrics) => void) {
  useEffect(() => {
    // Monitorar LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      if (onMetric) {
        onMetric({ LCP: lastEntry.renderTime || lastEntry.loadTime })
      }
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch {
      console.warn('LCP observer not supported')
    }

    // Monitorar FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (onMetric) {
          onMetric({ FID: (entry as any).processingDuration })
        }
        console.log('FID:', (entry as any).processingDuration)
      })
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch {
      console.warn('FID observer not supported')
    }

    // Monitorar CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          if (onMetric) {
            onMetric({ CLS: clsValue })
          }
          console.log('CLS:', clsValue)
        }
      })
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch {
      console.warn('CLS observer not supported')
    }

    // Monitorar FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (onMetric) {
        onMetric({ FCP: lastEntry.startTime })
      }
      console.log('FCP:', lastEntry.startTime)
    })

    try {
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch {
      console.warn('FCP observer not supported')
    }

    // Monitorar TTFB (Time to First Byte)
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation && onMetric) {
        onMetric({ TTFB: navigation.responseStart })
      }
      console.log('TTFB:', navigation?.responseStart)
    })

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      fcpObserver.disconnect()
    }
  }, [onMetric])
}

/**
 * Enviar Web Vitals para Google Analytics
 */
export function sendWebVitalsToAnalytics(metric: WebVitalsMetrics) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    Object.entries(metric).forEach(([key, value]) => {
      if (value !== undefined) {
        ;(window as any).gtag('event', key, {
          value: Math.round(value),
          event_category: 'Web Vitals',
          event_label: key,
          non_interaction: true,
        })
      }
    })
  }
}
