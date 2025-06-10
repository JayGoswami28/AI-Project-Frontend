import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Toast, ToastContainer as BootstrapToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  autoHide?: boolean;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      autoHide: true,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (newToast.autoHide && newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getToastClass = (type: ToastType) => {
    return `toast-modern toast-${type}`;
  };

  const getToastIconColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-info';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <BootstrapToastContainer 
      className="p-3" 
      position="top-end"
      style={{ 
        position: 'fixed', 
        zIndex: 9999,
        top: '80px' // Account for navbar height
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          className={getToastClass(toast.type)}
          onClose={() => onRemove(toast.id)}
          show={true}
          autohide={toast.autoHide}
          delay={toast.duration}
        >
          <Toast.Header className="d-flex align-items-center">
            <FontAwesomeIcon 
              icon={getToastIcon(toast.type)} 
              className={`me-2 ${getToastIconColor(toast.type)}`}
            />
            <strong className="me-auto">
              {toast.title || toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </strong>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onRemove(toast.id)}
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </button>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </BootstrapToastContainer>
  );
};

// Helper functions for common toast types
export const showSuccessToast = (addToast: ToastContextType['addToast']) => 
  (message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  };

export const showErrorToast = (addToast: ToastContextType['addToast']) => 
  (message: string, title?: string) => {
    addToast({ 
      type: 'error', 
      message, 
      title, 
      duration: 7000, // Longer duration for errors
    });
  };

export const showWarningToast = (addToast: ToastContextType['addToast']) => 
  (message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  };

export const showInfoToast = (addToast: ToastContextType['addToast']) => 
  (message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  };

export default ToastContainer;