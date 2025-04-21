export default function Card({ children }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
      {children}
    </div>
  );
}
