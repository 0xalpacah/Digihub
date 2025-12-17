import { lazy, Suspense, ReactNode, ComponentType, createElement } from 'react'

/**
 * Lazy load components with fallback UI
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc) as unknown as T
}

/**
 * Create a loading fallback component
 */
export function createLoadingFallback(message: string = 'Loading...'): ReactNode {
  return createElement(
    'div',
    { className: 'flex items-center justify-center min-h-screen' },
    createElement(
      'div',
      { className: 'text-center' },
      createElement('div', {
        className: 'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400',
      }),
      createElement('p', { className: 'mt-4 text-cyan-400 font-mono' }, message)
    )
  )
}

/**
 * Wrap lazy component with Suspense
 */
export function withSuspense<P extends Record<string, any>>(
  Component: React.LazyExoticComponent<ComponentType<P>>,
  fallback?: ReactNode
) {
  return (props: P) =>
    createElement(
      Suspense,
      { fallback: fallback || createLoadingFallback() },
      createElement(Component, props)
    )
}
