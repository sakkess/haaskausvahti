// src/components/Button.jsx
export default function Button({
    as: Component = 'button',          // ← NEW: allows as={Link}
    children,
    variant = 'primary',
    className = '',
    ...props
  }) {
    const base =
      'inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2';
    const variants = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
      secondary:
        'bg-white text-brand-600 ring-1 ring-inset ring-brand-600/20 hover:bg-brand-50 focus-visible:ring-brand-500',
    };
  
    return (
      <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </Component>
    );
  }
  