import React, { useEffect, useRef, useState } from 'react';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const containerRef = useRef(null);

  // Auto popup once per session
  useEffect(() => {
    const isDesktop = () => {
      const width = containerRef.current?.offsetWidth || 0;
      return width >= 400;
    };

    const hasPopupShown = sessionStorage.getItem('chatbotAutoPopupShown');

    if (isDesktop() && !hasPopupShown) {
      const timer = setTimeout(() => {
        setChatVisible(true);
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');
        const iframe = document.querySelector('#chat-widge iframe');
        iframe?.contentWindow.postMessage({ chatbotVisible: true }, '*');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Manual toggle
  const handleToggleClick = () => {
    const newState = !chatVisible;
    setChatVisible(newState);
    const iframe = document.querySelector('#chat-widge iframe');
    iframe?.contentWindow.postMessage({ chatbotVisible: newState }, '*');
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
          alt="chatbot-icon"
        />
      </div>
    </div>
  );
};

export default ChatbotContainer;
