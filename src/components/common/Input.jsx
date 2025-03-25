// src/components/common/Input.jsx
import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with different types, sizes, and states
 */
const Input = forwardRef(({
  type = 'text',
  id,
  name,
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  required = false,
  error = null,
  hint = null,
  icon = null,
  iconPosition = 'left',
  clearable = false,
  size = 'md',
  rounded = 'md',
  fullWidth = true,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Base input styles
  const baseInputStyle = 'block border bg-white text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  
  // Size styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg',
  };
  
  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // State styles
  const stateStyles = {
    normal: 'border-gray-300',
    focus: 'border-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    disabled: 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed',
  };
  
  // Icon padding styles
  const iconPaddingStyles = {
    left: 'pl-10',
    right: 'pr-10',
    none: '',
  };
  
  // Determine the state style
  let currentState = 'normal';
  if (disabled) currentState = 'disabled';
  else if (error) currentState = 'error';
  else if (isFocused) currentState = 'focus';
  
  // Full width style
  const fullWidthStyle = 'w-full';
  
  // Determine if we need to add padding for icon
  const iconPadding = icon ? iconPaddingStyles[iconPosition] : iconPaddingStyles.none;
  const clearablePadding = clearable && !disabled && value ? 'pr-10' : '';
  
  // Combine input styles
  const inputStyles = `
    ${baseInputStyle}
    ${sizeStyles[size] || sizeStyles.md}
    ${roundedStyles[rounded] || roundedStyles.md}
    ${stateStyles[currentState]}
    ${fullWidth ? fullWidthStyle : ''}
    ${iconPadding}
    ${clearablePadding}
    ${inputClassName}
  `.trim();
  
  // Handle focus and blur events
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Handle clear input
  const handleClear = () => {
    const event = {
      target: { name, value: '' },
    };
    if (onChange) onChange(event);
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-1 font-medium text-gray-700 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''} ${labelClassName}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputStyles}
          {...props}
        />
        
        {icon && iconPosition === 'right' && !clearable && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {clearable && !disabled && value && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {(error || hint) && (
        <div className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || hint}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  clearable: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Input;