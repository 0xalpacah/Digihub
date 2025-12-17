import * as Sentry from '@sentry/react'

/**
 * Inicializar Sentry para error tracking
 */
export function initializeSentry(dsn: string, environment: string = 'production') {
  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

/**
 * Capturar exceção
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  })
}

/**
 * Capturar mensagem
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * Adicionar breadcrumb
 */
export function addBreadcrumb(
  message: string,
  category: string = 'custom',
  level: 'debug' | 'info' | 'warning' | 'error' = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Definir user context
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username,
  })
}

/**
 * Limpar user context
 */
export function clearUserContext() {
  Sentry.setUser(null)
}

/**
 * Definir tag
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

/**
 * Definir contexto customizado
 */
export function setContext(name: string, context: Record<string, any>) {
  Sentry.setContext(name, context)
}

/**
 * Wrapper para async functions com error handling
 */
export async function withErrorTracking<T>(
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof Error) {
      captureException(error, context)
    } else {
      captureMessage(String(error), 'error')
    }
    return null
  }
}

/**
 * Hook para error boundary
 */
export function useErrorHandler() {
  return (error: Error, errorInfo: { componentStack: string }) => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }
}
