export default function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const base = 'btn'; // reference your global class
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  return (
    <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
