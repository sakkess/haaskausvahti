export default function Container({ className = '', children }) {
  return (
    <div className={`max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
