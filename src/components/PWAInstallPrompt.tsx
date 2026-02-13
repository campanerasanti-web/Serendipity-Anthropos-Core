import React, { useState, useEffect } from 'react';

/**
 * PWAInstallPrompt
 * Component that prompts users to install the app on their device
 * Shows an "Install App" button when available
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      const installPromptEvent = e as BeforeInstallPromptEvent;
      console.log('[PWA] Install prompt triggered');
      installPromptEvent.preventDefault();
      setDeferredPrompt(installPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install ${outcome}`);
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-prompt-content">
        <h3>🌟 Instalar El Mediador</h3>
        <p>Descargá la app en tu celular para acceder fácilmente desde cualquier parte.</p>
        <div className="pwa-prompt-buttons">
          <button onClick={handleInstall} className="btn-install">
            Instalar Ahora
          </button>
          <button onClick={() => setShowPrompt(false)} className="btn-cancel">
            Después
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

// Add styles (add to your CSS)
const PWAInstallStyles = `
.pwa-install-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.pwa-prompt-content {
  max-width: 600px;
  margin: 0 auto;
}

.pwa-prompt-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.pwa-prompt-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.95;
}

.pwa-prompt-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-install,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-install {
  background: white;
  color: #667eea;
}

.btn-install:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.btn-cancel {
  background: rgba(255,255,255,0.2);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255,255,255,0.3);
}

@media (max-width: 600px) {
  .pwa-prompt-buttons {
    justify-content: stretch;
  }
  
  .btn-install,
  .btn-cancel {
    flex: 1;
  }
}
`;
