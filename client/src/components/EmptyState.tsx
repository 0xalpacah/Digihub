import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-sm mb-6">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-black font-bold hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again later',
  action,
}: Omit<EmptyStateProps, 'icon'> & { action?: EmptyStateProps['action'] }) {
  return (
    <EmptyState
      icon="⚠️"
      title={title}
      description={description}
      action={action}
      className="bg-red-500/5 border border-red-500/20 rounded-xl"
    />
  )
}

export function NoDataState({
  title = 'No data available',
  description = 'There is no data to display',
  action,
}: Omit<EmptyStateProps, 'icon'> & { action?: EmptyStateProps['action'] }) {
  return (
    <EmptyState
      icon="📊"
      title={title}
      description={description}
      action={action}
    />
  )
}

export function NoResultsState({
  searchTerm = '',
  action,
}: {
  searchTerm?: string
  action?: EmptyStateProps['action']
}) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description={
        searchTerm
          ? `No results found for "${searchTerm}". Try a different search term.`
          : 'No results found. Try adjusting your filters.'
      }
      action={action}
    />
  )
}
