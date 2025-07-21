import { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: '#0a58ca',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 9999,
      }}
    >
      Install App
    </button>
  );
};

export default InstallPWA;
