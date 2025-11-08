import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClass = 'btn-enhanced';
  const variantClass = `btn-enhanced--${variant}`;
  const sizeClass = `btn-enhanced--${size}`;
  const fullWidthClass = fullWidth ? 'btn-enhanced--full-width' : '';
  const loadingClass = loading ? 'btn-enhanced--loading' : '';
  const disabledClass = disabled ? 'btn-enhanced--disabled' : '';

  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="btn-enhanced__content">
        {loading && (
          <span className="btn-enhanced__spinner">
            <div className="spinner"></div>
          </span>
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="btn-enhanced__icon btn-enhanced__icon--left">
            {icon}
          </span>
        )}
        <span className="btn-enhanced__text">{children}</span>
        {icon && iconPosition === 'right' && !loading && (
          <span className="btn-enhanced__icon btn-enhanced__icon--right">
            {icon}
          </span>
        )}
      </span>
      <div className="btn-enhanced__ripple"></div>
    </button>
  );
};

export default Button;