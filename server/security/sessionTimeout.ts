import type { Request, Response } from 'express'

/**
 * Middleware para session timeout
 * Logout automático após inatividade
 */
export function sessionTimeoutMiddleware(inactivityTimeMs: number = 30 * 60 * 1000) {
  // 30 minutos por padrão
  return (req: Request, res: Response, next: () => void) => {
    const now = Date.now()
    const session = (req as any).session
    const lastActivity = session?.lastActivity || now

    // Verificar se sessão expirou
    if (now - lastActivity > inactivityTimeMs) {
      if (session?.destroy) {
        session.destroy((err: any) => {
          if (err) console.error('Error destroying session:', err)
        })
      }
      return res.status(401).json({ error: 'Session expired' })
    }

    // Atualizar último acesso
    if (session) {
      session.lastActivity = now
    }

    next()
  }
}

/**
 * Classe para gerenciar timeouts de sessão
 */
export class SessionTimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map()
  private inactivityTimeMs: number

  constructor(inactivityTimeMs: number = 30 * 60 * 1000) {
    this.inactivityTimeMs = inactivityTimeMs
  }

  /**
   * Iniciar timeout para uma sessão
   */
  startTimeout(sessionId: string, onTimeout: () => void): void {
    // Limpar timeout anterior se existir
    this.clearTimeout(sessionId)

    // Criar novo timeout
    const timeout = setTimeout(() => {
      onTimeout()
      this.timeouts.delete(sessionId)
    }, this.inactivityTimeMs)

    this.timeouts.set(sessionId, timeout)
  }

  /**
   * Resetar timeout (atualizar atividade)
   */
  resetTimeout(sessionId: string, onTimeout: () => void): void {
    this.startTimeout(sessionId, onTimeout)
  }

  /**
   * Limpar timeout
   */
  clearTimeout(sessionId: string): void {
    const timeout = this.timeouts.get(sessionId)
    if (timeout) {
      clearTimeout(timeout)
      this.timeouts.delete(sessionId)
    }
  }

  /**
   * Limpar todos os timeouts
   */
  clearAllTimeouts(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout))
    this.timeouts.clear()
  }

  /**
   * Obter tempo restante até timeout
   */
  getTimeRemaining(sessionId: string): number {
    // Implementação simplificada
    // Em produção, seria necessário rastrear tempo de criação
    return this.inactivityTimeMs
  }
}

/**
 * Hook para frontend - gerenciar inatividade do usuário
 */
export function createClientSessionTimeout(inactivityTimeMs: number = 30 * 60 * 1000) {
  let timeoutId: NodeJS.Timeout | null = null

  const resetTimeout = (onTimeout: () => void) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      onTimeout()
    }, inactivityTimeMs)
  }

  const clearTimeout_ = () => {
    if (timeoutId) clearTimeout(timeoutId)
  }

  // Rastrear atividade do usuário
  const setupActivityListeners = (onTimeout: () => void) => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = () => {
      resetTimeout(onTimeout)
    }

    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    // Iniciar timeout
    resetTimeout(onTimeout)

    // Retornar função para remover listeners
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
      clearTimeout_()
    }
  }

  return { setupActivityListeners, resetTimeout, clearTimeout: clearTimeout_ }
}
