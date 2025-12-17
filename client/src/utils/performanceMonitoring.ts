/**
 * Performance Monitoring
 * Rastrear métricas de performance da aplicação
 */

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private marks: Map<string, number> = new Map()

  /**
   * Iniciar medição de tempo
   */
  startMeasure(name: string) {
    this.marks.set(name, performance.now())
  }

  /**
   * Finalizar medição de tempo
   */
  endMeasure(name: string): number | null {
    const startTime = this.marks.get(name)
    if (!startTime) return null

    const endTime = performance.now()
    const duration = endTime - startTime

    this.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    })

    this.marks.delete(name)
    return duration
  }

  /**
   * Registrar métrica customizada
   */
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)

    // Enviar para analytics se disponível
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
      })
    }
  }

  /**
   * Obter todas as métricas
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Limpar métricas
   */
  clearMetrics() {
    this.metrics = []
  }

  /**
   * Obter métrica específica
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.find((m) => m.name === name)
  }

  /**
   * Calcular tempo médio
   */
  getAverageTime(name: string): number {
    const metrics = this.metrics.filter((m) => m.name === name)
    if (metrics.length === 0) return 0

    const sum = metrics.reduce((acc, m) => acc + m.value, 0)
    return sum / metrics.length
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Hook para medir performance de componentes React
 */
export function useMeasurePerformance(componentName: string) {
  return {
    startMeasure: () => performanceMonitor.startMeasure(componentName),
    endMeasure: () => performanceMonitor.endMeasure(componentName),
  }
}

/**
 * Medir tempo de carregamento de página
 */
export function measurePageLoadTime() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart
      performanceMonitor.recordMetric({
        name: 'page_load_time',
        value: loadTime,
        unit: 'ms',
        timestamp: Date.now(),
      })
    }
  })
}

/**
 * Medir tempo de resposta da API
 */
export function measureApiResponseTime(endpoint: string, duration: number) {
  performanceMonitor.recordMetric({
    name: `api_${endpoint}`,
    value: duration,
    unit: 'ms',
    timestamp: Date.now(),
  })
}

/**
 * Obter Core Web Vitals
 */
export function getCoreWebVitals() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paintEntries = performance.getEntriesByType('paint')

  return {
    fcp: paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0,
    lcp: 0, // Requer PerformanceObserver
    cls: 0, // Requer PerformanceObserver
    ttfb: navigation?.responseStart || 0,
  }
}

/**
 * Enviar métricas para servidor de analytics
 */
export async function sendMetricsToServer(endpoint: string) {
  const metrics = performanceMonitor.getMetrics()
  if (metrics.length === 0) return

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrics }),
    })
  } catch (error) {
    console.error('Failed to send metrics:', error)
  }
}
