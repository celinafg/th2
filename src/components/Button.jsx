const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  icon,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-coral text-white hover:bg-coral-dark focus:ring-coral',
    secondary: 'bg-dark text-white hover:bg-gray-800 focus:ring-dark',
    outline:
      'bg-transparent border border-gray-400 text-gray-300 hover:bg-gray-800 focus:ring-gray-300',
    ghost: 'bg-transparent text-dark hover:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm rounded-full',
    md: 'px-6 py-2 text-sm rounded-full',
    lg: 'px-8 py-3 text-base rounded-full',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
