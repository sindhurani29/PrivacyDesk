import { useEffect, useRef } from 'react';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { create } from 'zustand/react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error';
}

interface ToastState {
  toasts: ToastMessage[];
  showToast: (params: { text: string; type: 'success' | 'error' }) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: ({ text, type }) => {
    const id = crypto.randomUUID();
    const toast: ToastMessage = { id, text, type };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 2000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },
}));

export function Toaster(): JSX.Element {
  const { toasts, removeToast } = useToastStore();
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure toasts appear in top-right corner
    if (groupRef.current) {
      const group = groupRef.current.querySelector('.k-notification-group');
      if (group) {
        (group as HTMLElement).style.position = 'fixed';
        (group as HTMLElement).style.top = '20px';
        (group as HTMLElement).style.right = '20px';
        (group as HTMLElement).style.zIndex = '9999';
      }
    }
  }, [toasts]);

  if (toasts.length === 0) {
    return <div style={{ display: 'none' }}></div>;
  }

  return (
    <div ref={groupRef}>
      <NotificationGroup
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <Notification
            key={toast.id}
            type={toast.type === 'success' ? { style: 'success', icon: true } : { style: 'error', icon: true }}
            closable={true}
            onClose={() => removeToast(toast.id)}
            style={{
              minWidth: '300px',
              marginBottom: '8px',
            }}
          >
            <span>{toast.text}</span>
          </Notification>
        ))}
      </NotificationGroup>
    </div>
  );
}

// Export a hook for easier usage
export function useToast(): (params: { text: string; type: 'success' | 'error' }) => void {
  const showToast = useToastStore((state) => state.showToast);
  return showToast;
}
