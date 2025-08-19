import React, { useEffect, useState } from 'react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check if app is already running in standalone (installed)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA App already installed');
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Clean up
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA App installed');
      } else {
        console.log('PWA App installation dismissed');
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    });
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-1 right-1 z-50">
      <button
        onClick={handleInstallClick}
        className="bg-blue-600 text-white px-2 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >📲 Install App
      </button>
    </div>
  );
};

export default InstallPWAButton;
