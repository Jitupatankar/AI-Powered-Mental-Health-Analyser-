import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  gradient = false,
  glass = false,
  padding = 'default',
  onClick,
  ...props 
}) => {
  const baseClass = 'card-enhanced';
  const variantClass = `card-enhanced--${variant}`;
  const paddingClass = `card-enhanced--${padding}`;
  const hoverClass = hover ? 'card-enhanced--hover' : '';
  const gradientClass = gradient ? 'card-enhanced--gradient' : '';
  const glassClass = glass ? 'card-enhanced--glass' : '';
  const clickableClass = onClick ? 'card-enhanced--clickable' : '';

  const cardClass = [
    baseClass,
    variantClass,
    paddingClass,
    hoverClass,
    gradientClass,
    glassClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      <div className="card-enhanced__shine"></div>
      <div className="card-enhanced__content">
        {children}
      </div>
    </div>
  );
};

// Sub-components for better composition
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`card-enhanced__header ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`card-enhanced__body ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`card-enhanced__footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', level = 3, ...props }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`card-enhanced__title ${className}`} {...props}>
      {children}
    </Tag>
  );
};

Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={`card-enhanced__subtitle ${className}`} {...props}>
    {children}
  </p>
);

Card.Icon = ({ children, variant = 'default', className = '', ...props }) => (
  <div className={`card-enhanced__icon card-enhanced__icon--${variant} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;