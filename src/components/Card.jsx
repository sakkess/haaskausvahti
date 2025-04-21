export default function Card({ children }) {
  return (
    <div className="card dark:bg-neutral-800 dark:ring-neutral-700">
      {children}
    </div>
  );
}
