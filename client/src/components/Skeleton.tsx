import { motion } from 'framer-motion'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  count?: number
  circle?: boolean
}

export function Skeleton({
  width = '100%',
  height = '20px',
  className = '',
  count = 1,
  circle = false,
}: SkeletonProps) {
  const items = Array.from({ length: count })

  return (
    <>
      {items.map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-cyan-400/10">
      <Skeleton height="20px" className="mb-4" />
      <Skeleton height="16px" width="80%" className="mb-2" />
      <Skeleton height="16px" width="60%" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton width="100%" height="40px" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-cyan-400/10">
        <Skeleton height="24px" width="200px" className="mb-4" />
        <Skeleton height="300px" />
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-cyan-400/10">
        <Skeleton height="24px" width="150px" className="mb-4" />
        <TableSkeleton rows={5} />
      </div>
    </div>
  )
}
