// src/components/common/Modal.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Modal component for displaying content in a dialog
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  hideCloseButton = false,
  footer = null,
  zIndex = 50,
  className = '',
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  
  // Size styles
  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };
  
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Click outside handler
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && overlayRef.current === e.target) {
      onClose();
    }
  };
  
  // Animation classes
  const overlayAnimationClasses = isOpen
    ? 'opacity-100'
    : 'opacity-0 pointer-events-none';
  
  const modalAnimationClasses = isOpen
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4 pointer-events-none';
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Create portal to render modal outside of current DOM hierarchy
  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${overlayAnimationClasses}`}
      style={{ zIndex }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl transform transition-all duration-300
          ${modalAnimationClasses} 
          ${sizeStyles[size] || sizeStyles.md}
          w-full m-4
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          
          {!hideCloseButton && (
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']),
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  footer: PropTypes.node,
  zIndex: PropTypes.number,
  className: PropTypes.string,
};

export default Modal;