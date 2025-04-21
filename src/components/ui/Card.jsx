export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-md ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700 ${className}`}
    >
      {children}
    </div>
  )
}
