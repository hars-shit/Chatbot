import React, { useEffect, useRef, useState } from 'react';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Send visibility message to iframe
  const postVisibility = (visible) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ chatbotVisible: visible }, '*');
    }
  };

  // Handle iframe load
  useEffect(() => {
    const iframe = document.querySelector('#chat-widge iframe');
    if (iframe) {
      iframeRef.current = iframe;
      iframe.addEventListener('load', () => {
        setIframeLoaded(true);
      });
    }
  }, []);

  // Auto-popup on first visit in session
  useEffect(() => {
    if (!iframeLoaded) return;

    const isDesktopSizedIframe = () => {
      const width = containerRef.current?.offsetWidth || 0;
      return width >= 400;
    };

    const hasPopupShown = sessionStorage.getItem('chatbotAutoPopupShown');

    if (isDesktopSizedIframe() && !hasPopupShown) {
      const timer = setTimeout(() => {
        setChatVisible(true);
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');
        postVisibility(true);
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [iframeLoaded]);

  const handleToggleClick = () => {
    const newVisibility = !chatVisible;
    setChatVisible(newVisibility);
    postVisibility(newVisibility);
  };

  return (
    <div ref={containerRef}>
      <div
        id="chat-toggle"
        className={chatVisible ? 'tooltip-hidden' : ''}
        onClick={handleToggleClick}
      >
        <div className="tooltip">Chat with Sarah</div>
        <img
          src="https://storage.googleapis.com/msgsndr/anzT2So2oHAxu8AgUsf9/media/685552f41a74cd7572683608.png"
          alt="logo-chatbot"
        />
      </div>
    </div>
  );
};

export default ChatbotContainer;
