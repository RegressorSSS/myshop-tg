import { useEffect } from 'react';

const ADMIN_IDS = [323205122, 709145946];

declare global {
  interface Window {
    eruda?: any;
  }
}

export default function ErudaDebug() {
  useEffect(() => {
    const checkAndLoadEruda = async () => {
      const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (!user) return;
      if (!ADMIN_IDS.includes(user.id)) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      script.onload = () => {
        if (window.eruda) window.eruda.init();
      };
      document.head.appendChild(script);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndLoadEruda);
    } else {
      checkAndLoadEruda();
    }
  }, []);
  
  return null;
}
