import React, { useEffect, useRef, useState } from 'react';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const containerRef = useRef(null);

  // Auto popup on first visit per session
  useEffect(() => {
    const isDesktopSizedIframe = () => {
      const width = containerRef.current?.offsetWidth || 0;
      return width >= 400;
    };

    const hasPopupShown = sessionStorage.getItem('chatbotAutoPopupShown');

    if (isDesktopSizedIframe() && !hasPopupShown) {
      const timer = setTimeout(() => {
        setChatVisible(true);
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');

        // Notify iframe to expand
        const iframe = document.querySelector('#chat-widge iframe');
        iframe?.contentWindow.postMessage({ chatbotVisible: true }, '*');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Toggle open/close
  const handleToggleClick = () => {
    const newVisibility = !chatVisible;
    setChatVisible(newVisibility);

    // Notify iframe to show/hide
    const iframe = document.querySelector('#chat-widge iframe');
    iframe?.contentWindow.postMessage({ chatbotVisible: newVisibility }, '*');
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
