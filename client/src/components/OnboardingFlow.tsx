import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingStep {
  id: number
  title: string
  description: string
  action: string
  icon: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to DIGI Hub',
    description: 'Your gateway to Web3 analytics and portfolio management',
    action: 'Get Started',
    icon: '🚀',
  },
  {
    id: 2,
    title: 'Connect Your Wallet',
    description: 'Link your MetaMask or Reown wallet to view your assets',
    action: 'Connect Wallet',
    icon: '💼',
  },
  {
    id: 3,
    title: 'Enable 2FA',
    description: 'Secure your account with Two-Factor Authentication',
    action: 'Enable 2FA',
    icon: '🔐',
  },
  {
    id: 4,
    title: 'Explore Dashboard',
    description: 'View real-time metrics, prices, and portfolio analytics',
    action: 'Explore',
    icon: '📊',
  },
  {
    id: 5,
    title: 'Ready to Go!',
    description: 'You are all set. Start exploring DIGI Hub',
    action: 'Start',
    icon: '✨',
  },
]

interface OnboardingFlowProps {
  onComplete?: () => void
  onSkip?: () => void
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const step = ONBOARDING_STEPS[currentStep]

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
      setIsVisible(false)
    }
  }

  const handleSkip = () => {
    onSkip?.()
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--bg-dark)] border border-cyan-400/30 rounded-xl p-8 max-w-md w-full mx-4"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-cyan-400 text-sm font-mono">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Skip
                </button>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Content */}
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">{step.title}</h2>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-4 py-2 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-colors font-mono text-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-black font-bold hover:shadow-lg hover:shadow-cyan-400/50 transition-all font-mono text-sm"
              >
                {step.action}
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {ONBOARDING_STEPS.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
